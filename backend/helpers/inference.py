# helpers/inference.py

from datetime import datetime

# -------------------------------
# HSMM PARAMETERS (TUNABLE)
# -------------------------------
EXPECTED_DURATION = {
    "Occupied": 20.0,
    "Leaving": 6.0,
    "Empty": 15.0
}

MIN_DURATION = {
    "Occupied": 6.0,
    "Leaving": 3.0,
    "Empty": 6.0
}


# -------------------------------
# Normalize probabilities
# -------------------------------
def normalize(d):
    total = sum(d.values())
    if total == 0:
        return {k: 1 / len(d) for k in d}
    return {k: v / total for k, v in d.items()}


# -------------------------------
# HSMM: Duration Model
# -------------------------------
def duration_factor(state, duration):
    expected = EXPECTED_DURATION[state]
    minimum = MIN_DURATION[state]

    if duration < minimum:
        return 0.2
    elif duration < expected:
        return 0.6
    else:
        return 1.0


# -------------------------------
# TRANSITION MODEL
# -------------------------------
def state_transition(prev, current_state, duration, dt):
    alpha = min(dt, 3.0)

    stay_bias = duration_factor(current_state, duration)

    transition = {
        "Occupied": (
            (1 - 0.30 * alpha) * prev["Occupied"] +
            0.15 * alpha * prev["Leaving"] +
            0.05 * alpha * prev["Empty"]
        ),
        "Leaving": (
            0.25 * alpha * prev["Occupied"] +
            (1 - 0.35 * alpha) * prev["Leaving"] +
            0.10 * alpha * prev["Empty"]
        ),
        "Empty": (
            0.30 * alpha * prev["Occupied"] +
            0.35 * alpha * prev["Leaving"] +
            (1 - 0.25 * alpha) * prev["Empty"]
        )
    }

    for state in transition:
        if state != current_state:
            transition[state] *= stay_bias

    return transition


# -------------------------------
# HISTORY ENHANCEMENT
# -------------------------------
def enhance_with_history(obs, history):
    if len(history) < 3:
        return obs

    recent = list(history)[-3:]

    exit_recent = any(f["exit_activity"] for f in recent)
    people_trend = recent[0]["people_count"] - recent[-1]["people_count"]
    motion_recent = max(f["motion_level"] for f in recent)

    presence_frames = sum(1 for f in recent if f["people_count"] > 0)
    empty_frames = sum(1 for f in recent if f["people_count"] == 0)

    enhanced = obs.copy()
    enhanced["exit_activity"] = obs["exit_activity"] or exit_recent
    enhanced["trend_leaving"] = people_trend > 0
    enhanced["motion_level"] = max(obs["motion_level"], motion_recent)
    enhanced["presence_strength"] = presence_frames / len(recent)
    enhanced["empty_consistency"] = empty_frames / len(recent)

    return enhanced


# -------------------------------
# OBSERVATION MODEL
# -------------------------------
def observation_likelihood(obs):
    people = obs.get("estimated_occupancy", obs["people_count"])
    motion = obs["motion_level"]
    exit_act = obs["exit_activity"]
    trend_leaving = obs.get("trend_leaving", False)
    presence_strength = obs.get("presence_strength", 0)
    empty_consistency = obs.get("empty_consistency", 0)

    occ = 0.2
    if people > 0:
        occ = 0.7 + 0.3 * presence_strength

    lea = 0.0
    if exit_act:
        lea += 0.6
    if trend_leaving:
        lea += 0.4
    if people == 0:
        lea = 0.0

    if people > 0:
        occ = 0.8
        emp = 0.01
    else:
        if motion < 0.1 and not exit_act:
            emp = 0.7 + 0.3 * empty_consistency
        else:
            emp = 0.2 + 0.3 * (1 - empty_consistency)

    return {
        "Occupied": max(0.001, min(occ, 0.999)),
        "Leaving":  max(0.001, min(lea, 0.999)),
        "Empty":    max(0.001, min(emp, 0.999))
    }


# -------------------------------
# SCHEDULE → BIAS
# -------------------------------
def compute_schedule_bias(schedule, current_time=None):
    if not schedule:
        return None

    if current_time is None:
        current_time = datetime.now()

    current_day = current_time.strftime("%A").lower()
    schedule_day = schedule["day"].lower()

    if current_day != schedule_day:
        return None

    start = datetime.strptime(schedule["time_start"], "%H:%M").time()
    end = datetime.strptime(schedule["time_end"], "%H:%M").time()
    now = current_time.time()

    if start <= now <= end:
        return {
            "Occupied": 1.5,
            "Leaving": 0.9,
            "Empty": 0.6
        }
    else:
        return {
            "Occupied": 0.6,
            "Leaving": 0.9,
            "Empty": 1.4
        }


# -------------------------------
# APPLY SCHEDULE SAFELY
# -------------------------------
def apply_schedule_bias(updated, obs, schedule_bias):
    if not schedule_bias:
        return updated

    people = obs.get("estimated_occupancy", obs["people_count"])
    biased = {}

    for state in updated:
        bias = schedule_bias.get(state, 1.0)

        # 🚨 Safety rules
        if people == 0:
            if state == "Occupied":
                bias = min(bias, 0.8)
        else:
            if state == "Occupied":
                bias = max(bias, 1.0)

        biased[state] = updated[state] * bias

    return biased


# -------------------------------
# HSMM BELIEF UPDATE
# -------------------------------
def update_belief(prev_belief, obs, history, dt, room_state, schedule=None):
    obs = enhance_with_history(obs, history)

    current_state = room_state.current_state
    duration = room_state.state_duration

    predicted = state_transition(
        prev_belief,
        current_state,
        duration,
        dt
    )

    likelihood = observation_likelihood(obs)

    updated = {
        k: predicted[k] * likelihood[k]
        for k in prev_belief
    }

    # 🔥 Schedule Bias Injection
    schedule_bias = compute_schedule_bias(schedule)
    updated = apply_schedule_bias(updated, obs, schedule_bias)

    return normalize(updated)


# -------------------------------
# FINAL STATE
# -------------------------------
def infer_state(belief, room_state, dt):
    new_state = max(belief, key=belief.get)

    if new_state == room_state.current_state:
        room_state.state_duration += dt
    else:
        room_state.current_state = new_state
        room_state.state_duration = dt

    return new_state
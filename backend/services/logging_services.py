import json
import os
from datetime import datetime

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)


def log_inference(room_id, features, state, belief, schedule):
    timestamp = datetime.now().isoformat()

    # -------------------------------
    # Determine expected state
    # -------------------------------
    schedule_active = False
    expected_state = None

    if schedule:
        now = datetime.now()
        current_day = now.strftime("%A").lower()

        if schedule["day"].lower() == current_day:
            start = datetime.strptime(schedule["time_start"], "%H:%M").time()
            end = datetime.strptime(schedule["time_end"], "%H:%M").time()

            if start <= now.time() <= end:
                schedule_active = True
                expected_state = "Occupied"
            else:
                expected_state = "Empty"

    # -------------------------------
    # Mismatch logic
    # -------------------------------
    mismatch = False
    if expected_state:
        if expected_state == "Occupied" and state == "Empty":
            mismatch = True
        elif expected_state == "Empty" and state == "Occupied":
            mismatch = True

    # -------------------------------
    # Build log entry
    # -------------------------------
    log_entry = {
        "timestamp": timestamp,
        "room_id": room_id,
        "state": state,
        "belief": belief,
        "estimated_occupancy": features.get("estimated_occupancy", 0),
        "people_count": features.get("people_count", 0),
        "schedule_active": schedule_active,
        "expected_state": expected_state,
        "mismatch": mismatch
    }

    # -------------------------------
    # Save per room file
    # -------------------------------
    filename = os.path.join(LOG_DIR, f"{room_id}.jsonl")

    with open(filename, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
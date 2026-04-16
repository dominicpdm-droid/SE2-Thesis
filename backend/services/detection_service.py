# backend/services/detection_service.py
import numpy as np
import cv2

from core.model import model
from helpers.feature import extract_features
from helpers.inference import update_belief, infer_state
from services.logging_services import log_inference

DT = 3.0


def process_frame(image, room_state, exit_points, schedule=None):
    results = model(image)

    # -------------------------------
    # Feature extraction
    # -------------------------------
    features, centers = extract_features(
        results,
        room_state.previous_centers,
        exit_points
    )
    room_state.previous_centers = centers

    # -------------------------------
    # Occupancy logic
    # -------------------------------
    if features["entry_count"] > 0:
        room_state.estimated_occupancy += features["entry_count"]

    # STRONG EXIT HANDLING
    if features["exit_count"] > 0:
        room_state.estimated_occupancy -= features["exit_count"]

        # HARD CLAMP (important)
        if room_state.estimated_occupancy < 0.5:
            room_state.estimated_occupancy = 0

    # -------------------------------
    # Decay logic
    # -------------------------------
    recent = list(room_state.feature_history)[-3:]
    recent_exit = any(f["exit_activity"] for f in recent)

    # Normal decay
    if not recent_exit:
        room_state.estimated_occupancy = max(
            0,
            room_state.estimated_occupancy - 0.1
        )

    # Stronger decay if fully empty visually
    if features["people_count"] == 0 and not features["exit_activity"]:
        room_state.estimated_occupancy = max(
            0,
            room_state.estimated_occupancy - 0.2
        )

    # Sync with detection if underestimated
    if features["people_count"] > room_state.estimated_occupancy:
        room_state.estimated_occupancy = features["people_count"]

    # Inject into features
    features["estimated_occupancy"] = room_state.estimated_occupancy

    # Save history
    room_state.feature_history.append(features)

    # -------------------------------
    # 🔥 INFERENCE (NOW SCHEDULE-AWARE)
    # -------------------------------
    room_state.belief = update_belief(
        room_state.belief,
        features,
        room_state.feature_history,
        dt=DT,
        room_state=room_state,
        schedule=schedule   # 👈 NEW
    )

    state = infer_state(
        room_state.belief,
        room_state,
        DT
    )
    
    state = infer_state(
    room_state.belief,
    room_state,
    DT
    )
    
    # 🔥 LOG HERE
    log_inference(
        room_id=room_state.room_id,
        features=features,
        state=state,
        belief=room_state.belief,
        schedule=schedule
    )

    return results, features, state, room_state.belief
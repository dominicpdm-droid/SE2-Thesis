#backend/routes/detect.py
from fastapi import APIRouter, UploadFile, File, Form
import numpy as np
import cv2
import json

from helpers.build_exit_zones import build_exit_zones
from services.detection_service import process_frame
from services.state_service import get_room_state
from services.visualization_service import draw_annotations
from services.storage_service import save_image

router = APIRouter()

@router.post("/detect")
async def detect(
    file: UploadFile = File(...),
    room_id: str = Form(...),
    exit_points: str = Form(...)
):
    contents = await file.read()

    np_array = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Invalid image"}
    
    exit_points_parsed = None
    if exit_points and exit_points.strip() not in ["", "[]"]:
        try:
            points = json.loads(exit_points)
        except Exception:
            return {"error": "Invalid exit points format"}
            
            exit_points_parsed = build_exit_zones(points)
        except json.JSONDecodeError:
            return {"error": "Invalid exit points format"}

    print("Received exit points - ", exit_points_parsed)
    
    room_state = get_room_state(room_id)

    results, features, state, belief = process_frame(image, room_state, exit_points_parsed)

    frame = draw_annotations(results, exit_points_parsed)
    filename, image_url = save_image(frame)


    return {
        "features": features,
        "state": state,
        "belief": belief,
        "image_url": image_url
    }
from fastapi import FastAPI
from ultralytics import YOLO
import uvicorn
import cv2

app = FastAPI()
model = YOLO("./model/yolov8n.pt")

"""
The function `detect_objects` takes an image path as input, detects objects in the image using a
model, annotates the image with the detected objects, saves the annotated image, and returns a
message indicating detection completion along with the path to the annotated image.

:param image_path: The `image_path` parameter in the `detect_objects` function is a string that
represents the file path to the image that you want to perform object detection on. This function
takes the image located at the specified path, runs a model to detect objects in the image,
annotates the detected objects on
:type image_path: str
:return: The function `detect_objects` returns a dictionary with two keys: "message" and
"output_path". The value of "message" is "Detection complete", and the value of "output_path" is the
path where the annotated image is saved after object detection.
"""

@app.get("/detect")
async def detect_objects(image_path: str):
    try:
        contents = await file.read()
        np_array = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        if image is None:
            return {"error": "Invalid image file"}
        
        results = model(image)
        
        count = 0
        for box in results[0].boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            if class_name == "person":
                count += 1

        output_path = "./results/annotated_image.jpg"
        cv2.imwrite(output_path, image)
        return {"message": "Detection complete", "count": count, "output_path": output_path}

    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
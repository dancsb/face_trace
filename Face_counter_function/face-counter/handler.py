import cv2
import numpy as np
import base64
import json

def handle(event, context):
    try:
        data = json.loads(event.body)
        img_data = base64.b64decode(data['image'])
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return json.dumps({"error": "Failed to decode image"}), 400

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        face_list = []
        for (x, y, w, h) in faces:
            face_list.append({
                "x": int(x),
                "y": int(y),
                "width": int(w),
                "height": int(h)
            })

        return json.dumps({
            "faces_detected": len(faces),
            "bounding_boxes": face_list
        })

    except Exception as e:
        return json.dumps({"error": str(e)}), 500

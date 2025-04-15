from http.server import BaseHTTPRequestHandler
import json
import base64
import os
import tempfile
import cv2
from ultralytics import YOLO
import traceback

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            # Get the base64 image
            image_data = base64.b64decode(data['image'])
            
            # Write to temp file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                input_path = temp_file.name
                temp_file.write(image_data)
            
            output_path = input_path + '_output.jpg'
            
            # Get model path - the model should be in the same directory as this file
            model_path = os.path.join(os.path.dirname(__file__), 'car_parts_detector.pt')
            print(f"Loading model from: {model_path}")
            
            # Run YOLO
            model = YOLO(model_path)
            image = cv2.imread(input_path)
            if image is None:
                raise ValueError("Failed to load input image")
                
            results = model(image)
            annotated_image = results[0].plot()
            cv2.imwrite(output_path, annotated_image)
            
            # Read the output image
            with open(output_path, 'rb') as f:
                output_data = base64.b64encode(f.read()).decode('utf-8')
            
            # Clean up temp files
            try:
                os.unlink(input_path)
                os.unlink(output_path)
            except Exception as e:
                print(f"Error cleaning up temp files: {e}")
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = json.dumps({'segmentedImage': output_data})
            self.wfile.write(response.encode('utf-8'))
            
        except Exception as e:
            print(f"Error processing image: {e}")
            traceback.print_exc()
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': str(e)
            }).encode('utf-8'))
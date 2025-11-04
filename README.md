# Underwater Object Detection (Demo Web App)

An attractive, responsive static web app showcasing an Underwater Object Detection UI with:
- Login page (client-side demo auth)
- Dashboard for uploading images or selecting samples
- Canvas preview with simulated detections (bounding boxes + labels)
- Result cards and stats

This is designed as a beautiful front-end shell where you can plug in your own CNN/YOLO model later (via TensorFlow.js or a backend API).

## Quick Start

1) Open `index.html` in your browser.
- Use any email and a password with 6+ characters.
- You will be redirected to `app.html` after login.

2) On the dashboard:
- Upload an image or click one of the sample chips.
- Click "Run Detection" to generate simulated boxes and labels.

No build step is required. It’s 100% static. If you prefer a local server:

```bash
# Any static server works, e.g. with Python 3
python -m http.server 8080
# Then open http://localhost:8080/index.html
```

## Project Structure

```
index.html         # Login page
app.html           # Dashboard
css/styles.css     # Styling (dark theme, glassmorphism)
js/auth.js         # Simple client-side auth & route guard
js/app.js          # Image handling, canvas preview, simulated detection
README.md          # This file
```

## Replace Simulation with Real Model

You can integrate real inference in two main ways:

- TensorFlow.js (client-side)
  - Load a model (e.g., YOLOv5/YOLOv8 TFJS or MobileNet-based detector) and run inference on the uploaded image.
  - Draw predicted boxes on the same canvas currently used by the simulation.
  - Replace the `simulateDetection()` call in `js/app.js` with your actual inference function and populate `boxes` with `{ x, y, w, h, label, confidence }` in canvas coordinates.

- Backend API (server-side)
  - POST the image to your API (Flask/FastAPI/Node) that runs CNN/YOLO server-side.
  - The API should return a JSON array of boxes with labels and confidences.
  - Update the front-end to call the API and render results in the same format.

### Expected Box Format

```js
{
  x: Number,   // canvas x
  y: Number,   // canvas y
  w: Number,   // width on canvas
  h: Number,   // height on canvas
  label: String,
  confidence: Number // 0..1
}
```

## Notes
- Samples use Unsplash images via public URLs. If CORS blocks a particular image, pick another link or host your own assets.
- Auth is demo-only (localStorage token). Replace with real auth for production.

## License
MIT



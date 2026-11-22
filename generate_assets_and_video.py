import asyncio
import base64
import json
import os
import shutil
import subprocess
import time
import urllib.request
import websockets
from PIL import Image

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROFILE_DIR = r"C:\work\GARUDA CONSTRUCTIONS\.chrome_asset_profile"
FRAMES_DIR = r"C:\work\GARUDA CONSTRUCTIONS\video_frames"
ASSETS_DIR = r"C:\work\GARUDA CONSTRUCTIONS\pdf_assets"

os.makedirs(FRAMES_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

async def main():
    if os.path.exists(PROFILE_DIR):
        try:
            shutil.rmtree(PROFILE_DIR)
        except Exception:
            pass

    proc = subprocess.Popen([
        CHROME_PATH,
        '--headless=new',
        '--remote-debugging-port=9444',
        f'--user-data-dir={PROFILE_DIR}',
        '--window-size=1440,900',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check'
    ])
    time.sleep(2.5)

    try:
        with urllib.request.urlopen("http://localhost:9444/json") as r:
            tabs = json.loads(r.read().decode())
            page_tab = next(t for t in tabs if t.get("type") == "page")
            ws_url = page_tab["webSocketDebuggerUrl"]

        async with websockets.connect(ws_url, max_size=100*1024*1024) as ws:
            msg_id = 1
            async def send(method, params=None):
                nonlocal msg_id
                cid = msg_id
                msg_id += 1
                await ws.send(json.dumps({"id": cid, "method": method, "params": params or {}}))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == cid:
                        return resp.get("result", {})

            await send("Page.enable")
            await send("DOM.enable")

            # -------------------------------------------------------------
            # STEP 1: CAPTURE NEW SITE SECTIONS (http://localhost:3030/)
            # -------------------------------------------------------------
            print("Loading http://localhost:3030/ ...")
            await send("Page.navigate", {"url": "http://localhost:3030/"})
            await asyncio.sleep(3.5)

            # Ensure all images are loaded
            await send("Runtime.evaluate", {
                "expression": """
                Promise.all(Array.from(document.images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(r => { img.onload = r; img.onerror = r; });
                }))
                """,
                "awaitPromise": True
            })
            await asyncio.sleep(1)

            async def capture_viewport(out_path, format="png", quality=None):
                params = {"format": format}
                if quality:
                    params["quality"] = quality
                shot = await send("Page.captureScreenshot", params)
                data = base64.b64decode(shot["data"])
                with open(out_path, "wb") as f:
                    f.write(data)
                return out_path

            # Hero Section
            print("Capturing New Hero...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_hero_new.png"))

            # Projects Section
            print("Capturing New Projects...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 940)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_projects_new.png"))

            # Packages Section
            print("Capturing New Packages (Clean 4 Cards & Matrix Banner)...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 1750)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_packages_new.png"))

            # Services Section
            print("Capturing New Services...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 3020)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_services_new.png"))

            # Calculator Section
            print("Capturing New Calculator (calculator.html)...")
            await send("Page.navigate", {"url": "http://localhost:3030/calculator.html"})
            await asyncio.sleep(2.5)
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 120)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_calculator_new.png"))

            # -------------------------------------------------------------
            # STEP 2: CAPTURE OLD SITE SECTIONS (https://garuda-construction.com/)
            # -------------------------------------------------------------
            print("Loading https://garuda-construction.com/ ...")
            await send("Page.navigate", {"url": "https://garuda-construction.com/"})
            await asyncio.sleep(6)

            # Pre-scroll through old site to trigger lazy image loads
            await send("Runtime.evaluate", {
                "expression": """
                new Promise(async (resolve) => {
                    window.scrollTo(0, 1000);
                    await new Promise(r => setTimeout(r, 800));
                    window.scrollTo(0, 2200);
                    await new Promise(r => setTimeout(r, 800));
                    window.scrollTo(0, 2800);
                    await new Promise(r => setTimeout(r, 800));
                    window.scrollTo(0, 3500);
                    await new Promise(r => setTimeout(r, 800));
                    window.scrollTo(0, 0);
                    await new Promise(r => setTimeout(r, 500));
                    resolve(true);
                })
                """,
                "awaitPromise": True
            })
            await asyncio.sleep(1.5)

            # Old Hero Section
            print("Capturing Old Hero...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_hero_old.png"))

            # Old Services Section ("Why Choose Us")
            print("Capturing Old Services...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 2140)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_services_old.png"))

            # Old Packages Section ("Our Construction Packages")
            print("Capturing Old Packages (Bare Rates)...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 2750)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_packages_old.png"))

            # Old Projects Section ("Browse Our Latest Construction")
            print("Capturing Old Projects...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 3150)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_projects_old.png"))

            # Old Calculator Section ("How It Works" with dead links)
            print("Capturing Old How It Works / Dead Calculator links...")
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 3850)"})
            await asyncio.sleep(0.5)
            await capture_viewport(os.path.join(ASSETS_DIR, "pair_calculator_old.png"))

            # -------------------------------------------------------------
            # STEP 3: RECORD HOMEPAGE SCROLLING VIDEO (http://localhost:3030/)
            # -------------------------------------------------------------
            print("Returning to http://localhost:3030/ for smooth scrolling video recording...")
            await send("Page.navigate", {"url": "http://localhost:3030/"})
            await asyncio.sleep(3.5)

            res_height = await send("Runtime.evaluate", {"expression": "document.body.scrollHeight"})
            total_height = res_height.get("result", {}).get("value", 7400)
            viewport_height = 900
            max_scroll = max(0, total_height - viewport_height)
            print(f"Total Height: {total_height}px, Max Scroll: {max_scroll}px")

            # We will generate 240 frames total (8 seconds at 30fps)
            # 20 frames stationary at top (0.66s)
            # 200 frames scrolling down smoothly
            # 20 frames stationary at bottom (0.66s)
            total_frames = 240
            scroll_frames = 200
            top_pause = 20
            bottom_pause = 20

            # Clean frames dir
            for f in os.listdir(FRAMES_DIR):
                if f.endswith(".jpg"):
                    os.remove(os.path.join(FRAMES_DIR, f))

            print(f"Capturing {total_frames} frames for smooth scrolling video...")
            frame_idx = 1

            # Top pause
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
            await asyncio.sleep(0.2)
            shot = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            top_data = base64.b64decode(shot["data"])
            for _ in range(top_pause):
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(top_data)
                frame_idx += 1

            # Smooth scrolling frames
            for i in range(scroll_frames):
                # Smooth progress using sine easing
                import math
                progress = i / (scroll_frames - 1)
                # smooth cubic easing
                ease_progress = progress * progress * (3 - 2 * progress)
                target_y = int(ease_progress * max_scroll)

                await send("Runtime.evaluate", {"expression": f"window.scrollTo(0, {target_y})"})
                # short yield to let rendering update
                await asyncio.sleep(0.02)
                shot = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(base64.b64decode(shot["data"]))
                frame_idx += 1

            # Bottom pause
            shot = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            bottom_data = base64.b64decode(shot["data"])
            for _ in range(bottom_pause):
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(bottom_data)
                frame_idx += 1

            print(f"Captured {frame_idx - 1} frames successfully.")

    finally:
        proc.terminate()

    # -------------------------------------------------------------
    # STEP 4: ENCODE VIDEO WITH FFMPEG
    # -------------------------------------------------------------
    out_video = r"c:\work\GARUDA CONSTRUCTIONS\garuda_homepage_scroll.mp4"
    print(f"Encoding video with ffmpeg to {out_video} ...")
    cmd = [
        "ffmpeg", "-y",
        "-framerate", "30",
        "-i", os.path.join(FRAMES_DIR, "frame_%04d.jpg"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "medium",
        "-movflags", "+faststart",
        out_video
    ]
    subprocess.run(cmd, check=True)
    print("Video generation completed successfully!")

    # -------------------------------------------------------------
    # STEP 5: NORMALIZE SCREENSHOTS FOR CASE STUDY (16:10 Aspect Ratio)
    # -------------------------------------------------------------
    print("Normalizing paired screenshot images for PDF...")
    pairs = [
        ("pair_hero_old", "pair_hero_new"),
        ("pair_services_old", "pair_services_new"),
        ("pair_packages_old", "pair_packages_new"),
        ("pair_projects_old", "pair_projects_new"),
        ("pair_calculator_old", "pair_calculator_new"),
    ]
    TARGET_SIZE = (1280, 800)

    for old_name, new_name in pairs:
        for name in [old_name, new_name]:
            png_path = os.path.join(ASSETS_DIR, f"{name}.png")
            jpg_path = os.path.join(ASSETS_DIR, f"{name}.jpg")
            if os.path.exists(png_path):
                img = Image.open(png_path).convert("RGB")
                # Crop or resize to 1280x800
                w, h = img.size
                target_ratio = 1280 / 800
                current_ratio = w / h
                if current_ratio > target_ratio:
                    new_w = int(h * target_ratio)
                    left = (w - new_w) // 2
                    img = img.crop((left, 0, left + new_w, h))
                else:
                    new_h = int(w / target_ratio)
                    top = (h - new_h) // 2
                    img = img.crop((0, top, w, top + new_h))

                img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
                img.save(jpg_path, "JPEG", quality=92)
                print(f"Generated normalized asset: {jpg_path} ({TARGET_SIZE})")

if __name__ == '__main__':
    asyncio.run(main())

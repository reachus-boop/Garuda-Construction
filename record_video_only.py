import asyncio
import base64
import json
import math
import os
import subprocess
import time
import urllib.request
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FRAMES_DIR = r"C:\work\GARUDA CONSTRUCTIONS\video_frames"
os.makedirs(FRAMES_DIR, exist_ok=True)

async def record():
    proc = subprocess.Popen([
        CHROME_PATH,
        '--headless=new',
        '--remote-debugging-port=9444',
        '--window-size=1440,900',
        '--disable-gpu'
    ])
    time.sleep(2)
    try:
        with urllib.request.urlopen("http://localhost:9444/json") as r:
            tabs = json.loads(r.read().decode())
            ws_url = [t for t in tabs if t.get("type") == "page"][0]["webSocketDebuggerUrl"]

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
            await send("Page.navigate", {"url": "http://localhost:3030/"})
            await asyncio.sleep(3)

            # Wait for all images
            await send("Runtime.evaluate", {
                "expression": "Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() : new Promise(r => img.onload = img.onerror = r)))",
                "awaitPromise": True
            })
            await asyncio.sleep(0.5)

            res_h = await send("Runtime.evaluate", {"expression": "document.body.scrollHeight"})
            total_height = res_h.get("result", {}).get("value", 7400)
            max_scroll = max(0, total_height - 900)

            total_frames = 240
            scroll_frames = 200
            top_pause = 20
            bottom_pause = 20

            # Clean frames
            for f in os.listdir(FRAMES_DIR):
                if f.endswith(".jpg"):
                    os.remove(os.path.join(FRAMES_DIR, f))

            frame_idx = 1
            await send("Runtime.evaluate", {"expression": "window.scrollTo(0, 0)"})
            await asyncio.sleep(0.2)
            shot = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            top_data = base64.b64decode(shot["data"])
            for _ in range(top_pause):
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(top_data)
                frame_idx += 1

            for i in range(scroll_frames):
                p = i / (scroll_frames - 1)
                ease = p * p * (3 - 2 * p)
                y = int(ease * max_scroll)
                await send("Runtime.evaluate", {"expression": f"window.scrollTo(0, {y})"})
                await asyncio.sleep(0.015)
                s = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(base64.b64decode(s["data"]))
                frame_idx += 1

            s = await send("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            bot_data = base64.b64decode(s["data"])
            for _ in range(bottom_pause):
                with open(os.path.join(FRAMES_DIR, f"frame_{frame_idx:04d}.jpg"), "wb") as f:
                    f.write(bot_data)
                frame_idx += 1
            print("Captured all video frames!")
    finally:
        proc.terminate()

    out_video = r"c:\work\GARUDA CONSTRUCTIONS\garuda_homepage_scroll.mp4"
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
    print(f"Updated video at {out_video}")

if __name__ == '__main__':
    asyncio.run(record())

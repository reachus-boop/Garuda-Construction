import asyncio
import json
import subprocess
import time
import urllib.request
import websockets
from PIL import Image
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

async def run():
    proc = subprocess.Popen([
        CHROME_PATH,
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--window-size=1280,900'
    ])
    time.sleep(2)
    
    try:
        with urllib.request.urlopen("http://localhost:9222/json") as r:
            tabs = json.loads(r.read().decode())
            ws_url = tabs[0]["webSocketDebuggerUrl"]
        
        async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
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

            # 1. Load old site
            print("Navigating to https://garuda-construction.com/ ...")
            await send("Page.navigate", {"url": "https://garuda-construction.com/"})
            await asyncio.sleep(6) # Let full site load

            # Scroll through whole page slowly to trigger lazy loading of images
            scroll_script = """
            async function fullScroll() {
                const totalHeight = document.body.scrollHeight;
                let cur = 0;
                while (cur < totalHeight) {
                    cur += 400;
                    window.scrollTo(0, cur);
                    await new Promise(r => setTimeout(r, 150));
                }
                // wait for images to load
                await Promise.all(Array.from(document.images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(res => { img.onload = res; img.onerror = res; });
                }));
                window.scrollTo(0, 0);
                await new Promise(r => setTimeout(r, 500));
            }
            fullScroll();
            """
            await send("Runtime.evaluate", {"expression": scroll_script, "awaitPromise": True})
            await asyncio.sleep(2)

            # Discover sections on old site
            discover_script = """
            (() => {
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, section, .section, header')).map(el => {
                    const rect = el.getBoundingClientRect();
                    return {
                        tag: el.tagName,
                        text: el.innerText.trim().slice(0, 80),
                        top: Math.round(rect.top + window.scrollY),
                        height: Math.round(rect.height)
                    };
                });
                return headings.filter(h => h.text.length > 3);
            })()
            """
            res = await send("Runtime.evaluate", {"expression": discover_script, "returnByValue": True})
            print("Old Site Headings & Sections:")
            print(json.dumps(res.get("result", {}).get("value", []), indent=2))

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(run())

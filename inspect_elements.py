import asyncio
import json
import subprocess
import time
import urllib.request
import websockets
import os
import shutil

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROFILE_DIR = r"C:\work\GARUDA CONSTRUCTIONS\.chrome_profile_tmp"

async def inspect():
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

            # 1. NEW SITE
            print("=== NAVIGATING TO http://localhost:3030/ ===")
            await send("Page.navigate", {"url": "http://localhost:3030/"})
            await asyncio.sleep(3)

            # Wait for images to load
            await send("Runtime.evaluate", {
                "expression": """
                Promise.all(Array.from(document.images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(r => { img.onload = r; img.onerror = r; });
                }))
                """,
                "awaitPromise": True
            })

            res_new = await send("Runtime.evaluate", {
                "expression": """
                (() => {
                    const hero = document.querySelector('.hero');
                    const services = document.querySelector('#services');
                    const packages = document.querySelector('#packages');
                    const projects = document.querySelector('#projects');
                    
                    const getBox = el => {
                        if (!el) return null;
                        const r = el.getBoundingClientRect();
                        return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height), width: Math.round(r.width) };
                    };
                    return {
                        hero: getBox(hero),
                        services: getBox(services),
                        packages: getBox(packages),
                        projects: getBox(projects),
                        scrollHeight: document.body.scrollHeight
                    };
                })()
                """,
                "returnByValue": True
            })
            print("NEW SITE ELEMENTS:", json.dumps(res_new.get("result", {}).get("value"), indent=2))

            # 2. OLD SITE
            print("=== NAVIGATING TO https://garuda-construction.com/ ===")
            await send("Page.navigate", {"url": "https://garuda-construction.com/"})
            await asyncio.sleep(5)

            # Scroll through to trigger all images
            await send("Runtime.evaluate", {
                "expression": """
                new Promise(async (resolve) => {
                    window.scrollTo(0, 1000);
                    await new Promise(r => setTimeout(r, 1000));
                    window.scrollTo(0, 2500);
                    await new Promise(r => setTimeout(r, 1000));
                    window.scrollTo(0, 4500);
                    await new Promise(r => setTimeout(r, 1000));
                    window.scrollTo(0, 0);
                    await new Promise(r => setTimeout(r, 500));
                    resolve(true);
                })
                """,
                "awaitPromise": True
            })

            res_old = await send("Runtime.evaluate", {
                "expression": """
                (() => {
                    const findByText = (sel, text) => {
                        return Array.from(document.querySelectorAll(sel)).find(el => el.innerText && el.innerText.includes(text));
                    };
                    const getBox = el => {
                        if (!el) return null;
                        const r = el.getBoundingClientRect();
                        return { top: Math.round(r.top + window.scrollY), height: Math.round(r.height), width: Math.round(r.width) };
                    };

                    const hero = document.querySelector('.slider-area, .hero-area') || document.querySelector('h1')?.closest('div.container, section');
                    const services = findByText('h2', 'Why Choose Us')?.closest('section, div[class*=\"area\"], div.container');
                    const packages = findByText('h2', 'Our Construction Packages')?.closest('section, div[class*=\"area\"], div.container');
                    const projects = findByText('h2', 'Browse Our Latest Construction')?.closest('section, div[class*=\"area\"], div.container');
                    const howItWorks = findByText('h2', 'How It Works')?.closest('section, div[class*=\"area\"], div.container');

                    return {
                        hero: getBox(hero),
                        services: getBox(services),
                        packages: getBox(packages),
                        projects: getBox(projects),
                        howItWorks: getBox(howItWorks),
                        scrollHeight: document.body.scrollHeight
                    };
                })()
                """,
                "returnByValue": True
            })
            print("OLD SITE ELEMENTS:", json.dumps(res_old.get("result", {}).get("value"), indent=2))

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(inspect())

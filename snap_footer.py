import asyncio
import base64
import json
import subprocess
import time
import urllib.request
import websockets

async def snap():
    proc = subprocess.Popen([
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9444',
        '--disable-gpu',
        '--window-size=1440,900'
    ])
    time.sleep(2)
    try:
        with urllib.request.urlopen('http://localhost:9444/json') as r:
            tabs = json.loads(r.read().decode())
            ws_url = [t for t in tabs if t.get('type') == 'page'][0]['webSocketDebuggerUrl']
        async with websockets.connect(ws_url, max_size=50*1024*1024) as ws:
            msg_id = 1
            async def send(method, params=None):
                nonlocal msg_id
                cid = msg_id
                msg_id += 1
                await ws.send(json.dumps({'id': cid, 'method': method, 'params': params or {}}))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get('id') == cid:
                        return resp.get('result', {})
            await send('Page.enable')
            await send('Page.navigate', {'url': 'http://localhost:3030/contact.html'})
            await asyncio.sleep(2)
            await send('Runtime.evaluate', {'expression': 'document.querySelector(".footer__base").scrollIntoView({block: "center"})'})
            await asyncio.sleep(0.5)
            shot = await send('Page.captureScreenshot', {'format': 'png'})
            with open('pdf_assets/verified_contact_footer.png', 'wb') as f:
                f.write(base64.b64decode(shot['data']))
            print('Saved pdf_assets/verified_contact_footer.png')
    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(snap())

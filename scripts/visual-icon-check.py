import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("/tmp/browser/icons/screens"); OUT.mkdir(parents=True, exist_ok=True)
BPS = [("mobile",390,844),("tablet",768,1024),("desktop",1440,900)]

async def run(pw, motion):
    b = await pw.chromium.launch(headless=True)
    for name,w,h in BPS:
        ctx = await b.new_context(viewport={"width":w,"height":1800},
                                  reduced_motion="reduce" if motion=="reduced" else "no-preference")
        p = await ctx.new_page()
        errs=[]; p.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        await p.goto("http://localhost:8080", wait_until="networkidle")
        for sec in ["#lab","#contact"]:
            await p.evaluate(f"document.querySelector('{sec}')?.scrollIntoView()")
            await p.wait_for_timeout(700)
            el = await p.query_selector(sec)
            if el: await el.screenshot(path=str(OUT/f"{motion}_{name}{sec[1:]}.png"))
        boxes = await p.eval_on_selector_all(".icon-box svg", "els=>els.map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})")
        print(motion,name,"icon sizes:",boxes,"errors:",errs[:3])
        await ctx.close()
    await b.close()

async def main():
    async with async_playwright() as pw:
        for m in ["normal","reduced"]:
            await run(pw,m)
asyncio.run(main())

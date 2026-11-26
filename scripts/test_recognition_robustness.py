"""TRACE recognition robustness matrix (MMFA).

Simulates the conditions a child produces in a gallery: standing far away (the
work fills only part of the frame), off-axis viewing (small rotation and
keystone squeeze), dim or warm gallery lighting, over-exposure and hand-shake
blur. Each variant is rendered from the work's own loaded reference views and
then checked twice:

  * against its own chapter   -> recognition rate is measured and reported
  * against a different work  -> must NEVER be accepted (false positive = fail)

This is a synthetic, in-browser approximation. It does not replace real
on-site photography with physical devices, which remains required.
"""
import os, json
from playwright.sync_api import sync_playwright

URL = os.getenv("TRACE_TEST_URL", "http://127.0.0.1:8765/?v=robust")
# Minimum self-recognition rates per category, set just below the measured
# baseline so that regressions in the matcher are caught.
MIN_RATE = {"painting": 0.90, "sculpture": 0.75}

JS = r"""
async () => {
 const variants = [
  {name:'straight',   scale:1.00, rot:0,  squeeze:1.00, bright:1.00, tint:null,     blur:0},
  {name:'far-70',     scale:0.70, rot:0,  squeeze:1.00, bright:1.00, tint:null,     blur:0},
  {name:'far-50',     scale:0.50, rot:0,  squeeze:1.00, bright:1.00, tint:null,     blur:0},
  {name:'tilt-left',  scale:0.85, rot:-5, squeeze:0.90, bright:1.00, tint:null,     blur:0},
  {name:'tilt-right', scale:0.85, rot:5,  squeeze:0.90, bright:1.00, tint:null,     blur:0},
  {name:'dim',        scale:0.85, rot:0,  squeeze:1.00, bright:0.65, tint:null,     blur:0},
  {name:'warm-light', scale:0.85, rot:0,  squeeze:1.00, bright:0.95, tint:'rgba(255,170,60,.16)', blur:0},
  {name:'bright',     scale:0.85, rot:0,  squeeze:1.00, bright:1.30, tint:null,     blur:0},
  {name:'shake-blur', scale:0.85, rot:0,  squeeze:1.00, bright:1.00, tint:null,     blur:1.6},
 ];
 const wallColour = '#8d8778';
 const decodeSignature = (p) => {
  const bytes = atob(p.rgb), pixels = new Uint8ClampedArray(p.cols * p.rows * 4);
  for (let i = 0, j = 0; i < bytes.length; i += 3, j += 8) {
   const a = bytes.charCodeAt(i), b = bytes.charCodeAt(i + 1), c = bytes.charCodeAt(i + 2);
   pixels[j] = (a >> 4) * 17; pixels[j + 1] = (a & 15) * 17; pixels[j + 2] = (b >> 4) * 17; pixels[j + 3] = 255;
   pixels[j + 4] = (b & 15) * 17; pixels[j + 5] = (c >> 4) * 17; pixels[j + 6] = (c & 15) * 17; pixels[j + 7] = 255;
  }
  const small = document.createElement('canvas'); small.width = p.cols; small.height = p.rows;
  small.getContext('2d').putImageData(new ImageData(pixels, p.cols, p.rows), 0, 0);
  const big = document.createElement('canvas'); const r = p.w / p.h;
  big.width = r > 1 ? 900 : Math.round(900 * r); big.height = r > 1 ? Math.round(900 / r) : 900;
  const x = big.getContext('2d'); x.imageSmoothingEnabled = true; x.drawImage(small, 0, 0, big.width, big.height);
  return big;
 };
 const toCanvas = (src) => {
  const w = src.naturalWidth || src.videoWidth || src.width, h = src.naturalHeight || src.videoHeight || src.height;
  if (!w || !h) return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(src, 0, 0); return c;
 };
 const sourcesFor = (id) => {
  const a = A.find(x => x.id === id), list = [];
  for (const [i, s] of [a.reference, ...(a.referenceViews || [])].filter(Boolean).entries()) { try { const c = toCanvas(s); if (c) list.push({view: i, canvas: c}); } catch (e) {} }
  for (const [i, s] of (window.TRACE_GALLERY_SIGNATURES?.[id] || []).entries()) list.push({view: 100 + i, canvas: decodeSignature(s)});
  return list;
 };
 const draw = (base, v) => {
  const W = 900, H = 900, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = wallColour; x.fillRect(0, 0, W, H);
  const ratio = base.width / base.height;
  let w = W * v.scale, h = w / ratio; if (h > H * v.scale) { h = H * v.scale; w = h * ratio; }
  x.save(); x.translate(W / 2, H / 2); x.rotate(v.rot * Math.PI / 180); x.scale(v.squeeze, 1);
  x.filter = `brightness(${v.bright})` + (v.blur ? ` blur(${v.blur}px)` : '');
  x.drawImage(base, -w / 2, -h / 2, w, h); x.restore(); x.filter = 'none';
  if (v.tint) { x.fillStyle = v.tint; x.fillRect(0, 0, W, H); }
  return c;
 };
 const kind = (id) => /sculpture/i.test((A.find(a => a.id === id)?.kind || '') + ' ' + (A.find(a => a.id === id)?.medium || '')) ? 'sculpture' : 'painting';
 const active = A.filter(a => window.TRACE_DISPLAY.isActive(a.id)).map(a => a.id);
 const out = [];
 const saved = state.current;
 for (const id of active) {
  const views = sourcesFor(id);
  if (!views.length) continue;
  const other = active.find(o => o !== id && kind(o) === kind(id)) || active.find(o => o !== id);
  // Official image plus up to two on-site views per work keeps CI time bounded.
  const pick = [...views.filter(v => v.view < 100).slice(0, 1), ...views.filter(v => v.view >= 100).slice(0, 2)];
  for (const ref of pick) {
   for (const v of variants) {
    const canvas = draw(ref.canvas, v);
    state.current = A.findIndex(a => a.id === id);
    const yes = await recognize(canvas);
    state.current = A.findIndex(a => a.id === other);
    const no = await recognize(canvas);
    out.push({id, kind: kind(id), view: ref.view, variant: v.name, yes: !!(yes.recognized && yes.id === id), wrong: !!no.recognized, other});
   }
  }
 }
 state.current = saved;
 return out;
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(URL, wait_until="domcontentloaded", timeout=45000)
    page.wait_for_function("window.__traceRefsFinished && window.TRACE_DISPLAY && !TRACE_DISPLAY.loading", timeout=90000)
    page.wait_for_function("library.filter(r=>r.id==='mmfa-eye').length>=5 && library.filter(r=>r.id==='mmfa-witte').length>=3", timeout=90000)
    rows = page.evaluate(JS)
    browser.close()

assert rows, "No MMFA reference views were available to test"
summary = {}
for r in rows:
    s = summary.setdefault(r["kind"], {"n": 0, "ok": 0, "wrong": 0})
    s["n"] += 1; s["ok"] += r["yes"]; s["wrong"] += r["wrong"]
by_variant = {}
for r in rows:
    s = by_variant.setdefault(r["variant"], [0, 0]); s[0] += r["yes"]; s[1] += 1
for name, (ok, n) in by_variant.items():
    print(f"VARIANT {name:<11} {ok:>3}/{n:<3} recognised", flush=True)
for kind, s in summary.items():
    print(f"CATEGORY {kind:<9} {s['ok']}/{s['n']} recognised ({s['ok']/s['n']:.0%}), {s['wrong']} wrong-work acceptances", flush=True)
misses = [r for r in rows if not r["yes"]]
for r in misses:
    print("MISS", json.dumps(r), flush=True)

false_pos = [r for r in rows if r["wrong"]]
assert not false_pos, "Wrong artwork accepted: " + json.dumps(false_pos[:5])
for kind, s in summary.items():
    rate = s["ok"] / s["n"]
    assert rate >= MIN_RATE[kind], f"{kind} recognition fell to {rate:.0%} (minimum {MIN_RATE[kind]:.0%})"
print("RECOGNITION ROBUSTNESS MATRIX PASSED", flush=True)

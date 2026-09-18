/* dev-only mobile audit helper: overflow, tap targets, type sizes */
window.__audit = () => {
  const vw = document.documentElement.clientWidth;
  const out = { vw, sw: document.documentElement.scrollWidth, overflow: [], smallTaps: [], smallText: [] };
  const skip = '.hero__obj, .closing__obj, .review__obj, .ribbon, .gridlines, .hero__glow, .closing__ghost, .hero__shadow, .shutter, .menu, .intro, .grain';
  const all = [...document.querySelectorAll('body *')];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') continue;
    if ((r.right > vw + 1 || r.left < -1) && !el.closest(skip)) out.overflow.push({ tag: el.tagName, cls: String(el.className).slice(0, 44), l: Math.round(r.left), r: Math.round(r.right) });
  }
  for (const el of document.querySelectorAll('a, button, input, select, textarea, [role=button], summary')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (el.closest('.menu, .intro, .shutter')) continue;
    if (r.height < 40 || r.width < 40) out.smallTaps.push({ tag: el.tagName, cls: String(el.className).slice(0, 30), txt: el.textContent.trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) });
  }
  for (const el of all) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const mono = cs.fontFamily.includes('Azeret');
    if ((mono && fs < 10) || (!mono && fs < 13)) out.smallText.push({ cls: String(el.className).slice(0, 30), fs, txt: el.textContent.trim().slice(0, 20) });
  }
  out.overflow = out.overflow.slice(0, 30); out.smallTaps = out.smallTaps.slice(0, 40); out.smallText = out.smallText.slice(0, 30);
  return out;
};

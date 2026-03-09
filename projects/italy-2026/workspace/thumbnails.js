const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');

const SLIDES = path.join(__dirname, 'slides');
const OUT = path.join(__dirname, 'v3-thumbnails.jpg');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const thumbs = [];

  for (let i = 1; i <= 23; i++) {
    const f = path.join(SLIDES, `s${String(i).padStart(2, '0')}.html`);
    await page.goto(`file://${f}`);
    await page.waitForTimeout(200);
    thumbs.push(await page.screenshot({ type: 'jpeg', quality: 85 }));
  }
  await browser.close();

  const cols = 4, tw = 480, th = 270, pad = 4, lh = 18;
  const rows = Math.ceil(thumbs.length / cols);
  const composites = [];

  for (let i = 0; i < thumbs.length; i++) {
    const x = pad + (i % cols) * (tw + pad);
    const y = pad + Math.floor(i / cols) * (th + pad + lh) + lh;
    composites.push({ input: await sharp(thumbs[i]).resize(tw, th, { fit: 'cover' }).toBuffer(), left: x, top: y });
    composites.push({ input: Buffer.from(`<svg width="${tw}" height="${lh}"><text x="4" y="14" font-family="Arial" font-size="12" fill="#555">Slide ${i}</text></svg>`), left: x, top: y - lh });
  }

  await sharp({ create: { width: cols * (tw + pad) + pad, height: rows * (th + pad + lh) + pad, channels: 3, background: { r: 240, g: 240, b: 240 } } })
    .composite(composites).jpeg({ quality: 90 }).toFile(OUT);
  console.log(`Saved: ${OUT}`);
})();

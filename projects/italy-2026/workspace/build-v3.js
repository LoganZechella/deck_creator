const pptxgen = require('pptxgenjs');
const html2pptx = require('/Users/logan/.claude/skills/powerpoint-creator/scripts/html2pptx.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'slides');
const ASSETS = path.join(__dirname, '..', 'assets');
const OUTPUT = path.join(__dirname, '..', 'output', 'italy-2026-v3.pptx');
[SLIDES_DIR, ASSETS, path.dirname(OUTPUT)].forEach(d => fs.mkdirSync(d, { recursive: true }));

const hasImg = (name) => fs.existsSync(path.join(ASSETS, name));
const imgPath = (name) => path.join(ASSETS, name);

// --- BACKGROUNDS ---
async function createBackgrounds() {
  // Solid cream
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><rect width="100%" height="100%" fill="#F4F1DE"/></svg>`))
    .png().toFile(path.join(SLIDES_DIR, 'bg-cream.png'));

  // Hero composites (photo + warm overlay) or gradient fallback
  const heroes = [
    { out: 'bg-title.png', img: 'italy-aerial.jpg', op: 0.55, g: ['#C4956B', '#D4A843'] },
    { out: 'bg-week1.png', img: 'tuscan-hills.jpg', op: 0.5, g: ['#6B8C4A', '#A4B87A'] },
    { out: 'bg-week2.png', img: 'colosseum.jpg', op: 0.5, g: ['#B8956B', '#D4A843'] },
    { out: 'bg-close.png', img: 'italian-sunset.jpg', op: 0.55, g: ['#C47A5F', '#F2CC8F'] },
  ];
  for (const h of heroes) {
    const dest = path.join(SLIDES_DIR, h.out);
    const src = hasImg(h.img) ? imgPath(h.img) : null;
    if (src) {
      const ov = Buffer.from(`<svg width="1000" height="563"><rect width="100%" height="100%" fill="rgba(244,241,222,${h.op})"/></svg>`);
      await sharp(src).resize(1000, 563, { fit: 'cover' }).composite([{ input: ov }]).png().toFile(dest);
      console.log(`  ${h.out} (photo)`);
    } else {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${h.g[0]}"/><stop offset="100%" stop-color="${h.g[1]}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
      await sharp(Buffer.from(svg)).png().toFile(dest);
      console.log(`  ${h.out} (gradient fallback)`);
    }
  }
}

// --- HTML TEMPLATE ---
function SL(bg, content) {
  const bgCSS = bg.endsWith('.png')
    ? `background-image:url('${bg}');background-size:cover;`
    : `background:#F4F1DE;`;
  return `<!DOCTYPE html><html><head><style>
html{background:#F4F1DE}
body{width:720pt;height:405pt;margin:0;padding:0;font-family:Georgia,serif;display:flex;flex-direction:column;${bgCSS}}
h1{color:#3D405B;font-size:38pt;margin:0;font-weight:700}
h2{color:#3D405B;font-size:26pt;margin:0;font-weight:700}
h3{color:#3D405B;font-size:15pt;margin:0;font-weight:700}
h4{color:#6B7280;font-size:13pt;margin:0;font-weight:400;font-family:Arial,sans-serif}
h5{color:#E07A5F;font-size:15pt;margin:0;font-weight:700}
h6{color:#6B7280;font-size:10pt;margin:0;font-weight:400;font-family:Arial,sans-serif}
p{color:#3D405B;font-size:11pt;margin:0;font-family:Arial,sans-serif}
ul,ol{margin:0;padding:0}
li{color:#3D405B;font-size:10pt;font-family:Arial,sans-serif;margin-left:14pt}
.card{background:#FFFFFF;border-radius:8pt;padding:12pt;box-shadow:2px 2px 8px rgba(0,0,0,0.06)}
.pill{display:inline-block;background:#F2CC8F;border-radius:20pt;padding:2pt 10pt}
.dur{display:inline-block;background:#FCEEE8;border-radius:20pt;padding:2pt 10pt}
.badge{display:inline-block;border-radius:4pt;padding:2pt 8pt;color:#FFF;font-size:9pt;font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:0.5pt}
.conf{background:#FBF3E0;border-radius:4pt;padding:1pt 6pt;color:#3D405B;font-size:10pt;font-family:Courier New,monospace;font-weight:700;display:inline-block}
</style></head><body>${content}</body></html>`;
}

// Photo element helper - returns img html or empty string
function PI(name, w = '230pt', h = '170pt') {
  if (!hasImg(name)) return '';
  return `<img src="${imgPath(name)}" style="width:${w};height:${h};border-radius:8pt">`;
}

// --- WRITE ALL 23 SLIDES ---
function writeSlides() {
  const W = (name, html) => fs.writeFileSync(path.join(SLIDES_DIR, name), html);

  // ===== S01: TITLE =====
  W('s01.html', SL('bg-title.png', `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:40pt 50pt 50pt">
      <div style="display:flex;width:60pt;height:5pt;margin-bottom:12pt">
        <div style="flex:1;background:#009246"></div>
        <div style="flex:1;background:#FFFFFF"></div>
        <div style="flex:1;background:#CE2B37"></div>
      </div>
      <h1 style="font-size:52pt;font-style:italic;letter-spacing:-1pt">Italia 2026</h1>
      <h4 style="margin-top:8pt;font-size:14pt">May 1 – 15 · Logan, Jim, Paula, Geoff &amp; Toni</h4>
      <div style="display:flex;gap:8pt;margin-top:16pt">
        <div style="background:rgba(135,169,107,0.3);border:1px solid rgba(135,169,107,0.6);border-radius:20pt;padding:3pt 12pt"><p style="color:#5A7A3E;font-size:10pt;font-weight:700">Tuscany</p></div>
        <div style="background:rgba(212,168,67,0.3);border:1px solid rgba(212,168,67,0.6);border-radius:20pt;padding:3pt 12pt"><p style="color:#A07820;font-size:10pt;font-weight:700">Rome</p></div>
        <div style="background:rgba(74,144,164,0.3);border:1px solid rgba(74,144,164,0.6);border-radius:20pt;padding:3pt 12pt"><p style="color:#2A6A7A;font-size:10pt;font-weight:700">Naples</p></div>
      </div>
    </div>
  `));

  // ===== S02: TRIP AT A GLANCE =====
  W('s02.html', SL('bg-cream.png', `
    <div style="padding:30pt 44pt">
      <h2>Trip at a Glance</h2>
      <p style="margin-top:4pt;color:#6B7280">15 days · 3 regions · 5 travelers</p>
      <div style="display:flex;height:18pt;margin-top:18pt;border-radius:20pt;overflow:hidden">
        <div style="flex:5;background:#87A96B;display:flex;align-items:center;justify-content:center"><p style="color:#FFF;font-size:8pt;font-weight:700">TUSCANY · 5N</p></div>
        <div style="flex:3;background:#D4A843;display:flex;align-items:center;justify-content:center"><p style="color:#FFF;font-size:8pt;font-weight:700">ROME · 3N</p></div>
        <div style="flex:5;background:#4A90A4;display:flex;align-items:center;justify-content:center"><p style="color:#FFF;font-size:8pt;font-weight:700">NAPLES · 5N</p></div>
      </div>
      <div style="display:flex;gap:12pt;margin-top:18pt">
        <div class="card" style="flex:1;border-left:4pt solid #87A96B">
          <h3 style="color:#87A96B">Tuscany</h3>
          <p style="margin-top:4pt;font-size:10pt">Casa Zia Franca, Barga</p>
          <p style="font-size:10pt">May 2–7 · 5 nights</p>
          <p style="font-size:9pt;color:#6B7280;margin-top:2pt">Lucca · Florence · Garfagnana</p>
        </div>
        <div class="card" style="flex:1;border-left:4pt solid #D4A843">
          <h3 style="color:#D4A843">Rome</h3>
          <p style="margin-top:4pt;font-size:10pt">citizenM Isola Tiberina</p>
          <p style="font-size:10pt">May 7–10 · 3 nights</p>
          <p style="font-size:9pt;color:#6B7280;margin-top:2pt">Vatican · Colosseum · City tours</p>
        </div>
        <div class="card" style="flex:1;border-left:4pt solid #4A90A4">
          <h3 style="color:#4A90A4">Naples &amp; Coast</h3>
          <p style="margin-top:4pt;font-size:10pt">AirBnB, Centro Storico</p>
          <p style="font-size:10pt">May 10–15 · 5 nights</p>
          <p style="font-size:9pt;color:#6B7280;margin-top:2pt">Pompeii · Capri · Amalfi</p>
        </div>
      </div>
      <div style="display:flex;gap:12pt;margin-top:12pt">
        <div class="card" style="flex:1;display:flex;align-items:center;gap:10pt">
          <p style="font-size:10pt"><b style="color:#3D405B">Rental Car</b> · Alamo, Pisa · May 2–7</p>
        </div>
        <div class="card" style="flex:1;display:flex;align-items:center;gap:10pt">
          <p style="font-size:10pt"><b style="color:#3D405B">Trains</b> · Lucca→Florence · Pisa→Rome · Rome→Naples</p>
        </div>
      </div>
    </div>
  `));

  // ===== S03: ACCOMMODATIONS & TRANSPORT =====
  W('s03.html', SL('bg-cream.png', `
    <div style="padding:28pt 40pt">
      <h2 style="font-size:22pt">Accommodations &amp; Transport</h2>
      <div style="display:flex;gap:10pt;margin-top:14pt">
        <div class="card" style="flex:1;border-left:4pt solid #87A96B">
          <h3 style="color:#87A96B;font-size:13pt">Casa Zia Franca</h3>
          <p style="font-size:9pt;margin-top:4pt">Via del Giardino 44, 55051 Barga LU</p>
          <p style="font-size:9pt"><b>Check-in:</b> Sat May 2, 15:00</p>
          <p style="font-size:9pt"><b>Check-out:</b> Thu May 7, 11:00</p>
          <p style="font-size:9pt">5 nights</p>
          <div class="pill" style="margin-top:6pt"><p style="font-size:9pt;font-weight:700;color:#3D405B">$1,615 · $323/ea</p></div>
          <p style="font-size:8pt;color:#6B7280;margin-top:3pt">Paid: Geoff (Citi 9191)</p>
        </div>
        <div class="card" style="flex:1;border-left:4pt solid #D4A843">
          <h3 style="color:#D4A843;font-size:13pt">citizenM Rome</h3>
          <p style="font-size:9pt;margin-top:4pt">Lungtevere de' Cenci 5-8, Rome 00186</p>
          <p style="font-size:9pt">Conf <span class="conf">#99566483</span></p>
          <p style="font-size:9pt"><b>Thu May 7 – Sun May 10</b> · 3 nights</p>
          <div class="pill" style="margin-top:6pt"><p style="font-size:9pt;font-weight:700;color:#3D405B">Jim's pts + $400</p></div>
        </div>
        <div class="card" style="flex:1;border-left:4pt solid #4A90A4">
          <h3 style="color:#4A90A4;font-size:13pt">AirBnB Naples</h3>
          <p style="font-size:9pt;margin-top:4pt">Largo Ecce Homo 31, Naples 80134</p>
          <p style="font-size:9pt"><b>Check-in:</b> Sun May 10, 15:00</p>
          <p style="font-size:9pt"><b>Check-out:</b> Fri May 15, 10:00</p>
          <p style="font-size:9pt">5 nights</p>
          <div class="pill" style="margin-top:6pt"><p style="font-size:9pt;font-weight:700;color:#3D405B">$1,622 · $325/ea</p></div>
          <p style="font-size:8pt;color:#6B7280;margin-top:3pt">Booked: Logan</p>
        </div>
      </div>
      <div class="card" style="margin-top:10pt;display:flex;align-items:center;gap:14pt">
        <div style="background:#E07A5F;border-radius:6pt;padding:3pt 10pt"><p style="color:#FFF;font-weight:700;font-size:10pt">CAR</p></div>
        <p style="font-size:10pt"><b>Alamo</b> · Pisa Airport · Conf <span class="conf">#758381187</span></p>
        <p style="font-size:10pt">Pickup May 2, 17:00 → Dropoff May 7, 10:00</p>
        <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$514 · $103/ea</p></div>
      </div>
    </div>
  `));

  // ===== S04: WEEK 1 DIVIDER =====
  W('s04.html', SL('bg-week1.png', `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:50pt">
      <h6 style="font-size:13pt;color:#87A96B;font-weight:700;text-transform:uppercase;letter-spacing:2pt">WEEK ONE</h6>
      <h1 style="font-size:46pt;margin-top:6pt">Tuscany &amp; Travel</h1>
      <h4 style="margin-top:8pt;font-size:14pt">May 1 – 7 · Barga, Lucca, Florence &amp; onward to Rome</h4>
    </div>
  `));

  // ===== S05: DAY 1 · FRI MAY 1 =====
  W('s05.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 1</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">FRI MAY 1</p></div>
      </div>
      <h4 style="margin-top:4pt">Evening Departure</h4>
      <div style="display:flex;flex-direction:column;gap:12pt;margin-top:24pt">
        <div class="card" style="display:flex;align-items:center;gap:14pt;border-left:4pt solid #E07A5F">
          <div style="background:#E07A5F;border-radius:6pt;padding:3pt 10pt"><p style="color:#FFF;font-weight:700;font-size:10pt">BA 120</p></div>
          <div>
            <h3 style="font-family:Arial,sans-serif;font-size:18pt">CVG → LHR</h3>
            <p style="margin-top:2pt"><b>Fri May 1</b> depart 21:10 → <b>Sat May 2</b> arrive 10:05</p>
          </div>
          <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">overnight</p></div>
        </div>
        <div class="card" style="padding:20pt;display:flex;align-items:center;justify-content:center">
          <p style="color:#6B7280;font-size:12pt;font-style:italic">Pack your bags — the adventure begins tonight!</p>
        </div>
      </div>
    </div>
  `));

  // ===== S06: DAY 2 · SAT MAY 2 =====
  const bargaPhoto = PI('barga-village.jpg', '230pt', '280pt');
  W('s06.html', SL('bg-cream.png', `
    <div style="padding:28pt 40pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 2</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">SAT MAY 2</p></div>
      </div>
      <h4 style="margin-top:3pt">Arrive in Italy · Travel to Barga</h4>
      <div style="display:flex;gap:12pt;margin-top:12pt">
        <div style="flex:1.2;display:flex;flex-direction:column;gap:8pt">
          <div class="card" style="display:flex;align-items:center;gap:10pt;border-left:4pt solid #E07A5F">
            <div style="background:#E07A5F;border-radius:6pt;padding:2pt 8pt"><p style="color:#FFF;font-weight:700;font-size:9pt">BA 612</p></div>
            <p style="font-size:10pt"><b>LHR → PSA</b> · depart 12:30 → arrive 15:50</p>
          </div>
          <div class="card" style="border-left:4pt solid #87A96B">
            <p style="font-size:10pt"><b>17:00</b> Pick up rental car · Alamo, Pisa Airport</p>
            <p style="font-size:9pt;margin-top:2pt">Conf <span class="conf">#758381187</span></p>
          </div>
          <div class="card" style="border-left:4pt solid #87A96B">
            <h3 style="color:#87A96B;font-size:13pt">Check in: Casa Zia Franca</h3>
            <p style="font-size:9pt;margin-top:3pt">Via del Giardino 44, Barga · ~1.5hr drive from Pisa</p>
            <p style="font-size:9pt">Check-in 15:00 · 5 nights</p>
            <div class="pill" style="margin-top:4pt"><p style="font-size:9pt;font-weight:700;color:#3D405B">$1,615 · $323/ea</p></div>
          </div>
        </div>
        ${bargaPhoto ? `<div style="flex:0.8;display:flex;align-items:center">${bargaPhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S07: DAY 3 · SUN MAY 3 =====
  W('s07.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 3</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">SUN MAY 3</p></div>
      </div>
      <h4 style="margin-top:4pt">Free Day — Explore Barga</h4>
      <div style="display:flex;flex-direction:column;gap:10pt;margin-top:20pt">
        <div class="card" style="border-left:4pt solid #87A96B;padding:18pt">
          <h3 style="color:#87A96B">Medieval Hilltop Village</h3>
          <p style="margin-top:6pt;font-size:11pt">Wander the cobblestone streets of one of Tuscany's most charming hill towns</p>
          <ul style="margin-top:10pt">
            <li style="margin-top:4pt"><b>Duomo di Barga</b> — Romanesque cathedral with panoramic views</li>
            <li style="margin-top:4pt"><b>Via del Pretorio</b> — Main street, local shops &amp; cafés</li>
            <li style="margin-top:4pt"><b>Garfagnana Valley views</b> — Stunning mountain scenery</li>
          </ul>
        </div>
      </div>
    </div>
  `));

  // ===== S08: DAY 4 · MON MAY 4 =====
  W('s08.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 4</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">MON MAY 4</p></div>
      </div>
      <h4 style="margin-top:4pt">Free Day — Garfagnana Valley</h4>
      <div style="display:flex;flex-direction:column;gap:10pt;margin-top:20pt">
        <div class="card" style="border-left:4pt solid #87A96B;padding:18pt">
          <h3 style="color:#87A96B">Explore the Valley</h3>
          <p style="margin-top:6pt;font-size:11pt">Discover the lush Garfagnana region surrounding Barga</p>
          <ul style="margin-top:10pt">
            <li style="margin-top:4pt"><b>Serchio River</b> — Scenic riverside walks &amp; picnic spots</li>
            <li style="margin-top:4pt"><b>Nearby villages</b> — Castelnuovo, Coreglia, Ghivizzano</li>
            <li style="margin-top:4pt"><b>Local cuisine</b> — Farro soup, chestnut flour specialties</li>
          </ul>
        </div>
      </div>
    </div>
  `));

  // ===== S09: DAY 5 · TUE MAY 5 =====
  const cookingPhoto = PI('italian-cooking.jpg', '230pt', '170pt');
  W('s09.html', SL('bg-cream.png', `
    <div style="padding:28pt 40pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 5</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">TUE MAY 5</p></div>
      </div>
      <h4 style="margin-top:3pt">Cook &amp; Sip</h4>
      <div style="display:flex;gap:12pt;margin-top:12pt">
        <div style="flex:1.2;display:flex;flex-direction:column;gap:8pt">
          <div class="card" style="border-left:4pt solid #87A96B">
            <div style="display:flex;align-items:baseline;gap:8pt">
              <h5>10:00</h5>
              <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">3 hours</p></div>
            </div>
            <h3 style="margin-top:6pt">Lucca Cook with Momma</h3>
            <p style="margin-top:4pt">Hands-on Italian cooking class in Lucca</p>
            <div style="display:flex;align-items:center;gap:8pt;margin-top:8pt;flex-wrap:wrap">
              <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$1,862.50 · $186/ea</p></div>
              <p style="font-size:9pt;color:#6B7280">Paid: Jim (AmEx)</p>
            </div>
          </div>
          <div class="card" style="border-left:4pt solid #87A96B">
            <h5>Afternoon</h5>
            <h3 style="margin-top:6pt">Winery with Kings</h3>
            <p style="margin-top:4pt;color:#E07A5F;font-style:italic">Details TBD</p>
          </div>
        </div>
        ${cookingPhoto ? `<div style="flex:0.8;display:flex;align-items:center">${cookingPhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S10: DAY 6 · WED MAY 6 =====
  const florencePhoto = PI('florence-duomo.jpg', '220pt', '170pt');
  W('s10.html', SL('bg-cream.png', `
    <div style="padding:26pt 38pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 6</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">WED MAY 6</p></div>
      </div>
      <h4 style="margin-top:3pt">Florence Day Trip</h4>
      <div style="display:flex;gap:10pt;margin-top:10pt">
        <div style="flex:1.2;display:flex;flex-direction:column;gap:7pt">
          <div style="display:flex;gap:8pt">
            <div class="card" style="flex:1;padding:8pt 10pt;border-left:3pt solid #87A96B">
              <p style="font-size:9pt"><b>Barga → Lucca</b> · 44 min drive</p>
            </div>
            <div class="card" style="flex:1.2;padding:8pt 10pt;border-left:3pt solid #87A96B">
              <p style="font-size:9pt"><b>09:30 Train</b> Lucca → Florence</p>
              <p style="font-size:8pt;color:#6B7280">Regionale 18509 · $54/$17ea · Logan</p>
            </div>
          </div>
          <div class="card" style="border-left:4pt solid #87A96B">
            <div style="display:flex;align-items:baseline;gap:8pt">
              <h5>14:15</h5>
              <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">3 – 3.5 hrs</p></div>
            </div>
            <h3 style="margin-top:6pt">Best of Florence Tour</h3>
            <p style="margin-top:3pt;font-size:10pt">David, Galleria dell'Accademia &amp; Duomo</p>
            <div style="display:flex;align-items:center;gap:8pt;margin-top:6pt;flex-wrap:wrap">
              <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$546.70 · $109/ea</p></div>
              <p style="font-size:9pt;color:#6B7280">Paid: Jim (AmEx)</p>
            </div>
          </div>
        </div>
        ${florencePhoto ? `<div style="flex:0.8;display:flex;align-items:center">${florencePhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S11: DAY 7 · THU MAY 7 =====
  W('s11.html', SL('bg-cream.png', `
    <div style="padding:26pt 38pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 7</h2>
        <div class="badge" style="background:#87A96B"><p style="color:#FFF;font-size:9pt;font-weight:700">THU MAY 7</p></div>
      </div>
      <h4 style="margin-top:3pt">Tuscany → Rome</h4>
      <div style="display:flex;flex-direction:column;gap:7pt;margin-top:10pt">
        <div class="card" style="padding:8pt 12pt;border-left:3pt solid #87A96B">
          <p style="font-size:10pt"><b>10:00</b> Drop off rental car at Pisa Airport</p>
        </div>
        <div class="card" style="border-left:4pt solid #D4A843">
          <div style="display:flex;align-items:center;gap:10pt">
            <div style="background:#D4A843;border-radius:6pt;padding:2pt 8pt"><p style="color:#FFF;font-weight:700;font-size:9pt">TRAIN</p></div>
            <h3 style="font-family:Arial,sans-serif;font-size:15pt">Pisa → Rome</h3>
            <p style="font-size:10pt">11:11 – 14:33 (3h22m)</p>
          </div>
          <p style="font-size:9pt;margin-top:4pt">Intercity 505 · Seats: 7A, 7C, 7D, 8C, 8D</p>
          <div style="display:flex;align-items:center;gap:8pt;margin-top:4pt">
            <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$233 · $47/ea</p></div>
            <p style="font-size:9pt;color:#6B7280">Booked: Logan</p>
          </div>
        </div>
        <div class="card" style="padding:8pt 12pt;border-left:3pt solid #D4A843">
          <p style="font-size:10pt">Check in <b>citizenM Rome Isola Tiberina</b> · Conf <span class="conf">#99566483</span></p>
        </div>
        <div class="card" style="border-left:4pt solid #D4A843">
          <div style="display:flex;align-items:baseline;gap:8pt">
            <h5>19:00</h5>
            <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">2.5 hours</p></div>
          </div>
          <h3 style="margin-top:4pt">Golf Cart Tour of Rome</h3>
          <p style="margin-top:3pt;font-size:10pt">Evening tour through Rome's iconic sights</p>
          <div style="display:flex;align-items:center;gap:8pt;margin-top:6pt;flex-wrap:wrap">
            <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$532 · $107/ea</p></div>
            <p style="font-size:9pt;color:#6B7280">Paid: Geoff</p>
          </div>
        </div>
      </div>
    </div>
  `));

  // ===== S12: WEEK 2 DIVIDER =====
  W('s12.html', SL('bg-week2.png', `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:50pt">
      <h6 style="font-size:13pt;color:#D4A843;font-weight:700;text-transform:uppercase;letter-spacing:2pt">WEEK TWO</h6>
      <h1 style="font-size:46pt;margin-top:6pt">Rome &amp; Naples Coast</h1>
      <h4 style="margin-top:8pt;font-size:14pt">May 8 – 15 · Vatican, Colosseum, Pompeii, Capri &amp; Amalfi</h4>
    </div>
  `));

  // ===== S13: DAY 8 · FRI MAY 8 =====
  const vaticanPhoto = PI('vatican.jpg', '230pt', '190pt');
  W('s13.html', SL('bg-cream.png', `
    <div style="padding:30pt 42pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 8</h2>
        <div class="badge" style="background:#D4A843"><p style="color:#FFF;font-size:9pt;font-weight:700">FRI MAY 8</p></div>
      </div>
      <h4 style="margin-top:4pt">Vatican City</h4>
      <div style="display:flex;gap:12pt;margin-top:14pt">
        <div style="flex:1.2">
          <div class="card" style="border-left:4pt solid #D4A843">
            <div style="display:flex;align-items:baseline;gap:8pt">
              <h5>10:30</h5>
              <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">2.5 hours</p></div>
            </div>
            <h3 style="margin-top:6pt">Vatican &amp; Basilica Tour</h3>
            <p style="margin-top:4pt">Vatican Museums, Sistine Chapel &amp; St. Peter's Basilica</p>
            <div style="display:flex;align-items:center;gap:8pt;margin-top:8pt;flex-wrap:wrap">
              <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$780 · $156/ea</p></div>
              <p style="font-size:9pt;color:#6B7280">Paid: Jim (AmEx)</p>
            </div>
          </div>
          <div class="card" style="margin-top:8pt;padding:14pt;border-left:4pt solid #D4A843">
            <p style="font-size:11pt;color:#6B7280;font-style:italic">Free afternoon — explore Rome at your own pace</p>
          </div>
        </div>
        ${vaticanPhoto ? `<div style="flex:0.8;display:flex;align-items:center">${vaticanPhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S14: DAY 9 · SAT MAY 9 =====
  W('s14.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 9</h2>
        <div class="badge" style="background:#D4A843"><p style="color:#FFF;font-size:9pt;font-weight:700">SAT MAY 9</p></div>
      </div>
      <h4 style="margin-top:4pt">The Colosseum</h4>
      <div style="display:flex;flex-direction:column;gap:10pt;margin-top:18pt">
        <div class="card" style="border-left:4pt solid #D4A843;padding:16pt">
          <div style="display:flex;align-items:baseline;gap:8pt">
            <h5>10:30</h5>
            <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">3 hours</p></div>
          </div>
          <h3 style="margin-top:6pt;font-size:18pt">Colosseum, Roman Forum &amp; Palatine Hill</h3>
          <p style="margin-top:4pt;font-size:11pt">Guided tour through ancient Rome's most iconic landmarks</p>
          <div style="display:flex;align-items:center;gap:8pt;margin-top:10pt;flex-wrap:wrap">
            <div class="pill"><p style="font-size:10pt;font-weight:700;color:#3D405B">$1,203 · $240/ea</p></div>
            <p style="font-size:9pt;color:#6B7280">Paid: Geoff</p>
          </div>
        </div>
        <div class="card" style="padding:14pt;border-left:4pt solid #D4A843">
          <p style="font-size:11pt;color:#6B7280;font-style:italic">Free afternoon &amp; evening</p>
        </div>
      </div>
    </div>
  `));

  // ===== S15: DAY 10 · SUN MAY 10 =====
  W('s15.html', SL('bg-cream.png', `
    <div style="padding:26pt 38pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 10</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">SUN MAY 10</p></div>
      </div>
      <h4 style="margin-top:3pt">Rome → Naples</h4>
      <div style="display:flex;flex-direction:column;gap:7pt;margin-top:10pt">
        <div class="card" style="padding:8pt 12pt;border-left:3pt solid #D4A843">
          <p style="font-size:10pt">Taxi/Uber to Roma Termini ~10-15 min</p>
        </div>
        <div class="card" style="border-left:4pt solid #4A90A4">
          <div style="display:flex;align-items:center;gap:10pt">
            <div style="background:#4A90A4;border-radius:6pt;padding:2pt 8pt"><p style="color:#FFF;font-weight:700;font-size:9pt">TRAIN</p></div>
            <h3 style="font-family:Arial,sans-serif;font-size:15pt">Rome → Naples</h3>
            <p style="font-size:10pt">13:40 – 14:53 (1h13m)</p>
          </div>
          <p style="font-size:9pt;margin-top:4pt">Italo 9977 · Carriage #2 · Seats: 8, 9, 10, 11, 12</p>
          <div style="display:flex;align-items:center;gap:8pt;margin-top:4pt">
            <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$200 · $40/ea</p></div>
            <p style="font-size:9pt;color:#6B7280">Booked: Logan</p>
          </div>
        </div>
        <div class="card" style="padding:8pt 12pt;border-left:3pt solid #4A90A4">
          <p style="font-size:10pt">Uber from Naples Centrale to AirBnB ~15 min</p>
        </div>
        <div class="card" style="border-left:4pt solid #4A90A4">
          <h3 style="color:#4A90A4;font-size:13pt">Check in: AirBnB Naples</h3>
          <p style="font-size:9pt;margin-top:3pt">Largo Ecce Homo 31, Naples 80134</p>
          <p style="font-size:9pt">Check-in 15:00 · 5 nights</p>
          <div class="pill" style="margin-top:4pt"><p style="font-size:9pt;font-weight:700;color:#3D405B">$1,622 · $325/ea</p></div>
          <p style="font-size:8pt;color:#6B7280;margin-top:2pt">Booked: Logan</p>
        </div>
      </div>
    </div>
  `));

  // ===== S16: DAY 11 · MON MAY 11 =====
  W('s16.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 11</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">MON MAY 11</p></div>
      </div>
      <h4 style="margin-top:4pt">Pompeii &amp; Herculaneum</h4>
      <div style="margin-top:18pt">
        <div class="card" style="border-left:4pt solid #4A90A4;padding:16pt">
          <div style="display:flex;align-items:baseline;gap:8pt">
            <h5>09:20</h5>
            <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">7 hours · Full Day</p></div>
          </div>
          <h3 style="margin-top:6pt;font-size:18pt">Pompeii &amp; Herculaneum by Bus</h3>
          <p style="margin-top:6pt;font-size:11pt">Full-day guided excursion to the ancient ruins preserved by Vesuvius</p>
          <p style="margin-top:4pt;font-size:10pt;color:#6B7280">Bus departs near Naples train station</p>
          <div style="display:flex;align-items:center;gap:8pt;margin-top:10pt;flex-wrap:wrap">
            <div class="pill"><p style="font-size:10pt;font-weight:700;color:#3D405B">$920 · $184/ea</p></div>
            <p style="font-size:9pt;color:#6B7280">Paid: Geoff</p>
          </div>
        </div>
      </div>
    </div>
  `));

  // ===== S17: DAY 12 · TUE MAY 12 =====
  const capriPhoto = PI('capri-coast.jpg', '230pt', '190pt');
  W('s17.html', SL('bg-cream.png', `
    <div style="padding:30pt 42pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 12</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">TUE MAY 12</p></div>
      </div>
      <h4 style="margin-top:4pt">Capri &amp; Blue Grotto</h4>
      <div style="display:flex;gap:12pt;margin-top:14pt">
        <div style="flex:1.2">
          <div class="card" style="border-left:4pt solid #4A90A4">
            <div style="display:flex;align-items:baseline;gap:8pt">
              <h5>08:00</h5>
              <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">9 hours · Full Day</p></div>
            </div>
            <h3 style="margin-top:6pt">Capri &amp; Blue Grotto</h3>
            <p style="margin-top:4pt">Full-day boat excursion to the island of Capri</p>
            <p style="font-size:9pt;margin-top:2pt;color:#6B7280">Walk to port/dock from apartment</p>
            <div style="display:flex;align-items:center;gap:8pt;margin-top:8pt;flex-wrap:wrap">
              <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$967.85 · $194/ea</p></div>
              <p style="font-size:9pt;color:#6B7280">Paid: Jim (AmEx)</p>
            </div>
          </div>
        </div>
        ${capriPhoto ? `<div style="flex:0.8;display:flex;align-items:center">${capriPhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S18: DAY 13 · WED MAY 13 =====
  const amalfiPhoto = PI('amalfi-coast.jpg', '230pt', '190pt');
  W('s18.html', SL('bg-cream.png', `
    <div style="padding:30pt 42pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 13</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">WED MAY 13</p></div>
      </div>
      <h4 style="margin-top:4pt">Amalfi Coast &amp; Sorrento</h4>
      <div style="display:flex;gap:12pt;margin-top:14pt">
        <div style="flex:1.2">
          <div class="card" style="border-left:4pt solid #4A90A4">
            <div style="display:flex;align-items:baseline;gap:8pt">
              <h5>08:30</h5>
              <div class="dur"><p style="color:#E07A5F;font-size:9pt;font-weight:700">8 hours · Full Day</p></div>
            </div>
            <h3 style="margin-top:6pt">Amalfi Coast &amp; Sorrento</h3>
            <p style="margin-top:4pt">Full-day bus tour along the stunning Amalfi Coast</p>
            <p style="font-size:9pt;margin-top:2pt;color:#6B7280">Bus departs near Naples train station</p>
            <div style="display:flex;align-items:center;gap:8pt;margin-top:8pt;flex-wrap:wrap">
              <div class="pill"><p style="font-size:9pt;font-weight:700;color:#3D405B">$544.45 · $109/ea</p></div>
              <p style="font-size:9pt;color:#6B7280">Paid: Geoff</p>
            </div>
          </div>
        </div>
        ${amalfiPhoto ? `<div style="flex:0.8;display:flex;align-items:center">${amalfiPhoto}</div>` : ''}
      </div>
    </div>
  `));

  // ===== S19: DAY 14 · THU MAY 14 =====
  W('s19.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 14</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">THU MAY 14</p></div>
      </div>
      <h4 style="margin-top:4pt">Free Day — Explore Naples</h4>
      <div style="display:flex;flex-direction:column;gap:10pt;margin-top:20pt">
        <div class="card" style="border-left:4pt solid #4A90A4;padding:18pt">
          <h3 style="color:#4A90A4">Last Full Day in Italy</h3>
          <p style="margin-top:6pt;font-size:11pt">Soak in the energy of Naples before heading home</p>
          <ul style="margin-top:10pt">
            <li style="margin-top:4pt"><b>Spaccanapoli</b> — The vibrant heart of old Naples</li>
            <li style="margin-top:4pt"><b>Pizza pilgrimage</b> — Da Michele, Sorbillo, or Starita</li>
            <li style="margin-top:4pt"><b>Naples Underground</b> — Ancient tunnels beneath the city</li>
            <li style="margin-top:4pt"><b>Waterfront</b> — Lungomare &amp; Castel dell'Ovo</li>
          </ul>
        </div>
      </div>
    </div>
  `));

  // ===== S20: DAY 15 · FRI MAY 15 =====
  W('s20.html', SL('bg-cream.png', `
    <div style="padding:30pt 44pt">
      <div style="display:flex;align-items:baseline;gap:10pt">
        <h2>Day 15</h2>
        <div class="badge" style="background:#4A90A4"><p style="color:#FFF;font-size:9pt;font-weight:700">FRI MAY 15</p></div>
      </div>
      <h4 style="margin-top:4pt">Homeward Bound</h4>
      <div style="display:flex;flex-direction:column;gap:8pt;margin-top:14pt">
        <div class="card" style="padding:8pt 12pt;border-left:3pt solid #4A90A4">
          <p style="font-size:10pt"><b>10:00</b> Check out of AirBnB · 20 min car ride to Naples Airport</p>
        </div>
        <div class="card" style="display:flex;align-items:center;gap:12pt;border-left:4pt solid #E07A5F">
          <div style="background:#E07A5F;border-radius:6pt;padding:3pt 10pt"><p style="color:#FFF;font-weight:700;font-size:10pt">BA 1578</p></div>
          <div>
            <h3 style="font-family:Arial,sans-serif;font-size:15pt">Naples → Chicago</h3>
            <p style="margin-top:2pt;font-size:10pt">Depart 15:00 → Arrive 18:55</p>
          </div>
        </div>
        <div class="card" style="display:flex;align-items:center;gap:12pt;border-left:4pt solid #E07A5F">
          <div style="background:#E07A5F;border-radius:6pt;padding:3pt 10pt"><p style="color:#FFF;font-weight:700;font-size:10pt">BA 5160</p></div>
          <div>
            <h3 style="font-family:Arial,sans-serif;font-size:15pt">Chicago → CVG</h3>
            <p style="margin-top:2pt;font-size:10pt">Depart 20:56 → Arrive 23:56</p>
          </div>
        </div>
        <div class="card" style="padding:16pt;display:flex;align-items:center;justify-content:center;margin-top:4pt">
          <p style="color:#6B7280;font-size:12pt;font-style:italic">Home sweet home — what a trip!</p>
        </div>
      </div>
    </div>
  `));

  // ===== S21: TRIP BUDGET =====
  W('s21.html', SL('bg-cream.png', `
    <div style="padding:32pt 44pt;display:flex;flex-direction:column;align-items:center">
      <h2 style="font-size:28pt;text-align:center">Trip Budget</h2>
      <p style="text-align:center;margin-top:4pt;color:#6B7280">Excluding flights · 5 travelers</p>
      <div style="display:flex;gap:16pt;margin-top:28pt">
        <div class="card" style="text-align:center;min-width:130pt;padding:18pt 22pt">
          <h2 style="color:#E07A5F;font-size:32pt">$11,215</h2>
          <p style="font-size:10pt;margin-top:4pt;color:#6B7280">Total Trip Cost</p>
        </div>
        <div class="card" style="text-align:center;min-width:130pt;padding:18pt 22pt">
          <h2 style="color:#E07A5F;font-size:32pt">$2,243</h2>
          <p style="font-size:10pt;margin-top:4pt;color:#6B7280">Per Person (avg)</p>
        </div>
        <div class="card" style="text-align:center;min-width:90pt;padding:18pt 22pt">
          <h2 style="color:#87A96B;font-size:32pt">14</h2>
          <p style="font-size:10pt;margin-top:4pt;color:#6B7280">Nights</p>
        </div>
        <div class="card" style="text-align:center;min-width:90pt;padding:18pt 22pt">
          <h2 style="color:#4A90A4;font-size:32pt">3</h2>
          <p style="font-size:10pt;margin-top:4pt;color:#6B7280">Regions</p>
        </div>
      </div>
    </div>
  `));

  // ===== S22: WHO PAID WHAT =====
  W('s22.html', SL('bg-cream.png', `
    <div style="padding:24pt 34pt">
      <h2 style="font-size:22pt">Who Paid What</h2>
      <div style="display:flex;gap:10pt;margin-top:10pt">
        <div class="card" style="flex:1;display:flex;flex-direction:column;border-top:4pt solid #87A96B">
          <h3 style="color:#87A96B;font-size:14pt;margin-bottom:6pt">Logan</h3>
          <div style="display:flex;justify-content:space-between;margin-top:3pt"><p style="font-size:8pt">Train Lucca → Florence</p><p style="font-size:8pt;font-weight:700">$54</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Train Pisa → Rome</p><p style="font-size:8pt;font-weight:700">$233</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Train Rome → Naples</p><p style="font-size:8pt;font-weight:700">$200</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">AirBnB Naples</p><p style="font-size:8pt;font-weight:700">$1,622</p></div>
          <div style="flex:1"></div>
          <div style="border-top:2pt solid #F2CC8F;padding-top:6pt;margin-top:6pt;text-align:right">
            <h3 style="color:#E07A5F;font-size:16pt">$2,109</h3>
          </div>
        </div>
        <div class="card" style="flex:1;display:flex;flex-direction:column;border-top:4pt solid #D4A843">
          <h3 style="color:#D4A843;font-size:14pt;margin-bottom:6pt">Jim</h3>
          <div style="display:flex;justify-content:space-between;margin-top:3pt"><p style="font-size:8pt">Cooking class</p><p style="font-size:8pt;font-weight:700">$1,862.50</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Florence tour</p><p style="font-size:8pt;font-weight:700">$546.70</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Vatican tour</p><p style="font-size:8pt;font-weight:700">$780</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Capri / Blue Grotto</p><p style="font-size:8pt;font-weight:700">$967.85</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">citizenM Rome</p><p style="font-size:8pt;font-weight:700">pts + $400</p></div>
          <div style="flex:1"></div>
          <div style="border-top:2pt solid #F2CC8F;padding-top:6pt;margin-top:6pt;text-align:right">
            <h3 style="color:#E07A5F;font-size:16pt">$4,557</h3>
          </div>
        </div>
        <div class="card" style="flex:1;display:flex;flex-direction:column;border-top:4pt solid #4A90A4">
          <h3 style="color:#4A90A4;font-size:14pt;margin-bottom:6pt">Geoff</h3>
          <div style="display:flex;justify-content:space-between;margin-top:3pt"><p style="font-size:8pt">AirBnB Barga</p><p style="font-size:8pt;font-weight:700">$1,615</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Golf cart tour</p><p style="font-size:8pt;font-weight:700">$532</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Colosseum tour</p><p style="font-size:8pt;font-weight:700">$1,203</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Pompeii</p><p style="font-size:8pt;font-weight:700">$920</p></div>
          <div style="display:flex;justify-content:space-between;margin-top:2pt"><p style="font-size:8pt">Amalfi Coast</p><p style="font-size:8pt;font-weight:700">$544.45</p></div>
          <div style="flex:1"></div>
          <div style="border-top:2pt solid #F2CC8F;padding-top:6pt;margin-top:6pt;text-align:right">
            <h3 style="color:#E07A5F;font-size:16pt">$4,814</h3>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10pt;margin-top:8pt">
        <div id="chart" class="placeholder" style="flex:2;height:100pt;background:rgba(0,0,0,0.03);border-radius:8pt"></div>
        <div class="card" style="flex:1;display:flex;align-items:center;justify-content:center">
          <div style="text-align:center">
            <p style="font-size:8pt;color:#6B7280">Rental car ($514) payer TBD</p>
            <p style="font-size:8pt;color:#6B7280;margin-top:2pt">Flights not included</p>
          </div>
        </div>
      </div>
    </div>
  `));

  // ===== S23: ANDIAMO! =====
  W('s23.html', SL('bg-close.png', `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
      <div style="display:flex;width:80pt;height:5pt;margin-bottom:14pt">
        <div style="flex:1;background:#009246"></div>
        <div style="flex:1;background:#FFFFFF"></div>
        <div style="flex:1;background:#CE2B37"></div>
      </div>
      <h1 style="font-size:56pt;font-style:italic">Andiamo!</h1>
      <h4 style="margin-top:10pt;font-style:italic;font-size:15pt">Buon viaggio — May 1 – 15, 2026</h4>
    </div>
  `));
}

// --- BUILD PPTX ---
async function build() {
  console.log('Creating backgrounds...');
  await createBackgrounds();

  console.log('Writing HTML slides...');
  writeSlides();

  console.log('Converting to PPTX...');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Claude Code';
  pptx.title = 'Italia 2026';

  for (let i = 1; i <= 23; i++) {
    const file = `s${String(i).padStart(2, '0')}.html`;
    console.log(`  ${file}...`);
    try {
      const result = await html2pptx(path.join(SLIDES_DIR, file), pptx);

      // Add bar chart to Who Paid What slide (s22)
      if (file === 's22.html' && result.placeholders.length > 0) {
        result.slide.addChart(pptx.charts.BAR, [{
          name: 'Amount',
          labels: ['Tours & Excursions', 'Accommodation', 'Transport', 'Hotel (pts)'],
          values: [6357, 3237, 1001, 400]
        }], {
          ...result.placeholders[0],
          barDir: 'bar',
          showTitle: false,
          showLegend: false,
          showValue: true,
          dataLabelPosition: 'outEnd',
          dataLabelColor: '3D405B',
          dataLabelFontSize: 8,
          catAxisFontColor: '3D405B',
          catAxisFontSize: 8,
          valAxisHidden: true,
          catGridLine: { style: 'none' },
          valGridLine: { style: 'none' },
          chartColors: ['E07A5F', '87A96B', '4A90A4', 'F2CC8F'],
        });
      }
    } catch (err) {
      console.error(`  ERROR on ${file}: ${err.message}`);
    }
  }

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\nDone! → ${OUTPUT}`);
}

build().catch(err => { console.error(err); process.exit(1); });

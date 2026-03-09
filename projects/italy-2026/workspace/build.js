const pptxgen = require('pptxgenjs');
const html2pptx = require('/Users/logan/.claude/skills/powerpoint-creator/scripts/html2pptx.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'slides');
const OUTPUT = path.join(__dirname, '..', 'output', 'italy-2026-v2.pptx');

// --- COLORS (no # prefix for pptxgenjs) ---
const C = {
  navy: '0C1A2E',
  navyLight: '142744',
  azure: '2196F3',
  terracotta: 'E8734A',
  gold: 'F0C75E',
  teal: '4DD0C8',
  wine: 'C2185B',
  white: 'FFFFFF',
  textSec: 'A8BDD4',
  cardBg: '1A3050',
  border: '2A4060',
};

// --- GRADIENT BACKGROUNDS ---
async function createGradients() {
  const gradients = [
    { name: 'bg-navy.png', c1: '#0C1A2E', c2: '#1A3556' },
    { name: 'bg-tuscany.png', c1: '#0C2E1E', c2: '#142744' },
    { name: 'bg-rome.png', c1: '#2E1A0C', c2: '#142744' },
    { name: 'bg-naples.png', c1: '#0C1A2E', c2: '#0C2E3E' },
    { name: 'bg-budget.png', c1: '#0C1A2E', c2: '#1A2744' },
    { name: 'bg-title.png', c1: '#060E1A', c2: '#142744' },
  ];
  for (const g of gradients) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${g.c1}"/>
        <stop offset="100%" style="stop-color:${g.c2}"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(SLIDES_DIR, g.name));
  }
}

// --- HTML SLIDE TEMPLATE ---
function slide(bgImage, content) {
  return `<!DOCTYPE html><html><head><style>
html { background: #0C1A2E; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; font-family: Georgia, serif; display: flex; flex-direction: column;
  ${bgImage ? `background-image: url('${bgImage}'); background-size: cover;` : 'background: #0C1A2E;'} }
h1 { color: #FFFFFF; font-size: 38pt; margin: 0; font-weight: 700; }
h2 { color: #FFFFFF; font-size: 28pt; margin: 0; font-weight: 700; }
h3 { color: #FFFFFF; font-size: 18pt; margin: 0; font-weight: 700; }
h4 { color: #A8BDD4; font-size: 14pt; margin: 0; font-weight: 400; }
h5 { color: #F0C75E; font-size: 20pt; margin: 0; font-weight: 700; }
h6 { color: #A8BDD4; font-size: 11pt; margin: 0; font-weight: 400; }
p { color: #A8BDD4; font-size: 12pt; margin: 0; font-family: Arial, sans-serif; }
ul { margin: 0; padding: 0; }
li { color: #A8BDD4; font-size: 11pt; font-family: Arial, sans-serif; margin-left: 14pt; }
.card { background: #1A3050; border: 1px solid #2A4060; border-radius: 8pt; padding: 14pt; }
.pill { display: inline-block; background: #2A3A20; border: 1px solid #3A5A30; border-radius: 20pt; padding: 2pt 10pt; color: #F0C75E; font-size: 10pt; font-family: Arial, sans-serif; font-weight: 700; }
.badge { display: inline-block; background: #2196F3; border-radius: 4pt; padding: 2pt 8pt; color: #FFFFFF; font-size: 9pt; font-family: Arial, sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5pt; }
.conf { background: #0C2A4A; border: 1px solid #2A5080; border-radius: 4pt; padding: 1pt 6pt; color: #2196F3; font-size: 10pt; font-family: Arial, sans-serif; font-weight: 700; display: inline-block; }
</style></head><body>${content}</body></html>`;
}

// --- WRITE ALL SLIDES ---
function writeSlides() {

  // SLIDE 1: Title
  fs.writeFileSync(path.join(SLIDES_DIR, 's01.html'), slide('bg-title.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 40pt 50pt 50pt 50pt;">
      <div style="display:flex; width:60pt; height:5pt; margin-bottom:12pt;">
        <div style="flex:1; background:#009246;"></div>
        <div style="flex:1; background:#FFFFFF;"></div>
        <div style="flex:1; background:#CE2B37;"></div>
      </div>
      <h1 style="font-size:52pt; font-style:italic; letter-spacing:-1pt;">Italia 2026</h1>
      <h4 style="margin-top:8pt;">May 1 – 15 &nbsp;·&nbsp; Logan, Jim, Paula, Geoff &amp; Toni</h4>
      <div style="display:flex; gap:8pt; margin-top:16pt;">
        <div style="background:#0A2A2A; border:1px solid #2A6A6A; border-radius:20pt; padding:3pt 12pt;"><p style="color:#4DD0C8; font-size:10pt; font-weight:700;">Tuscany</p></div>
        <div style="background:#2A1A0A; border:1px solid #6A3A1A; border-radius:20pt; padding:3pt 12pt;"><p style="color:#E8734A; font-size:10pt; font-weight:700;">Rome</p></div>
        <div style="background:#0A1A2A; border:1px solid #1A4A7A; border-radius:20pt; padding:3pt 12pt;"><p style="color:#2196F3; font-size:10pt; font-weight:700;">Naples</p></div>
      </div>
    </div>
  `));

  // SLIDE 2: The Route
  fs.writeFileSync(path.join(SLIDES_DIR, 's02.html'), slide('bg-navy.png', `
    <div style="padding: 36pt 50pt;">
      <h2>The Route</h2>
      <div style="display:flex; gap:20pt; margin-top:24pt;">
        <div style="flex:1;">
          <div class="card" style="margin-bottom:12pt; border-left: 4pt solid #4DD0C8;">
            <h3 style="color:#4DD0C8;">Tuscany</h3>
            <p style="margin-top:4pt;">May 2 – 7 &nbsp;·&nbsp; 5 nights in Barga</p>
            <p style="font-size:10pt; margin-top:2pt;">Lucca · Florence · Pisa</p>
          </div>
          <div class="card" style="margin-bottom:12pt; border-left: 4pt solid #E8734A;">
            <h3 style="color:#E8734A;">Rome</h3>
            <p style="margin-top:4pt;">May 7 – 10 &nbsp;·&nbsp; 3 nights</p>
            <p style="font-size:10pt; margin-top:2pt;">Vatican · Colosseum · City tours</p>
          </div>
          <div class="card" style="border-left: 4pt solid #2196F3;">
            <h3 style="color:#2196F3;">Naples &amp; Coast</h3>
            <p style="margin-top:4pt;">May 10 – 15 &nbsp;·&nbsp; 5 nights</p>
            <p style="font-size:10pt; margin-top:2pt;">Pompeii · Capri · Amalfi Coast</p>
          </div>
        </div>
        <div style="flex:1; display:flex; align-items:center; justify-content:center;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:6pt;">
            <div style="background:#4DD0C8; border-radius:50%; width:40pt; height:40pt; display:flex; align-items:center; justify-content:center;">
              <p style="color:#0C1A2E; font-weight:700; font-size:9pt;">TUSCANY</p>
            </div>
            <div style="width:2pt; height:30pt; background:#2A4060;"></div>
            <div style="background:#E8734A; border-radius:50%; width:40pt; height:40pt; display:flex; align-items:center; justify-content:center;">
              <p style="color:#0C1A2E; font-weight:700; font-size:9pt;">ROME</p>
            </div>
            <div style="width:2pt; height:30pt; background:#2A4060;"></div>
            <div style="background:#2196F3; border-radius:50%; width:40pt; height:40pt; display:flex; align-items:center; justify-content:center;">
              <p style="color:#0C1A2E; font-weight:700; font-size:9pt;">NAPLES</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `));

  // SLIDE 3: Getting There (Flights)
  fs.writeFileSync(path.join(SLIDES_DIR, 's03.html'), slide('bg-navy.png', `
    <div style="padding: 36pt 50pt;">
      <h2>Getting There</h2>
      <div style="display:flex; flex-direction:column; gap:14pt; margin-top:24pt;">
        <div class="card" style="display:flex; align-items:center; gap:16pt;">
          <div style="background:#E8734A; border-radius:6pt; padding:4pt 12pt;"><p style="color:#FFF; font-weight:700; font-size:11pt;">BA 120</p></div>
          <h3 style="font-family:Arial; font-size:22pt;">CVG <span style="color:#2196F3;">✈</span> LHR</h3>
          <p><b style="color:#FFF;">Fri May 1</b> depart 21:10 → <b style="color:#FFF;">Sat May 2</b> arrive 10:05 <span style="color:#E8734A; font-size:9pt;">&nbsp;overnight</span></p>
        </div>
        <div class="card" style="display:flex; align-items:center; gap:16pt;">
          <div style="background:#E8734A; border-radius:6pt; padding:4pt 12pt;"><p style="color:#FFF; font-weight:700; font-size:11pt;">BA 612</p></div>
          <h3 style="font-family:Arial; font-size:22pt;">LHR <span style="color:#2196F3;">✈</span> PSA</h3>
          <p><b style="color:#FFF;">Sat May 2</b> depart 12:30 → arrive <b style="color:#FFF;">15:50</b> (Pisa)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 4: Tuscany Section Divider
  fs.writeFileSync(path.join(SLIDES_DIR, 's04.html'), slide('bg-tuscany.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <h6 style="font-size:72pt; color:rgba(77,208,200,0.12); font-family:Georgia; font-weight:900; position:absolute; top:20pt; left:50pt;">01</h6>
      <h1 style="font-size:56pt; color:#4DD0C8;">Tuscany</h1>
      <h4 style="margin-top:8pt;">May 2 – 7 &nbsp;·&nbsp; Barga, Lucca &amp; Florence</h4>
    </div>
  `));

  // SLIDE 5: Home Base Barga (Accommodation + Car)
  fs.writeFileSync(path.join(SLIDES_DIR, 's05.html'), slide('bg-navy.png', `
    <div style="padding: 32pt 44pt;">
      <h2 style="font-size:24pt;">Home Base: Barga</h2>
      <div style="display:flex; gap:14pt; margin-top:16pt;">
        <div class="card" style="flex:1;">
          <h3 style="color:#4DD0C8; font-size:15pt;">🏠 Casa Zia Franca</h3>
          <p style="margin-top:6pt; font-size:10pt; line-height:1.6;">Via del Giardino 44, 55051 Barga LU, Italy</p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">Check-in:</b> Sat May 2, 15:00</p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">Check-out:</b> Thu May 7, 11:00</p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">5 nights</b></p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:8pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$1,615 total · $323/person</p></div>
          </div>
          <p style="font-size:9pt; margin-top:4pt;">Paid: <b style="color:#4DD0C8;">Geoff</b> (Citi 9191, 2/10/26)</p>
        </div>
        <div class="card" style="flex:1;">
          <h3 style="color:#2196F3; font-size:15pt;">🚗 Rental Car — Alamo</h3>
          <p style="margin-top:6pt; font-size:10pt; line-height:1.6;">Pisa International Airport</p>
          <p style="font-size:10pt; line-height:1.6;">Conf <span class="conf">#758381187</span></p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">Pickup:</b> Sat May 2, 17:00</p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">Dropoff:</b> Thu May 7, 10:00</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:8pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$514 total · $103/person</p></div>
          </div>
          <p style="font-size:9pt; margin-top:4pt;">$384 rental + $55 add'l driver + $72 full coverage</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 6: Settling In Days 1-3
  fs.writeFileSync(path.join(SLIDES_DIR, 's06.html'), slide('bg-navy.png', `
    <div style="padding: 36pt 50pt;">
      <h2 style="font-size:24pt;">Settling In</h2>
      <div style="display:flex; flex-direction:column; gap:10pt; margin-top:20pt;">
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt;">
          <div class="badge" style="background:#4DD0C8; flex-shrink:0;"><p style="color:#0C1A2E; font-size:9pt; font-weight:700;">SAT MAY 2</p></div>
          <div><p><b style="color:#FFF;">Arrival Day</b> — Land in Pisa 15:50, pick up car at 17:00, drive to Barga (~1.5 hrs), check in to AirBnB</p></div>
        </div>
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt;">
          <div class="badge" style="background:#4DD0C8; flex-shrink:0;"><p style="color:#0C1A2E; font-size:9pt; font-weight:700;">SUN MAY 3</p></div>
          <div><p><b style="color:#FFF;">Explore Barga</b> — Free day. Medieval hilltop village, Duomo di Barga, local cafés</p></div>
        </div>
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt;">
          <div class="badge" style="background:#4DD0C8; flex-shrink:0;"><p style="color:#0C1A2E; font-size:9pt; font-weight:700;">MON MAY 4</p></div>
          <div><p><b style="color:#FFF;">Explore the Region</b> — Free day. Garfagnana Valley, Serchio River, nearby villages</p></div>
        </div>
      </div>
    </div>
  `));

  // SLIDE 7: Tue May 5 Cook & Sip
  fs.writeFileSync(path.join(SLIDES_DIR, 's07.html'), slide('bg-navy.png', `
    <div style="padding: 36pt 50pt;">
      <h2 style="font-size:24pt;">Tue May 5 · Cook &amp; Sip</h2>
      <div style="display:flex; flex-direction:column; gap:14pt; margin-top:20pt;">
        <div class="card">
          <div style="display:flex; align-items:baseline; gap:12pt;">
            <h5>10:00 AM</h5>
            <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">3 hours</p></div>
          </div>
          <h3 style="margin-top:8pt; font-size:17pt;">Lucca Cook with Momma</h3>
          <p style="margin-top:4pt;">Hands-on Italian cooking class in Lucca</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:8pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$1,862.50 total · $186/person</p></div>
            <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Jim</b> (AmEx)</p>
          </div>
        </div>
        <div class="card">
          <div style="display:flex; align-items:baseline; gap:12pt;">
            <h5>Afternoon</h5>
          </div>
          <h3 style="margin-top:8pt; font-size:17pt;">Winery with Kings</h3>
          <p style="margin-top:4pt; color:#E8734A; font-style:italic;">Details TBD</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 8: Wed May 6 Florence
  fs.writeFileSync(path.join(SLIDES_DIR, 's08.html'), slide('bg-navy.png', `
    <div style="padding: 32pt 44pt;">
      <h2 style="font-size:24pt;">Wed May 6 · Florence</h2>
      <div style="display:flex; flex-direction:column; gap:10pt; margin-top:16pt;">
        <div style="display:flex; gap:10pt;">
          <div style="background:#0C2A3A; border:1px solid #1A4A6A; border-radius:8pt; padding:8pt 14pt; display:flex; align-items:center; gap:10pt; flex:1;">
            <p style="color:#2196F3; font-size:10pt;">🚗</p>
            <p style="font-size:11pt;"><b style="color:#FFF;">Barga → Lucca</b> &nbsp;·&nbsp; 44 min drive</p>
          </div>
          <div style="background:#0C2A3A; border:1px solid #1A4A6A; border-radius:8pt; padding:8pt 14pt; display:flex; align-items:center; gap:10pt; flex:1.2;">
            <p style="color:#2196F3; font-size:10pt;">🚆</p>
            <p style="font-size:11pt;"><b style="color:#FFF;">Lucca → Florence</b> &nbsp;·&nbsp; 09:30 &nbsp;·&nbsp; Regionale 18509</p>
          </div>
        </div>
        <div style="display:flex; gap:10pt;">
          <div class="pill"><p style="color:#F0C75E; font-size:9pt; font-weight:700;">Train: $54 · $17/ea</p></div>
          <p style="font-size:9pt;">Booked: <b style="color:#4DD0C8;">Logan</b></p>
        </div>
        <div class="card" style="margin-top:4pt;">
          <div style="display:flex; align-items:baseline; gap:12pt;">
            <h5>14:15</h5>
            <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">3 – 3.5 hours</p></div>
          </div>
          <h3 style="margin-top:8pt; font-size:17pt;">Best of Florence Tour</h3>
          <p style="margin-top:4pt;">David, Galleria dell'Accademia &amp; Duomo</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:8pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$546.70 total · $109/person</p></div>
            <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Jim</b> (AmEx)</p>
          </div>
        </div>
      </div>
    </div>
  `));

  // SLIDE 9: Rome Section Divider
  fs.writeFileSync(path.join(SLIDES_DIR, 's09.html'), slide('bg-rome.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <h6 style="font-size:72pt; color:rgba(232,115,74,0.12); font-family:Georgia; font-weight:900; position:absolute; top:20pt; left:50pt;">02</h6>
      <h1 style="font-size:56pt; color:#E8734A;">Rome</h1>
      <h4 style="margin-top:8pt;">May 7 – 10 &nbsp;·&nbsp; The Eternal City</h4>
    </div>
  `));

  // SLIDE 10: Getting to Rome
  fs.writeFileSync(path.join(SLIDES_DIR, 's10.html'), slide('bg-navy.png', `
    <div style="padding: 32pt 44pt;">
      <h2 style="font-size:24pt;">Getting to Rome</h2>
      <div style="display:flex; flex-direction:column; gap:12pt; margin-top:16pt;">
        <div style="background:#0C2A3A; border:1px solid #1A4A6A; border-radius:8pt; padding:12pt 16pt;">
          <div style="display:flex; align-items:center; gap:10pt; flex-wrap:wrap;">
            <p style="color:#2196F3; font-size:10pt;">🚆</p>
            <h3 style="font-family:Arial; font-size:18pt;">Pisa → Rome</h3>
            <p style="font-size:11pt;"><b style="color:#FFF;">Thu May 7</b> · 11:11 – 14:33 (3h22m)</p>
          </div>
          <p style="font-size:10pt; margin-top:6pt;">Intercity 505 &nbsp;·&nbsp; Seats: 7A, 7C, 7D, 8C, 8D</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:6pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:9pt; font-weight:700;">$233 · $47/ea</p></div>
            <p style="font-size:9pt;">Booked: <b style="color:#4DD0C8;">Logan</b></p>
          </div>
        </div>
        <div class="card">
          <h3 style="color:#E8734A; font-size:15pt;">🏨 citizenM Rome Isola Tiberina</h3>
          <p style="margin-top:6pt; font-size:10pt; line-height:1.6;">Lungtevere de' Cenci 5-8, Rome 00186</p>
          <p style="font-size:10pt; line-height:1.6;">Conf <span class="conf">#99566483</span></p>
          <p style="font-size:10pt; line-height:1.6;"><b style="color:#FFF;">Thu May 7 – Sun May 10</b> · 3 nights</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:6pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">Jim's hotel points + $400</p></div>
            <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Jim</b></p>
          </div>
          <p style="font-size:9pt; margin-top:4pt; color:#E8734A;">⚠ Jim to check on shuttle for arrive/depart</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 11: Thu May 7 Evening
  fs.writeFileSync(path.join(SLIDES_DIR, 's11.html'), slide('bg-navy.png', `
    <div style="padding: 36pt 50pt;">
      <h2 style="font-size:24pt;">Thu May 7 · Arrival Evening</h2>
      <div style="display:flex; flex-direction:column; gap:14pt; margin-top:20pt;">
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt;">
          <div class="badge" style="background:#E8734A; flex-shrink:0;"><p style="color:#FFF; font-size:9pt; font-weight:700;">14:33</p></div>
          <div><p><b style="color:#FFF;">Arrive Rome Termini</b> — Check in to citizenM, settle in, freshen up</p></div>
        </div>
        <div class="card">
          <div style="display:flex; align-items:baseline; gap:12pt;">
            <h5>19:00</h5>
            <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">2.5 hours</p></div>
          </div>
          <h3 style="margin-top:8pt; font-size:17pt;">Golf Cart Tour of Rome</h3>
          <p style="margin-top:4pt;">Evening tour through Rome's iconic sights by golf cart</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:8pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$532 total · $107/person</p></div>
            <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Geoff</b> (Citi Card)</p>
          </div>
        </div>
      </div>
    </div>
  `));

  // SLIDE 12: Fri May 8 Vatican
  fs.writeFileSync(path.join(SLIDES_DIR, 's12.html'), slide('bg-rome.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <div class="card" style="max-width:420pt; background:rgba(12,26,46,0.85); border-color:rgba(255,255,255,0.15);">
        <div style="display:flex; align-items:baseline; gap:12pt;">
          <h5>10:30 AM</h5>
          <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">2.5 hours</p></div>
          <p style="font-size:10pt; color:#A8BDD4;">Fri May 8</p>
        </div>
        <h2 style="margin-top:8pt; font-size:28pt;">Vatican &amp; Basilica</h2>
        <p style="margin-top:6pt;">Vatican Museums, Sistine Chapel &amp; St. Peter's Basilica</p>
        <div style="display:flex; align-items:center; gap:8pt; margin-top:10pt; flex-wrap:wrap;">
          <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$780 total · $156/person</p></div>
          <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Jim</b> (AmEx)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 13: Sat May 9 Colosseum
  fs.writeFileSync(path.join(SLIDES_DIR, 's13.html'), slide('bg-rome.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <div class="card" style="max-width:420pt; background:rgba(12,26,46,0.85); border-color:rgba(255,255,255,0.15);">
        <div style="display:flex; align-items:baseline; gap:12pt;">
          <h5>10:30 AM</h5>
          <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">3 hours</p></div>
          <p style="font-size:10pt; color:#A8BDD4;">Sat May 9</p>
        </div>
        <h2 style="margin-top:8pt; font-size:28pt;">The Colosseum</h2>
        <p style="margin-top:6pt;">Colosseum, Roman Forum &amp; Palatine Hill</p>
        <div style="display:flex; align-items:center; gap:8pt; margin-top:10pt; flex-wrap:wrap;">
          <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$1,203 total · $240/person</p></div>
          <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Geoff</b> (Citi Card)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 14: Naples Section Divider
  fs.writeFileSync(path.join(SLIDES_DIR, 's14.html'), slide('bg-naples.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <h6 style="font-size:72pt; color:rgba(33,150,243,0.12); font-family:Georgia; font-weight:900; position:absolute; top:20pt; left:50pt;">03</h6>
      <h1 style="font-size:52pt; color:#2196F3;">Naples &amp; the Coast</h1>
      <h4 style="margin-top:8pt;">May 10 – 15 &nbsp;·&nbsp; Pompeii, Capri &amp; Amalfi</h4>
    </div>
  `));

  // SLIDE 15: Getting to Naples
  fs.writeFileSync(path.join(SLIDES_DIR, 's15.html'), slide('bg-navy.png', `
    <div style="padding: 30pt 44pt;">
      <h2 style="font-size:24pt;">Getting to Naples</h2>
      <div style="display:flex; flex-direction:column; gap:10pt; margin-top:14pt;">
        <div style="background:#0C2A3A; border:1px solid #1A4A6A; border-radius:8pt; padding:10pt 16pt;">
          <div style="display:flex; align-items:center; gap:10pt; flex-wrap:wrap;">
            <p style="color:#2196F3; font-size:10pt;">🚆</p>
            <h3 style="font-family:Arial; font-size:18pt;">Rome → Naples</h3>
            <p style="font-size:11pt;"><b style="color:#FFF;">Sun May 10</b> · 13:40 – 14:53 (1h13m)</p>
          </div>
          <p style="font-size:10pt; margin-top:4pt;">Italo 9977 · Carriage #2 · Seats: 8, 9, 10, 11, 12</p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:4pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:9pt; font-weight:700;">$200 · $40/ea</p></div>
            <p style="font-size:9pt;">Booked: <b style="color:#4DD0C8;">Logan</b></p>
          </div>
          <p style="font-size:9pt; margin-top:4pt; color:#E8734A;">⚠ Taxi/Uber to Rome station (~10-15 min) · Uber from Naples station to AirBnB (~15 min)</p>
        </div>
        <div class="card">
          <h3 style="color:#2196F3; font-size:15pt;">🏠 AirBnB Naples</h3>
          <p style="margin-top:4pt; font-size:10pt; line-height:1.5;">Largo Ecce Homo 31, ex Vico Santa Maria dell'Aiuto 1, Naples 80134</p>
          <p style="font-size:10pt; line-height:1.5;"><b style="color:#FFF;">Check-in:</b> Sun May 10, 15:00 &nbsp;·&nbsp; <b style="color:#FFF;">Check-out:</b> Fri May 15, 10:00 &nbsp;·&nbsp; <b style="color:#FFF;">5 nights</b></p>
          <div style="display:flex; align-items:center; gap:8pt; margin-top:6pt; flex-wrap:wrap;">
            <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$1,622 total · $325/person</p></div>
            <p style="font-size:9pt;">Booked: <b style="color:#4DD0C8;">Logan</b></p>
          </div>
        </div>
      </div>
    </div>
  `));

  // SLIDE 16: Mon May 11 Pompeii
  fs.writeFileSync(path.join(SLIDES_DIR, 's16.html'), slide('bg-navy.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <div class="card" style="max-width:440pt;">
        <div style="display:flex; align-items:baseline; gap:12pt;">
          <h5>09:20 AM</h5>
          <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">7 hours · Full Day</p></div>
          <p style="font-size:10pt; color:#A8BDD4;">Mon May 11</p>
        </div>
        <h2 style="margin-top:8pt; font-size:26pt;">Pompeii &amp; Herculaneum</h2>
        <p style="margin-top:6pt;">Full-day bus excursion to the ancient ruins</p>
        <p style="margin-top:4pt; font-size:10pt;">Bus departs near train station</p>
        <div style="display:flex; align-items:center; gap:8pt; margin-top:10pt; flex-wrap:wrap;">
          <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$920 total · $184/person</p></div>
          <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Geoff</b> (Citi Card)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 17: Tue May 12 Capri
  fs.writeFileSync(path.join(SLIDES_DIR, 's17.html'), slide('bg-naples.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <div class="card" style="max-width:440pt; background:rgba(12,26,46,0.85);">
        <div style="display:flex; align-items:baseline; gap:12pt;">
          <h5>08:00 AM</h5>
          <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">9 hours · Full Day</p></div>
          <p style="font-size:10pt; color:#A8BDD4;">Tue May 12</p>
        </div>
        <h2 style="margin-top:8pt; font-size:26pt;">Capri &amp; Blue Grotto</h2>
        <p style="margin-top:6pt;">Full-day boat excursion</p>
        <p style="margin-top:4pt; font-size:10pt;">Walk to port/dock from apartment</p>
        <div style="display:flex; align-items:center; gap:8pt; margin-top:10pt; flex-wrap:wrap;">
          <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$967.85 total · $194/person</p></div>
          <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Jim</b> (AmEx)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 18: Wed May 13 Amalfi
  fs.writeFileSync(path.join(SLIDES_DIR, 's18.html'), slide('bg-naples.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding: 50pt;">
      <div class="card" style="max-width:440pt; background:rgba(12,26,46,0.85);">
        <div style="display:flex; align-items:baseline; gap:12pt;">
          <h5>08:30 AM</h5>
          <div style="background:#0C2A4A; border:1px solid #2196F3; border-radius:20pt; padding:2pt 10pt;"><p style="color:#2196F3; font-size:9pt; font-weight:700;">8 hours · Full Day</p></div>
          <p style="font-size:10pt; color:#A8BDD4;">Wed May 13</p>
        </div>
        <h2 style="margin-top:8pt; font-size:26pt;">Amalfi Coast &amp; Sorrento</h2>
        <p style="margin-top:6pt;">Full-day bus tour along the Amalfi Coast</p>
        <p style="margin-top:4pt; font-size:10pt;">Bus departs near train station</p>
        <div style="display:flex; align-items:center; gap:8pt; margin-top:10pt; flex-wrap:wrap;">
          <div class="pill"><p style="color:#F0C75E; font-size:10pt; font-weight:700;">$544.45 total · $109/person</p></div>
          <p style="font-size:9pt;">Paid: <b style="color:#4DD0C8;">Geoff</b> (Citi Card)</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 19: Final Days
  fs.writeFileSync(path.join(SLIDES_DIR, 's19.html'), slide('bg-navy.png', `
    <div style="padding: 32pt 44pt;">
      <h2 style="font-size:24pt;">Final Days</h2>
      <div style="display:flex; flex-direction:column; gap:10pt; margin-top:16pt;">
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt;">
          <div class="badge" style="background:#2196F3; flex-shrink:0;"><p style="color:#FFF; font-size:9pt; font-weight:700;">THU MAY 14</p></div>
          <div>
            <p><b style="color:#FFF;">Free Day — Explore Naples</b></p>
            <p style="font-size:10pt; margin-top:2pt;">Spaccanapoli, pizza pilgrimage, Naples Underground, waterfront</p>
          </div>
        </div>
        <div class="card" style="display:flex; align-items:flex-start; gap:14pt; border-color:rgba(232,115,74,0.3);">
          <div class="badge" style="background:#E8734A; flex-shrink:0;"><p style="color:#FFF; font-size:9pt; font-weight:700;">FRI MAY 15</p></div>
          <div><p><b style="color:#FFF;">Departure Day</b> — Check out 10:00. 20 min car ride to Naples airport.</p></div>
        </div>
        <div class="card" style="display:flex; align-items:center; gap:14pt;">
          <div style="background:#E8734A; border-radius:6pt; padding:3pt 10pt;"><p style="color:#FFF; font-weight:700; font-size:10pt;">BA 1578</p></div>
          <p style="font-size:11pt;"><b style="color:#FFF;">Naples</b> <span style="color:#2196F3;">✈</span> <b style="color:#FFF;">Chicago</b> &nbsp;·&nbsp; depart 15:00 → arrive 18:55</p>
        </div>
        <div class="card" style="display:flex; align-items:center; gap:14pt;">
          <div style="background:#E8734A; border-radius:6pt; padding:3pt 10pt;"><p style="color:#FFF; font-weight:700; font-size:10pt;">BA 5160</p></div>
          <p style="font-size:11pt;"><b style="color:#FFF;">ORD</b> <span style="color:#2196F3;">✈</span> <b style="color:#FFF;">CVG</b> &nbsp;·&nbsp; depart 20:56 → arrive 23:56</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 20: Budget Overview
  fs.writeFileSync(path.join(SLIDES_DIR, 's20.html'), slide('bg-budget.png', `
    <div style="padding: 36pt 50pt; display:flex; flex-direction:column; align-items:center;">
      <h2 style="font-size:28pt; text-align:center;">Trip Budget</h2>
      <p style="text-align:center; margin-top:4pt;">Excluding flights · 5 travelers</p>
      <div style="display:flex; gap:16pt; margin-top:30pt;">
        <div class="card" style="text-align:center; min-width:120pt; padding:16pt 20pt;">
          <h2 style="color:#F0C75E; font-size:32pt;">$11,215</h2>
          <p style="font-size:10pt; margin-top:4pt;">Total Trip Cost</p>
        </div>
        <div class="card" style="text-align:center; min-width:120pt; padding:16pt 20pt;">
          <h2 style="color:#F0C75E; font-size:32pt;">$2,243</h2>
          <p style="font-size:10pt; margin-top:4pt;">Per Person (avg)</p>
        </div>
        <div class="card" style="text-align:center; min-width:90pt; padding:16pt 20pt;">
          <h2 style="color:#4DD0C8; font-size:32pt;">14</h2>
          <p style="font-size:10pt; margin-top:4pt;">Nights</p>
        </div>
        <div class="card" style="text-align:center; min-width:90pt; padding:16pt 20pt;">
          <h2 style="color:#E8734A; font-size:32pt;">3</h2>
          <p style="font-size:10pt; margin-top:4pt;">Regions</p>
        </div>
      </div>
    </div>
  `));

  // SLIDE 21: Who Paid What
  fs.writeFileSync(path.join(SLIDES_DIR, 's21.html'), slide('bg-budget.png', `
    <div style="padding: 28pt 40pt;">
      <h2 style="font-size:24pt;">Who Paid What</h2>
      <div style="display:flex; gap:12pt; margin-top:14pt;">
        <div class="card" style="flex:1; display:flex; flex-direction:column;">
          <div style="padding-bottom:6pt; border-bottom:1px solid #2A4060;"><h3 style="color:#4DD0C8; font-size:14pt;">Logan</h3></div>
          <div style="display:flex; justify-content:space-between; margin-top:6pt;"><p style="font-size:9pt;">Train Lucca → Florence</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$54</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Train Pisa → Rome</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$233</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Train Rome → Naples</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$200</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">AirBnB Naples</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$1,622</p></div>
          <div style="flex:1;"></div>
          <div style="border-top:2px solid #F0C75E; padding-top:6pt; margin-top:8pt; text-align:right;">
            <h3 style="color:#F0C75E; font-size:16pt;">$2,109</h3>
          </div>
        </div>
        <div class="card" style="flex:1; display:flex; flex-direction:column;">
          <div style="padding-bottom:6pt; border-bottom:1px solid #2A4060;"><h3 style="color:#2196F3; font-size:14pt;">Jim</h3></div>
          <div style="display:flex; justify-content:space-between; margin-top:6pt;"><p style="font-size:9pt;">Cooking class</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$1,862.50</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Florence tour</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$546.70</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Vatican tour</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$780</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Capri / Blue Grotto</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$967.85</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">citizenM Rome</p><p style="font-size:9pt; color:#FFF; font-weight:600;">pts + $400</p></div>
          <div style="flex:1;"></div>
          <div style="border-top:2px solid #F0C75E; padding-top:6pt; margin-top:8pt; text-align:right;">
            <h3 style="color:#F0C75E; font-size:16pt;">$4,557</h3>
          </div>
        </div>
        <div class="card" style="flex:1; display:flex; flex-direction:column;">
          <div style="padding-bottom:6pt; border-bottom:1px solid #2A4060;"><h3 style="color:#F0C75E; font-size:14pt;">Geoff</h3></div>
          <div style="display:flex; justify-content:space-between; margin-top:6pt;"><p style="font-size:9pt;">AirBnB Barga</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$1,615</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Golf cart tour</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$532</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Colosseum tour</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$1,203</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Pompeii</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$920</p></div>
          <div style="display:flex; justify-content:space-between; margin-top:3pt;"><p style="font-size:9pt;">Amalfi Coast</p><p style="font-size:9pt; color:#FFF; font-weight:600;">$544.45</p></div>
          <div style="flex:1;"></div>
          <div style="border-top:2px solid #F0C75E; padding-top:6pt; margin-top:8pt; text-align:right;">
            <h3 style="color:#F0C75E; font-size:16pt;">$4,814</h3>
          </div>
        </div>
      </div>
      <p style="font-size:8pt; text-align:center; margin-top:8pt;">Rental car ($514) payer unspecified · Flights not included in totals</p>
    </div>
  `));

  // SLIDE 22: Spending by Category (placeholder for chart)
  fs.writeFileSync(path.join(SLIDES_DIR, 's22.html'), slide('bg-budget.png', `
    <div style="padding: 36pt 50pt;">
      <h2 style="font-size:24pt;">Spending by Category</h2>
      <p style="margin-top:4pt; font-size:10pt;">Excluding flights</p>
      <div id="chart" class="placeholder" style="width: 580pt; height: 260pt; margin-top:20pt; background: rgba(26,48,80,0.5); border-radius: 8pt;"></div>
    </div>
  `));

  // SLIDE 23: Closing
  fs.writeFileSync(path.join(SLIDES_DIR, 's23.html'), slide('bg-title.png', `
    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
      <div style="display:flex; width:80pt; height:5pt; margin-bottom:14pt;">
        <div style="flex:1; background:#009246;"></div>
        <div style="flex:1; background:#FFFFFF;"></div>
        <div style="flex:1; background:#CE2B37;"></div>
      </div>
      <h1 style="font-size:60pt; font-style:italic;">Andiamo!</h1>
      <h4 style="margin-top:10pt; font-style:italic;">Buon viaggio — May 1 – 15, 2026</h4>
    </div>
  `));
}

// --- BUILD PPTX ---
async function build() {
  console.log('Creating gradient backgrounds...');
  await createGradients();

  console.log('Writing HTML slides...');
  writeSlides();

  console.log('Converting to PPTX...');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Claude Code';
  pptx.title = 'Italia 2026 — Trip Reference';

  const slideFiles = [];
  for (let i = 1; i <= 23; i++) {
    slideFiles.push(`s${String(i).padStart(2, '0')}.html`);
  }

  for (const file of slideFiles) {
    const htmlPath = path.join(SLIDES_DIR, file);
    console.log(`  Processing ${file}...`);
    try {
      const result = await html2pptx(htmlPath, pptx);

      // Add chart to budget category slide (s22)
      if (file === 's22.html' && result.placeholders.length > 0) {
        const chartData = [{
          name: 'Amount',
          labels: ['Tours & Excursions', 'Accommodation', 'Transportation', 'Hotel (pts)'],
          values: [6357, 3237, 1001, 400]
        }];
        result.slide.addChart(pptx.charts.BAR, chartData, {
          ...result.placeholders[0],
          barDir: 'bar',
          showTitle: false,
          showLegend: false,
          showValue: true,
          dataLabelPosition: 'outEnd',
          dataLabelColor: 'FFFFFF',
          dataLabelFontSize: 10,
          catAxisFontColor: 'A8BDD4',
          catAxisFontSize: 10,
          valAxisHidden: true,
          catGridLine: { style: 'none' },
          valGridLine: { style: 'none' },
          plotArea: { fill: { color: '142744' } },
          chartColors: ['E8734A', '4DD0C8', '2196F3', 'F0C75E'],
        });
      }
    } catch (err) {
      console.error(`  ERROR on ${file}: ${err.message}`);
    }
  }

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\nDone! Saved to: ${OUTPUT}`);
}

build().catch(err => { console.error(err); process.exit(1); });

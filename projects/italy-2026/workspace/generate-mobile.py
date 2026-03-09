#!/usr/bin/env python3
"""Generate a static HTML/CSS-only mobile version of the Italy 2026 dashboard.
No JavaScript dependencies - works on iOS when shared via email/Drive."""

import os

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'output', 'italy-dashboard-mobile-v1.html')

# SVG icon paths (matching the React version)
ICONS = {
    'calendar': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>',
    'mappin': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>',
    'plane': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>',
    'train': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M8 4h8l2 6H6l2-6ZM6 10v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M9 18l-2 3M15 18l2 3M9.5 14h.01M14.5 14h.01" /></svg>',
    'car': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h17.25M3.375 14.25L6 6.75h12l2.625 7.5" /></svg>',
    'home': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>',
    'dollar': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    'map': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>',
    'sun': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>',
    'info': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
}

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
  background:#f9fafb;color:#1f2937;line-height:1.5;min-height:100vh}

/* Icons */
.icon{width:1.25rem;height:1.25rem;display:inline-block;vertical-align:middle;flex-shrink:0}
.icon-sm{width:0.75rem;height:0.75rem}
.icon-lg{width:1.5rem;height:1.5rem}

/* Header */
.header{background:#064e3b;color:#fff;padding:2.5rem 1.5rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.header-inner{max-width:64rem;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:1.5rem}
@media(min-width:768px){.header-inner{flex-direction:row;justify-content:space-between}}
.header h1{font-size:1.75rem;font-weight:700;margin-bottom:.5rem}
@media(min-width:768px){.header h1{font-size:2.25rem}}
.header-subtitle{color:#a7f3d0;font-size:1.125rem;display:flex;align-items:center;gap:.5rem}
.header-date-note{color:#6ee7b7;font-size:.875rem;margin-top:.25rem;margin-left:1.75rem}
.stat-cards{display:flex;gap:1rem;margin-top:1.5rem}
@media(min-width:768px){.stat-cards{margin-top:0}}
.stat-card{background:rgba(6,78,59,.5);padding:.75rem;border-radius:.5rem;text-align:center;
  border:1px solid rgba(5,150,105,.3);backdrop-filter:blur(4px)}
.stat-card .num{display:block;font-size:1.5rem;font-weight:700}
.stat-card .label{font-size:.625rem;text-transform:uppercase;letter-spacing:.05em;color:#a7f3d0}

/* Tab Navigation - CSS Only */
.tab-input{display:none}
.tab-nav{background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:20;
  box-shadow:0 1px 2px rgba(0,0,0,.05);overflow-x:auto;-webkit-overflow-scrolling:touch}
.tab-nav::-webkit-scrollbar{display:none}
.tab-nav{-ms-overflow-style:none;scrollbar-width:none}
.tab-nav-inner{max-width:64rem;margin:0 auto;display:flex;white-space:nowrap}
.tab-label{display:flex;align-items:center;padding:1rem 1.5rem;cursor:pointer;
  border-bottom:2px solid transparent;font-weight:500;color:#6b7280;transition:all .15s;
  font-size:.875rem;gap:.5rem;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.tab-label:hover{color:#1f2937;background:#f9fafb}
.tab-label .icon{color:#9ca3af}

/* Tab content panels */
.tab-panels{max-width:64rem;margin:0 auto;padding:1rem}
@media(min-width:768px){.tab-panels{padding:1.5rem}}
@media(min-width:1024px){.tab-panels{padding:2rem}}
.panel{display:none}

/* Tab activation via :checked */
#tab-timeline:checked ~ .tab-nav .tab-nav-inner .lbl-timeline,
#tab-logistics:checked ~ .tab-nav .tab-nav-inner .lbl-logistics,
#tab-lodging:checked ~ .tab-nav .tab-nav-inner .lbl-lodging,
#tab-finances:checked ~ .tab-nav .tab-nav-inner .lbl-finances,
#tab-map:checked ~ .tab-nav .tab-nav-inner .lbl-map,
#tab-tips:checked ~ .tab-nav .tab-nav-inner .lbl-tips{
  border-bottom-color:#059669;color:#047857}
#tab-timeline:checked ~ .tab-nav .tab-nav-inner .lbl-timeline .icon,
#tab-logistics:checked ~ .tab-nav .tab-nav-inner .lbl-logistics .icon,
#tab-lodging:checked ~ .tab-nav .tab-nav-inner .lbl-lodging .icon,
#tab-finances:checked ~ .tab-nav .tab-nav-inner .lbl-finances .icon,
#tab-map:checked ~ .tab-nav .tab-nav-inner .lbl-map .icon,
#tab-tips:checked ~ .tab-nav .tab-nav-inner .lbl-tips .icon{
  color:#059669}
#tab-timeline:checked ~ .tab-panels .panel-timeline,
#tab-logistics:checked ~ .tab-panels .panel-logistics,
#tab-lodging:checked ~ .tab-panels .panel-lodging,
#tab-finances:checked ~ .tab-panels .panel-finances,
#tab-map:checked ~ .tab-panels .panel-map,
#tab-tips:checked ~ .tab-panels .panel-tips{display:block}

/* Cards */
.card{background:#fff;border-radius:.75rem;box-shadow:0 1px 2px rgba(0,0,0,.05);
  border:1px solid #f3f4f6;overflow:hidden;margin-bottom:1.5rem}
.card-row{display:flex;flex-direction:column}
@media(min-width:768px){.card-row{flex-direction:row}}

/* Day cards (Timeline) */
.day-sidebar{padding:1rem;flex-shrink:0;display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid #d1fae5;background:#ecfdf5;color:#064e3b}
@media(min-width:768px){.day-sidebar{width:12rem;flex-direction:column;justify-content:flex-start;
  align-items:flex-start;border-bottom:none;border-right:1px solid #d1fae5}}
.day-date{font-weight:700;font-size:1.125rem}
.day-location{color:#047857;font-size:.875rem;margin-top:.25rem;display:flex;align-items:center;gap:.25rem}
.day-location .icon{width:.75rem;height:.75rem}
.day-title{font-size:.875rem;font-weight:500;color:#065f46;background:rgba(167,243,208,.3);
  padding:.25rem .5rem;border-radius:.25rem}
@media(min-width:768px){.day-title{margin-top:1rem}}
.day-events{padding:1rem;flex-grow:1;position:relative}
.day-events ul{list-style:none;display:flex;flex-direction:column;gap:1rem}
.event-item{display:flex;align-items:flex-start;gap:1rem;position:relative;z-index:1}
.event-icon{padding:.5rem;border-radius:50%;margin-top:.25rem;flex-shrink:0}
.event-icon.transit{color:#2563eb;background:#eff6ff}
.event-icon.lodging{color:#9333ea;background:#faf5ff}
.event-icon.activity{color:#d97706;background:#fffbeb}
.event-icon .icon{width:1rem;height:1rem}
.event-time{display:inline-block;padding:.125rem .5rem;border-radius:.25rem;font-size:.75rem;
  font-weight:600;background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;margin-bottom:.25rem}
.event-text{font-size:1rem;color:#374151}
.event-text.highlight{font-weight:500;color:#111827}

/* Timeline vertical line */
@media(min-width:768px){
.day-events::before{content:'';position:absolute;left:1.5rem;top:1.5rem;bottom:1.5rem;
  width:2px;background:#f3f4f6}}

/* Section headings */
.section{margin-bottom:2rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;color:#1f2937}
.section-title .icon{width:1.5rem;height:1.5rem}

/* Grid layouts */
.grid-2{display:grid;grid-template-columns:1fr;gap:1rem}
@media(min-width:768px){.grid-2{grid-template-columns:1fr 1fr}}

/* Flight cards */
.flight-card{background:#fff;padding:1.25rem;border-radius:.75rem;border:1px solid #e5e7eb;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.flight-label{text-transform:uppercase;font-size:.625rem;font-weight:700;color:#9ca3af;margin-bottom:.5rem;letter-spacing:.05em}
.flight-route{display:flex;justify-content:space-between;align-items:center;padding-bottom:.75rem}
.flight-route:not(:last-child){border-bottom:1px solid #f3f4f6;margin-bottom:.75rem}
.flight-num{font-weight:700;font-size:1.125rem}
.flight-detail{font-size:.875rem;color:#6b7280}

/* Table */
.data-table{width:100%;text-align:left;font-size:.875rem;border-collapse:collapse}
.data-table thead{background:#f9fafb;border-bottom:1px solid #e5e7eb}
.data-table th{padding:1rem;font-weight:600;color:#4b5563}
.data-table td{padding:1rem}
.data-table tbody tr{border-bottom:1px solid #f3f4f6}
.data-table .text-right{text-align:right}
.overflow-x{overflow-x:auto;-webkit-overflow-scrolling:touch}

/* Car rental */
.car-card{display:flex;flex-direction:column;gap:1.5rem;padding:1.25rem}
@media(min-width:768px){.car-card{flex-direction:row;align-items:flex-start}}
.car-highlight{background:#fffbeb;padding:1rem;border-radius:.5rem}
@media(min-width:768px){.car-highlight{width:33%}}
.car-details{display:grid;grid-template-columns:1fr;gap:1rem;flex-grow:1}
@media(min-width:768px){.car-details{grid-template-columns:1fr 1fr}}
.detail-label{text-transform:uppercase;font-size:.625rem;font-weight:700;color:#6b7280;letter-spacing:.05em;margin-bottom:.25rem}
.detail-value{font-weight:600;color:#1f2937}
.detail-sub{font-size:.875rem;color:#4b5563;margin-top:.25rem}

/* Lodging cards */
.lodge-card{display:flex;flex-direction:column;overflow:hidden}
@media(min-width:768px){.lodge-card{flex-direction:row}}
.lodge-sidebar{padding:1.5rem;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;
  border-bottom:1px solid}
@media(min-width:768px){.lodge-sidebar{width:16rem;border-bottom:none;border-right:1px solid}}
.lodge-city{font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:.75rem;margin-bottom:.25rem}
.lodge-name{font-size:1.25rem;font-weight:700;line-height:1.3}
.lodge-conf{margin-top:.5rem;font-family:monospace;font-size:.75rem;padding:.375rem;
  border-radius:.25rem;display:inline-block;width:max-content}
.lodge-details{padding:1.5rem;flex-grow:1;display:grid;grid-template-columns:1fr;gap:1rem}
@media(min-width:768px){.lodge-details{grid-template-columns:1fr 1fr}}
.lodge-detail{display:flex;align-items:flex-start;gap:.75rem}
.lodge-detail .icon{color:#9ca3af;margin-top:.125rem;flex-shrink:0}

/* Lodging color variants */
.lodge-emerald .lodge-sidebar{background:#ecfdf5;border-color:#a7f3d0}
.lodge-emerald .lodge-city{color:#059669}
.lodge-emerald .lodge-name{color:#064e3b}
.lodge-emerald .lodge-conf{background:rgba(167,243,208,.3);color:#065f46}
.lodge-blue .lodge-sidebar{background:#eff6ff;border-color:#bfdbfe}
.lodge-blue .lodge-city{color:#2563eb}
.lodge-blue .lodge-name{color:#1e3a8a}
.lodge-blue .lodge-conf{background:rgba(191,219,254,.3);color:#1e40af}
.lodge-amber .lodge-sidebar{background:#fffbeb;border-color:#fde68a}
.lodge-amber .lodge-city{color:#d97706}
.lodge-amber .lodge-name{color:#78350f}

/* Finance summary cards */
.fin-cards{display:grid;grid-template-columns:1fr;gap:1rem;margin-bottom:2rem}
@media(min-width:768px){.fin-cards{grid-template-columns:1fr 1fr 1fr}}
.fin-total{background:#059669;color:#fff;padding:1.5rem;border-radius:.75rem;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.fin-total h3{color:#d1fae5;font-size:.875rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem}
.fin-total .amount{font-size:1.875rem;font-weight:700}
.fin-total .note{font-size:.875rem;margin-top:.5rem;color:#d1fae5;opacity:.9}
.fin-card{background:#fff;border:1px solid #e5e7eb;padding:1.5rem;border-radius:.75rem;
  box-shadow:0 1px 2px rgba(0,0,0,.05);display:flex;flex-direction:column;justify-content:center}
.fin-card h3{color:#6b7280;font-size:.875rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem}
.fin-card .amount{font-size:1.875rem;font-weight:700;color:#1f2937}
.payer-row{display:flex;justify-content:space-between;font-size:.875rem;color:#4b5563;margin-bottom:.25rem}
.payer-row .payer-amount{font-weight:600;color:#1f2937}
.badge{display:inline-block;padding:.25rem .5rem;border-radius:9999px;font-size:.75rem;font-weight:600}
.badge-blue{background:#dbeafe;color:#1e40af}
.badge-purple{background:#f3e8ff;color:#6b21a8}
.badge-amber{background:#fef3c7;color:#92400e}

/* Map section */
.map-grid{display:flex;flex-direction:column;gap:1.5rem}
.map-group{background:#fff;border-radius:.75rem;box-shadow:0 1px 2px rgba(0,0,0,.05);
  border:1px solid #e5e7eb;overflow:hidden}
.map-group-header{padding:.75rem 1rem;border-bottom:1px solid;font-weight:700;font-size:.875rem}
.map-group-header.emerald{background:#ecfdf5;border-color:#d1fae5;color:#064e3b}
.map-group-header.blue{background:#eff6ff;border-color:#bfdbfe;color:#1e3a8a}
.map-group-header.amber{background:#fffbeb;border-color:#fde68a;color:#78350f}
.map-link{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;
  text-decoration:none;color:#374151;border-bottom:1px solid #f3f4f6;transition:background .1s}
.map-link:last-child{border-bottom:none}
.map-link:hover,.map-link:active{background:#f9fafb}
.map-link-icon{padding:.375rem;border-radius:50%;flex-shrink:0}
.map-link-icon.emerald{background:#d1fae5;color:#059669}
.map-link-icon.blue{background:#bfdbfe;color:#2563eb}
.map-link-icon.amber{background:#fde68a;color:#d97706}
.map-link-icon .icon{width:1rem;height:1rem}
.map-link-text{font-size:.875rem;font-weight:500}
.map-link-arrow{margin-left:auto;color:#9ca3af;font-size:.75rem}

/* Tips section */
.tip-card{padding:1.5rem;border-radius:.75rem;border:1px solid;margin-bottom:1.5rem}
.tip-card.blue{background:#eff6ff;border-color:#bfdbfe}
.tip-card.amber{background:#fffbeb;border-color:#fde68a}
.tip-card.purple{background:#faf5ff;border-color:#e9d5ff}
.tip-title{font-size:1.25rem;font-weight:700;margin-bottom:.75rem;display:flex;align-items:center;gap:.5rem}
.tip-card.blue .tip-title{color:#1e3a8a}
.tip-card.blue .tip-title .icon{color:#2563eb}
.tip-card.amber .tip-title{color:#78350f}
.tip-card.amber .tip-title .icon{color:#d97706}
.tip-card.purple .tip-title{color:#581c87}
.tip-card.purple .tip-title .icon{color:#9333ea}
.tip-body{line-height:1.7}
.tip-card.blue .tip-body{color:#1e40af}
.tip-card.amber .tip-body{color:#92400e}
.tip-card.purple .tip-body{color:#6b21a8}
.tip-list{list-style:disc;padding-left:1.25rem;margin-top:.75rem}
.tip-list li{margin-bottom:.5rem}

/* Utilities */
.text-sm{font-size:.875rem}
.text-xs{font-size:.75rem}
.text-gray{color:#6b7280}
.font-bold{font-weight:700}
.mt-1{margin-top:.25rem}
.mt-2{margin-top:.5rem}
.pt-3{padding-top:.75rem}
.border-t{border-top:1px solid #f3f4f6}
.cost-note{padding-top:.75rem;border-top:1px solid #f3f4f6;margin-top:.5rem;grid-column:1/-1}
"""

def icon(name, extra_class=''):
    svg = ICONS[name]
    if extra_class:
        svg = svg.replace('class="icon"', f'class="icon {extra_class}"')
    return svg


def build_timeline():
    days = [
        ('Fri, May 1', 'Departure Day', 'Cincinnati (CVG)', [
            ('21:10', 'Flight BA 120 departs CVG', 'plane', 'transit'),
        ]),
        ('Sat, May 2', 'Arrival & Welcome to Tuscany', 'Pisa / Barga', [
            ('10:05', 'Arrive in London (LHR)', 'plane', 'transit'),
            ('12:30', 'Flight BA 612 departs LHR', 'plane', 'transit'),
            ('15:50', 'Arrive at Pisa International Airport (PSA)', 'plane', 'transit'),
            ('17:00', 'Pick up Alamo Rental Car', 'car', 'transit'),
            ('18:30', 'Check-in to Casa Zia Franca (Barga)', 'home', 'lodging'),
        ]),
        ('Sun, May 3', 'Helping Out', 'Barga, Tuscany', [
            ('All Day', "At Joy & Kelly's house \u2014 help with work around the house as needed. Plans flexible, playing it by ear.", 'home', 'activity'),
        ]),
        ('Mon, May 4', 'Helping Out', 'Barga, Tuscany', [
            ('All Day', "At Joy & Kelly's house \u2014 continue helping out as needed. Plans flexible, playing it by ear.", 'home', 'activity'),
        ]),
        ('Tue, May 5', 'Culinary Delights', 'Lucca', [
            ('10:00', 'Lucca Cook with Momma (3 hours)', 'mappin', 'activity'),
            ('Afternoon', 'Winery with Kings (TBD)', 'mappin', 'activity'),
        ]),
        ('Wed, May 6', 'Best of Florence', 'Florence', [
            ('Morning', '44 min drive from Barga to Lucca', 'car', 'transit'),
            ('09:31', 'Train from Lucca to Florence, arrive 10:52 (Regionale 18509)', 'train', 'transit'),
            ('14:15', 'Best of Florence Tour: David, Accademia w/ Duomo (3.5 hrs)', 'mappin', 'activity'),
        ]),
        ('Thu, May 7', 'Journey to Rome', 'Pisa to Rome', [
            ('10:00', 'Drop off Alamo Rental Car at PSA Airport', 'car', 'transit'),
            ('11:11', 'Train to Rome: Intercity 505 (Seats: 7A, 7C, 7D, 8C, 8D)', 'train', 'transit'),
            ('14:33', 'Arrive at Roma Termini', 'train', 'transit'),
            ('15:30', 'Check-in to citizenM Rome Isola Tiberina', 'home', 'lodging'),
            ('19:00', 'Golf Cart Tour of Rome (2.5 hrs)', 'mappin', 'activity'),
        ]),
        ('Fri, May 8', 'The Vatican', 'Rome', [
            ('10:30', 'Vatican & Basilica Tour (2.5 hrs)', 'mappin', 'activity'),
        ]),
        ('Sat, May 9', 'Ancient Rome', 'Rome', [
            ('10:30', 'Colosseum Tour (3 hrs)', 'mappin', 'activity'),
        ]),
        ('Sun, May 10', 'South to Naples', 'Rome to Naples', [
            ('12:30', 'Taxi/Uber to Roma Termini (15 min ride)', 'car', 'transit'),
            ('13:40', 'Train to Naples: Italo 9977 (Carriage #2, Seats 8-12)', 'train', 'transit'),
            ('14:53', 'Arrive at Napoli Centrale', 'train', 'transit'),
            ('15:15', 'Uber to AirBnB Largo Ecce Homo 31', 'car', 'transit'),
            ('15:30', 'Check-in to Naples AirBnB', 'home', 'lodging'),
        ]),
        ('Mon, May 11', 'Frozen in Time', 'Pompeii', [
            ('09:20', 'Pompeii & Herculaneum Bus Tour (7 hrs) - Departs near train station', 'mappin', 'activity'),
        ]),
        ('Tue, May 12', 'Island Escape', 'Capri', [
            ('08:00', 'Capri & Blue Grotto Tour (9 hrs) - Walk to port/dock', 'mappin', 'activity'),
        ]),
        ('Wed, May 13', 'The Stunning Coast', 'Amalfi Coast', [
            ('08:30', 'Amalfi Coast & Sorrento Tour (8 hrs) - Departs near train station', 'mappin', 'activity'),
        ]),
        ('Thu, May 14', 'Napoli Local', 'Naples', [
            ('All Day', 'Tour Naples on your own. Enjoy pizza and coastal views!', 'map', 'activity'),
        ]),
        ('Fri, May 15', 'Journey Home', 'Naples to CVG', [
            ('10:00', 'Check-out of Naples AirBnB', 'home', 'lodging'),
            ('12:30', '20-min car ride to Naples Airport', 'car', 'transit'),
            ('15:00', 'Flight BA 1578 departs Naples', 'plane', 'transit'),
            ('18:55', 'Arrive in Chicago (CHI)', 'plane', 'transit'),
            ('20:56', 'Flight BA 5160 departs Chicago', 'plane', 'transit'),
            ('23:56', 'Arrive safely at CVG', 'plane', 'transit'),
        ]),
    ]

    html = ''
    for date, title, location, events in days:
        events_html = ''
        for time, text, ic, etype in events:
            highlight = ' highlight' if etype in ('lodging', 'activity') else ''
            events_html += f'''<li class="event-item">
                <div class="event-icon {etype}">{icon(ic)}</div>
                <div><span class="event-time">{time}</span><p class="event-text{highlight}">{text}</p></div>
            </li>'''
        html += f'''<div class="card card-row">
            <div class="day-sidebar">
                <div><p class="day-date">{date}</p>
                <p class="day-location">{icon('mappin', 'icon-sm')} {location}</p></div>
                <p class="day-title">{title}</p>
            </div>
            <div class="day-events"><ul>{events_html}</ul></div>
        </div>'''
    return html


def build_logistics():
    return f'''
    <div class="section">
        <h2 class="section-title">{icon('plane')} <span style="color:#2563eb">Flights (British Airways)</span></h2>
        <div class="grid-2">
            <div class="flight-card">
                <div class="flight-label">Outbound &bull; Thu, May 1 &ndash; Fri, May 2</div>
                <div class="flight-route"><div><p class="flight-num">BA 120</p><p class="flight-detail">CVG (21:10) &rarr; LHR (10:05)</p></div></div>
                <div class="flight-route"><div><p class="flight-num">BA 612</p><p class="flight-detail">LHR (12:30) &rarr; PSA (15:50)</p></div></div>
            </div>
            <div class="flight-card">
                <div class="flight-label">Return &bull; Fri, May 15</div>
                <div class="flight-route"><div><p class="flight-num">BA 1578</p><p class="flight-detail">Naples (15:00) &rarr; Chicago (18:55)</p></div></div>
                <div class="flight-route"><div><p class="flight-num">BA 5160</p><p class="flight-detail">Chicago (20:56) &rarr; CVG (23:56)</p></div></div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title" style="color:#059669">{icon('train')} Trains Booked</h2>
        <div class="card">
            <div class="overflow-x">
                <table class="data-table">
                    <thead><tr><th>Date</th><th>Route</th><th>Details</th></tr></thead>
                    <tbody>
                        <tr><td style="white-space:nowrap">Wed, May 6</td><td><strong>Lucca</strong> &rarr; <strong>Florence</strong></td><td class="text-sm text-gray">09:31 &ndash; 10:52 (1h21m)<br>Regionale 18509</td></tr>
                        <tr><td style="white-space:nowrap">Thu, May 7</td><td><strong>Pisa</strong> &rarr; <strong>Rome</strong></td><td class="text-sm text-gray">11:11 - 14:33 (3h22m)<br>Intercity 505 | Seats: 7A, 7C, 7D, 8C, 8D</td></tr>
                        <tr><td style="white-space:nowrap">Sun, May 10</td><td><strong>Rome</strong> &rarr; <strong>Naples</strong></td><td class="text-sm text-gray">13:40 - 14:53 (1h13m)<br>Italo 9977 | Carriage 2, Seats: 8, 9, 10, 11, 12</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title" style="color:#d97706">{icon('car')} Car Rental</h2>
        <div class="card">
            <div class="car-card">
                <div class="car-highlight">
                    <h3 style="font-weight:700;font-size:1.25rem;color:#92400e;margin-bottom:.25rem">Alamo</h3>
                    <p style="font-family:monospace;font-size:.875rem;background:rgba(254,243,199,.5);padding:.25rem;border-radius:.25rem;color:#92400e">Conf #758381187</p>
                </div>
                <div class="car-details">
                    <div><p class="detail-label">Pickup</p><p class="detail-value">Sat, May 2 @ 17:00</p><p class="detail-sub">Pisa International Airport (Aeroporto Galileo Galilei, 56121 Pisa PI)</p></div>
                    <div><p class="detail-label">Drop-off</p><p class="detail-value">Thu, May 7 @ 10:00</p><p class="detail-sub">Pisa International Airport</p></div>
                    <div class="cost-note"><p class="text-sm text-gray"><strong>Cost Included:</strong> $384 (5-day rental) + $55 (additional driver) + $72 (full coverage) = $514 total.</p></div>
                </div>
            </div>
        </div>
    </div>'''


def build_lodging():
    lodgings = [
        ('emerald', 'Barga (Tuscany)', 'Casa Zia Franca AirBnB', None,
         'Sat, May 2 &ndash; Thu, May 7', '15:00', '11:00',
         'Via del Giardino, 44, 55051 Barga LU, Italy', None),
        ('blue', 'Rome', 'citizenM Rome Isola Tiberina', '#99566483',
         'Thu, May 7 &ndash; Sun, May 10', '14:00', '11:00',
         "Lungotevere de' Cenci 5-8, Rome, Italy, 00186",
         'Luggage stored at front desk until departure'),
        ('amber', 'Naples', 'Largo Ecce Homo AirBnB', None,
         'Sun, May 10 &ndash; Fri, May 15', '15:00', '10:00',
         "Largo Ecce Homo 31, ex Vico Santa Maria dell'Aiuto 1, Naples, 80134", None),
    ]

    html = ''
    for color, city, name, conf, dates, checkin, checkout, address, note in lodgings:
        conf_html = f'<p class="lodge-conf">Conf: {conf}</p>' if conf else ''
        note_html = f'<p class="text-xs text-gray mt-1" style="font-style:italic">{note}</p>' if note else ''
        html += f'''<div class="card lodge-card lodge-{color}">
            <div class="lodge-sidebar">
                <p class="lodge-city">{city}</p>
                <h3 class="lodge-name">{name}</h3>
                {conf_html}
            </div>
            <div class="lodge-details">
                <div class="lodge-detail">
                    {icon('calendar')}
                    <div>
                        <p class="detail-value">{dates}</p>
                        <div class="text-sm text-gray mt-1">
                            <p>In: {checkin}</p>
                            <p>Out: {checkout}</p>
                            {note_html}
                        </div>
                    </div>
                </div>
                <div class="lodge-detail">
                    {icon('mappin')}
                    <div><p style="font-weight:500;font-size:.875rem;line-height:1.6;color:#1f2937">{address}</p></div>
                </div>
            </div>
        </div>'''
    return html


def build_finances():
    expenses = [
        ('Alamo Car Rental', 514.00, 'Jim'),
        ('Barga AirBnB', 1615.00, 'Geoff'),
        ('Lucca Cooking Class', 1862.50, 'Jim'),
        ('Train: Lucca to Florence', 54.00, 'Logan'),
        ('Florence Best-of Tour', 546.70, 'Jim'),
        ('Train: Pisa to Rome', 233.00, 'Logan'),
        ('Rome citizenM Hotel', 400.00, 'Jim'),
        ('Rome Golf Cart Tour', 532.00, 'Geoff'),
        ('Vatican Tour', 780.00, 'Jim'),
        ('Colosseum Tour', 1203.00, 'Geoff'),
        ('Train: Rome to Naples', 200.00, 'Logan'),
        ('Naples AirBnB', 1622.00, 'Logan'),
        ('Pompeii Bus Tour', 920.00, 'Geoff'),
        ('Capri / Blue Grotto', 967.85, 'Jim'),
        ('Amalfi / Sorrento Tour', 544.45, 'Geoff'),
    ]

    total = sum(c for _, c, _ in expenses)
    per_person = total / 5
    payers = {}
    for _, cost, payer in expenses:
        payers[payer] = payers.get(payer, 0) + cost

    payer_rows = ''
    for name, amount in payers.items():
        payer_rows += f'<div class="payer-row"><span>{name}:</span><span class="payer-amount">${amount:,.2f}</span></div>'

    expense_rows = ''
    for item, cost, payer in expenses:
        badge_class = 'badge-blue' if payer == 'Jim' else ('badge-purple' if payer == 'Geoff' else 'badge-amber')
        expense_rows += f'''<tr>
            <td style="font-weight:500;color:#1f2937">{item}</td>
            <td class="text-right text-gray">${cost:,.2f}</td>
            <td class="text-right text-gray">${cost/5:,.2f}</td>
            <td><span class="badge {badge_class}">{payer}</span></td>
        </tr>'''

    return f'''
    <div class="fin-cards">
        <div class="fin-total">
            <h3>Total Trip Bookings</h3>
            <p class="amount">${total:,.2f}</p>
            <p class="note">*Excluding flights &amp; daily meals</p>
        </div>
        <div class="fin-card">
            <h3>Avg Per Person (5)</h3>
            <p class="amount">${per_person:,.2f}</p>
        </div>
        <div class="fin-card">
            <h3 style="margin-bottom:.5rem">Payer Breakdown</h3>
            {payer_rows}
        </div>
    </div>
    <div class="card">
        <div class="overflow-x">
            <table class="data-table">
                <thead><tr>
                    <th>Item / Booking</th>
                    <th class="text-right">Total Cost</th>
                    <th class="text-right">Cost Ea. (5)</th>
                    <th>Paid By</th>
                </tr></thead>
                <tbody>{expense_rows}</tbody>
            </table>
        </div>
    </div>'''


def build_map():
    regions = [
        ('Tuscany', 'emerald', [
            ('Pisa Airport (Rental Car)', 'Aeroporto Galileo Galilei, 56121 Pisa PI, Italy', 'plane'),
            ('Casa Zia Franca (Base)', 'Via del Giardino, 44, 55051 Barga LU, Italy', 'home'),
            ('Lucca', 'Lucca, Italy', 'mappin'),
            ('Florence (Accademia)', "Galleria dell'Accademia, Florence, Italy", 'mappin'),
        ]),
        ('Rome', 'blue', [
            ('citizenM Hotel (Base)', "Lungotevere de' Cenci 5-8, Rome, Italy, 00186", 'home'),
            ('Vatican & Basilica', 'Vatican City', 'mappin'),
            ('Colosseum', 'Piazza del Colosseo, 1, 00184 Roma RM, Italy', 'mappin'),
            ('Roma Termini (Train)', 'Piazza dei Cinquecento 1, 00185 Rome, Italy', 'train'),
        ]),
        ('Campania (Naples)', 'amber', [
            ('Napoli Centrale (Train)', 'Piazza Giuseppe Garibaldi, 80142 Naples, Italy', 'train'),
            ('AirBnB Largo Ecce Homo (Base)', 'Largo Ecce Homo 31, Naples, Campania 80134, Italy', 'home'),
            ('Pompeii & Herculaneum', 'Pompeii, Italy', 'mappin'),
            ('Capri & Blue Grotto', 'Capri, Italy', 'mappin'),
            ('Amalfi Coast & Sorrento', 'Amalfi, Italy', 'mappin'),
        ]),
    ]

    html = '<p style="color:#6b7280;font-size:.875rem;margin-bottom:1rem">Tap any location to open in Maps</p><div class="map-grid">'
    for region, color, places in regions:
        links = ''
        for name, query, ic in places:
            import urllib.parse
            maps_url = f"https://maps.apple.com/?q={urllib.parse.quote(query)}"
            links += f'''<a href="{maps_url}" class="map-link" target="_blank" rel="noopener">
                <div class="map-link-icon {color}">{icon(ic)}</div>
                <span class="map-link-text">{name}</span>
                <span class="map-link-arrow">&rsaquo;</span>
            </a>'''
        html += f'''<div class="map-group">
            <div class="map-group-header {color}">{region}</div>
            {links}
        </div>'''
    html += '</div>'
    return html


def build_tips():
    return f'''
    <div class="tip-card blue">
        <h3 class="tip-title">{icon('sun')} Weather in May</h3>
        <div class="tip-body">
            <p>May is widely considered one of the best times to visit Italy. Temperatures are generally mild and
            spring-like, warming up steadily as the month progresses.</p>
            <ul class="tip-list">
                <li><strong>Tuscany (North/Central):</strong> Average 60&deg;F - 75&deg;F (15&deg;C - 24&deg;C).</li>
                <li><strong>Rome &amp; Naples (South):</strong> Averages closer to 64&deg;F - 77&deg;F (18&deg;C - 25&deg;C).</li>
                <li><strong>Packing:</strong> "Dress like an onion" (layers). Bring a light jacket for evenings, comfortable
                walking shoes, and a compact umbrella (early May can occasionally bring brief afternoon showers).</li>
            </ul>
        </div>
    </div>

    <div class="tip-card amber">
        <h3 class="tip-title">{icon('train')} Italo Train Luggage Rules (Rome &rarr; Naples)</h3>
        <div class="tip-body">
            <p>You booked Italo 9977. Good news: Italo trains allow you to bring luggage for <strong>free</strong> without
            strict weight limits.</p>
            <ul class="tip-list">
                <li><strong>Smart Class limits:</strong> If you are in "Smart" class, bags must be under <strong>75 x 53 x
                30 cm</strong> (29.5" x 21" x 11.8") to fit in the overhead racks.</li>
                <li><strong>Bigger Bags:</strong> If you have massive suitcases, there are dedicated storage racks at the
                end of each carriage. Try to board early to snag rack space!</li>
                <li><strong>Security:</strong> Always keep a small bag with passports/wallets/valuables on your person or
                right at your seat.</li>
            </ul>
        </div>
    </div>

    <div class="tip-card purple">
        <h3 class="tip-title">{icon('mappin')} citizenM Rome Arrival Info</h3>
        <div class="tip-body">
            <p>The itinerary notes "check on shuttle". <strong>citizenM does not operate its own hotel shuttle</strong>.</p>
            <ul class="tip-list">
                <li><strong>Location:</strong> It's beautifully situated in the historic Jewish Quarter, right on the River
                Tiber, looking out at Isola Tiberina.</li>
                <li><strong>From Termini Station:</strong> Since you arrive by train at 14:33, the easiest group option is
                grabbing a taxi from the official queue out front. It's only a ~4km (10-15 min) drive and should cost
                around &euro;15-&euro;20 total.</li>
                <li><strong>Public Transit option:</strong> Bus 'H' goes directly from Termini and drops you right by the
                hotel in about 19 minutes (&euro;2 per ticket).</li>
            </ul>
        </div>
    </div>'''


def build_page():
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Italy 2026">
    <meta name="theme-color" content="#064e3b">
    <title>Zechella Family Italian Odyssey &mdash; May 2026</title>
    <style>{CSS}</style>
</head>
<body>

<!-- Header -->
<header class="header">
    <div class="header-inner">
        <div>
            <h1>The Zechella Family Italian Odyssey</h1>
            <p class="header-subtitle">{icon('calendar')} May 1 - May 15, 2026</p>
        </div>
        <div class="stat-cards">
            <div class="stat-card"><span class="num">5</span><span class="label">Travelers</span></div>
            <div class="stat-card"><span class="num">15</span><span class="label">Days</span></div>
            <div class="stat-card"><span class="num">3</span><span class="label">Cities</span></div>
        </div>
    </div>
</header>

<!-- CSS-only tab system: radio inputs must be siblings of nav and panels -->
<input type="radio" name="tab" id="tab-timeline" class="tab-input" checked>
<input type="radio" name="tab" id="tab-logistics" class="tab-input">
<input type="radio" name="tab" id="tab-lodging" class="tab-input">
<input type="radio" name="tab" id="tab-finances" class="tab-input">
<input type="radio" name="tab" id="tab-map" class="tab-input">
<input type="radio" name="tab" id="tab-tips" class="tab-input">

<nav class="tab-nav">
    <div class="tab-nav-inner">
        <label for="tab-timeline" class="tab-label lbl-timeline">{icon('calendar')} Daily Itinerary</label>
        <label for="tab-logistics" class="tab-label lbl-logistics">{icon('plane')} Logistics</label>
        <label for="tab-lodging" class="tab-label lbl-lodging">{icon('home')} Lodging</label>
        <label for="tab-finances" class="tab-label lbl-finances">{icon('dollar')} Finances</label>
        <label for="tab-map" class="tab-label lbl-map">{icon('map')} Map View</label>
        <label for="tab-tips" class="tab-label lbl-tips">{icon('info')} Pro Tips</label>
    </div>
</nav>

<div class="tab-panels">
    <div class="panel panel-timeline">{build_timeline()}</div>
    <div class="panel panel-logistics">{build_logistics()}</div>
    <div class="panel panel-lodging">{build_lodging()}</div>
    <div class="panel panel-finances">{build_finances()}</div>
    <div class="panel panel-map">{build_map()}</div>
    <div class="panel panel-tips">{build_tips()}</div>
</div>

</body>
</html>'''


if __name__ == '__main__':
    html = build_page()
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated: {OUTPUT_PATH}")
    print(f"Size: {len(html):,} bytes")

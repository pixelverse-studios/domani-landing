const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = __dirname;
const W = 1440;
const H = 1200;

const c = {
  bg: "#f6f7fb",
  surface: "#ffffff",
  surface2: "#fbfbfe",
  text: "#171521",
  muted: "#696577",
  faint: "#8b8797",
  border: "#e3e0ea",
  border2: "#eeeaf5",
  primary: "#3f00e9",
  primary2: "#9b5cff",
  purpleSoft: "#f1ebff",
  green: "#17845f",
  greenSoft: "#e8f6ef",
  amber: "#9a6a13",
  amberSoft: "#fff3d8",
  red: "#b44732",
  redSoft: "#fff0ed",
  blue: "#286aa9",
  blueSoft: "#e9f3ff",
};

function esc(s) {
  return String(s).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]);
}

function text(x, y, value, opts = {}) {
  const {
    size = 14,
    weight = 500,
    fill = c.text,
    family = "Inter, Arial, sans-serif",
    anchor = "start",
    spacing = 0,
    opacity = 1,
  } = opts;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}" opacity="${opacity}">${esc(value)}</text>`;
}

function rect(x, y, w, h, r = 0, fill = c.surface, stroke = c.border, extra = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
}

function line(x1, y1, x2, y2, stroke = c.border, extra = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
}

function pill(x, y, label, fill = c.purpleSoft, color = c.primary, w) {
  const width = w || Math.max(54, label.length * 7 + 28);
  return `${rect(x, y, width, 28, 14, fill, "none")}
  ${text(x + width / 2, y + 19, label, { size: 12, weight: 800, fill: color, anchor: "middle" })}`;
}

function iconCircle(x, y, label, fill = c.purpleSoft, color = c.primary) {
  return `${rect(x, y, 38, 38, 12, fill, "none")}
  ${text(x + 19, y + 25, label, { size: 15, weight: 900, fill: color, anchor: "middle" })}`;
}

function frame(title, activeTab = "Releases") {
  const nav = [
    ["O", "Overview"],
    ["F", "Feedback"],
    ["W", "Waitlist"],
    ["U", "Users"],
    ["C", "Campaigns"],
    ["R", "Releases"],
  ];
  const side = [
    "Overview",
    "Clients",
    "Websites",
    "Deployments",
    "SEO Health",
    "Agenda",
    "Prospects",
    "Domani",
    "Docs",
  ];
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <circle cx="1170" cy="20" r="320" fill="${c.primary}" opacity="0.045"/>
  <circle cx="260" cy="1180" r="360" fill="${c.primary2}" opacity="0.035"/>
  <rect x="0" y="0" width="260" height="${H}" fill="#fbfbff"/>
  ${line(260, 0, 260, H, c.border)}
  ${text(34, 54, "PixelVerse", { size: 22, weight: 900, family: "Poppins, Arial, sans-serif" })}
  ${text(34, 78, "Dashboard", { size: 12, weight: 700, fill: c.faint, spacing: 1.6 })}
  `;

  side.forEach((label, i) => {
    const y = 122 + i * 48;
    const active = label === "Domani";
    if (active) {
      s += `<rect x="20" y="${y - 26}" width="220" height="40" rx="14" fill="url(#sideGrad)"/>`;
    }
    s += `${text(52, y, label, { size: 14, weight: active ? 850 : 700, fill: active ? "#ffffff" : c.muted })}
    <circle cx="34" cy="${y - 5}" r="5" fill="${active ? "#ffffff" : "#d2cfdb"}"/>`;
  });

  s += `${text(34, 558, "COMING SOON", { size: 11, weight: 900, fill: c.faint, spacing: 1.8 })}
  ${text(52, 598, "Projects", { size: 14, weight: 700, fill: "#aaa5b5" })}
  ${text(52, 646, "Audits", { size: 14, weight: 700, fill: "#aaa5b5" })}
  <rect x="260" y="0" width="1180" height="76" fill="${c.surface}" opacity="0.96"/>
  ${line(260, 76, 1440, 76, c.border)}
  ${text(304, 47, title, { size: 20, weight: 900, family: "Poppins, Arial, sans-serif" })}
  ${rect(1088, 20, 168, 36, 12, "#f5f3fb", c.border2)}
  ${text(1110, 43, "Search dashboard", { size: 13, weight: 650, fill: c.faint })}
  ${rect(1274, 18, 42, 42, 14, c.purpleSoft, "none")}
  ${text(1295, 45, "P", { size: 15, weight: 900, fill: c.primary, anchor: "middle" })}
  <g transform="translate(304 116)">
    <rect width="50" height="50" rx="16" fill="url(#domaniGrad)"/>
    ${text(25, 32, "D", { size: 17, weight: 950, fill: "#ffffff", anchor: "middle" })}
    ${text(68, 21, "Domani", { size: 25, weight: 900, family: "Poppins, Arial, sans-serif" })}
    ${text(68, 46, "App analytics and release operations", { size: 13, weight: 650, fill: c.muted })}
  </g>
  <g transform="translate(304 198)">`;

  let x = 0;
  nav.forEach(([letter, label]) => {
    const w = label === "Releases" ? 116 : label.length * 9 + 48;
    const active = label === activeTab;
    s += `<rect x="${x}" y="0" width="${w}" height="42" rx="14" fill="${active ? c.text : c.surface}" stroke="${active ? c.text : c.border}"/>
      ${text(x + 20, 27, letter, { size: 12, weight: 900, fill: active ? "#ffffff" : c.primary })}
      ${text(x + 42, 27, label, { size: 13, weight: 800, fill: active ? "#ffffff" : c.muted })}`;
    x += w + 10;
  });

  s += `</g>`;
  return s;
}

function defs() {
  return `<defs>
    <linearGradient id="sideGrad" x1="20" y1="0" x2="240" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c.primary}"/>
      <stop offset="1" stop-color="${c.primary2}"/>
    </linearGradient>
    <linearGradient id="domaniGrad" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c.primary}"/>
      <stop offset="1" stop-color="${c.primary2}"/>
    </linearGradient>
  </defs>`;
}

function close() {
  return `${defs()}</svg>`;
}

function metric(x, y, label, value, sub, fill, color) {
  return `${rect(x, y, 218, 112, 20, c.surface, c.border, 'filter="url(#shadow)"')}
  ${iconCircle(x + 18, y + 18, label[0], fill, color)}
  ${text(x + 72, y + 42, value, { size: 27, weight: 950, family: "Poppins, Arial, sans-serif" })}
  ${text(x + 72, y + 66, label, { size: 13, weight: 800, fill: c.muted })}
  ${text(x + 18, y + 93, sub, { size: 12, weight: 650, fill: c.faint })}`;
}

function row(y, version, title, status, date, platform, notes, visibility, statusFill, statusColor) {
  return `<g transform="translate(326 ${y})">
    ${rect(0, 0, 1030, 84, 18, c.surface, c.border2)}
    ${text(24, 35, version, { size: 22, weight: 950, family: "Poppins, Arial, sans-serif" })}
    ${text(24, 58, date, { size: 12, weight: 750, fill: c.faint })}
    ${text(148, 32, title, { size: 16, weight: 850 })}
    ${text(148, 56, notes, { size: 13, weight: 600, fill: c.muted })}
    ${pill(566, 26, status, statusFill, statusColor)}
    ${pill(690, 26, platform, c.blueSoft, c.blue)}
    ${pill(812, 26, visibility, visibility === "Public" ? c.greenSoft : c.purpleSoft, visibility === "Public" ? c.green : c.primary)}
    ${text(990, 51, "Edit", { size: 13, weight: 850, fill: c.primary, anchor: "end" })}
  </g>`;
}

function releasesList() {
  let s = frame("Domani Releases");
  s += `<filter id="shadow"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#1b102d" flood-opacity="0.06"/></filter>
  <g transform="translate(304 272)">
    ${text(0, 0, "Releases", { size: 34, weight: 950, family: "Poppins, Arial, sans-serif" })}
    ${text(0, 30, "Plan, draft, approve, and publish public release notes from one workspace.", { size: 15, weight: 650, fill: c.muted })}
    ${rect(814, -28, 178, 44, 14, c.text, c.text)}
    ${text(842, 0, "New release", { size: 14, weight: 850, fill: "#ffffff" })}
    ${rect(1008, -28, 122, 44, 14, c.surface, c.border)}
    ${text(1038, 0, "Import .md", { size: 14, weight: 850, fill: c.text })}
  </g>
  <g transform="translate(304 338)">
    ${metric(0, 0, "Drafts", "7", "3 need copy review", c.purpleSoft, c.primary)}
    ${metric(242, 0, "Planned", "4", "Next target is Aug 2026", c.amberSoft, c.amber)}
    ${metric(484, 0, "Public", "12", "Visible across app pages", c.greenSoft, c.green)}
    ${metric(726, 0, "Private", "19", "Internal notes only", c.blueSoft, c.blue)}
  </g>
  <g transform="translate(304 486)">
    ${rect(0, 0, 1052, 76, 20, c.surface, c.border)}
    ${rect(22, 18, 320, 40, 13, c.surface2, c.border2)}
    ${text(42, 44, "Search versions or release title", { size: 13, weight: 650, fill: c.faint })}
    ${pill(370, 24, "All", c.text, "#ffffff", 58)}
    ${pill(438, 24, "Draft", c.purpleSoft, c.primary)}
    ${pill(522, 24, "Planning", c.redSoft, c.red)}
    ${pill(626, 24, "Planned", c.amberSoft, c.amber)}
    ${pill(734, 24, "Public", c.greenSoft, c.green)}
    ${pill(936, 24, "Sort: target date", c.surface2, c.muted, 132)}
  </g>
  ${row(590, "1.2", "Smarter evening planning setup", "Planned", "Target Aug 2026", "iOS + Android", "3 public highlights, 1 internal note", "Public", c.amberSoft, c.amber)}
  ${row(692, "1.1", "Changelog and release pages", "Draft", "No date set", "iOS + Android", "Imported from Linear milestone", "Private", c.purpleSoft, c.primary)}
  ${row(794, "1.0.4", "Stability patch summary", "Private", "Released Jun 4", "iOS", "Internal technical log only", "Private", c.blueSoft, c.blue)}
  ${row(896, "1.3", "Android planning polish", "Planning", "Target Oct 2026", "Android", "2 proposed highlights", "Private", c.redSoft, c.red)}
  <g transform="translate(304 1020)">
    ${rect(0, 0, 1052, 86, 22, "#fbfbff", c.border)}
    ${text(26, 34, "Empty, loading, and error states", { size: 17, weight: 900 })}
    ${text(26, 59, "Use this same table shell for skeleton loading, no-results search, and failed fetch recovery.", { size: 13, weight: 650, fill: c.muted })}
  </g>`;
  return s + close();
}

function editorField(x, y, label, value, w = 250) {
  return `${text(x, y, label, { size: 12, weight: 850, fill: c.faint, spacing: 1 })}
  ${rect(x, y + 12, w, 44, 13, c.surface2, c.border2)}
  ${text(x + 16, y + 40, value, { size: 14, weight: 760, fill: c.text })}`;
}

function releaseDetail() {
  let s = frame("Domani Release Detail");
  s += `<g transform="translate(304 272)">
    ${text(0, 0, "Release 1.2", { size: 34, weight: 950, family: "Poppins, Arial, sans-serif" })}
    ${text(0, 30, "Smarter evening planning setup", { size: 15, weight: 700, fill: c.muted })}
    ${pill(536, -24, "Public preview", c.greenSoft, c.green, 118)}
    ${pill(666, -24, "Planned", c.amberSoft, c.amber, 86)}
    ${pill(766, -24, "iOS + Android", c.blueSoft, c.blue, 126)}
    ${rect(910, -30, 104, 44, 14, c.surface, c.border)}
    ${text(944, -2, "Save", { size: 14, weight: 850, fill: c.text })}
    ${rect(1030, -30, 104, 44, 14, c.text, c.text)}
    ${text(1056, -2, "Publish", { size: 14, weight: 850, fill: "#fff" })}
  </g>
  <g transform="translate(304 342)">
    ${rect(0, 0, 350, 306, 22, c.surface, c.border)}
    ${text(24, 36, "Release settings", { size: 18, weight: 900 })}
    ${editorField(24, 70, "VERSION", "1.2", 128)}
    ${editorField(174, 70, "TARGET DATE", "Aug 1, 2026", 150)}
    ${editorField(24, 152, "STATUS", "Planned", 138)}
    ${editorField(184, 152, "VISIBILITY", "Public preview", 140)}
    ${text(24, 244, "Platforms", { size: 12, weight: 850, fill: c.faint, spacing: 1 })}
    ${pill(24, 260, "iOS", c.blueSoft, c.blue, 58)}
    ${pill(90, 260, "Android", c.blueSoft, c.blue, 88)}
    ${pill(188, 260, "Web off", c.surface2, c.faint, 88)}

    ${rect(374, 0, 760, 306, 22, c.surface, c.border)}
    ${text(398, 36, "Public summary", { size: 18, weight: 900 })}
    ${rect(398, 58, 688, 62, 14, c.surface2, c.border2)}
    ${text(416, 84, "We are making the first few nights with Domani easier, with clearer setup prompts", { size: 13, weight: 650, fill: c.muted })}
    ${text(416, 106, "and better guidance for choosing a realistic tomorrow plan.", { size: 13, weight: 650, fill: c.muted })}
    ${text(398, 156, "Highlights", { size: 12, weight: 850, fill: c.faint, spacing: 1 })}
    ${rect(398, 174, 688, 42, 12, "#fbfbfe", c.border2)}
    ${text(416, 201, "Guided first plan", { size: 14, weight: 850 })}
    ${rect(398, 226, 688, 42, 12, "#fbfbfe", c.border2)}
    ${text(416, 253, "Category suggestions", { size: 14, weight: 850 })}
  </g>
  <g transform="translate(304 676)">
    ${rect(0, 0, 706, 328, 22, c.surface, c.border)}
    ${text(24, 38, "Release notes", { size: 18, weight: 900 })}
    ${text(24, 64, "Public-facing notes are edited here before approval.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(24, 90, 658, 64, 16, c.surface2, c.border2)}
    ${pill(44, 108, "1", c.purpleSoft, c.primary, 42)}
    ${text(104, 118, "Guided first plan", { size: 15, weight: 900 })}
    ${text(104, 140, "A calmer walkthrough for choosing your first most important task.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(24, 170, 658, 64, 16, c.surface2, c.border2)}
    ${pill(44, 188, "2", c.purpleSoft, c.primary, 42)}
    ${text(104, 198, "Category suggestions", { size: 15, weight: 900 })}
    ${text(104, 220, "Helpful starter categories without forcing a rigid workflow.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(24, 250, 164, 42, 14, c.text, c.text)}
    ${text(52, 277, "Add highlight", { size: 14, weight: 850, fill: "#fff" })}

    ${rect(732, 0, 402, 328, 22, c.surface, c.border)}
    ${text(756, 38, "Internal log", { size: 18, weight: 900 })}
    ${text(756, 64, "Private notes for build, API, and support context.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(756, 92, 354, 160, 14, "#272331", "#272331")}
    ${text(778, 124, "api: added release_public_view", { size: 13, weight: 650, fill: "#e9e4ff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(778, 154, "db: release_notes.lifecycle_status", { size: 13, weight: 650, fill: "#e9e4ff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(778, 184, "qa: verify platform filters", { size: 13, weight: 650, fill: "#e9e4ff", family: "JetBrains Mono, Menlo, monospace" })}
    ${rect(756, 270, 116, 38, 13, c.surface2, c.border2)}
    ${text(780, 294, "Private", { size: 13, weight: 850, fill: c.muted })}
  </g>`;
  return s + close();
}

function markdownImport() {
  let s = frame("Domani Markdown Import");
  s += `<g transform="translate(304 272)">
    ${text(0, 0, "Import Markdown", { size: 34, weight: 950, family: "Poppins, Arial, sans-serif" })}
    ${text(0, 30, "Create a private release draft from a controlled .md source.", { size: 15, weight: 650, fill: c.muted })}
    ${rect(940, -30, 194, 44, 14, c.text, c.text)}
    ${text(972, -2, "Create private draft", { size: 14, weight: 850, fill: "#fff" })}
  </g>
  <g transform="translate(304 344)">
    ${rect(0, 0, 484, 600, 24, c.surface, c.border)}
    ${text(28, 40, "Source", { size: 19, weight: 900 })}
    ${text(28, 68, "Attach the source document and origin details.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(28, 100, 428, 174, 20, "#fbfbfe", c.border2, 'stroke-dasharray="8 8"')}
    ${text(242, 164, ".md", { size: 28, weight: 950, fill: c.primary, anchor: "middle", family: "Poppins, Arial, sans-serif" })}
    ${text(242, 196, "Drop Markdown file here", { size: 15, weight: 850, anchor: "middle" })}
    ${text(242, 220, "or paste content in the editor", { size: 13, weight: 650, fill: c.muted, anchor: "middle" })}
    ${editorField(28, 314, "SOURCE TYPE", "Linear milestone", 202)}
    ${editorField(254, 314, "REFERENCE", "1.1-changelog", 202)}
    ${editorField(28, 398, "TARGET RELEASE", "Create new 1.1", 202)}
    ${editorField(254, 398, "DEFAULT VISIBILITY", "Private draft", 202)}
    ${text(28, 514, "Import rules", { size: 12, weight: 850, fill: c.faint, spacing: 1 })}
    ${text(28, 544, "Raw source is saved unchanged.", { size: 13, weight: 700, fill: c.muted })}
    ${text(28, 570, "No public note is published until reviewed.", { size: 13, weight: 700, fill: c.muted })}

    ${rect(516, 0, 618, 600, 24, c.surface, c.border)}
    ${text(544, 40, "Markdown preview", { size: 19, weight: 900 })}
    ${rect(544, 70, 562, 470, 18, "#272331", "#272331")}
    ${text(570, 110, "# Domani 1.1 Changelog", { size: 14, weight: 700, fill: "#f6f1ff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 148, "## Scope", { size: 14, weight: 700, fill: "#cbbdff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 178, "- Public changelog page", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 208, "- Coming soon page", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 238, "- Dashboard release editor", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 286, "## Technical notes", { size: 14, weight: 700, fill: "#cbbdff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 316, "- Supabase releases table", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 346, "- Markdown import endpoint", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 394, "## Public draft ideas", { size: 14, weight: 700, fill: "#cbbdff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(570, 424, "- Easier ways to see what changed", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${rect(544, 558, 120, 34, 12, c.purpleSoft, "none")}
    ${text(570, 580, "Valid .md", { size: 13, weight: 850, fill: c.primary })}
  </g>`;
  return s + close();
}

function conversionReview() {
  let s = frame("Domani Conversion Review");
  s += `<g transform="translate(304 272)">
    ${text(0, 0, "Review Converted Draft", { size: 34, weight: 950, family: "Poppins, Arial, sans-serif" })}
    ${text(0, 30, "Compare the source Markdown with editable public notes before saving.", { size: 15, weight: 650, fill: c.muted })}
    ${pill(650, -24, "Private draft", c.purpleSoft, c.primary, 112)}
    ${pill(774, -24, "Needs review", c.amberSoft, c.amber, 112)}
    ${rect(916, -30, 104, 44, 14, c.surface, c.border)}
    ${text(940, -2, "Reject", { size: 14, weight: 850, fill: c.text })}
    ${rect(1034, -30, 100, 44, 14, c.text, c.text)}
    ${text(1056, -2, "Save", { size: 14, weight: 850, fill: "#fff" })}
  </g>
  <g transform="translate(304 344)">
    ${rect(0, 0, 548, 618, 24, c.surface, c.border)}
    ${text(28, 40, "Source Markdown", { size: 19, weight: 900 })}
    ${text(28, 66, "Stored exactly as uploaded.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(28, 94, 492, 488, 18, "#272331", "#272331")}
    ${text(54, 134, "# Domani 1.1 Changelog", { size: 14, weight: 700, fill: "#f6f1ff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 176, "## Scope", { size: 14, weight: 700, fill: "#cbbdff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 206, "- Public changelog page", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 236, "- Coming soon page", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 266, "- Resources nav update", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 314, "## Technical notes", { size: 14, weight: 700, fill: "#cbbdff", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 344, "- Supabase release_public_view", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}
    ${text(54, 374, "- Markdown import endpoint", { size: 14, weight: 650, fill: "#e6e0f5", family: "JetBrains Mono, Menlo, monospace" })}

    ${rect(586, 0, 548, 618, 24, c.surface, c.border)}
    ${text(614, 40, "Generated public draft", { size: 19, weight: 900 })}
    ${text(614, 66, "Edit before approval. Technical details stay private.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(614, 96, 492, 74, 18, c.surface2, c.border2)}
    ${text(636, 126, "See what changed in each Domani release", { size: 16, weight: 900 })}
    ${text(636, 150, "A new release page keeps app updates easier to follow.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(614, 194, 492, 82, 18, "#fbfbfe", c.border2)}
    ${pill(636, 214, "1", c.purpleSoft, c.primary, 42)}
    ${text(692, 224, "Changelog page", { size: 15, weight: 900 })}
    ${text(692, 248, "A version-by-version history of meaningful Domani updates.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(614, 294, 492, 82, 18, "#fbfbfe", c.border2)}
    ${pill(636, 314, "2", c.purpleSoft, c.primary, 42)}
    ${text(692, 324, "Coming soon page", { size: 15, weight: 900 })}
    ${text(692, 348, "A preview of planned releases by version and platform.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(614, 394, 492, 82, 18, "#fbfbfe", c.border2)}
    ${pill(636, 414, "3", c.purpleSoft, c.primary, 42)}
    ${text(692, 424, "Resources navigation", { size: 15, weight: 900 })}
    ${text(692, 448, "FAQ, Blog, Changelog, and related links grouped together.", { size: 13, weight: 650, fill: c.muted })}
    ${rect(614, 510, 148, 42, 14, c.surface, c.border)}
    ${text(642, 537, "Edit draft", { size: 14, weight: 850, fill: c.text })}
    ${rect(778, 510, 178, 42, 14, c.text, c.text)}
    ${text(806, 537, "Approve notes", { size: 14, weight: 850, fill: "#fff" })}
  </g>`;
  return s + close();
}

async function write(name, svg) {
  const svgPath = path.join(OUT, `${name}.svg`);
  const pngPath = path.join(OUT, `${name}.png`);
  fs.writeFileSync(svgPath, svg);
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  console.log(`${name}.svg`);
  console.log(`${name}.png`);
}

(async () => {
  await write("dashboard-releases-list", releasesList());
  await write("dashboard-release-detail", releaseDetail());
  await write("dashboard-markdown-import", markdownImport());
  await write("dashboard-conversion-review", conversionReview());
})();

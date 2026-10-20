// Each field: [key, label, unit, allowNegative?]. Each output: [label, value, unit].

const PI = Math.PI;
const calculators = [
  {
    id: "torque", group: "Power and motion", name: "Torque", desc: "Turning effect of a force applied at a distance from the pivot.",
    formula: "T = F × r", fields: [["F", "Force", "N"], ["r", "Perpendicular distance", "m"]],
    out: v => [["Torque", v.F * v.r, "N·m"]]
  },
  {
    id: "power", group: "Power and motion", name: "Power from torque and speed", desc: "Power transmitted by a rotating shaft.",
    formula: "P = 2π × N × T / 60", fields: [["N", "Speed", "rpm"], ["T", "Torque", "N·m"]],
    out: v => { const P = 2 * PI * v.N * v.T / 60; return [["Power", P, "W"], ["Power", P / 1000, "kW"], ["Power", P / 745.7, "hp"]]; }
  },
  {
    id: "torque-from-power", group: "Power and motion", name: "Torque from power", desc: "Torque a motor delivers at a given power and speed.",
    formula: "T = 60 × P / (2π × N)", fields: [["P", "Power", "kW"], ["N", "Speed", "rpm"]],
    out: v => [["Torque", 60 * v.P * 1000 / (2 * PI * v.N), "N·m"]]
  },
  {
    id: "flywheel", group: "Power and motion", name: "Flywheel energy", desc: "Kinetic energy stored in a rotating mass.",
    formula: "E = ½ × I × ω², ω = 2πN / 60", fields: [["I", "Moment of inertia", "kg·m²"], ["N", "Speed", "rpm"]],
    out: v => { const w = 2 * PI * v.N / 60, E = 0.5 * v.I * w * w; return [["Angular speed", w, "rad/s"], ["Energy", E, "J"]]; }
  },
  {
    id: "efficiency", group: "Power and motion", name: "Efficiency", desc: "Ratio of useful output power to input power.",
    formula: "η = Output / Input × 100", fields: [["o", "Output power", "W"], ["i", "Input power", "W"]],
    out: v => [["Efficiency", v.o / v.i * 100, "%"], ["Power lost", v.i - v.o, "W"]]
  },

  {
    id: "belt", group: "Drives", name: "Belt drive speed", desc: "Driven pulley speed and belt speed, assuming no slip.",
    formula: "N₂ = N₁ × D₁ / D₂,  v = π × D₁ × N₁ / 60000",
    fields: [["N1", "Driver speed", "rpm"], ["D1", "Driver diameter", "mm"], ["D2", "Driven diameter", "mm"]],
    out: v => [["Driven speed", v.N1 * v.D1 / v.D2, "rpm"], ["Belt speed", PI * v.D1 * v.N1 / 60000, "m/s"]]
  },
  {
    id: "belt-length", group: "Drives", name: "Open belt length", desc: "Length of an open belt around two pulleys.",
    formula: "L = π(D₁ + D₂)/2 + 2C + (D₁ − D₂)² / 4C",
    fields: [["D1", "Large pulley diameter", "mm"], ["D2", "Small pulley diameter", "mm"], ["C", "Centre distance", "mm"]],
    out: v => [["Belt length", PI * (v.D1 + v.D2) / 2 + 2 * v.C + (v.D1 - v.D2) ** 2 / (4 * v.C), "mm"]]
  },
  {
    id: "gear", group: "Drives", name: "Gear pair", desc: "Output speed and ratio for a pair of meshing gears.",
    formula: "N₂ = N₁ × Z₁ / Z₂,  ratio = Z₂ / Z₁",
    fields: [["N1", "Driver speed", "rpm"], ["Z1", "Driver teeth", "teeth"], ["Z2", "Driven teeth", "teeth"]],
    out: v => [["Driven speed", v.N1 * v.Z1 / v.Z2, "rpm"], ["Gear ratio", v.Z2 / v.Z1, ":1"]]
  },

  {
    id: "stress", group: "Strength of materials", name: "Direct stress", desc: "Average stress in a member under axial load.",
    formula: "σ = F / A", fields: [["F", "Axial force", "N"], ["A", "Cross-section area", "mm²"]],
    out: v => [["Stress", v.F / v.A, "MPa"]]
  },
  {
    id: "elongation", group: "Strength of materials", name: "Elongation of a bar", desc: "Change in length of a bar under axial load.",
    formula: "δ = F × L / (A × E)", fields: [["F", "Axial force", "N"], ["L", "Original length", "mm"], ["A", "Cross-section area", "mm²"], ["E", "Young’s modulus", "GPa"]],
    out: v => { const d = v.F * v.L / (v.A * v.E * 1000); return [["Elongation", d, "mm"], ["Stress", v.F / v.A, "MPa"], ["Strain", d / v.L, ""]]; }
  },
  {
    id: "fos", group: "Strength of materials", name: "Factor of safety", desc: "How much stronger the material is than the stress it carries.",
    formula: "FoS = Strength / Working stress", fields: [["S", "Yield or ultimate strength", "MPa"], ["s", "Working stress", "MPa"]],
    out: v => [["Factor of safety", v.S / v.s, ""]]
  },
  {
    id: "shaft", group: "Strength of materials", name: "Solid shaft diameter", desc: "Minimum diameter of a solid round shaft under pure torsion.",
    formula: "d = (16 × T / (π × τ))^(1/3)", fields: [["T", "Torque", "N·m"], ["t", "Allowable shear stress", "MPa"]],
    out: v => [["Shaft diameter", Math.cbrt(16 * v.T * 1000 / (PI * v.t)), "mm"]]
  },
  {
    id: "beam", group: "Strength of materials", name: "Simply supported beam", desc: "Centre point load on a beam resting on two supports.",
    formula: "M = F×L/4,  σ = M×c / I,  δ = F×L³ / (48×E×I)",
    fields: [["F", "Load at centre", "N"], ["L", "Span", "mm"], ["E", "Young’s modulus", "GPa"], ["I", "Second moment of area", "mm⁴"], ["c", "Distance to outer fibre", "mm"]],
    out: v => { const M = v.F * v.L / 4; return [["Maximum moment", M / 1000, "N·m"], ["Bending stress", M * v.c / v.I, "MPa"], ["Maximum deflection", v.F * v.L ** 3 / (48 * v.E * 1000 * v.I), "mm"]]; }
  },
  {
    id: "spring", group: "Strength of materials", name: "Helical spring", desc: "Stiffness and force of a round-wire compression spring.",
    formula: "k = G × d⁴ / (8 × D³ × n),  F = k × x",
    fields: [["G", "Shear modulus", "GPa"], ["d", "Wire diameter", "mm"], ["D", "Mean coil diameter", "mm"], ["n", "Active coils", ""], ["x", "Compression", "mm"]],
    out: v => { const k = v.G * 1000 * v.d ** 4 / (8 * v.D ** 3 * v.n); return [["Stiffness", k, "N/mm"], ["Force", k * v.x, "N"]]; }
  },
  {
    id: "bolt", group: "Strength of materials", name: "Bolt tightening torque", desc: "Torque needed to reach a target bolt preload.",
    formula: "T = K × d × F", fields: [["K", "Nut factor (about 0.2)", ""], ["d", "Bolt diameter", "mm"], ["F", "Preload", "N"]],
    out: v => [["Tightening torque", v.K * v.d / 1000 * v.F, "N·m"]]
  },

  {
    id: "turning", group: "Manufacturing", name: "Turning: speed and time", desc: "Spindle speed, feed rate and machining time on a lathe.",
    formula: "N = 1000×V / (π×D),  feed = f × N,  t = L / (f × N)",
    fields: [["V", "Cutting speed", "m/min"], ["D", "Workpiece diameter", "mm"], ["f", "Feed", "mm/rev"], ["L", "Length of cut", "mm"]],
    out: v => { const N = 1000 * v.V / (PI * v.D); return [["Spindle speed", N, "rpm"], ["Feed rate", v.f * N, "mm/min"], ["Machining time", v.L / (v.f * N), "min"]]; }
  },

  {
    id: "expansion", group: "Thermal and fluids", name: "Thermal expansion", desc: "Change in length when temperature changes.",
    formula: "ΔL = α × L × ΔT", fields: [["a", "Expansion coefficient", "×10⁻⁶ /°C"], ["L", "Original length", "mm"], ["T", "Temperature change", "°C", true]],
    out: v => [["Change in length", v.a * 1e-6 * v.L * v.T, "mm"]]
  },
  {
    id: "conduction", group: "Thermal and fluids", name: "Heat conduction", desc: "Steady heat flow through a flat wall.",
    formula: "Q = k × A × ΔT / L", fields: [["k", "Thermal conductivity", "W/m·K"], ["A", "Area", "m²"], ["T", "Temperature difference", "K"], ["L", "Wall thickness", "m"]],
    out: v => [["Heat flow", v.k * v.A * v.T / v.L, "W"]]
  },
  {
    id: "cylinder", group: "Thermal and fluids", name: "Hydraulic cylinder force", desc: "Push force from fluid pressure on a piston.",
    formula: "F = P × A,  A = π × D² / 4", fields: [["P", "Pressure", "bar"], ["D", "Piston diameter", "mm"]],
    out: v => { const A = PI * v.D ** 2 / 4; return [["Piston area", A, "mm²"], ["Force", v.P * 0.1 * A / 1000, "kN"]]; }
  }
];

const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString(undefined, { maximumSignificantDigits: 6 });
let current = calculators[0];
let last = null; // latest calculation, sent to Gemma for explanation

const ic = p => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const icons = {
  "Power and motion": ic('<circle cx="24" cy="24" r="13"/><circle cx="24" cy="24" r="3"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6"/>'),
  "Drives": ic('<circle cx="14" cy="24" r="8"/><circle cx="36" cy="24" r="5"/><path d="M14 16l22 3M14 32l22-3"/>'),
  "Strength of materials": ic('<path d="M5 30h38M10 30v8M38 30v8M24 8v15M18 18l6 6 6-6"/>'),
  "Manufacturing": ic('<rect x="6" y="12" width="36" height="11" rx="2"/><path d="M24 23v14M17 37h14"/>'),
  "Thermal and fluids": ic('<path d="M24 7c7 8 11 13 11 20a11 11 0 0 1-22 0c0-7 4-12 11-20z"/>')
};
const groups = [...new Set(calculators.map(c => c.group))];
$("count").textContent = calculators.length;
$("cat-grid").innerHTML = groups.map(g => {
  const list = calculators.filter(c => c.group === g);
  return `<button type="button" class="cat" data-group="${g}">${icons[g]}<h3>${g}</h3><p>${list.length} calculators</p><small>${list.map(c => c.name).join(", ")}</small></button>`;
}).join("");
$("cat-grid").addEventListener("click", e => {
  const b = e.target.closest(".cat");
  if (!b) return;
  show(calculators.find(c => c.group === b.dataset.group).id);
  $("tool").scrollIntoView();
});

// Build the sidebar list and the mobile dropdown.
let lastGroup = "", navHtml = "", selHtml = "";
calculators.forEach(c => {
  if (c.group !== lastGroup) {
    if (lastGroup) selHtml += "</optgroup>";
    navHtml += `<h3>${c.group}</h3>`;
    selHtml += `<optgroup label="${c.group}">`;
    lastGroup = c.group;
  }
  navHtml += `<button type="button" data-id="${c.id}">${c.name}</button>`;
  selHtml += `<option value="${c.id}">${c.name}</option>`;
});
$("calc-list").innerHTML = navHtml;
$("calc-select").innerHTML = selHtml + "</optgroup>";

function show(id) {
  current = calculators.find(c => c.id === id) || calculators[0];
  $("calc-icon").innerHTML = icons[current.group];
  $("calc-crumb").textContent = current.group;
  $("calc-title").textContent = current.name;
  $("calc-desc").textContent = current.desc;
  $("calc-formula").textContent = current.formula;
  $("calc-select").value = current.id;
  document.querySelectorAll("#calc-list button").forEach(b => b.classList.toggle("active", b.dataset.id === current.id));
  $("fields").innerHTML = current.fields.map(([key, label, unit]) =>
    `<div class="field"><label for="f-${key}">${label} <span>${unit ? "(" + unit + ")" : ""}</span></label>` +
    `<input id="f-${key}" type="number" step="any" inputmode="decimal"></div>`).join("");
  clearOutput();
  history.replaceState(null, "", "#" + current.id);
}

function clearOutput() {
  $("error").hidden = true;
  $("result").hidden = true;
  $("ai-output").hidden = true;
  $("ai-status").textContent = "";
  last = null;
}

$("calc-form").addEventListener("submit", e => {
  e.preventDefault();
  clearOutput();
  const v = {};
  for (const [key, label, unit, allowNeg] of current.fields) {
    const raw = $("f-" + key).value.trim();
    const n = Number(raw);
    if (raw === "" || !Number.isFinite(n) || (!allowNeg && n <= 0)) {
      $("error").textContent = allowNeg
        ? `Enter a number for “${label}”.`
        : `Enter a number greater than 0 for “${label}”.`;
      $("error").hidden = false;
      $("f-" + key).focus();
      return;
    }
    v[key] = n;
  }
  const rows = current.out(v);
  $("result-table").innerHTML = rows.map(([label, value, unit]) =>
    `<tr><td>${label}</td><td>${fmt(value)}</td><td>${unit}</td></tr>`).join("");
  $("working").textContent = current.fields
    .map(([key, label, unit]) => `${label} = ${fmt(v[key])}${unit ? " " + unit : ""}`).join(", ");
  $("result").hidden = false;
  last = {
    name: current.name, formula: current.formula,
    inputs: current.fields.map(([k, l, u]) => `${l} = ${v[k]}${u ? " " + u : ""}`).join("; "),
    results: rows.map(([l, val, u]) => `${l} = ${fmt(val)}${u ? " " + u : ""}`).join("; ")
  };
});

$("reset").addEventListener("click", () => {
  $("calc-form").reset();
  clearOutput();
});
$("calc-list").addEventListener("click", e => { if (e.target.dataset.id) show(e.target.dataset.id); });
$("calc-select").addEventListener("change", e => show(e.target.value));
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (calculators.some(c => c.id === h)) show(h); });

show(location.hash.slice(1));

// Paste your Google AI Studio API key between the quotes below.
// Warning: a key in front-end JavaScript is visible to visitors. Use a backend for public deployment.
const GEMINI_API_KEY = "";
const GEMMA_MODEL = "gemma-4-26b-a4b-it";

// ---- AI explanation (Gemma through the Gemini API) ----
// The result is always calculated above in JavaScript. The AI only explains it.

$("explain").addEventListener("click", async () => {
  const status = $("ai-status"), out = $("ai-output"), btn = $("explain");
  const key = GEMINI_API_KEY.trim();
  status.className = "ai-status";
  if (!last) {
    status.textContent = "Calculate a result first.";
    return;
  }
  if (!key || key === "PASTE_YOUR_GOOGLE_API_KEY_HERE") {
    status.textContent = "Google Gemma is not connected yet. Add your Google API key in script.js.";
    status.className = "ai-status bad";
    return;
  }

  const prompt =
    "Explain this mechanical engineering calculation to a student in under 120 words. " +
    "Use short numbered steps: what each value means, the formula with the numbers put in, and what the answer tells us. " +
    "Do not change the given result. Plain text only, no markdown.\n" +
    `Calculator: ${last.name}\nFormula: ${last.formula}\nInputs: ${last.inputs}\nResult: ${last.results}`;

  btn.disabled = true; out.hidden = true;
  status.textContent = "Getting explanation from Google Gemma…";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMMA_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 }
        })
      }
    );
    if (!res.ok) {
      const msg = res.status === 400 || res.status === 403 ? "The API key was not accepted. Check it and try again."
        : res.status === 429 ? "Too many requests. Wait a minute and try again."
          : `The API returned an error (HTTP ${res.status}).`;
      throw new Error(msg);
    }
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.filter(p => !p.thought && p.text).map(p => p.text).join("").replace(/\*\*/g, "").trim();
    if (!text) throw new Error("The model sent back no text. Try again.");
    out.textContent = text; out.hidden = false;
    status.textContent = `Explanation by ${GEMMA_MODEL}.`;
  } catch (err) {
    status.textContent = err instanceof TypeError ? "Could not reach the Gemini API. Check your internet connection." : err.message;
    status.className = "ai-status bad";
  } finally {
    btn.disabled = false;
  }
});
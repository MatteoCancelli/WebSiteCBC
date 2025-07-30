async function fetchData() {
  const response = await fetch("/json/instruments.json");
  const data = await response.json();
  return data;
}

function normalizePath(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return "/" + path;
}

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSection(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p3 = polarToCartesian(cx, cy, rInner, endAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArc = (endAngle - startAngle + 360) % 360 > 180 ? 1 : 0;

  return `
    M ${p1.x},${p1.y}
    A ${rOuter},${rOuter} 0 ${largeArc},1 ${p2.x},${p2.y}
    L ${p3.x},${p3.y}
    A ${rInner},${rInner} 0 ${largeArc},0 ${p4.x},${p4.y}
    Z
  `;
}

function writeLabel(
  svgGroup,
  cx,
  cy,
  rInner,
  rOuter,
  startAngle,
  endAngle,
  name,
  abbreviations,
  svgPixelWidth
) {
  const fontSizePx =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--text-font-size"
      )
    ) || 22;
  const labelAngle = (startAngle + endAngle) / 2;
  const labelPos = polarToCartesian(
    cx,
    cy,
    (rInner + rOuter) / 2,
    labelAngle % 360
  );
  const arcLength =
    (((endAngle - startAngle + 360) % 360) *
      Math.PI *
      ((rOuter + rInner) / 2)) /
    180;
  const scaleFactor = svgPixelWidth / 1272;
  const realArcLength = arcLength * scaleFactor;
  const arcHeight = (rOuter - rInner) * scaleFactor;

  const approxTextWidth =
    Math.max(...name.split(" ").map((w) => w.length)) * fontSizePx * 0.6;
  const approxTextHeight = name.split(" ").length * fontSizePx * 1.6;

  let labelLines;
  if (realArcLength <= approxTextWidth || arcHeight <= approxTextHeight) {
    let approxABBRWidth = abbreviations[1].length * fontSizePx * 0.6;
    let approxABBRHeight = abbreviations[1].length * fontSizePx * 1.6;
    if (realArcLength > approxABBRWidth || arcHeight > approxABBRHeight) {
      labelLines = [abbreviations[1]];
    } else {
      labelLines = [abbreviations[0]];
    }
  } else {
    labelLines = name.split(" ");
  }

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", labelPos.x);
  text.setAttribute("y", labelPos.y);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");

  labelLines.forEach((line, i) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    tspan.setAttribute("x", labelPos.x);
    tspan.setAttribute("dy", i === 0 ? "0" : "1.2em");
    tspan.textContent = line;
    text.appendChild(tspan);
  });

  svgGroup.appendChild(text);
}

function setupModal() {
  let modal = document.getElementById("instrument-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "instrument-modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const close = document.createElement("span");
    close.className = "close-button";
    close.innerHTML = "&times;";
    close.onclick = () => {
      const audio = document.getElementById("modal-instrument-audio");
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      modal.style.display = "none";
    };

    const title = document.createElement("h2");
    title.id = "modal-instrument-title";

    const img = document.createElement("img");
    img.id = "modal-instrument-image";
    img.style.maxWidth = "100%";

    const audio = document.createElement("audio");
    audio.id = "modal-instrument-audio";
    audio.controls = false;
    audio.style.display = "none";

    const button = document.createElement("button");
    button.id = "modal-instrument-button";
    button.textContent = "Scopri il corso!";

    modalContent.append(close, img, title, button, audio);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.onclick = (event) => {
      if (event.target === modal) {
        const audio = document.getElementById("modal-instrument-audio");
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        modal.style.display = "none";
      }
    };
  }

  return modal;
}

function showInstrumentModal(instrument) {
  const modal = setupModal();

  document.getElementById("modal-instrument-title").textContent =
    instrument.name;
  const img = document.getElementById("modal-instrument-image");
  img.src = normalizePath(instrument.pic);
  img.onclick = () => {
    const audio = document.getElementById("modal-instrument-audio");
    audio.currentTime = 0;
    audio.play();
  };

  const audio = document.getElementById("modal-instrument-audio");
  if (instrument.audio?.trim()) {
    audio.src = normalizePath(instrument.audio);
    audio.style.display = "block";
  } else {
    audio.removeAttribute("src");
    audio.style.display = "none";
  }

  audio.currentTime = 0;
  audio.play();

  const button = document.getElementById("modal-instrument-button");
  button.onclick = () => {
    window.location.href = `corso?id=${instrument.link}`;
  };

  modal.style.display = "block";
}

function renderSections(
  instruments,
  svg,
  cx,
  cy,
  rowDimensions,
  svgPixelWidth
) {
  const validInstruments = instruments.filter(
    (i) => i.startAngle !== "" && i.endAngle !== "" && i.rowNumber !== ""
  );

  setupModal();

  validInstruments.forEach((instrument) => {
    const rowIndex = parseInt(instrument.rowNumber) - 1;
    if (rowIndex < 0 || rowIndex >= rowDimensions.length) return;

    const { rInner, rOuter } = rowDimensions[rowIndex];
    const startAngle = parseFloat(instrument.startAngle);
    const endAngle = parseFloat(instrument.endAngle);
    if (isNaN(startAngle) || isNaN(endAngle)) return;

    const pathData = describeSection(
      cx,
      cy,
      rOuter,
      rInner,
      startAngle % 360,
      endAngle % 360
    );
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "section");
    path.setAttribute("d", pathData);

    path.addEventListener("click", () => showInstrumentModal(instrument));

    svg.appendChild(path);

    writeLabel(
      svg,
      cx,
      cy,
      rInner,
      rOuter,
      startAngle,
      endAngle,
      instrument.name,
      instrument.abbreviations,
      svgPixelWidth
    );
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  const svg =
    document.getElementById("instrument-map") ||
    document.getElementById("chart");
  if (!svg) return;

  const bbox = svg.getBoundingClientRect();
  const svgPixelWidth = bbox.width;
  const cx = 500;
  const cy = 500;
  const rowDimensions = [
    { rInner: 50, rOuter: 150 },
    { rInner: 150, rOuter: 260 },
    { rInner: 260, rOuter: 375 },
    { rInner: 375, rOuter: 500 },
  ];

  try {
    const instruments = await fetchData();
    svg.innerHTML = "";
    renderSections(instruments, svg, cx, cy, rowDimensions, svgPixelWidth);
  } catch (err) {
    console.error("Errore durante il caricamento degli strumenti:", err);
  }
});

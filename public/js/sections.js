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

function preloadInstrumentAudio(instrument) {
  if (!instrument.audio || instrument.audio.trim() === "") return null;

  const audioId = `audio-${instrument.abbreviations[0]}`;
  let audio = document.getElementById(audioId);

  if (!audio) {
    audio = document.createElement("audio");
    audio.id = audioId;
    audio.src = normalizePath(instrument.audio);
    audio.preload = "auto";
    document.body.appendChild(audio);
  }

  return audioId;
}

function preloadInstrumentAudios(instruments) {
  const audioMap = {};
  instruments.forEach((instrument) => {
    const audioId = preloadInstrumentAudio(instrument);
    if (audioId) {
      audioMap[instrument.abbreviations[0]] = audioId;
    }
  });
  return audioMap;
}

function createModalCloseButton(modal) {
  const closeButtonRow = document.createElement("div");

  const closeButton = document.createElement("span");
  closeButton.className = "close-button";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = function () {
    modal.style.display = "none";
    const modalAudio = document.getElementById("modal-instrument-audio");
    if (modalAudio && !modalAudio.paused) {
      modalAudio.pause();
      modalAudio.currentTime = 0;
    }
  };

  closeButtonRow.appendChild(closeButton);
  return closeButtonRow;
}

function createModalimage() {
  const modalImage = document.createElement("img");
  modalImage.id = "modal-instrument-image";
  modalImage.style.cursor = "pointer";
  modalImage.alt = "Instrument Image";
  modalImage.addEventListener("click", () => {
    const audio = document.getElementById("modal-instrument-audio");
    if (audio?.src) {
      audio.currentTime = 0;
      audio.play();
    }
  });
  return modalImage;
}

function createModalTitle() {
  const modalTitle = document.createElement("h2");
  modalTitle.id = "modal-instrument-title";
  return modalTitle;
}

function createModalButton() {
  const modalButton = document.createElement("button");
  modalButton.id = "modal-instrument-button";
  modalButton.textContent = "Scopri il corso!";
  return modalButton;
}

function createModalAudio() {
  const modalAudio = document.createElement("audio");
  modalAudio.id = "modal-instrument-audio";
  modalAudio.controls = true;
  modalAudio.style.display = "none";
  return modalAudio;
}

function setupModal() {
  let modal = document.getElementById("instrument-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "instrument-modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    modalContent.appendChild(createModalCloseButton(modal));
    modalContent.appendChild(createModalimage());
    modalContent.appendChild(createModalTitle());
    modalContent.appendChild(createModalButton());
    modalContent.appendChild(createModalAudio());
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";

        const modalAudio = document.getElementById("modal-instrument-audio");
        if (modalAudio && !modalAudio.paused) {
          modalAudio.pause();
          modalAudio.currentTime = 0;
        }
      }
    };
  }

  return modal;
}

function createPreloadContainer() {
  let preloadDiv = document.getElementById("instrument-images-preload");
  if (!preloadDiv) {
    preloadDiv = document.createElement("div");
    preloadDiv.id = "instrument-images-preload";
    preloadDiv.style.display = "none";
    document.body.appendChild(preloadDiv);
  }
  return preloadDiv;
}

function preloadInstrumentImage(instrument, preloadDiv) {
  if (!instrument.pic || instrument.pic.trim() === "") {
    return null;
  }

  const imgId = `img-${instrument.abbreviations[0]}`;

  let img = document.getElementById(imgId);
  if (!img) {
    img = document.createElement("img");
    img.id = imgId;
    img.alt = instrument.name;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "300px";
    img.src = normalizePath(instrument.pic);

    
    preloadDiv.appendChild(img);
  }

  return imgId;
}

function preloadInstrumentImages(instruments) {
  const preloadDiv = createPreloadContainer();
  const imageMap = {};

  instruments.forEach((instrument) => {
    const imgId = preloadInstrumentImage(instrument, preloadDiv);
    if (imgId) {
      imageMap[instrument.abbreviations[0]] = imgId;
    }
  });

  return imageMap;
}

function showInstrumentModal(instrument, imageMap, audioMap) {
  const modal = document.getElementById("instrument-modal");
  const modalImage = document.getElementById("modal-instrument-image");
  const modalTitle = document.getElementById("modal-instrument-title");
  const modalButton = document.getElementById("modal-instrument-button");
  const modalAudio = document.getElementById("modal-instrument-audio");

  modalTitle.textContent = instrument.name;

  const abbreviation = instrument.abbreviations[0];

  // Imposta immagine se presente
  if (instrument.pic?.trim() && imageMap[abbreviation]) {
    const originalImg = document.getElementById(imageMap[abbreviation]);
    modalImage.src = originalImg.src;
    modalImage.style.display = "block";
  } else {
    modalImage.style.display = "none";
  }

  // Rimuove eventuali GIF precedenti
  document.querySelectorAll(".tap-gif-overlay").forEach((el) => el.remove());

  const imageWrapper = modalImage.parentElement;
  imageWrapper.style.position = "relative";
  modalImage.style.position = "relative";

  // Clona l’immagine per rimuovere vecchi listener
  const newModalImage = modalImage.cloneNode(true);
  newModalImage.id = "modal-instrument-image"; // mantieni l’id per i riferimenti
  modalImage.replaceWith(newModalImage);

  // Aggiungi listener che fa ripartire l’audio
  newModalImage.addEventListener("click", () => {
    document.querySelectorAll(".tap-gif-overlay").forEach((el) => el.remove());
    newModalImage.style.opacity = 0.7;
    setTimeout(() => (newModalImage.style.opacity = 1), 150);
    if (modalAudio?.src) {
      modalAudio.pause(); // aggiunta: se è già in esecuzione
      modalAudio.currentTime = 0;
      modalAudio.play();
    }
  });

  // Mostra GIF "tap here"
  newModalImage.onload = () => {
    const tapGif = document.createElement("img");
    tapGif.src = normalizePath("gif/tap-here.png");
    tapGif.classList.add("tap-gif-overlay");

    const imageHeight = newModalImage.offsetHeight;
    tapGif.style.width = `${imageHeight}px`;

    imageWrapper.appendChild(tapGif);
  };

  // Forza onload se immagine è già caricata
  if (newModalImage.complete) {
    newModalImage.onload();
  }

  // Imposta audio
  if (instrument.audio?.trim() && audioMap[abbreviation]) {
    const audioEl = document.getElementById(audioMap[abbreviation]);
    modalAudio.src = audioEl.src;
  } else {
    modalAudio.removeAttribute("src");
  }

  // Pulsante "Vai allo strumento"
  modalButton.onclick = () => {
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

  const imageMap = preloadInstrumentImages(validInstruments);
  const audioMap = preloadInstrumentAudios(validInstruments);

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
    const group = document.createElementNS("http://www.w3.org/2000/svg", "a");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "section");
    path.setAttribute("d", pathData);

    path.addEventListener("click", () => {
      showInstrumentModal(instrument, imageMap, audioMap);
    });

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

// Inizializzazione finale: fetch dei dati e rendering
window.addEventListener("DOMContentLoaded", async () => {
  const svg = document.getElementById("instrument-map");
  if (!svg) return;

  const cx = 300; // centro x
  const cy = 300; // centro y
  const svgPixelWidth = svg.clientWidth || 600;

  const rowDimensions = [
    { rInner: 190, rOuter: 240 },
    { rInner: 130, rOuter: 185 },
    { rInner: 70, rOuter: 125 },
  ];

  try {
    const instruments = await fetchData();
    renderSections(instruments, svg, cx, cy, rowDimensions, svgPixelWidth);
  } catch (error) {
    console.error("Errore durante il caricamento degli strumenti:", error);
  }
});

async function drawSections() {
  const instruments = await fetchData();
  const svg = document.getElementById("chart");
  svg.innerHTML = "";

  const bbox = svg.getBoundingClientRect();
  const svgPixelWidth = bbox.width;

  const cx = 500,
    cy = 500; // viewBox coords
  const rowDimensions = [
    { rInner: 50, rOuter: 150 },
    { rInner: 150, rOuter: 260 },
    { rInner: 260, rOuter: 375 },
    { rInner: 375, rOuter: 500 },
  ];

  renderSections(instruments, svg, cx, cy, rowDimensions, svgPixelWidth);
}

window.addEventListener("DOMContentLoaded", drawSections);
window.addEventListener("resize", () => {
  if (document.getElementById("chart")) drawSections();
});

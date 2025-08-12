function loadNavbar(id, path) {
  fetch(path)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".testimonianza");
  let current = 0;

  function showNextItem() {
    items[current].classList.remove("visibile");
    current = (current + 1) % items.length;
    setTimeout(() => {
      items[current].classList.add("visibile");
    }, 1000);
    setTimeout(showNextItem, 6000);
  }

  setTimeout(showNextItem, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".open-image").forEach(btn => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-img");
      document.getElementById("modalImage").src = imgSrc;
    });
  });
});

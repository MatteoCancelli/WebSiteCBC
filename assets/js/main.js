function loadNavbar(id, path) {
  fetch(path)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    });
}

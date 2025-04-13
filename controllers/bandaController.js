export const mostraHome = (req, res) => {
    res.render("banda/index", {
      title: "Corpo Bandistico di Castelcovati",
      navbar: "partials/navbar-banda",
    });
  };
  
  export const mostraEventi = (req, res) => {
    res.render("banda/eventi", {
      title: "Eventi",
      navbar: "partials/navbar-banda",
    });
  };
export const mostraHome = (req, res) => {
    res.render("banda/index", {
      title: "Corpo Bandistico di Castelcovati",
      head: "partials/head-banda",
      navbar: "partials/navbar-banda",
    });
  };
  
  export const mostraEventi = (req, res) => {
    res.render("banda/eventi", {
      title: "Eventi",
      head: "partials/head-banda",
      navbar: "partials/navbar-banda",
    });
  };
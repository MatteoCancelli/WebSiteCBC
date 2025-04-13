export const mostraHome = (req, res) => {
    res.render("accademia/index", {
      title: "Accademia Musicale",
      navbar: "partials/navbar-accademia",
    });
  };
  
  export const mostraCorsi = (req, res) => {
    res.render("accademia/corsi", {
      title: "Corsi",
      navbar: "partials/navbar-accademia",
    });
  };
  
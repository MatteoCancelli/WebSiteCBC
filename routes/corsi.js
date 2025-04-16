// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');

// const corsiPath = path.join(__dirname, '../corsi.json');

// router.get('/:strumento', (req, res) => {
//   const strumento = req.params.strumento;

//   fs.readFile(corsiPath, 'utf8', (err, data) => {
//     if (err) return res.status(500).render('errore', { messaggio: 'Errore interno' });

//     const corsi = JSON.parse(data);
//     const corso = corsi[strumento];

//     if (!corso) {
//       return res.status(404).render('errore', { messaggio: 'Corso non trovato' });
//     }

//     res.render('corso', { corso });
//   });
// });

// module.exports = router;

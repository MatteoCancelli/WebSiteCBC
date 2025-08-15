const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

async function generateSitemap() {
  try {
    // Configurazione base
    const sitemap = new SitemapStream({ 
      hostname: 'https://bandacastelcovati.it'
    });
    
    // File di output - salva nella root
    const writeStream = createWriteStream(path.join(__dirname, 'sitemap.xml'));
    sitemap.pipe(writeStream);
    
    // Le tue pagine con changefreq ottimizzate
    const pages = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/consiglio', changefreq: 'monthly', priority: 0.8 },
      { url: '/contatti', changefreq: 'monthly', priority: 0.9 },
      { url: '/direttore', changefreq: 'yearly', priority: 0.7 },
      { url: '/dona', changefreq: 'monthly', priority: 0.9 },
      { url: '/partner', changefreq: 'monthly', priority: 0.8 },
      { url: '/storia', changefreq: 'yearly', priority: 0.6 },
      { url: '/accademia/', changefreq: 'monthly', priority: 0.8 },
      { url: '/accademia/contatti', changefreq: 'monthly', priority: 0.8 },
      { url: '/accademia/corso', changefreq: 'monthly', priority: 0.9 },
      { url: '/accademia/insegnante', changefreq: 'monthly', priority: 0.8 },
      { url: '/accademia/insegnanti', changefreq: 'monthly', priority: 0.8 }
    ];
    
    // Scrivi tutte le pagine
    pages.forEach(page => {
      sitemap.write({
        url: page.url,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
    
    // Chiudi lo stream
    sitemap.end();
    
    // Attendi che la scrittura sia completata
    await streamToPromise(sitemap);
    
    console.log('✅ Sitemap generata con successo in sitemap.xml');
    
  } catch (error) {
    console.error('❌ Errore nella generazione della sitemap:', error);
  }
}

// Esegui la funzione
generateSitemap();
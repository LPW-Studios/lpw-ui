(async function () {
  try {
    // Bestimme die Basis-URL des Scripts für externes Laden
    const currentScript = document.currentScript || 
      (function() {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      })();
    
    let baseURL = "";
    if (currentScript && currentScript.src) {
      // Extrahiere den Pfad ohne den Dateinamen
      baseURL = currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1);
    }
    
    const componentsURL = baseURL + "components/";
    const res = await fetch(componentsURL);
    if (!res.ok) return;
    const text = await res.text();
    const hrefs = new Set();
    
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      doc.querySelectorAll("a").forEach((a) => {
        const h = a.getAttribute("href");
        if (h && h.match(/\.css$/i)) hrefs.add(h);
      });
    } catch (e) {}
    
    if (hrefs.size === 0) {
      for (const m of text.matchAll(/href=["']([^"']+\.css)["']/gi))
        hrefs.add(m[1]);
      for (const m of text.matchAll(/(["'])([^"']+\.css)\1/gi)) hrefs.add(m[2]);
    }
    
    hrefs.forEach((h) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      // Verwende die Basis-URL für externe Pfade
      if (h.startsWith("http://") || h.startsWith("https://") || h.startsWith("/")) {
        link.href = h;
      } else if (h.startsWith("components/")) {
        link.href = baseURL + h;
      } else {
        link.href = baseURL + "components/" + h;
      }
      document.head.appendChild(link);
    });
  } catch (e) {
    console.error("Error loading component CSS:", e);
  }
})();

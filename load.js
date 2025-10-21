(async function () {
  try {
    const res = await fetch("components/");
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
      link.href =
        h.startsWith("components/") || h.startsWith("/")
          ? h
          : "components/" + h;
      document.head.appendChild(link);
    });
  } catch (e) {
    console.error("Error loading component CSS:", e);
  }
})();

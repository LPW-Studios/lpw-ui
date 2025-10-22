(async () => {
  const baseURL = new URL('./', import.meta.url);
  const manifestURL = new URL('components/manifest.json', baseURL);

  try {
    const response = await fetch(manifestURL);
    if (!response.ok) throw new Error(`Manifest not found: ${manifestURL}`);
    const files = await response.json();

    for (const file of files) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL(`components/${file}`, baseURL).href;
      document.head.appendChild(link);
    }

    console.log(`✅ LPW UI Libary: ${files.length} components loaded.`);
  } catch (err) {
    console.error('❌ Failed to load LPW UI Libary components:', err);
  }
})();

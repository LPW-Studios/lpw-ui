(async () => {
  // Alternative to import.meta.url for non-module scripts
  const currentScript = document.currentScript || 
    (function() {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
  
  const baseURL = new URL('./', currentScript.src);
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

    console.log(`✅ LPW UI Library: ${files.length} components loaded.`);
  } catch (err) {
    console.error('❌ Failed to load LPW UI Library components:', err);
  }
})();

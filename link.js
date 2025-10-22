// Load all CSS files from LPW UI components
async function loadAllCSSComponents() {
    const baseUrl = 'https://lpw-studios.github.io/lpw-ui/components/';
    
    // List of known CSS components (you may need to update this list)
    const cssFiles = [
        'container.css',
        'dev.css',
        'header.css',
        'footer.css',
        'button.css',
        "colors.css",
        "input.css"
    ];
    
    // Function to load a single CSS file
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            
            link.onload = () => resolve(href);
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            
            document.head.appendChild(link);
        });
    }
    
    // Load all CSS files
    const loadPromises = cssFiles.map(file => {
        const fullUrl = baseUrl + file;
        return loadCSS(fullUrl).catch(error => {
            console.warn(`Could not load ${file}:`, error.message);
            return null; // Continue with other files even if one fails
        });
    });
    
    try {
        const results = await Promise.all(loadPromises);
        const loaded = results.filter(result => result !== null);
        console.log(`Successfully loaded ${loaded.length} CSS files:`, loaded);
    } catch (error) {
        console.error('Error loading CSS files:', error);
    }
}

// Alternative function to dynamically discover and load CSS files
async function discoverAndLoadCSS() {
    const baseUrl = 'https://lpw-studios.github.io/lpw-ui/components/';
    
    try {
        // Fetch the directory listing (this may not work due to CORS)
        const response = await fetch(baseUrl);
        const html = await response.text();
        
        // Parse HTML to find .css files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href$=".css"]');
        
        const cssFiles = Array.from(links).map(link => link.getAttribute('href'));
        
        // Load each CSS file
        for (const file of cssFiles) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = baseUrl + file;
            document.head.appendChild(link);
        }
        
        console.log(`Loaded ${cssFiles.length} CSS files dynamically`);
    } catch (error) {
        console.warn('Could not discover CSS files dynamically, falling back to known list');
        await loadAllCSSComponents();
    }
}

// Load CSS when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllCSSComponents();
});

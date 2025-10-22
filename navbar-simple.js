// Navbar - Komplett neu und einfach
(function() {
    'use strict';
    
    // Einfache Navbar-Funktionalität
    function initNavbar() {
        // Alle Navbars finden
        const navbars = document.querySelectorAll('.navbar');
        
        navbars.forEach(navbar => {
            // Active Link Management
            setupActiveLinks(navbar);
            
            // Height Sync mit Container
            syncHeightWithContainer(navbar);
        });
        
        console.log('✅ Navbar initialized:', navbars.length + ' navbars found');
    }
    
    // Active Links einrichten
    function setupActiveLinks(navbar) {
        const links = navbar.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                // Entferne active von allen Links
                links.forEach(l => l.classList.remove('active'));
                
                // Füge active zum geklickten Link hinzu
                this.classList.add('active');
                
                console.log('Active link:', this.textContent);
            });
        });
    }
    
    // Höhe mit Container synchronisieren
    function syncHeightWithContainer(navbar) {
        const container = document.querySelector('.container');
        
        if (container) {
            // Warte auf Container-Rendering
            setTimeout(() => {
                const containerHeight = container.offsetHeight;
                navbar.style.height = containerHeight + 'px';
                
                console.log('📏 Navbar height synced:', containerHeight + 'px');
            }, 100);
        }
    }
    
    // Navbar erstellen (einfache Version)
    function createNavbar(options = {}) {
        const {
            position = 'left', // 'left' oder 'right'
            brand = 'Menu',
            items = [],
            container = document.body
        } = options;
        
        const navbar = document.createElement('nav');
        navbar.className = `navbar ${position}`;
        
        let html = `<a href="#" class="brand">${brand}</a><ul>`;
        
        items.forEach(item => {
            html += `<li><a href="${item.href || '#'}">${item.text}</a></li>`;
        });
        
        html += '</ul>';
        navbar.innerHTML = html;
        
        container.appendChild(navbar);
        
        // Initialisiere die neue Navbar
        setupActiveLinks(navbar);
        syncHeightWithContainer(navbar);
        
        return navbar;
    }
    
    // Event Listeners
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
    
    // Window resize
    window.addEventListener('resize', () => {
        const navbars = document.querySelectorAll('.navbar');
        navbars.forEach(syncHeightWithContainer);
    });
    
    // Globale Funktionen
    window.createNavbar = createNavbar;
    window.initNavbar = initNavbar;
    
})();
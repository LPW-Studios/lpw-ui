// Theme Manager
(function() {
    'use strict';
    
    // Get current theme from localStorage or default to 'light'
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        console.log('Theme applied:', theme);
    }

    // Switch to a specific theme
    function switchTheme(theme) {
        applyTheme(theme);
        return theme;
    }

    // Toggle between light and dark theme
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        return newTheme;
    }

    // Initialize theme on page load
    function initTheme() {
        const theme = getCurrentTheme();
        applyTheme(theme);
        
        // Set select value if element exists
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = theme;
        }
    }

    // Setup theme select listener
    function setupThemeSelect() {
        const themeSelect = document.getElementById('theme-select');
        
        if (themeSelect) {
            console.log('Theme select found, setting up listener');
            
            // Set initial value
            themeSelect.value = getCurrentTheme();
            
            // Add change event listener
            themeSelect.addEventListener('change', function() {
                console.log('Theme changed to:', this.value);
                switchTheme(this.value);
            });
        } else {
            console.log('Theme select not found');
        }
    }

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupThemeSelect();
        });
    } else {
        initTheme();
        setupThemeSelect();
    }

    // Make functions available globally for debugging
    window.themeManager = {
        getCurrentTheme,
        applyTheme,
        switchTheme,
        toggleTheme,
        initTheme
    };
})();

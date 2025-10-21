// Navbar Manager
(function() {
    'use strict';
    
    // Navbar creation and management
    class NavbarManager {
        constructor() {
            this.navbars = new Map();
            this.init();
        }

        // Initialize navbar functionality
        init() {
            this.setupExistingNavbars();
            this.setupMobileToggles();
            this.setupDropdowns();
        }

        // Setup existing navbars in the DOM
        setupExistingNavbars() {
            const navbars = document.querySelectorAll('.navbar');
            navbars.forEach((navbar, index) => {
                const id = navbar.id || `navbar-${index}`;
                navbar.id = id;
                this.navbars.set(id, navbar);
                this.enhanceNavbar(navbar);
            });
        }

        // Create a new navbar programmatically
        createNavbar(config = {}) {
            const {
                id = `navbar-${Date.now()}`,
                variant = '', // 'left', 'right', 'top', 'sticky'
                brand = 'LPW Studios',
                brandHref = '#',
                items = [],
                actions = [],
                container = document.body
            } = config;

            const navbar = document.createElement('nav');
            navbar.className = `navbar ${variant}`.trim();
            navbar.id = id;

            // Create navbar structure
            let navbarHTML = '';

            // Brand/Logo
            if (brand) {
                navbarHTML += `<a href="${brandHref}" class="brand">${brand}</a>`;
            }

            // Navigation items
            if (items.length > 0) {
                navbarHTML += '<ul>';
                items.forEach(item => {
                    navbarHTML += this.createNavItem(item);
                });
                navbarHTML += '</ul>';
            }

            // Actions (buttons, etc.)
            if (actions.length > 0) {
                navbarHTML += '<div class="navbar-actions">';
                actions.forEach(action => {
                    navbarHTML += action;
                });
                navbarHTML += '</div>';
            }

            // Mobile toggle
            navbarHTML += '<button class="mobile-toggle" aria-label="Toggle mobile menu">☰</button>';

            navbar.innerHTML = navbarHTML;
            container.appendChild(navbar);

            this.navbars.set(id, navbar);
            this.enhanceNavbar(navbar);

            return navbar;
        }

        // Create navigation item HTML
        createNavItem(item) {
            const { text, href = '#', active = false, dropdown = [] } = item;
            
            let itemHTML = '<li';
            if (dropdown.length > 0) {
                itemHTML += ' class="dropdown"';
            }
            itemHTML += '>';
            
            itemHTML += `<a href="${href}"${active ? ' class="active"' : ''}>${text}`;
            if (dropdown.length > 0) {
                itemHTML += '</a><ul class="dropdown-menu">';
                dropdown.forEach(subItem => {
                    itemHTML += `<li><a href="${subItem.href || '#'}">${subItem.text}</a></li>`;
                });
                itemHTML += '</ul>';
            } else {
                itemHTML += '</a>';
            }
            
            itemHTML += '</li>';
            return itemHTML;
        }

        // Enhance navbar with interactive features
        enhanceNavbar(navbar) {
            this.setupMobileToggle(navbar);
            this.setupDropdownMenus(navbar);
            this.setupActiveStates(navbar);
            this.addScrollEffects(navbar);
        }

        // Setup mobile toggle for specific navbar
        setupMobileToggle(navbar) {
            const toggle = navbar.querySelector('.mobile-toggle');
            const menu = navbar.querySelector('ul');
            
            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    menu.classList.toggle('show');
                    toggle.classList.toggle('active');
                    
                    // Animate toggle icon
                    if (toggle.classList.contains('active')) {
                        toggle.innerHTML = '✕';
                    } else {
                        toggle.innerHTML = '☰';
                    }
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!navbar.contains(e.target)) {
                        menu.classList.remove('show');
                        toggle.classList.remove('active');
                        toggle.innerHTML = '☰';
                    }
                });
            }
        }

        // Setup all mobile toggles
        setupMobileToggles() {
            this.navbars.forEach(navbar => {
                this.setupMobileToggle(navbar);
            });
        }

        // Setup dropdown menus for specific navbar
        setupDropdownMenus(navbar) {
            const dropdowns = navbar.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (link && menu) {
                    // Prevent default click on dropdown links
                    link.addEventListener('click', (e) => {
                        if (menu) e.preventDefault();
                    });

                    // Handle hover for desktop
                    dropdown.addEventListener('mouseenter', () => {
                        if (window.innerWidth > 768) {
                            menu.style.display = 'block';
                            setTimeout(() => {
                                menu.classList.add('show');
                            }, 10);
                        }
                    });

                    dropdown.addEventListener('mouseleave', () => {
                        if (window.innerWidth > 768) {
                            menu.classList.remove('show');
                            setTimeout(() => {
                                if (!menu.classList.contains('show')) {
                                    menu.style.display = 'none';
                                }
                            }, 300);
                        }
                    });

                    // Handle click for mobile
                    link.addEventListener('click', (e) => {
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            dropdown.classList.toggle('open');
                        }
                    });
                }
            });
        }

        // Setup all dropdown menus
        setupDropdowns() {
            this.navbars.forEach(navbar => {
                this.setupDropdownMenus(navbar);
            });
        }

        // Setup active states based on current URL
        setupActiveStates(navbar) {
            const links = navbar.querySelectorAll('a[href]');
            const currentPath = window.location.pathname;
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPath || (href !== '#' && currentPath.includes(href))) {
                    link.classList.add('active');
                }
            });
        }

        // Add scroll effects for sticky/top navbars
        addScrollEffects(navbar) {
            if (navbar.classList.contains('sticky') || navbar.classList.contains('top')) {
                let lastScroll = 0;
                
                window.addEventListener('scroll', () => {
                    const currentScroll = window.pageYOffset;
                    
                    // Add scrolled class for styling
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    
                    // Hide/show navbar on scroll (for top variant)
                    if (navbar.classList.contains('top')) {
                        if (currentScroll > lastScroll && currentScroll > 100) {
                            navbar.style.transform = 'translateY(-100%)';
                        } else {
                            navbar.style.transform = 'translateY(0)';
                        }
                    }
                    
                    lastScroll = currentScroll;
                });
            }
        }

        // Update active menu item
        setActive(navbarId, href) {
            const navbar = this.navbars.get(navbarId);
            if (navbar) {
                // Remove all active classes
                navbar.querySelectorAll('a.active').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to specified link
                const targetLink = navbar.querySelector(`a[href="${href}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
            }
        }

        // Get navbar by ID
        getNavbar(id) {
            return this.navbars.get(id);
        }

        // Remove navbar
        removeNavbar(id) {
            const navbar = this.navbars.get(id);
            if (navbar) {
                navbar.remove();
                this.navbars.delete(id);
            }
        }

        // Quick navbar creation methods
        createHorizontalNavbar(config) {
            return this.createNavbar({ ...config, variant: '' });
        }

        createSidebarLeft(config) {
            return this.createNavbar({ ...config, variant: 'left' });
        }

        createSidebarRight(config) {
            return this.createNavbar({ ...config, variant: 'right' });
        }

        createTopNavbar(config) {
            return this.createNavbar({ ...config, variant: 'top' });
        }

        createStickyNavbar(config) {
            return this.createNavbar({ ...config, variant: 'sticky' });
        }
    }

    // Initialize navbar manager when DOM is ready
    let navbarManager;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            navbarManager = new NavbarManager();
        });
    } else {
        navbarManager = new NavbarManager();
    }

    // Make navbar manager available globally
    window.NavbarManager = NavbarManager;
    window.navbarManager = navbarManager;

    // Example usage functions
    window.createExampleNavbar = function() {
        const exampleItems = [
            { text: 'Home', href: '#home', active: true },
            { text: 'About', href: '#about' },
            { 
                text: 'Services', 
                href: '#services',
                dropdown: [
                    { text: 'Web Design', href: '#web-design' },
                    { text: 'Development', href: '#development' },
                    { text: 'Consulting', href: '#consulting' }
                ]
            },
            { text: 'Contact', href: '#contact' }
        ];

        const exampleActions = [
            '<button class="btn basic">Login</button>',
            '<button class="btn accept">Sign Up</button>'
        ];

        return navbarManager.createNavbar({
            id: 'example-navbar',
            brand: 'LPW Studios',
            items: exampleItems,
            actions: exampleActions
        });
    };

})();
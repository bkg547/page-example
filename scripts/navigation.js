class PageTransition {
    constructor() {
        this.initializeNavigation();
        this.setupPageTransitions();
    }

    initializeNavigation() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Don't prevent default for external page links
                if (href.includes('.html')) {
                    return;
                }
                
                // Handle same-page anchor links
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    setupPageTransitions() {
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.loadPage(e.state.path, false);
            }
        });
    }

    async navigateToPage(path) {
        try {
            await this.loadPage(path, true);
            window.history.pushState({ path }, '', path);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    async loadPage(path, updateHistory = true) {
        // Show loading animation
        this.showLoader();

        try {
            const response = await fetch(path);
            const html = await response.text();
            
            // Extract main content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main').innerHTML;

            // Animate out current content
            const main = document.querySelector('main');
            main.style.opacity = '0';

            setTimeout(() => {
                // Update content
                main.innerHTML = newContent;
                main.style.opacity = '1';
                main.classList.add('page-transition');

                // Update active navigation
                this.updateActiveNavigation(path);

                // Hide loader
                this.hideLoader();
            }, 300);

        } catch (error) {
            console.error('Error loading page:', error);
            this.hideLoader();
        }
    }

    showLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = '<div class="loading"></div>';
        document.body.appendChild(loader);
    }

    hideLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.addEventListener('animationend', () => {
                loader.remove();
            });
        }
    }

    updateActiveNavigation(path) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('nav-link-active');
            if (link.getAttribute('href') === path) {
                link.classList.add('nav-link-active');
            }
        });
    }
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
    new PageTransition();
}); 
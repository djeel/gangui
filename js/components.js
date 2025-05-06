
// Gestion des composants communs
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Chargement du header
        const headerResponse = await fetch('components/header.html');
        const headerData = await headerResponse.text();
        document.querySelector('body').insertAdjacentHTML('afterbegin', headerData);

        // Chargement du footer
        const footerResponse = await fetch('components/footer.html');
        const footerData = await footerResponse.text();
        document.querySelector('body').insertAdjacentHTML('beforeend', footerData);

        // Initialiser les composants une fois que tout est chargé
        initComponents();
    } catch (error) {
        console.error('Erreur lors du chargement des composants:', error);
    }
});
// Fonction pour initialiser les composants
function initComponents() {
    // Gestion du thème
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Gestion de la langue
    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const langDropdownMenu = document.getElementById('langDropdownMenu');
    const langOptions = document.querySelectorAll('.lang-option');

    if (langDropdownBtn && langDropdownMenu) {
        langDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdownMenu.classList.toggle('show');
        });

        // Fermer le menu quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!langDropdownBtn.contains(e.target) && !langDropdownMenu.contains(e.target)) {
                langDropdownMenu.classList.remove('show');
            }
        });

        // Gestion du changement de langue
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                updateLanguage(lang);
                langDropdownMenu.classList.remove('show');
            });
        });
    }

    // Gestion du menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Gestion du bouton "Back to Top"
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialiser le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Initialiser la langue sauvegardée
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        updateLanguage(savedLang);
    } else {
        // Langue par défaut
        updateLanguage('en');
    }
} 
/**
 * components.js - Gestion des composants header, footer & backtotop btn
 * Fichier responsable du chargement dynamique des composants et des fonctionnalités partagées
 */

// -----------------------------------------------------
// 1. CHARGEMENT INITIAL DES COMPOSANTS
// -----------------------------------------------------

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

// -----------------------------------------------------
// 2. INITIALISATION DES COMPOSANTS
// -----------------------------------------------------

/**
 * Fonction principale d'initialisation des composants
 * Appelle toutes les sous-fonctions d'initialisation
 */
function initComponents() {
    // Chargement des préférences utilisateur
    initSavedPreferences();
    
    // Initialisation des contrôleurs d'interface
    initThemeToggle();
    initLanguageSelector();
    initBackToTopButton();
}

// -----------------------------------------------------
// 3. GESTION DES PRÉFÉRENCES UTILISATEUR
// -----------------------------------------------------

/**
 * Initialise les préférences sauvegardées (thème, langue)
 */
function initSavedPreferences() {
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

// -----------------------------------------------------
// 4. CONTRÔLEURS D'INTERFACE
// -----------------------------------------------------

/**
 * Initialise le bouton de changement de thème
 */
function initThemeToggle() {
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
}

/**
 * Initialise le sélecteur de langue
 */
function initLanguageSelector() {
    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const langDropdownMenu = document.getElementById('langDropdownMenu');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (langDropdownBtn && langDropdownMenu) {
        // Ouvrir/fermer le menu déroulant
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
}

/**
 * Initialise le bouton "Retour en haut"
 */
function initBackToTopButton() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        // Afficher/masquer selon la position de défilement
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Action de défilement vers le haut
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// -----------------------------------------------------
// 5. UTILITAIRES
// -----------------------------------------------------

/**
 * Met à jour la langue de l'interface
 * @param {string} lang - Code de langue (ex: 'fr', 'en')
 */
function updateLanguage(lang) {
    // Note: Cette fonction est appelée mais non définie dans le code original
    // Implémentation à compléter selon les besoins
    
    // Sauvegarde de la préférence
    localStorage.setItem('language', lang);
    
    // La logique pour changer le contenu selon la langue devrait être ajoutée ici
    console.log(`Langue changée pour: ${lang}`);
}
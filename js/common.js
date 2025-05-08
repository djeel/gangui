/**
 * common.js - Fonctions communes pour le site
 * Stockage des données, thème et langue
 */

// ----------------------------------------------------- //
// 1. CONSTANTES ET VARIABLES GLOBALES
// ----------------------------------------------------- //
const STORAGE_TEST_KEY = 'test_storage';
const DEFAULT_THEME = 'dark';
const DEFAULT_LANGUAGE = 'en';

// Objet contenant les noms d'affichage pour chaque langue supportée
const LANGUAGE_NAMES = {
    'en': 'English',
    'fr': 'Français',
    'es': 'Español',
    'de': 'Deutsch',
    'ro': 'Română',
    'ru': 'Русский',
    'zh': '中文'
};

// Namespace principal pour les fonctionnalités du site
const SiteManager = {
    storage: {},
    theme: {},
    language: {}
};

// ----------------------------------------------------- //
// 2. UTILITAIRES ET GESTION DU STOCKAGE
// ----------------------------------------------------- //

/**
 * Vérifie si localStorage est disponible et fonctionnel
 * @returns {boolean} - true si localStorage fonctionne, false sinon
 */
SiteManager.storage.check = function() {
    try {
        localStorage.setItem(STORAGE_TEST_KEY, 'test');
        const value = localStorage.getItem(STORAGE_TEST_KEY);
        localStorage.removeItem(STORAGE_TEST_KEY);
        return value === 'test';
    } catch (e) {
        console.error('localStorage non disponible:', e);
        return false;
    }
};

/**
 * Sauvegarde une valeur dans localStorage avec gestion d'erreur
 * @param {string} key - La clé de stockage
 * @param {string} value - La valeur à stocker
 * @returns {boolean} - true si réussi, false sinon
 */
SiteManager.storage.save = function(key, value) {
    try {
        localStorage.setItem(key, value);
        console.log(`Valeur sauvegardée: ${key}=${value}`);
        return true;
    } catch (e) {
        console.error(`Erreur lors de la sauvegarde de ${key}:`, e);
        return false;
    }
};

/**
 * Récupère une valeur depuis localStorage avec valeur par défaut
 * @param {string} key - La clé à récupérer
 * @param {string} defaultValue - Valeur par défaut si non trouvée
 * @returns {string} - La valeur stockée ou la valeur par défaut
 */
SiteManager.storage.get = function(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (e) {
        console.error(`Erreur lors de la récupération de ${key}:`, e);
        return defaultValue;
    }
};

// ----------------------------------------------------- //
// 3. GESTION DU THÈME
// ----------------------------------------------------- //

/**
 * Initialise le thème depuis localStorage et configure les événements
 */
SiteManager.theme.init = function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Récupère le thème sauvegardé ou utilise le thème par défaut
    const savedTheme = SiteManager.storage.get('theme', DEFAULT_THEME);
    console.log('Thème chargé:', savedTheme);
    html.setAttribute('data-theme', savedTheme);
    
    // Gestion du bouton de changement de thème
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            SiteManager.theme.toggle();
        });
    }
};

/**
 * Bascule entre les thèmes clair et sombre
 */
SiteManager.theme.toggle = function() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log('Changement de thème:', newTheme);
    html.setAttribute('data-theme', newTheme);
    SiteManager.storage.save('theme', newTheme);
    
    // Émettre un événement personnalisé pour le changement de thème
    document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: newTheme } 
    }));
};

// ----------------------------------------------------- //
// 4. GESTION DES LANGUES
// ----------------------------------------------------- //

/**
 * Initialise la langue depuis localStorage et configure les événements
 */
SiteManager.language.init = function() {
    try {
        // Vérifier si l'objet translations est disponible
        if (typeof translations === 'undefined') {
            console.error('L\'objet translations n\'est pas défini');
            return;
        }
        
        const savedLang = SiteManager.storage.get('language', DEFAULT_LANGUAGE);
        const lang = translations[savedLang] ? savedLang : DEFAULT_LANGUAGE;
        
        // Vérifie si la langue existe dans les traductions
        if (!translations[lang]) {
            console.error(`La langue ${lang} n'est pas supportée`);
            return;
        }

        // Met à jour le texte de l'interface
        SiteManager.language.update(lang);

        // Met à jour le sélecteur de langue
        SiteManager.language.updateSelector(lang);

        // Ajoute les écouteurs d'événements pour le changement de langue
        SiteManager.language.setupListeners();

        console.log(`Langue initialisée: ${lang}`);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la langue:', error);
    }
};

/**
 * Met à jour le contenu du sélecteur de langue
 * @param {string} lang - Code de la langue actuelle
 */
SiteManager.language.updateSelector = function(lang) {
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.textContent = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES[DEFAULT_LANGUAGE];
    }
};

/**
 * Configure les écouteurs d'événements pour le changement de langue
 */
SiteManager.language.setupListeners = function() {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newLang = option.getAttribute('data-lang');
            SiteManager.language.changeLanguage(newLang);
        });
    });
};

/**
 * Change la langue de l'interface si valide
 * @param {string} newLang - Code de la langue à appliquer
 */
SiteManager.language.changeLanguage = function(newLang) {
    if (typeof translations === 'undefined') {
        console.error('L\'objet translations n\'est pas défini');
        return;
    }
    
    if (translations[newLang]) {
        SiteManager.language.update(newLang);
        SiteManager.language.updateSelector(newLang);
    } else {
        console.error(`La langue ${newLang} n'est pas supportée`);
    }
};

/**
 * Met à jour la langue de l'interface
 * @param {string} lang - Code de la langue à appliquer
 */
SiteManager.language.update = function(lang) {
    try {
        if (typeof translations === 'undefined') {
            console.error('L\'objet translations n\'est pas défini');
            return;
        }
        
        if (!translations[lang]) {
            console.error(`La langue ${lang} n'est pas supportée`);
            return;
        }

        // Met à jour tous les éléments avec l'attribut data-translate
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Sauvegarde la préférence de langue
        SiteManager.storage.save('language', lang);
        console.log(`Langue mise à jour: ${lang}`);
        
        // Émettre un événement personnalisé pour le changement de langue
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la langue:', error);
    }
};

// ----------------------------------------------------- //
// 5. INITIALISATION
// ----------------------------------------------------- //

/**
 * Point d'entrée principal - initialise toutes les fonctionnalités communes
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialisation des fonctionnalités communes');
    if (SiteManager.storage.check()) {
        SiteManager.theme.init();
        SiteManager.language.init();
    } else {
        console.error('Impossible d\'utiliser localStorage');
        // Utiliser les valeurs par défaut en cas d'échec de localStorage
        document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    }
});
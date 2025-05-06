// Check localStorage
function checkLocalStorage() {
    try {
        const testKey = 'test_storage';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return value === 'test';
    } catch (e) {
        console.error('localStorage not available:', e);
        return false;
    }
}

// Theme management
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Retrieve the saved theme or use dark by default
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || 'dark';
    console.log('Loaded theme:', theme);
    html.setAttribute('data-theme', theme);
    
    // Handle theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log('Theme change:', newTheme);
            html.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
                console.log('Saved theme:', newTheme);
            } catch (e) {
                console.error('Error saving theme:', e);
            }
        });
    }
}

// Language management
function initLanguage() {
    try {
        const savedLang = localStorage.getItem('language');
        const defaultLang = 'en';
        const lang = savedLang && translations[savedLang] ? savedLang : defaultLang;
        
        // Check if the language exists in translations
        if (!translations[lang]) {
            console.error(`The language ${lang} is not supported`);
            return;
        }

        // Update the interface text
        updateLanguage(lang);

        // Update the language selector
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.textContent = 
                lang === 'en' ? 'English' : 
                lang === 'fr' ? 'Français' :
                lang === 'es' ? 'Español' :
                lang === 'de' ? 'Deutsch' :
                lang === 'ro' ? 'Română' : 
                lang === 'ru' ? 'Русский' :
                lang === 'zh' ? '中文' : 'English';
        }

        // Add event listeners for language change
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newLang = option.getAttribute('data-lang');
                if (translations[newLang]) {
                    updateLanguage(newLang);
                    if (langSelect) {
                        langSelect.textContent = 
                            newLang === 'en' ? 'English' : 
                            newLang === 'fr' ? 'Français' :
                            newLang === 'es' ? 'Español' :
                            newLang === 'de' ? 'Deutsch' :
                            newLang === 'ro' ? 'Română' : 
                            newLang === 'ru' ? 'Русский' :
                            newLang === 'zh' ? '中文' : 'English';
                    }
                }
            });
        });

        console.log(`Language initialized: ${lang}`);
    } catch (error) {
        console.error('Error initializing language:', error);
    }
}

// Update the language
function updateLanguage(lang) {
    try {
        if (!translations[lang]) {
            console.error(`The language ${lang} is not supported`);
            return;
        }

        // Update all elements with data-translate attributes
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Save the language preference
        localStorage.setItem('language', lang);
        console.log(`Language updated: ${lang}`);
    } catch (error) {
        console.error('Error updating language:', error);
    }
}

// Initialize common features
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing common features');
    if (checkLocalStorage()) {
        initTheme();
        initLanguage();
    } else {
        console.error('Unable to use localStorage');
    }
}); 
// DOM Elements
const loader = document.querySelector('.loader');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-menu a');
const backToTop = document.querySelector('.back-to-top');
const faqItems = document.querySelectorAll('.faq-item');
const copyIpButtons = document.querySelectorAll('.copy-ip');
const langButtons = document.querySelectorAll('.lang-btn');
const animElements = document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left');
const header = document.querySelector('.header');

// Current language
let currentLang = 'en';

// Functions

function updateLanguage(lang) {
    currentLang = lang;
    // Mettre à jour tous les éléments avec l'attribut data-lang
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            if (element.getAttribute('data-lang-html')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

function toggleFAQ(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle i');
    const isOpen = item.classList.contains('active');

    // Fermer toutes les réponses
    faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherToggle = otherItem.querySelector('.faq-toggle i');
        if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
        }
        if (otherToggle) {
            otherToggle.classList.remove('active');
        }
    });

    // Ouvrir/fermer la réponse cliquée
    if (!isOpen) {
        item.classList.add('active');
        if (answer) {
            // Force le recalcul du layout pour une animation fluide
            answer.style.maxHeight = '0px';
            void answer.offsetWidth; // Force reflow
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
        if (toggle) {
            toggle.classList.add('active');
        }
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = 'Copied!';
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2000);
    });
}

// Détection de la langue au premier chargement
let savedLang = localStorage.getItem('lang');
if (!savedLang) {
    updateLanguage('en');
    localStorage.setItem('lang', 'en');
} else {
    updateLanguage(savedLang);
}

// Dropdown langue
const langDropdownBtn = document.getElementById('langDropdownBtn');
const langDropdownMenu = document.getElementById('langDropdownMenu');
const langDropdown = langDropdownBtn ? langDropdownBtn.parentElement : null;
const langCurrent = document.querySelector('.lang-current');

if (langDropdownBtn && langDropdownMenu && langDropdown) {
    langDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('open');
    });
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = btn.getAttribute('data-lang');
            if(langCurrent) langCurrent.textContent = btn.textContent;
            langDropdown.classList.remove('open');
            updateLanguage(lang);
            localStorage.setItem('lang', lang); // Sauvegarde la langue choisie
        });
    });
    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target)) {
            langDropdown.classList.remove('open');
        }
    });
}

function initFeaturesCarousel() {
    const carousel = document.querySelector('.features-grid.carousel');
    if (!carousel) {
        console.log('Carousel not found, skipping initialization');
        return;
    }

    const cards = carousel.querySelectorAll('.feature-card');
    if (!cards || cards.length === 0) {
        console.log('No feature cards found, skipping initialization');
        return;
    }

    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;

    function updateActiveState() {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    function scrollToCard(index) {
        // Gestion de la boucle infinie
        if (index < 0) {
            index = cards.length - 1;
        } else if (index >= cards.length) {
            index = 0;
        }
        
        currentIndex = index;
        const card = cards[index];
        const scrollPosition = card.offsetLeft - carousel.offsetLeft;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updateActiveState();
        updateDots();
        updateArrows();
    }

    function updateArrows() {
        if (leftArrow && rightArrow) {
            leftArrow.disabled = rightArrow.disabled = (cards.length <= 1);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        
        if (dotsContainer.children.length !== cards.length) {
            dotsContainer.innerHTML = '';
            cards.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
                dot.addEventListener('click', () => scrollToCard(i));
                dotsContainer.appendChild(dot);
            });
        } else {
            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
            });
        }
    }

    // Gestion des touches du clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scrollToCard(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            scrollToCard(currentIndex + 1);
        }
    });

    // Gestion du touch
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                scrollToCard(currentIndex + 1);
            } else {
                scrollToCard(currentIndex - 1);
            }
        }
    }

    // Gestion du scroll
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const cardWidth = cards[0].offsetWidth;
            const scrollPosition = carousel.scrollLeft;
            const newIndex = Math.round(scrollPosition / cardWidth);
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
                currentIndex = newIndex;
                updateActiveState();
                updateDots();
                updateArrows();
            }
        }, 100);
    });

    // Gestion du clic sur les cartes
    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            // Empêcher le clic si on est déjà sur cette carte
            if (index === currentIndex) return;
            
            // Empêcher le comportement par défaut
            e.preventDefault();
            e.stopPropagation();
            
            // Faire défiler vers la carte cliquée
            scrollToCard(index);
        });
    });

    // Initialisation
    updateActiveState();
    updateDots();
    updateArrows();
}

function initMainComponents() {
    // Initialiser les composants une fois que tout est chargé
    initFeaturesCarousel();
    initFAQ();
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => toggleFAQ(item));
            }
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Remove loader if it exists
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }

    // Initialiser les composants principaux
    initMainComponents();

    // Navbar scroll
    if (header || backToTop) {
        window.addEventListener('scroll', () => {
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
            if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
        });
    }

    // Nav links active state
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Copy IP buttons
    if (copyIpButtons.length > 0) {
        copyIpButtons.forEach(button => {
            button.addEventListener('click', () => {
                const ip = button.getAttribute('data-ip');
                copyToClipboard(ip);
            });
        });
    }

    // Effet spotlight lumineux qui suit la souris
    const spotlight = document.querySelector('.mouse-spotlight');
    if (spotlight) {
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        document.addEventListener('mousemove', (e) => {
            document.body.classList.add('spotlight-active');
            targetX = e.clientX;
            targetY = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('spotlight-active');
        });

        function animateSpotlight() {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            spotlight.style.left = `${currentX}px`;
            spotlight.style.top = `${currentY}px`;
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    // Gestion du thème
    function updateTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const header = document.querySelector('.header');
        
        if (theme === 'light') {
            header.classList.add('light-theme');
        } else {
            header.classList.remove('light-theme');
        }
    }

    // Observer pour les changements de thème
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Initialisation du thème
    updateTheme();
});
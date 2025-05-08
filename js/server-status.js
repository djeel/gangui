/**
 * server-status.js - Suivi de l'état du serveur Minecraft
 * Fichier responsable de la vérification et l'affichage de l'état du serveur
 */

// -----------------------------------------------------
// 1. CONFIGURATION
// -----------------------------------------------------

const SERVER_IP = 'mc.gangui.eu';
const UPDATE_INTERVAL = 30000; // 30 secondes

// -----------------------------------------------------
// 2. INITIALISATION
// -----------------------------------------------------

/**
 * Point d'entrée principal
 * Attend le chargement du DOM puis initialise le suivi du serveur
 */
document.addEventListener('DOMContentLoaded', init);

/**
 * Fonction d'initialisation
 * Attend le chargement du footer puis démarre le suivi de l'état du serveur
 */
async function init() {
    console.log('Attente du chargement du footer...');
    await waitForFooter();
    console.log('Footer chargé, initialisation du statut du serveur...');
    
    // Première mise à jour
    await updateServerStatus();
    
    // Démarrage des mises à jour périodiques
    schedulePeriodicUpdates();
}

// -----------------------------------------------------
// 3. GESTION DES MISES À JOUR
// -----------------------------------------------------

/**
 * Programme les mises à jour périodiques du statut
 * Utilise setTimeout récursif pour éviter l'accumulation de délais
 */
function schedulePeriodicUpdates() {
    function scheduleNextUpdate() {
        setTimeout(async () => {
            await updateServerStatus();
            scheduleNextUpdate();
        }, UPDATE_INTERVAL);
    }
    
    scheduleNextUpdate();
}

/**
 * Attend que le footer soit chargé dans le DOM
 * @returns {Promise} Résolu quand le footer est disponible
 */
function waitForFooter() {
    return new Promise((resolve) => {
        const checkFooter = () => {
            const footer = document.querySelector('.footer');
            if (footer) {
                resolve();
            } else {
                setTimeout(checkFooter, 100);
            }
        };
        checkFooter();
    });
}

// -----------------------------------------------------
// 4. REQUÊTES API ET TRAITEMENT DES DONNÉES
// -----------------------------------------------------

/**
 * Met à jour le statut du serveur
 * Essaie d'abord avec l'API principale, puis avec une API de secours
 */
async function updateServerStatus() {
    try {
        console.log('Mise à jour du statut du serveur...');
        
        // Tentative avec l'API principale (mcstatus.io)
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}`);
        const data = await response.json();
        console.log('Réponse de l\'API:', data);

        // Mise à jour de l'interface avec les données reçues
        updateUIWithServerStatus(data);
        
    } catch (error) {
        console.error('Erreur avec mcstatus.io, tentative avec mcsrvstat...');
        
        // Tentative avec l'API de secours (mcsrvstat)
        tryFallbackAPI();
    }
}

/**
 * Tente d'obtenir le statut avec l'API de secours
 * En cas d'échec, marque le serveur comme hors ligne
 */
async function tryFallbackAPI() {
    try {
        // Fallback sur mcsrvstat si la première API échoue
        const fallbackResponse = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const fallbackData = await fallbackResponse.json();
        console.log('Réponse de fallback:', fallbackData);

        // Mise à jour de l'interface avec les données de l'API de secours
        updateUIWithServerStatus(fallbackData, true);
        
    } catch (fallbackError) {
        console.error('Erreur lors de la récupération du statut du serveur:', fallbackError);
        
        // En cas d'échec total, marquer comme hors ligne
        markServerAsOffline();
    }
}

// -----------------------------------------------------
// 5. MISE À JOUR DE L'INTERFACE
// -----------------------------------------------------

/**
 * Met à jour l'interface utilisateur avec les données du serveur
 * @param {Object} data - Les données du serveur depuis l'API
 * @param {boolean} isFallback - Indique si les données viennent de l'API de secours
 */
function updateUIWithServerStatus(data, isFallback = false) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-indicator span:last-child');
    const playerCount = document.querySelector('.player-count');

    if (!statusDot || !statusText || !playerCount) {
        console.error('Éléments HTML non trouvés');
        return;
    }

    if (data.online) {
        // Serveur en ligne
        statusDot.classList.remove('offline');
        statusDot.classList.add('online');
        statusText.textContent = 'Online';
        
        // Le chemin d'accès aux données peut différer selon l'API
        const onlinePlayers = isFallback ? data.players.online : data.players.online;
        playerCount.textContent = onlinePlayers || '0';
        
        console.log(`Serveur en ligne${isFallback ? ' (fallback)' : ''}, joueurs:`, onlinePlayers);
    } else {
        // Serveur hors ligne
        markServerAsOffline();
    }
}

/**
 * Marque le serveur comme hors ligne dans l'interface
 */
function markServerAsOffline() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-indicator span:last-child');
    const playerCount = document.querySelector('.player-count');
    
    if (statusDot && statusText && playerCount) {
        statusDot.classList.remove('online');
        statusDot.classList.add('offline');
        statusText.textContent = 'Offline';
        playerCount.textContent = '0';
        console.log('Serveur hors ligne');
    }
}
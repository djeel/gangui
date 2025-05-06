// Configuration
const SERVER_IP = 'mc.gangui.eu';
const UPDATE_INTERVAL = 30000; // 30 secondes

// Fonction pour mettre à jour le statut du serveur
async function updateServerStatus() {
    try {
        console.log('Mise à jour du statut du serveur...');
        // Essayer d'abord l'API Minecraft Server Status
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}`);
        const data = await response.json();
        console.log('Réponse de l\'API:', data);

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
            playerCount.textContent = data.players.online || '0';
            console.log('Serveur en ligne, joueurs:', data.players.online);
        } else {
            // Serveur hors ligne
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
            statusText.textContent = 'Offline';
            playerCount.textContent = '0';
            console.log('Serveur hors ligne');
        }
    } catch (error) {
        console.error('Erreur avec mcstatus.io, tentative avec mcsrvstat...');
        try {
            // Fallback sur mcsrvstat si la première API échoue
            const fallbackResponse = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
            const fallbackData = await fallbackResponse.json();
            console.log('Réponse de fallback:', fallbackData);

            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status-indicator span:last-child');
            const playerCount = document.querySelector('.player-count');

            if (fallbackData.online) {
                statusDot.classList.remove('offline');
                statusDot.classList.add('online');
                statusText.textContent = 'Online';
                playerCount.textContent = fallbackData.players.online || '0';
                console.log('Serveur en ligne (fallback), joueurs:', fallbackData.players.online);
            } else {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
                statusText.textContent = 'Offline';
                playerCount.textContent = '0';
                console.log('Serveur hors ligne (fallback)');
            }
        } catch (fallbackError) {
            console.error('Erreur lors de la récupération du statut du serveur:', fallbackError);
            // En cas d'erreur, on considère le serveur comme hors ligne
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status-indicator span:last-child');
            const playerCount = document.querySelector('.player-count');
            
            if (statusDot && statusText && playerCount) {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
                statusText.textContent = 'Offline';
                playerCount.textContent = '0';
            }
        }
    }
}

// Attendre que le footer soit chargé
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

// Initialisation
async function init() {
    console.log('Attente du chargement du footer...');
    await waitForFooter();
    console.log('Footer chargé, initialisation du statut du serveur...');
    
    // Première mise à jour
    await updateServerStatus();
    
    // Mise à jour périodique avec setTimeout récursif
    function scheduleNextUpdate() {
        setTimeout(async () => {
            await updateServerStatus();
            scheduleNextUpdate();
        }, UPDATE_INTERVAL);
    }
    
    scheduleNextUpdate();
}

// Démarrer l'initialisation
document.addEventListener('DOMContentLoaded', init); 
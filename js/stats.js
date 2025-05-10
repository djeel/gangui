/**
 * stats.js - Script pour la page des statistiques des joueurs
 * GANGUI Minecraft Server
 */

// Mock database of players
// In a real application, this data would come from a backend API
const MOCK_PLAYER_DB = {
    "djeel": {
        uuid: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
        username: "djeel",
        role: "admin", // 'admin', 'moderator', 'player'
        isOnline: true,
        firstSeen: new Date("2023-01-15T10:00:00Z").getTime(),
        lastSeen: new Date().getTime(), // now
        playTime: (350 * 60 * 60 * 1000) + (45 * 60 * 1000), // 350h 45m in milliseconds
        avatarUrl: "img/player-skin.png", // Default or specific avatar
        // Add more stats as needed, e.g., kills, deaths, blocks_broken etc.
    },
    "Tomastore": {
        uuid: "674ba97b-64fe-47c1-aaf2-000a01d0037e",
        username: "Tomastore",
        role: "player",
        isOnline: false,
        firstSeen: new Date("2022-11-20T14:30:00Z").getTime(),
        lastSeen: new Date("2025-05-08T18:00:00Z").getTime(),
        playTime: (1900 * 60 * 60 * 1000) + (36 * 60 * 1000) + (8 * 1000), // 1900h 36m 08s
        avatarUrl: "img/player-skin.png",
    },
    "NotFound": {
        uuid: "00000000-0000-0000-0000-000000000000",
        username: "NotFound",
        role: "player",
        isOnline: false,
        firstSeen: 0,
        lastSeen: 0,
        playTime: 0,
        avatarUrl: "img/player-skin.png", // A default "unknown" skin
    }
};

// DOM Elements
const searchInput = document.getElementById('player-search-input');
const searchButton = document.getElementById('player-search-button');
const searchMessage = document.getElementById('search-message');
const playerStatsDisplaySection = document.getElementById('player-stats-display-section');
const playerProfileLoading = document.getElementById('player-profile-loading');
const playerProfileContent = document.getElementById('player-profile-content');

const playerAvatarImg = document.getElementById('player-avatar-img');
const playerUsernameEl = document.getElementById('player-username');
const playerRoleEl = document.getElementById('player-role');
const playerStatusIndicator = document.getElementById('player-status-indicator');
const playerUuidValue = document.getElementById('player-uuid-value');
const firstSeenDateEl = document.getElementById('first-seen-date');
const lastSeenDateEl = document.getElementById('last-seen-date');
const playTimeEl = document.getElementById('play-time');

/**
 * Formats milliseconds into a human-readable string (e.g., 120h 30m 15s)
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
function formatPlayTime(ms) {
    if (ms === 0) return "0s";
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    let result = "";
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === "") result += `${seconds}s`;
    return result.trim();
}

/**
 * Formats a timestamp into a human-readable date string (e.g., 10/05/2025)
 * @param {number} timestamp - The timestamp in milliseconds
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    if (timestamp === 0) return "N/A";
    const date = new Date(timestamp);
    // Using currentLang for locale-specific date formatting if available and desired
    // For simplicity, using a fixed format here. Adjust as needed.
    return date.toLocaleDateString(currentLang || 'en', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/**
 * Simulates fetching player data from an API.
 * @param {string} identifier - Username or UUID
 * @returns {Promise<Object|null>} Player data object or null if not found
 */
async function fetchPlayerData(identifier) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerIdentifier = identifier.toLowerCase();
    for (const key in MOCK_PLAYER_DB) {
        const player = MOCK_PLAYER_DB[key];
        if (player.username.toLowerCase() === lowerIdentifier || player.uuid.toLowerCase() === lowerIdentifier) {
            return { ...player }; // Return a copy
        }
    }
    return null;
}

/**
 * Updates the DOM with player data.
 * @param {Object} playerData - The player data object.
 */
function displayPlayerData(playerData) {
    if (!playerData) {
        showSearchMessage('stats-player-not-found', 'error');
        playerStatsDisplaySection.style.display = 'none';
        playerProfileLoading.style.display = 'none';
        return;
    }

    playerProfileContent.style.display = 'none'; // Hide while updating
    playerProfileLoading.style.display = 'block';


    // Basic Info
    playerUsernameEl.textContent = playerData.username;
    playerUuidValue.textContent = playerData.uuid;
    playerAvatarImg.src = playerData.avatarUrl || "img/player-skin.png"; // Fallback to default
    playerAvatarImg.alt = `${playerData.username}'s skin`;

    // Status
    playerStatusIndicator.classList.toggle('online', playerData.isOnline);
    playerStatusIndicator.classList.toggle('offline', !playerData.isOnline);
    // Assuming translations for 'Online'/'Offline' text in a title or ::after pseudo-element
    // If direct text is needed:
    // playerStatusIndicator.textContent = playerData.isOnline ? translations[currentLang]['stats-status-online'] : translations[currentLang]['stats-status-offline'];
    // playerStatusIndicator.setAttribute('data-lang', playerData.isOnline ? 'stats-status-online' : 'stats-status-offline');


    // Role
    const roleKey = `stats-role-${playerData.role.toLowerCase()}`;
    playerRoleEl.textContent = translations[currentLang] ? (translations[currentLang][roleKey] || playerData.role.toUpperCase()) : playerData.role.toUpperCase();
    playerRoleEl.className = `player-role ${playerData.role.toLowerCase()}`; // Update class for styling
    playerRoleEl.style.display = 'inline-flex';


    // Dates & Playtime
    firstSeenDateEl.textContent = formatDate(playerData.firstSeen);
    lastSeenDateEl.textContent = formatDate(playerData.lastSeen);
    playTimeEl.textContent = formatPlayTime(playerData.playTime);

    // Translations for dynamically set content (ensure keys exist or add them to translations.js)
    // This is mostly handled by data-lang attributes on static labels.
    // If you need to update tooltips or other text content based on data:
    // playerStatusIndicator.title = translations[currentLang][playerData.isOnline ? 'stats-status-online' : 'stats-status-offline'];
    
    // Show the content
    playerStatsDisplaySection.style.display = 'block';
    playerProfileLoading.style.display = 'none';
    playerProfileContent.style.display = 'flex'; // Or 'block' depending on your CSS for .player-profile

    // Update all translations on the page
    if (typeof updateLanguage === 'function') {
        updateLanguage(currentLang);
    }
}

/**
 * Shows a message in the search message area.
 * @param {string} langKey - The translation key for the message.
 * @param {'info'|'error'|'success'} type - Message type for styling.
 */
function showSearchMessage(langKey, type = 'info') {
    if (translations[currentLang] && translations[currentLang][langKey]) {
        searchMessage.textContent = translations[currentLang][langKey];
    } else {
        searchMessage.textContent = langKey; // Fallback to key if not found
    }
    searchMessage.className = `search-message ${type}`;
    searchMessage.style.display = 'block';
}

/**
 * Clears the search message.
 */
function clearSearchMessage() {
    searchMessage.textContent = '';
    searchMessage.style.display = 'none';
}

/**
 * Handles the player search logic.
 */
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        // Optionally show a message if query is empty, or just do nothing
        return;
    }

    clearSearchMessage();
    playerStatsDisplaySection.style.display = 'none';
    playerProfileContent.style.display = 'none';
    playerProfileLoading.style.display = 'block';
    playerStatsDisplaySection.style.display = 'block'; // Show the section for loading message

    try {
        const playerData = await fetchPlayerData(query);
        if (playerData) {
            displayPlayerData(playerData);
            // Update URL for shareability, without reloading the page
            const url = new URL(window.location);
            url.searchParams.set('player', query);
            window.history.pushState({}, '', url);
        } else {
            showSearchMessage('stats-player-not-found', 'error');
            playerProfileLoading.style.display = 'none';
            playerStatsDisplaySection.style.display = 'none';
        }
    } catch (error) {
        console.error("Search error:", error);
        showSearchMessage('stats-search-error', 'error');
        playerProfileLoading.style.display = 'none';
        playerStatsDisplaySection.style.display = 'none';
    }
}


/**
 * Tries to load player data from URL parameter on page load.
 */
function loadPlayerFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerIdentifier = urlParams.get('player');

    if (playerIdentifier) {
        searchInput.value = playerIdentifier; // Populate search bar
        handleSearch(); // Perform search
    }
}


// -----------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Initial language setup (assuming common.js or main.js handles this)
    // If not, you'd call initLanguageSystem() here if it were part of this file.
    // For now, ensure `currentLang` is available and `updateLanguage` can be called.
    // We'll call updateLanguage once at the end to ensure all initial text is translated.
    if (typeof updateLanguage === 'function') {
         // Call initially if needed, or rely on main.js/common.js
        // updateLanguage(localStorage.getItem('lang') || 'en');
    }

    loadPlayerFromURL(); // Check if a player was linked directly

    // Ensure translations are applied after DOM is ready and initial player load attempt
    // This relies on initLanguageSystem() from main.js having set the correct currentLang.
    if (typeof updateLanguage === 'function' && typeof translations !== 'undefined') {
        updateLanguage(currentLang || localStorage.getItem('lang') || 'en');
    } else {
        console.warn('updateLanguage function or translations object not found. Ensure main.js/common.js and translations.js are loaded and correct.');
    }
});

// Make sure currentLang is globally available or passed around if needed.
// For this example, we assume currentLang is set globally by initLanguageSystem in main.js/common.js
// If currentLang is not defined initially, set a default to avoid errors
if (typeof currentLang === 'undefined') {
    var currentLang = localStorage.getItem('lang') || 'en';
}

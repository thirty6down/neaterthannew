class XboxGameCollection {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilters = {
            type: 'all',
            region: 'all',
            search: ''
        };

        this.init();
    }

    async init() {
        await this.loadGames();
        this.setupEventListeners();
        this.renderGames();
        this.updateStats();
    }

    async loadGames() {
        try {
            // Load retail games
            const retailResponse = await fetch('xbox-games.txt');
            const retailText = await retailResponse.text();
            const retailGames = this.parseRetailGames(retailText);

            // Load homebrew games
            const homebrewResponse = await fetch('homebrew.txt');
            const homebrewText = await homebrewResponse.text();
            const homebrewGames = this.parseHomebrewGames(homebrewText);

            this.games = [...retailGames, ...homebrewGames];
            this.filteredGames = [...this.games];

            console.log(`Loaded ${this.games.length} total games`);
        } catch (error) {
            console.error('Error loading games:', error);
            this.showError('Failed to load game data');
        }
    }

    parseRetailGames(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const games = [];

        for (const line of lines) {
            const match = line.match(/^\s*\d+→(.+),([A-Z-]+)$/);
            if (match) {
                const [, title, regions] = match;
                // Handle multiple regions (e.g., "USA-JPN")
                const regionList = regions.split('-');

                // Create entry for each region
                for (const region of regionList) {
                    games.push({
                        title: title.trim(),
                        region: region.trim(),
                        type: 'retail'
                    });
                }
            }
        }

        return games;
    }

    parseHomebrewGames(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const games = [];

        for (const line of lines) {
            const match = line.match(/^\s*\d+→(.+)$/);
            if (match) {
                const [, title] = match;
                games.push({
                    title: title.trim(),
                    region: 'GLO',
                    type: 'homebrew'
                });
            }
        }

        return games;
    }

    setupEventListeners() {
        document.getElementById('gameType').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('regionFilter').addEventListener('change', (e) => {
            this.currentFilters.region = e.target.value;
            this.applyFilters();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
    }

    applyFilters() {
        this.filteredGames = this.games.filter(game => {
            // Type filter
            if (this.currentFilters.type !== 'all' && game.type !== this.currentFilters.type) {
                return false;
            }

            // Region filter
            if (this.currentFilters.region !== 'all' && game.region !== this.currentFilters.region) {
                return false;
            }

            // Search filter
            if (this.currentFilters.search && !game.title.toLowerCase().includes(this.currentFilters.search)) {
                return false;
            }

            return true;
        });

        this.renderGames();
        this.updateStats();
    }

    renderGames() {
        const tableBody = document.getElementById('gamesTableBody');

        if (this.filteredGames.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="no-results">
                        No games found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }

        // Sort games alphabetically by title
        const sortedGames = [...this.filteredGames].sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        // Split games into two columns for desktop
        const isDesktop = window.innerWidth >= 1200;
        const columns = isDesktop ? 2 : 1;
        const gamesPerColumn = Math.ceil(sortedGames.length / columns);

        // Clear existing content
        tableBody.innerHTML = '';

        if (isDesktop && sortedGames.length > 10) {
            // Render in two columns
            this.renderTwoColumns(sortedGames, gamesPerColumn);
        } else {
            // Render in single column
            this.renderSingleColumn(sortedGames);
        }
    }

    renderSingleColumn(games) {
        const tableBody = document.getElementById('gamesTableBody');

        games.forEach(game => {
            const row = this.createGameRow(game);
            tableBody.appendChild(row);
        });
    }

    renderTwoColumns(games, gamesPerColumn) {
        // For two-column layout, we need to modify the table structure
        const container = document.querySelector('.table-container');

        // Create two separate table wrappers
        container.innerHTML = '';

        for (let col = 0; col < 2; col++) {
            const startIndex = col * gamesPerColumn;
            const endIndex = Math.min(startIndex + gamesPerColumn, games.length);
            const columnGames = games.slice(startIndex, endIndex);

            if (columnGames.length === 0) continue;

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-wrapper';

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Game Title</th>
                        <th>Region</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');
            columnGames.forEach(game => {
                const row = this.createGameRow(game);
                tbody.appendChild(row);
            });

            tableWrapper.appendChild(table);
            container.appendChild(tableWrapper);
        }
    }

    createGameRow(game) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${this.escapeHtml(game.title)}</td>
            <td class="region-cell">
                <img src="images/flags/${game.region.toLowerCase()}.png"
                     alt="${game.region}"
                     class="region-flag"
                     onerror="this.style.display='none'">
                <span>${game.region}</span>
            </td>
            <td>
                <span class="type-badge type-${game.type}">${game.type}</span>
            </td>
        `;

        return row;
    }

    updateStats() {
        const total = this.filteredGames.length;
        const retail = this.filteredGames.filter(g => g.type === 'retail').length;
        const homebrew = this.filteredGames.filter(g => g.type === 'homebrew').length;

        const statsText = `Showing ${total} games (${retail} retail, ${homebrew} homebrew)`;
        document.getElementById('gameCount').textContent = statsText;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const tableBody = document.getElementById('gamesTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="no-results">
                    ${message}
                </td>
            </tr>
        `;
    }
}

// Handle responsive table rendering on window resize
window.addEventListener('resize', () => {
    if (window.gameCollection) {
        window.gameCollection.renderGames();
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameCollection = new XboxGameCollection();
});
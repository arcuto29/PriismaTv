// PriismaTv - Main Application
class PriismaTv {
    constructor() {
        this.content = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT)) || [];
        this.watchlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST)) || [];
        this.favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        this.friends = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIENDS)) || [];
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindSearch();
        this.bindModal();
        this.bindAdmin();
        this.bindFriends();
        this.bindSidebar();
        this.renderHome();
        this.updateStats();
    }

    // ===== NAVIGATION =====
    bindNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));

        const pageEl = document.getElementById(`page-${page}`);
        const navEl = document.querySelector(`[data-page="${page}"]`);
        if (pageEl) pageEl.classList.add('active');
        if (navEl) navEl.classList.add('active');

        // Render page content
        switch(page) {
            case 'home': this.renderHome(); break;
            case 'movies': this.renderMovies(); break;
            case 'anime': this.renderAnime(); break;
            case 'tvshows': this.renderTVShows(); break;
            case 'watchlist': this.renderWatchlist(); break;
            case 'favorites': this.renderFavorites(); break;
            case 'friends': this.renderFriends(); break;
            case 'admin': this.updateStats(); break;
        }

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('mobile-open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    // ===== SIDEBAR =====
    bindSidebar() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        toggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // ===== RENDER HOME =====
    renderHome() {
        this.renderHero();
        this.renderRow('trendingRow', this.getByTag('trending'));
        this.renderRow('recentRow', this.getRecent());
        this.renderRow('topRatedRow', this.getByTag('top-rated'));
        this.renderRow('animeRow', this.content.filter(c => c.type === 'anime'));
    }

    renderHero() {
        const featured = this.content.filter(c => c.tags && c.tags.includes('must-watch'));
        const item = featured[Math.floor(Math.random() * featured.length)] || this.content[0];
        if (!item) return;

        const backdrop = document.querySelector('.hero-backdrop');
        if (item.backdrop) {
            backdrop.style.backgroundImage = `url(${item.backdrop})`;
        }
        document.getElementById('heroTitle').textContent = item.title;
        document.getElementById('heroDescription').textContent = item.description || '';
        
        const meta = document.getElementById('heroMeta');
        meta.innerHTML = `
            <span class="rating"><i class="fas fa-star"></i> ${item.rating || 'N/A'}</span>
            <span><i class="fas fa-calendar"></i> ${item.year || ''}</span>
            <span><i class="fas fa-tag"></i> ${item.genre || ''}</span>
            ${item.duration ? `<span><i class="fas fa-clock"></i> ${item.duration}</span>` : ''}
        `;

        document.getElementById('heroWatch').onclick = () => this.openDetail(item);
        document.getElementById('heroInfo').onclick = () => this.openDetail(item);
    }

    renderRow(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(item => this.createCard(item)).join('');
        this.bindCardEvents(container);
    }

    // ===== RENDER PAGES =====
    renderMovies() {
        const genre = document.getElementById('movieGenreFilter').value;
        const sort = document.getElementById('movieSortFilter').value;
        let items = this.content.filter(c => c.type === 'movie');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('moviesGrid', items);

        document.getElementById('movieGenreFilter').onchange = () => this.renderMovies();
        document.getElementById('movieSortFilter').onchange = () => this.renderMovies();
    }

    renderAnime() {
        const genre = document.getElementById('animeGenreFilter').value;
        const sort = document.getElementById('animeSortFilter').value;
        let items = this.content.filter(c => c.type === 'anime');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('animeGrid', items);

        document.getElementById('animeGenreFilter').onchange = () => this.renderAnime();
        document.getElementById('animeSortFilter').onchange = () => this.renderAnime();
    }

    renderTVShows() {
        const genre = document.getElementById('tvGenreFilter').value;
        const sort = document.getElementById('tvSortFilter').value;
        let items = this.content.filter(c => c.type === 'tvshow');
        items = this.filterAndSort(items, genre, sort);
        this.renderGrid('tvshowsGrid', items);

        document.getElementById('tvGenreFilter').onchange = () => this.renderTVShows();
        document.getElementById('tvSortFilter').onchange = () => this.renderTVShows();
    }


    renderWatchlist() {
        const items = this.content.filter(c => this.watchlist.includes(c.id));
        this.renderGrid('watchlistGrid', items);
        document.getElementById('watchlistCount').textContent = `${items.length} items`;
        
        const empty = document.getElementById('watchlistEmpty');
        if (items.length === 0) {
            empty.classList.add('active');
        } else {
            empty.classList.remove('active');
        }

        document.getElementById('clearWatchlist').onclick = () => {
            if (confirm('Clear your entire watchlist?')) {
                this.watchlist = [];
                this.saveWatchlist();
                this.renderWatchlist();
                this.showToast('Watchlist cleared', 'info');
            }
        };
    }

    renderFavorites() {
        const items = this.content.filter(c => this.favorites.includes(c.id));
        this.renderGrid('favoritesGrid', items);
        document.getElementById('favoritesCount').textContent = `${items.length} items`;

        const empty = document.getElementById('favoritesEmpty');
        if (items.length === 0) {
            empty.classList.add('active');
        } else {
            empty.classList.remove('active');
        }
    }

    renderGrid(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(item => this.createCard(item)).join('');
        this.bindCardEvents(container);
    }

    // ===== CARD CREATION =====
    createCard(item) {
        const isWatchlist = this.watchlist.includes(item.id);
        const isFavorite = this.favorites.includes(item.id);
        const posterUrl = item.poster || `https://via.placeholder.com/300x450/1a1a2e/00b4ff?text=${encodeURIComponent(item.title)}`;
        
        return `
            <div class="content-card" data-id="${item.id}">
                <div class="card-poster">
                    <img src="${posterUrl}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450/1a1a2e/00b4ff?text=${encodeURIComponent(item.title)}'">
                    <span class="card-type-badge ${item.type}">${item.type === 'tvshow' ? 'TV' : item.type}</span>
                    <div class="card-overlay">
                        <div class="card-overlay-actions">
                            <button class="watchlist-btn ${isWatchlist ? 'active' : ''}" data-id="${item.id}" title="Watchlist">
                                <i class="fas fa-bookmark"></i>
                            </button>
                            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" title="Favorite">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <div class="card-meta">
                        <span class="rating"><i class="fas fa-star"></i> ${item.rating || '-'}</span>
                        <span>${item.year || ''}</span>
                        <span>${item.genre || ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    bindCardEvents(container) {
        container.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.watchlist-btn') || e.target.closest('.favorite-btn')) return;
                const id = card.dataset.id;
                const item = this.content.find(c => c.id === id);
                if (item) this.openDetail(item);
            });
        });

        container.querySelectorAll('.watchlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWatchlist(btn.dataset.id);
                btn.classList.toggle('active');
            });
        });

        container.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(btn.dataset.id);
                btn.classList.toggle('active');
            });
        });
    }


    // ===== DETAIL MODAL =====
    bindModal() {
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('detailModal')) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openDetail(item) {
        const modal = document.getElementById('detailModal');
        const backdrop = document.getElementById('modalBackdrop');
        
        if (item.backdrop) {
            backdrop.style.backgroundImage = `url(${item.backdrop})`;
        } else if (item.poster) {
            backdrop.style.backgroundImage = `url(${item.poster})`;
        }

        const posterEl = document.getElementById('modalPoster');
        posterEl.innerHTML = `<img src="${item.poster || ''}" alt="${item.title}">`;

        document.getElementById('modalTitle').textContent = item.title;
        document.getElementById('modalDescription').textContent = item.description || 'No description available.';

        const meta = document.getElementById('modalMeta');
        meta.innerHTML = `
            <span class="rating"><i class="fas fa-star"></i> ${item.rating || 'N/A'}</span>
            <span><i class="fas fa-calendar"></i> ${item.year || 'Unknown'}</span>
            <span><i class="fas fa-tag"></i> ${item.genre || 'Unknown'}</span>
            ${item.duration ? `<span><i class="fas fa-clock"></i> ${item.duration}</span>` : ''}
            ${item.episodes ? `<span><i class="fas fa-list"></i> ${item.episodes} eps</span>` : ''}
            ${item.seasons ? `<span><i class="fas fa-layer-group"></i> ${item.seasons} seasons</span>` : ''}
        `;

        // Watch button
        const watchBtn = document.getElementById('modalWatch');
        if (item.video) {
            watchBtn.onclick = () => window.open(item.video, '_blank');
        } else if (item.magnet) {
            watchBtn.onclick = () => window.open(item.magnet);
        } else {
            watchBtn.onclick = () => this.showToast('No stream link available. Add one via the admin panel.', 'info');
        }

        // Watchlist button
        const wlBtn = document.getElementById('modalWatchlist');
        const isWl = this.watchlist.includes(item.id);
        wlBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${isWl ? 'In Watchlist' : 'Watchlist'}`;
        wlBtn.onclick = () => {
            this.toggleWatchlist(item.id);
            const nowWl = this.watchlist.includes(item.id);
            wlBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${nowWl ? 'In Watchlist' : 'Watchlist'}`;
        };

        // Favorite button
        const favBtn = document.getElementById('modalFavorite');
        favBtn.classList.toggle('active', this.favorites.includes(item.id));
        favBtn.onclick = () => {
            this.toggleFavorite(item.id);
            favBtn.classList.toggle('active', this.favorites.includes(item.id));
        };

        // Share button
        document.getElementById('modalShare').onclick = () => {
            const shareData = JSON.stringify({ shared: [item.id], from: 'PriismaTv' });
            navigator.clipboard.writeText(btoa(shareData)).then(() => {
                this.showToast('Share code copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Could not copy. Try manually.', 'error');
            });
        };

        // Links
        const linksEl = document.getElementById('modalLinks');
        let links = '';
        if (item.video) links += `<a href="${item.video}" target="_blank"><i class="fas fa-play"></i> Stream</a>`;
        if (item.magnet) links += `<a href="${item.magnet}"><i class="fas fa-magnet"></i> Magnet Link</a>`;
        linksEl.innerHTML = links;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('detailModal').classList.remove('active');
        document.body.style.overflow = '';
    }


    // ===== SEARCH =====
    bindSearch() {
        const input = document.getElementById('searchInput');
        const results = document.getElementById('searchResults');

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            if (query.length < 2) {
                results.classList.remove('active');
                return;
            }

            const matches = this.content.filter(item =>
                item.title.toLowerCase().includes(query) ||
                (item.genre && item.genre.toLowerCase().includes(query)) ||
                (item.type && item.type.toLowerCase().includes(query)) ||
                (item.tags && item.tags.some(t => t.includes(query)))
            ).slice(0, 8);

            if (matches.length === 0) {
                results.innerHTML = '<div class="search-result-item"><span style="color: var(--text-muted)">No results found</span></div>';
            } else {
                results.innerHTML = matches.map(item => `
                    <div class="search-result-item" data-id="${item.id}">
                        <img src="${item.poster || 'https://via.placeholder.com/45x65/1a1a2e/00b4ff'}" alt="">
                        <div class="search-result-info">
                            <h4>${item.title}</h4>
                            <span>${item.type === 'tvshow' ? 'TV Show' : item.type} • ${item.year || ''} • ★ ${item.rating || 'N/A'}</span>
                        </div>
                    </div>
                `).join('');
            }
            results.classList.add('active');

            results.querySelectorAll('.search-result-item[data-id]').forEach(el => {
                el.addEventListener('click', () => {
                    const item = this.content.find(c => c.id === el.dataset.id);
                    if (item) this.openDetail(item);
                    results.classList.remove('active');
                    input.value = '';
                });
            });
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                results.classList.remove('active');
                input.blur();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                results.classList.remove('active');
            }
        });
    }


    // ===== ADMIN =====
    bindAdmin() {
        const form = document.getElementById('addContentForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContent();
        });

        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
    }

    addContent() {
        const title = document.getElementById('contentTitle').value.trim();
        if (!title) return;

        const newItem = {
            id: `custom_${Date.now()}`,
            title: title,
            type: document.getElementById('contentType').value,
            year: parseInt(document.getElementById('contentYear').value) || new Date().getFullYear(),
            rating: parseFloat(document.getElementById('contentRating').value) || null,
            genre: document.getElementById('contentGenre').value,
            description: document.getElementById('contentDescription').value.trim(),
            poster: document.getElementById('contentPoster').value.trim() || null,
            backdrop: document.getElementById('contentBackdrop').value.trim() || null,
            video: document.getElementById('contentVideo').value.trim() || null,
            magnet: document.getElementById('contentMagnet').value.trim() || null,
            duration: document.getElementById('contentDuration').value.trim() || null,
            episodes: parseInt(document.getElementById('contentEpisodes').value) || null,
            seasons: parseInt(document.getElementById('contentSeasons').value) || null,
            tags: document.getElementById('contentTags').value.split(',').map(t => t.trim()).filter(Boolean),
            dateAdded: new Date().toISOString().split('T')[0]
        };

        this.content.push(newItem);
        this.saveContent();
        this.updateStats();
        document.getElementById('addContentForm').reset();
        this.showToast(`"${title}" added to your collection!`, 'success');
    }

    exportData() {
        const data = {
            content: this.content,
            watchlist: this.watchlist,
            favorites: this.favorites,
            friends: this.friends,
            exportDate: new Date().toISOString(),
            app: 'PriismaTv'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `priismatv_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Collection exported successfully!', 'success');
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.content) {
                    this.content = data.content;
                    this.saveContent();
                }
                if (data.watchlist) {
                    this.watchlist = data.watchlist;
                    this.saveWatchlist();
                }
                if (data.favorites) {
                    this.favorites = data.favorites;
                    this.saveFavorites();
                }
                if (data.friends) {
                    this.friends = data.friends;
                    this.saveFriends();
                }
                this.updateStats();
                this.renderHome();
                this.showToast('Collection imported successfully!', 'success');
            } catch (err) {
                this.showToast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    updateStats() {
        const movies = this.content.filter(c => c.type === 'movie').length;
        const anime = this.content.filter(c => c.type === 'anime').length;
        const tv = this.content.filter(c => c.type === 'tvshow').length;
        document.getElementById('statMovies').textContent = movies;
        document.getElementById('statAnime').textContent = anime;
        document.getElementById('statTV').textContent = tv;
        document.getElementById('statTotal').textContent = this.content.length;
    }


    // ===== FRIENDS =====
    bindFriends() {
        document.getElementById('addFriendBtn').addEventListener('click', () => this.addFriend());
        document.getElementById('friendName').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.addFriend();
        });
        document.getElementById('shareListBtn').addEventListener('click', () => this.shareList());
        document.getElementById('importListBtn').addEventListener('click', () => this.importSharedList());
    }

    renderFriends() {
        const list = document.getElementById('friendsList');
        list.innerHTML = this.friends.map((f, i) => `
            <div class="friend-item">
                <div class="avatar">${f.name.charAt(0).toUpperCase()}</div>
                <span>${f.name}</span>
                <button onclick="app.removeFriend(${i})" title="Remove"><i class="fas fa-times"></i></button>
            </div>
        `).join('') || '<p style="color: var(--text-muted); font-size: 0.85rem;">No friends added yet</p>';
    }

    addFriend() {
        const input = document.getElementById('friendName');
        const name = input.value.trim();
        if (!name) return;
        this.friends.push({ name, addedAt: new Date().toISOString() });
        this.saveFriends();
        this.renderFriends();
        input.value = '';
        this.showToast(`${name} added as a friend!`, 'success');
    }

    removeFriend(index) {
        const name = this.friends[index]?.name;
        this.friends.splice(index, 1);
        this.saveFriends();
        this.renderFriends();
        this.showToast(`${name} removed`, 'info');
    }

    shareList() {
        const shareData = {
            watchlist: this.watchlist,
            favorites: this.favorites,
            content: this.content.filter(c => this.watchlist.includes(c.id) || this.favorites.includes(c.id)),
            sharedBy: 'PriismaTv User',
            sharedAt: new Date().toISOString()
        };
        const code = btoa(JSON.stringify(shareData));
        navigator.clipboard.writeText(code).then(() => {
            this.showToast('Share code copied! Send it to your friends.', 'success');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('Share code copied!', 'success');
        });
    }

    importSharedList() {
        const code = document.getElementById('importCode').value.trim();
        if (!code) {
            this.showToast('Please paste a share code', 'error');
            return;
        }
        try {
            const data = JSON.parse(atob(code));
            if (data.content && Array.isArray(data.content)) {
                let added = 0;
                data.content.forEach(item => {
                    if (!this.content.find(c => c.id === item.id)) {
                        this.content.push(item);
                        added++;
                    }
                });
                this.saveContent();
                if (data.watchlist) {
                    data.watchlist.forEach(id => {
                        if (!this.watchlist.includes(id)) this.watchlist.push(id);
                    });
                    this.saveWatchlist();
                }
                this.showToast(`Imported ${added} new items from shared list!`, 'success');
                document.getElementById('importCode').value = '';
            } else {
                this.showToast('Invalid share code format', 'error');
            }
        } catch (err) {
            this.showToast('Could not decode share code', 'error');
        }
    }


    // ===== WATCHLIST & FAVORITES =====
    toggleWatchlist(id) {
        const idx = this.watchlist.indexOf(id);
        if (idx > -1) {
            this.watchlist.splice(idx, 1);
            this.showToast('Removed from watchlist', 'info');
        } else {
            this.watchlist.push(id);
            this.showToast('Added to watchlist!', 'success');
        }
        this.saveWatchlist();
    }

    toggleFavorite(id) {
        const idx = this.favorites.indexOf(id);
        if (idx > -1) {
            this.favorites.splice(idx, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(id);
            this.showToast('Added to favorites! ❤️', 'success');
        }
        this.saveFavorites();
    }

    // ===== HELPERS =====
    getByTag(tag) {
        return this.content.filter(c => c.tags && c.tags.includes(tag));
    }

    getRecent() {
        return [...this.content].sort((a, b) => 
            new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0)
        ).slice(0, 12);
    }

    filterAndSort(items, genre, sort) {
        if (genre !== 'all') {
            items = items.filter(i => i.genre === genre);
        }
        switch(sort) {
            case 'rating':
                items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'title':
                items.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'newest':
            default:
                items.sort((a, b) => (b.year || 0) - (a.year || 0));
                break;
        }
        return items;
    }

    // ===== STORAGE =====
    saveContent() { localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(this.content)); }
    saveWatchlist() { localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(this.watchlist)); }
    saveFavorites() { localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites)); }
    saveFriends() { localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(this.friends)); }

    // ===== TOAST =====
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app
const app = new PriismaTv();

// ═══════════════════════════════════════════════════════════
// PriismaTv - Data Layer & Sample Content
// All data persisted in localStorage for free hosting
// ═══════════════════════════════════════════════════════════

const STORAGE_KEYS = {
    CONTENT: 'priismatv_content',
    WATCHLIST: 'priismatv_watchlist',
    FAVORITES: 'priismatv_favorites',
    FRIENDS: 'priismatv_friends',
    USER: 'priismatv_user'
};

// Pre-loaded sample content with TMDB images + YouTube trailers
const SAMPLE_CONTENT = [
    // ═══════ MOVIES ═══════
    {
        id: 'mov_1', title: 'Interstellar', type: 'movie', year: 2014, rating: 8.7, genre: 'sci-fi',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth becomes uninhabitable.',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVZp2A.jpg',
        trailer: 'zSWdZVtXT7E', duration: '2h 49m',
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-01-15'
    },
    {
        id: 'mov_2', title: 'The Dark Knight', type: 'movie', year: 2008, rating: 9.0, genre: 'action',
        description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUOzMKh6GGE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg',
        trailer: 'EXeTwQWrcwY', duration: '2h 32m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-10'
    },
    {
        id: 'mov_3', title: 'Blade Runner 2049', type: 'movie', year: 2017, rating: 8.0, genre: 'sci-fi',
        description: 'Young Blade Runner K discovers a long-buried secret that leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.',
        poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg',
        trailer: 'gCcx85zbxz4', duration: '2h 44m',
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-01'
    },
    {
        id: 'mov_4', title: 'Inception', type: 'movie', year: 2010, rating: 8.8, genre: 'sci-fi',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        trailer: 'YoHD9XEInc0', duration: '2h 28m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-20'
    },
    {
        id: 'mov_5', title: 'Dune: Part Two', type: 'movie', year: 2024, rating: 8.6, genre: 'sci-fi',
        description: 'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        trailer: 'Way9Dexny3w', duration: '2h 46m',
        tags: ['trending', 'must-watch'], dateAdded: '2024-03-01'
    },
    {
        id: 'mov_6', title: 'Oppenheimer', type: 'movie', year: 2023, rating: 8.5, genre: 'drama',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
        trailer: 'uYPbbksJxIg', duration: '3h',
        tags: ['top-rated'], dateAdded: '2024-01-30'
    },
    {
        id: 'mov_7', title: 'Spider-Man: Across the Spider-Verse', type: 'movie', year: 2023, rating: 8.7, genre: 'animation',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
        poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        trailer: 'cqGjhVJWtEg', duration: '2h 20m',
        tags: ['trending', 'must-watch', 'top-rated'], dateAdded: '2024-02-14'
    },
    {
        id: 'mov_8', title: 'John Wick: Chapter 4', type: 'movie', year: 2023, rating: 7.7, genre: 'action',
        description: 'John Wick uncovers a path to defeating The High Table but must face off against a new enemy with powerful alliances.',
        poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyLBB2SIMQ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg',
        trailer: 'qEVUtrk8_B4', duration: '2h 49m',
        tags: ['trending'], dateAdded: '2024-02-05'
    },
    {
        id: 'mov_9', title: 'The Batman', type: 'movie', year: 2022, rating: 7.8, genre: 'action',
        description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman investigates the city\'s hidden corruption.',
        poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyFAJlME0banwGTGnL.jpg',
        trailer: 'mqqft2x_Aa4', duration: '2h 56m',
        tags: ['must-watch'], dateAdded: '2024-01-22'
    },
    {
        id: 'mov_10', title: 'Everything Everywhere All at Once', type: 'movie', year: 2022, rating: 8.0, genre: 'sci-fi',
        description: 'A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence by exploring other universes.',
        poster: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/fWkB9k0LfNqfcrYWS3p6NjohMDQ.jpg',
        trailer: 'wxN1T1uxQ2g', duration: '2h 19m',
        tags: ['top-rated'], dateAdded: '2024-02-18'
    },

    // ═══════ ANIME ═══════
    {
        id: 'ani_1', title: 'Attack on Titan', type: 'anime', year: 2013, rating: 9.0, genre: 'action',
        description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.',
        poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
        trailer: 'MGRm4IzK1SQ', episodes: 87, seasons: 4,
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-01-05'
    },
    {
        id: 'ani_2', title: 'Demon Slayer', type: 'anime', year: 2019, rating: 8.7, genre: 'action',
        description: 'Tanjiro sets out to become a demon slayer to avenge his family and cure his sister who is turning into a demon.',
        poster: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdQ6HGbhagQ0UHZlK.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/5DUMPBMjPKQj3wQzakupgBEYcSR.jpg',
        trailer: 'VQGCKyvRw3A', episodes: 55, seasons: 4,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-10'
    },
    {
        id: 'ani_3', title: 'Jujutsu Kaisen', type: 'anime', year: 2020, rating: 8.6, genre: 'action',
        description: 'A boy swallows a cursed talisman and becomes host to a powerful Curse. He enrolls in a school for sorcerers to control his newfound powers.',
        poster: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/9CxWh0jMWctDPmBHtnOEIsCDWn.jpg',
        trailer: '4A_X-Dvl0ws', episodes: 47, seasons: 2,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-15'
    },
    {
        id: 'ani_4', title: 'Your Name', type: 'anime', year: 2016, rating: 8.4, genre: 'romance',
        description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
        poster: 'https://image.tmdb.org/t/p/w500/q719jXXEhI1GBquMrUFfMHiGKfl.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dIWwZW7dJJtqC6CgWzYkNVKIUm8.jpg',
        trailer: 'xU47nhruN-Q', duration: '1h 46m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-25'
    },
    {
        id: 'ani_5', title: 'Spy x Family', type: 'anime', year: 2022, rating: 8.5, genre: 'comedy',
        description: 'A spy must form a fake family for a mission, not knowing his adopted daughter is a telepath and his pretend wife is an assassin.',
        poster: 'https://image.tmdb.org/t/p/w500/3r4LYFuXdKYnFmSEKBMk4JC4tU6.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/bEciFlh0mII0MWrEBpAbZEyfT6x.jpg',
        trailer: 'ofXigVM6dDQ', episodes: 37, seasons: 2,
        tags: ['trending'], dateAdded: '2024-03-05'
    },
    {
        id: 'ani_6', title: 'Death Note', type: 'anime', year: 2006, rating: 9.0, genre: 'thriller',
        description: 'A student discovers a supernatural notebook that kills anyone whose name is written in it, leading to a deadly game of cat and mouse.',
        poster: 'https://image.tmdb.org/t/p/w500/iigTJJskR1PcjjXqxdyJwVB3BoU.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/A2t1T2nSMjpzcCMpMFbnQTSP4FU.jpg',
        trailer: 'NlJZ-YgAt-c', episodes: 37, seasons: 1,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-12'
    },
    {
        id: 'ani_7', title: 'One Punch Man', type: 'anime', year: 2015, rating: 8.7, genre: 'action',
        description: 'The story of Saitama, a hero who can defeat any opponent with a single punch but seeks to find a worthy challenger.',
        poster: 'https://image.tmdb.org/t/p/w500/iE3s0lG5QVdEHOEZnoAxjmMtvnc.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/yAwrhlYiBgVCzqMy9VLRhMrHTBf.jpg',
        trailer: 'A3Jks90zaEE', episodes: 24, seasons: 2,
        tags: ['trending'], dateAdded: '2024-02-22'
    },
    {
        id: 'ani_8', title: 'Chainsaw Man', type: 'anime', year: 2022, rating: 8.5, genre: 'action',
        description: 'A young man left for dead is reborn as a powerful devil-human hybrid after merging with his pet devil Pochita.',
        poster: 'https://image.tmdb.org/t/p/w500/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/5LIRV0MBNRnoeplbOPgkCVmbUbm.jpg',
        trailer: 'q15CRdE5Bv0', episodes: 12, seasons: 1,
        tags: ['trending', 'must-watch'], dateAdded: '2024-03-08'
    },

    // ═══════ TV SHOWS ═══════
    {
        id: 'tv_1', title: 'Breaking Bad', type: 'tvshow', year: 2008, rating: 9.5, genre: 'drama',
        description: 'A chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine to secure his family\'s future.',
        poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        trailer: 'HhesaQXLuRY', episodes: 62, seasons: 5,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-08'
    },
    {
        id: 'tv_2', title: 'Stranger Things', type: 'tvshow', year: 2016, rating: 8.7, genre: 'sci-fi',
        description: 'When a young boy disappears, his mother and friends must confront terrifying supernatural forces to get him back.',
        poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/56v2KjBlYz0JslLCyzXN3f7UxKl.jpg',
        trailer: 'b9EkMc79ZSU', episodes: 34, seasons: 4,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-20'
    },
    {
        id: 'tv_3', title: 'The Last of Us', type: 'tvshow', year: 2023, rating: 8.8, genre: 'drama',
        description: 'Joel and Ellie must survive in a post-apocalyptic world ravaged by a fungal infection that turns humans into zombie-like creatures.',
        poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
        trailer: 'uLtkt8BonwM', episodes: 16, seasons: 2,
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-03-10'
    },
    {
        id: 'tv_4', title: 'Arcane', type: 'tvshow', year: 2021, rating: 9.0, genre: 'action',
        description: 'Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League of Legends champions.',
        poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rkB4LyZHo1NHXFEDHl9vSD9r1lI.jpg',
        trailer: 'fXmAurh012s', episodes: 18, seasons: 2,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-02-28'
    },
    {
        id: 'tv_5', title: 'The Boys', type: 'tvshow', year: 2019, rating: 8.7, genre: 'action',
        description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their powers rather than using them for good.',
        poster: 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/7Ns6tO3aYjppI5bFhyYZurOYGBT.jpg',
        trailer: 'tcrNsIaQkb4', episodes: 32, seasons: 4,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-12'
    },
    {
        id: 'tv_6', title: 'House of the Dragon', type: 'tvshow', year: 2022, rating: 8.4, genre: 'fantasy',
        description: 'Set 200 years before Game of Thrones, the series tells the story of House Targaryen civil war.',
        poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
        trailer: 'DotnJ7tTA34', episodes: 18, seasons: 2,
        tags: ['trending'], dateAdded: '2024-03-15'
    },
    {
        id: 'tv_7', title: 'Wednesday', type: 'tvshow', year: 2022, rating: 8.1, genre: 'comedy',
        description: 'Wednesday Addams is sent to Nevermore Academy, where she attempts to master her psychic abilities and solve a supernatural mystery.',
        poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
        trailer: 'Di310WS8zLk', episodes: 8, seasons: 1,
        tags: ['trending'], dateAdded: '2024-01-28'
    }
];

// ═══════ INITIALIZE DATA ═══════
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(SAMPLE_CONTENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WATCHLIST)) {
        localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FRIENDS)) {
        localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name: 'PriismaTv User', avatar: 'P' }));
    }
}

initializeData();

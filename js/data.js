// PriismaTv - Sample Data & Local Storage Management
const STORAGE_KEYS = {
    CONTENT: 'priismatv_content',
    WATCHLIST: 'priismatv_watchlist',
    FAVORITES: 'priismatv_favorites',
    FRIENDS: 'priismatv_friends',
    USER: 'priismatv_user'
};

// Sample content to pre-populate
const SAMPLE_CONTENT = [
    {
        id: 'mov_1',
        title: 'Interstellar',
        type: 'movie',
        year: 2014,
        rating: 8.7,
        genre: 'sci-fi',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVZp2A.jpg',
        duration: '2h 49m',
        tags: ['trending', 'top-rated', 'must-watch'],
        dateAdded: '2024-01-15'
    },
    {
        id: 'mov_2',
        title: 'The Dark Knight',
        type: 'movie',
        year: 2008,
        rating: 9.0,
        genre: 'action',
        description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUOzMKh6GGE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg',
        duration: '2h 32m',
        tags: ['top-rated', 'must-watch'],
        dateAdded: '2024-01-10'
    },

    {
        id: 'mov_3',
        title: 'Blade Runner 2049',
        type: 'movie',
        year: 2017,
        rating: 8.0,
        genre: 'sci-fi',
        description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
        poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg',
        duration: '2h 44m',
        tags: ['trending'],
        dateAdded: '2024-02-01'
    },
    {
        id: 'mov_4',
        title: 'Inception',
        type: 'movie',
        year: 2010,
        rating: 8.8,
        genre: 'sci-fi',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        duration: '2h 28m',
        tags: ['top-rated', 'must-watch'],
        dateAdded: '2024-01-20'
    },
    {
        id: 'mov_5',
        title: 'Dune: Part Two',
        type: 'movie',
        year: 2024,
        rating: 8.6,
        genre: 'sci-fi',
        description: 'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family while trying to prevent a terrible future.',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        duration: '2h 46m',
        tags: ['trending', 'must-watch'],
        dateAdded: '2024-03-01'
    },

    {
        id: 'ani_1',
        title: 'Attack on Titan',
        type: 'anime',
        year: 2013,
        rating: 9.0,
        genre: 'action',
        description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
        poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
        episodes: 87,
        seasons: 4,
        tags: ['trending', 'top-rated'],
        dateAdded: '2024-01-05'
    },
    {
        id: 'ani_2',
        title: 'Demon Slayer',
        type: 'anime',
        year: 2019,
        rating: 8.7,
        genre: 'action',
        description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family.',
        poster: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdQ6HGbhagQ0UHZlK.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/5DUMPBMjPKQj3wQzakupgBEYcSR.jpg',
        episodes: 55,
        seasons: 4,
        tags: ['trending', 'must-watch'],
        dateAdded: '2024-02-10'
    },
    {
        id: 'ani_3',
        title: 'Jujutsu Kaisen',
        type: 'anime',
        year: 2020,
        rating: 8.6,
        genre: 'action',
        description: 'A boy swallows a cursed talisman and becomes host to a powerful curse. He enrolls in a school of sorcerers to control his new powers.',
        poster: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/9CxWh0jMWctDPmBHtnOEIsCDWn.jpg',
        episodes: 47,
        seasons: 2,
        tags: ['trending'],
        dateAdded: '2024-02-15'
    },
    {
        id: 'ani_4',
        title: 'Your Name',
        type: 'anime',
        year: 2016,
        rating: 8.4,
        genre: 'romance',
        description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
        poster: 'https://image.tmdb.org/t/p/w500/q719jXXEhI1GBquMrUFfMHiGKfl.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dIWwZW7dJJtqC6CgWzYkNVKIUm8.jpg',
        duration: '1h 46m',
        tags: ['top-rated', 'must-watch'],
        dateAdded: '2024-01-25'
    },

    {
        id: 'ani_5',
        title: 'Spy x Family',
        type: 'anime',
        year: 2022,
        rating: 8.5,
        genre: 'comedy',
        description: 'A spy on a mission to form a fake family discovers that the girl he adopts can read minds and his pretend wife is an assassin.',
        poster: 'https://image.tmdb.org/t/p/w500/3r4LYFuXdKYnFmSEKBMk4JC4tU6.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/bEciFlh0mII0MWrEBpAbZEyfT6x.jpg',
        episodes: 37,
        seasons: 2,
        tags: ['trending'],
        dateAdded: '2024-03-05'
    },
    {
        id: 'tv_1',
        title: 'Breaking Bad',
        type: 'tvshow',
        year: 2008,
        rating: 9.5,
        genre: 'drama',
        description: 'A high school chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine to secure his family\'s future.',
        poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        episodes: 62,
        seasons: 5,
        tags: ['top-rated', 'must-watch'],
        dateAdded: '2024-01-08'
    },
    {
        id: 'tv_2',
        title: 'Stranger Things',
        type: 'tvshow',
        year: 2016,
        rating: 8.7,
        genre: 'sci-fi',
        description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces to get him back.',
        poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/56v2KjBlYz0JslLCyzXN3f7UxKl.jpg',
        episodes: 34,
        seasons: 4,
        tags: ['trending', 'must-watch'],
        dateAdded: '2024-02-20'
    },
    {
        id: 'tv_3',
        title: 'The Last of Us',
        type: 'tvshow',
        year: 2023,
        rating: 8.8,
        genre: 'drama',
        description: 'Joel and Ellie must survive in a post-apocalyptic world ravaged by a fungal infection that turns humans into zombie-like creatures.',
        poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
        episodes: 16,
        seasons: 2,
        tags: ['trending', 'top-rated'],
        dateAdded: '2024-03-10'
    },
    {
        id: 'tv_4',
        title: 'Arcane',
        type: 'tvshow',
        year: 2021,
        rating: 9.0,
        genre: 'action',
        description: 'Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League of Legends champions.',
        poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rkB4LyZHo1NHXFEDHl9vSD9r1lI.jpg',
        episodes: 18,
        seasons: 2,
        tags: ['top-rated', 'must-watch'],
        dateAdded: '2024-02-28'
    },
    {
        id: 'mov_6',
        title: 'Oppenheimer',
        type: 'movie',
        year: 2023,
        rating: 8.5,
        genre: 'drama',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
        duration: '3h',
        tags: ['top-rated'],
        dateAdded: '2024-01-30'
    }
];

// Initialize storage with sample data if empty
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
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ name: 'Vault User', avatar: 'P' }));
    }
}

initializeData();

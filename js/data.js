// ═══════════════════════════════════════════════════════════
// PriismaTv - Data Layer & Content Library
// ═══════════════════════════════════════════════════════════

const STORAGE_KEYS = {
    CONTENT: 'priismatv_content',
    WATCHLIST: 'priismatv_watchlist',
    FAVORITES: 'priismatv_favorites',
    FRIENDS: 'priismatv_friends',
    USER: 'priismatv_user'
};

const SAMPLE_CONTENT = [
    // ═══════ MOVIES ═══════
    {
        id: 'mov_1', title: 'Interstellar', type: 'movie', year: 2014, rating: 8.7, genre: 'sci-fi',
        description: 'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK1DVZp2A.jpg',
        trailer: 'zSWdZVtXT7E', duration: '2h 49m',
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-01-15'
    },
    {
        id: 'mov_2', title: 'The Dark Knight', type: 'movie', year: 2008, rating: 9.0, genre: 'action',
        description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUOzMKh6GGE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg',
        trailer: 'EXeTwQWrcwY', duration: '2h 32m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-10'
    },
    {
        id: 'mov_3', title: 'Inception', type: 'movie', year: 2010, rating: 8.8, genre: 'sci-fi',
        description: 'A thief who enters people\'s dreams is given the task of planting an idea in a CEO\'s mind.',
        poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        trailer: 'YoHD9XEInc0', duration: '2h 28m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-20'
    },
    {
        id: 'mov_4', title: 'Dune: Part Two', type: 'movie', year: 2024, rating: 8.6, genre: 'sci-fi',
        description: 'Paul Atreides unites with the Fremen on a warpath of revenge against House Harkonnen.',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        trailer: 'Way9Dexny3w', duration: '2h 46m',
        tags: ['trending', 'must-watch'], dateAdded: '2024-03-01'
    },

    // ═══════ HARRY POTTER SERIES ═══════
    {
        id: 'hp_1', title: 'Harry Potter and the Philosopher\'s Stone', type: 'movie', year: 2001, rating: 7.6, genre: 'fantasy',
        description: 'An orphaned boy discovers he is a wizard and enrolls at Hogwarts School of Witchcraft and Wizardry.',
        poster: 'https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/hziiv14OpD73u9gAak4XDDfBKa2.jpg',
        trailer: 'VyHV0BRtdxo', duration: '2h 32m',
        tags: ['must-watch'], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_2', title: 'Harry Potter and the Chamber of Secrets', type: 'movie', year: 2002, rating: 7.4, genre: 'fantasy',
        description: 'Harry returns to Hogwarts where a mysterious force is petrifying students one by one.',
        poster: 'https://image.tmdb.org/t/p/w500/sdEOH0992YZ0QSxgXNIGLq1ToUi.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/1stUIsjawROZxjiCMtqqXqgE0F5.jpg',
        trailer: 'jBltxS8HfQ4', duration: '2h 41m',
        tags: [], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_3', title: 'Harry Potter and the Prisoner of Azkaban', type: 'movie', year: 2004, rating: 7.9, genre: 'fantasy',
        description: 'Harry learns that a dangerous prisoner has escaped Azkaban and is believed to be after him.',
        poster: 'https://image.tmdb.org/t/p/w500/796Inh2Y9JOk1UPNjspbqM0HyrE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/vbk5CfaAHOjQPSAcYm6AoRYz2Af.jpg',
        trailer: 'lAxgztbYDbs', duration: '2h 22m',
        tags: ['top-rated'], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_4', title: 'Harry Potter and the Goblet of Fire', type: 'movie', year: 2005, rating: 7.7, genre: 'fantasy',
        description: 'Harry is mysteriously selected as a competitor in a dangerous wizarding tournament.',
        poster: 'https://image.tmdb.org/t/p/w500/fECBtHlr0RB3foNhAGR3TKI2TCD.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8f9dnOtOm4KiU1CcEj8JhmJrrmu.jpg',
        trailer: '3EGojp4Hh5A', duration: '2h 37m',
        tags: ['must-watch'], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_5', title: 'Harry Potter and the Order of the Phoenix', type: 'movie', year: 2007, rating: 7.5, genre: 'fantasy',
        description: 'Harry forms Dumbledore\'s Army to fight against the Ministry and the return of Voldemort.',
        poster: 'https://image.tmdb.org/t/p/w500/s836PRwHkLjrOJrfW0NOq4hHyZB.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/urDWNffjwmNi5IQaezw9GwqCUMI.jpg',
        trailer: 'y6ZW7KXaUGE', duration: '2h 18m',
        tags: [], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_6', title: 'Harry Potter and the Half-Blood Prince', type: 'movie', year: 2009, rating: 7.6, genre: 'fantasy',
        description: 'Dumbledore and Harry uncover the secret to destroying Voldemort using memories of Tom Riddle.',
        poster: 'https://image.tmdb.org/t/p/w500/z7uo3vwIwV5rQp1lsZs1bk2Ek36.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/urDWNffjwmNi5IQaezw9GwqCUMI.jpg',
        trailer: 'jcJHQJE_hNE', duration: '2h 33m',
        tags: [], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_7', title: 'Harry Potter and the Deathly Hallows: Part 1', type: 'movie', year: 2010, rating: 7.7, genre: 'fantasy',
        description: 'Harry, Ron, and Hermione set out to find and destroy Voldemort\'s Horcruxes.',
        poster: 'https://image.tmdb.org/t/p/w500/maP4MTfPCeVD2FZHKhMIA0Oj60k.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8YpMqfcnTTkMJaxkSqkPgLSKIjn.jpg',
        trailer: 'MxqsmMBMBzU', duration: '2h 26m',
        tags: [], dateAdded: '2024-01-01'
    },
    {
        id: 'hp_8', title: 'Harry Potter and the Deathly Hallows: Part 2', type: 'movie', year: 2011, rating: 8.1, genre: 'fantasy',
        description: 'The final battle between Harry and Voldemort. Everything ends here.',
        poster: 'https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoomR.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dVr11o9or7AS8AMPfwjSpEU83iU.jpg',
        trailer: '5NYt1qirBWg', duration: '2h 10m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-01'
    },

    // ═══════ LORD OF THE RINGS & HOBBIT ═══════
    {
        id: 'lotr_1', title: 'The Lord of the Rings: The Fellowship of the Ring', type: 'movie', year: 2001, rating: 8.8, genre: 'fantasy',
        description: 'A young hobbit must destroy a powerful ring to save Middle-earth from the Dark Lord Sauron.',
        poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg',
        trailer: 'V75dMMIW2B4', duration: '3h 48m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-02'
    },
    {
        id: 'lotr_2', title: 'The Lord of the Rings: The Two Towers', type: 'movie', year: 2002, rating: 8.8, genre: 'fantasy',
        description: 'The fellowship is broken. Frodo and Sam continue alone while war rages across Middle-earth.',
        poster: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
        trailer: 'LbfMDwc4azU', duration: '3h 55m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-02'
    },
    {
        id: 'lotr_3', title: 'The Lord of the Rings: The Return of the King', type: 'movie', year: 2003, rating: 9.0, genre: 'fantasy',
        description: 'The final battle for Middle-earth begins as Frodo reaches Mount Doom to destroy the One Ring.',
        poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg',
        trailer: 'r5X-hFf6Bwo', duration: '4h 11m',
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-02'
    },
    {
        id: 'hob_1', title: 'The Hobbit: An Unexpected Journey', type: 'movie', year: 2012, rating: 7.8, genre: 'fantasy',
        description: 'Bilbo Baggins is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor.',
        poster: 'https://image.tmdb.org/t/p/w500/yHA9Fc37VmpUA5UncTxxo3rTGVA.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xHYkJw9aQPMUNynFMgm0kBnYLQk.jpg',
        trailer: 'SDnYMbYB-nU', duration: '2h 49m',
        tags: ['must-watch'], dateAdded: '2024-01-02'
    },
    {
        id: 'hob_2', title: 'The Hobbit: The Desolation of Smaug', type: 'movie', year: 2013, rating: 7.8, genre: 'fantasy',
        description: 'The dwarves continue their journey to the Lonely Mountain, encountering the dragon Smaug.',
        poster: 'https://image.tmdb.org/t/p/w500/gl3cOYUCE6cWSmViOrgbAGiMWaT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/oQKb6MFxxrW04GO6P27xxCM9bKB.jpg',
        trailer: 'JDG2m5hN1vo', duration: '2h 41m',
        tags: [], dateAdded: '2024-01-02'
    },
    {
        id: 'hob_3', title: 'The Hobbit: The Battle of the Five Armies', type: 'movie', year: 2014, rating: 7.4, genre: 'fantasy',
        description: 'Bilbo and the Dwarves face the consequences of awakening Smaug as five armies clash.',
        poster: 'https://image.tmdb.org/t/p/w500/xT98tLqatZPQApyRmlPL12LtiWp.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/svWFGCGbENYjaNJlYiPnHbfaZkL.jpg',
        trailer: 'iVAgTiBrrDA', duration: '2h 24m',
        tags: [], dateAdded: '2024-01-02'
    },

    // ═══════ HUNGER GAMES ═══════
    {
        id: 'hg_1', title: 'The Hunger Games', type: 'movie', year: 2012, rating: 7.2, genre: 'action',
        description: 'Katniss Everdeen volunteers to take her sister\'s place in a televised death match.',
        poster: 'https://image.tmdb.org/t/p/w500/iPayaD5neYCRhicmHq3TXtG6FMV.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/pOlH8e2jHWOFgZBjqJPmvxkSEsE.jpg',
        trailer: 'mfBbSwAVWpA', duration: '2h 22m',
        tags: ['must-watch'], dateAdded: '2024-01-03'
    },
    {
        id: 'hg_2', title: 'The Hunger Games: Catching Fire', type: 'movie', year: 2013, rating: 7.5, genre: 'action',
        description: 'Katniss becomes a symbol of rebellion and is forced back into the arena.',
        poster: 'https://image.tmdb.org/t/p/w500/4ZMvjenmmAdxtIBqE9IK4mxKBMo.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/mUhOmGIpPJfsBVCfCl5NpPcvHxM.jpg',
        trailer: 'EAzGXqOhKMg', duration: '2h 26m',
        tags: ['top-rated'], dateAdded: '2024-01-03'
    },
    {
        id: 'hg_3', title: 'The Hunger Games: Mockingjay - Part 1', type: 'movie', year: 2014, rating: 6.7, genre: 'action',
        description: 'Katniss becomes the Mockingjay, the symbol of rebellion against the Capitol.',
        poster: 'https://image.tmdb.org/t/p/w500/4FAA18ZIja70d1Tu5hr5cj2q1sB.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/4RgyC1bETc4vOYOcefhjLsMDcNT.jpg',
        trailer: '3PkkHsuMrho', duration: '2h 3m',
        tags: [], dateAdded: '2024-01-03'
    },
    {
        id: 'hg_4', title: 'The Hunger Games: Mockingjay - Part 2', type: 'movie', year: 2015, rating: 6.6, genre: 'action',
        description: 'Katniss and her squad go on a mission to assassinate President Snow.',
        poster: 'https://image.tmdb.org/t/p/w500/qGcEUHBRGHxclMmBYNwMznkYCHn.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/qAk4Bx2S6C0h5xQGLTVjMAvNjnW.jpg',
        trailer: 'n-7K_OjsDCQ', duration: '2h 17m',
        tags: [], dateAdded: '2024-01-03'
    },

    // ═══════ TV SHOWS ═══════
    {
        id: 'tv_got', title: 'Game of Thrones', type: 'tvshow', year: 2011, rating: 9.3, genre: 'fantasy',
        description: 'Nine noble families fight for control of the lands of Westeros while an ancient enemy threatens them all.',
        poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
        trailer: 'KPLWWIOCOOQ', episodes: 73, seasons: 8,
        tags: ['top-rated', 'must-watch', 'trending'], dateAdded: '2024-01-04'
    },
    {
        id: 'tv_witcher', title: 'The Witcher', type: 'tvshow', year: 2019, rating: 8.2, genre: 'fantasy',
        description: 'Geralt of Rivia, a mutated monster-hunter, struggles to find his place in a world full of evil.',
        poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVJ04UcwaJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcdiJq.jpg',
        trailer: 'ndl1W4ltcmg', episodes: 24, seasons: 3,
        tags: ['trending', 'must-watch'], dateAdded: '2024-01-04'
    },
    {
        id: 'tv_bb', title: 'Breaking Bad', type: 'tvshow', year: 2008, rating: 9.5, genre: 'drama',
        description: 'A chemistry teacher turns to manufacturing meth to secure his family\'s future.',
        poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        trailer: 'HhesaQXLuRY', episodes: 62, seasons: 5,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-08'
    },
    {
        id: 'tv_st', title: 'Stranger Things', type: 'tvshow', year: 2016, rating: 8.7, genre: 'sci-fi',
        description: 'When a boy disappears, his friends must confront terrifying supernatural forces.',
        poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/56v2KjBlYz0JslLCyzXN3f7UxKl.jpg',
        trailer: 'b9EkMc79ZSU', episodes: 34, seasons: 4,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-20'
    },
    {
        id: 'tv_tlou', title: 'The Last of Us', type: 'tvshow', year: 2023, rating: 8.8, genre: 'drama',
        description: 'Joel and Ellie survive in a post-apocalyptic world ravaged by a deadly fungal infection.',
        poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
        trailer: 'uLtkt8BonwM', episodes: 16, seasons: 2,
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-03-10'
    },
    {
        id: 'tv_arcane', title: 'Arcane', type: 'tvshow', year: 2021, rating: 9.0, genre: 'action',
        description: 'Set in Piltover and Zaun, follows the origins of two League of Legends champions.',
        poster: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rkB4LyZHo1NHXFEDHl9vSD9r1lI.jpg',
        trailer: 'fXmAurh012s', episodes: 18, seasons: 2,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-02-28'
    },


    // ═══════ ANIME FAVORITES ═══════
    {
        id: 'ani_sl', title: 'Solo Leveling', type: 'anime', year: 2024, rating: 8.8, genre: 'action',
        description: 'In a world where hunters fight monsters from gates, the weakest hunter Sung Jinwoo gains the power to level up infinitely.',
        poster: 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg',
        trailer: 'Yul3Yteaj9M', episodes: 24, seasons: 2,
        tags: ['trending', 'must-watch', 'top-rated'], dateAdded: '2024-03-20'
    },
    {
        id: 'ani_nar1', title: 'Naruto', type: 'anime', year: 2002, rating: 8.3, genre: 'action',
        description: 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage.',
        poster: 'https://image.tmdb.org/t/p/w500/xppeysfvDKVx775MFuH8Z9BlpMk.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/qlIJKMTKrrh3DOHCVsu25LIzLfV.jpg',
        trailer: 'QczGoCmX-pI', episodes: 220, seasons: 5,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-01'
    },
    {
        id: 'ani_nar2', title: 'Naruto Shippuden', type: 'anime', year: 2007, rating: 8.7, genre: 'action',
        description: 'Naruto returns after training and faces the Akatsuki organization threatening the ninja world.',
        poster: 'https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dIkQbQNJOP6hn0mXLxO4JjFjR5z.jpg',
        trailer: '1dy2zLVyYmk', episodes: 500, seasons: 21,
        tags: ['top-rated', 'must-watch', 'trending'], dateAdded: '2024-01-01'
    },
    {
        id: 'ani_boruto', title: 'Boruto: Naruto Next Generations', type: 'anime', year: 2017, rating: 6.8, genre: 'action',
        description: 'The son of Naruto follows his own ninja path while uncovering threats to the shinobi world.',
        poster: 'https://image.tmdb.org/t/p/w500/bIRuMg6aG8YhLJdN39KZ9lQz4UY.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/sM33SAI2FWaJTsD0mgan59OCZOB.jpg',
        trailer: '4iHOE2YoHWE', episodes: 293, seasons: 1,
        tags: ['trending'], dateAdded: '2024-02-01'
    },
    {
        id: 'ani_eis', title: 'The Eminence in Shadow', type: 'anime', year: 2022, rating: 8.3, genre: 'action',
        description: 'A boy who always wanted to be a mastermind in the shadows gets reincarnated into a fantasy world where his delusions become reality.',
        poster: 'https://image.tmdb.org/t/p/w500/b3RUt0lRFjqXPRG5ILKzqhusaMS.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/b3RUt0lRFjqXPRG5ILKzqhusaMS.jpg',
        trailer: 'wG5AoEiXiVc', episodes: 32, seasons: 2,
        tags: ['trending', 'must-watch'], dateAdded: '2024-03-12'
    },
    {
        id: 'ani_agk', title: 'Akame ga Kill!', type: 'anime', year: 2014, rating: 7.8, genre: 'action',
        description: 'Tatsumi joins the assassin group Night Raid to fight against a corrupt Empire and bring justice.',
        poster: 'https://image.tmdb.org/t/p/w500/byPEPD04MNhejMQDLhMEbXBVaOt.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/byPEPD04MNhejMQDLhMEbXBVaOt.jpg',
        trailer: 'NIeKMKwON0U', episodes: 24, seasons: 1,
        tags: ['must-watch'], dateAdded: '2024-02-08'
    },
    {
        id: 'ani_ditf', title: 'Darling in the Franxx', type: 'anime', year: 2018, rating: 7.5, genre: 'mecha',
        description: 'In a dystopian future, children pilot giant mechs called Franxx. Zero Two, a mysterious girl with horns, changes everything for Hiro.',
        poster: 'https://image.tmdb.org/t/p/w500/sJV97lUi2qB6xDgkDo3JVDXmyVT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/sJV97lUi2qB6xDgkDo3JVDXmyVT.jpg',
        trailer: 'JGdcNritDvM', episodes: 24, seasons: 1,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-15'
    },
    {
        id: 'ani_fsn', title: 'Fate/stay night: Unlimited Blade Works', type: 'anime', year: 2014, rating: 8.1, genre: 'action',
        description: 'The Holy Grail War begins as Masters and Servants battle for the wish-granting artifact.',
        poster: 'https://image.tmdb.org/t/p/w500/ij0xoc1pFwNsY2dAIi8v0MtB2dj.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/ij0xoc1pFwNsY2dAIi8v0MtB2dj.jpg',
        trailer: 'gDFWHD9cm-E', episodes: 25, seasons: 2,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-18'
    },
    {
        id: 'ani_fz', title: 'Fate/Zero', type: 'anime', year: 2011, rating: 8.3, genre: 'action',
        description: 'The prequel to Fate/stay night. Seven mages summon heroic spirits for a battle royale for the Holy Grail.',
        poster: 'https://image.tmdb.org/t/p/w500/yJME98H6bGEJT0nApMRN2P7gsM6.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/yJME98H6bGEJT0nApMRN2P7gsM6.jpg',
        trailer: 'Kwrg4VsH1IM', episodes: 25, seasons: 2,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-18'
    },
    {
        id: 'ani_fgob', title: 'Fate/Grand Order: Babylonia', type: 'anime', year: 2019, rating: 7.9, genre: 'action',
        description: 'Ritsuka and Mash travel to ancient Mesopotamia to stop the destruction of humanity.',
        poster: 'https://image.tmdb.org/t/p/w500/pLbBiJNR98l75MNwCSJCBgOfSK4.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/pLbBiJNR98l75MNwCSJCBgOfSK4.jpg',
        trailer: 'rHowT66ENbI', episodes: 21, seasons: 1,
        tags: ['trending'], dateAdded: '2024-02-20'
    },
    {
        id: 'ani_aot', title: 'Attack on Titan', type: 'anime', year: 2013, rating: 9.0, genre: 'action',
        description: 'Humanity lives behind walls to protect against man-eating Titans. Eren vows to destroy them all.',
        poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
        trailer: 'MGRm4IzK1SQ', episodes: 87, seasons: 4,
        tags: ['trending', 'top-rated', 'must-watch'], dateAdded: '2024-01-05'
    },
    {
        id: 'ani_ds', title: 'Demon Slayer', type: 'anime', year: 2019, rating: 8.7, genre: 'action',
        description: 'Tanjiro becomes a demon slayer to avenge his family and cure his sister Nezuko.',
        poster: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdQ6HGbhagQ0UHZlK.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/5DUMPBMjPKQj3wQzakupgBEYcSR.jpg',
        trailer: 'VQGCKyvRw3A', episodes: 55, seasons: 4,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-10'
    },
    {
        id: 'ani_jjk', title: 'Jujutsu Kaisen', type: 'anime', year: 2020, rating: 8.6, genre: 'action',
        description: 'A boy swallows a cursed finger and becomes host to the King of Curses. Enrolls in sorcerer school.',
        poster: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/9CxWh0jMWctDPmBHtnOEIsCDWn.jpg',
        trailer: '4A_X-Dvl0ws', episodes: 47, seasons: 2,
        tags: ['trending', 'must-watch'], dateAdded: '2024-02-15'
    },
    {
        id: 'ani_dn', title: 'Death Note', type: 'anime', year: 2006, rating: 9.0, genre: 'thriller',
        description: 'A genius student finds a notebook that kills anyone whose name is written in it.',
        poster: 'https://image.tmdb.org/t/p/w500/iigTJJskR1PcjjXqxdyJwVB3BoU.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/A2t1T2nSMjpzcCMpMFbnQTSP4FU.jpg',
        trailer: 'NlJZ-YgAt-c', episodes: 37, seasons: 1,
        tags: ['top-rated', 'must-watch'], dateAdded: '2024-01-12'
    },
    {
        id: 'ani_csm', title: 'Chainsaw Man', type: 'anime', year: 2022, rating: 8.5, genre: 'action',
        description: 'Denji merges with his devil pet Pochita to become Chainsaw Man, a devil-human hybrid hunter.',
        poster: 'https://image.tmdb.org/t/p/w500/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/5LIRV0MBNRnoeplbOPgkCVmbUbm.jpg',
        trailer: 'q15CRdE5Bv0', episodes: 12, seasons: 1,
        tags: ['trending', 'must-watch'], dateAdded: '2024-03-08'
    },

    // ═══════ BLEACH (COMPLETE) ═══════
    {
        id: 'ani_bleach', title: 'Bleach', type: 'anime', year: 2004, rating: 8.2, genre: 'action',
        description: 'Ichigo Kurosaki gains Soul Reaper powers and must protect the living world from evil spirits called Hollows while uncovering a conspiracy within the Soul Society.',
        poster: 'https://image.tmdb.org/t/p/w500/2EbBkCoKB68YgnPbQOlStmlySqD.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/qtfMRKYbWoX1DsgnkrU4YkuKUoE.jpg',
        trailer: '--IcmZkvL0Q', episodes: 366, seasons: 16,
        tags: ['top-rated', 'must-watch', 'trending'], dateAdded: '2024-01-01'
    },
    {
        id: 'ani_bleach_tybw', title: 'Bleach: Thousand-Year Blood War', type: 'anime', year: 2022, rating: 9.1, genre: 'action',
        description: 'The final arc of Bleach. The Wandenreich, a hidden empire of Quincies, declares war on the Soul Society. Ichigo must unlock his true power to face their leader, Yhwach.',
        poster: 'https://image.tmdb.org/t/p/w500/iS3nIoMZPXqJBKmW8DkutfijqLh.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/sV77RkH7NJCxQaEGJzIyJOsVQ2G.jpg',
        trailer: 'e8YBesRKq_U', episodes: 52, seasons: 4,
        tags: ['trending', 'must-watch', 'top-rated'], dateAdded: '2024-03-25'
    },
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

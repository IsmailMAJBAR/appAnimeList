const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    animeImage: {
        type: String,
        required : true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Anime = mongoose.model('Anime', AnimeSchema);

module.exports = Anime;
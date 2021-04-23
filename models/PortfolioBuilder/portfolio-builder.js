const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    PortfolioData : {
        type: String
    },
    PictureSecureId: {
        type: String,
    },
    PicturePublicId : {
        type: String,
        default: "https://free4kwallpapers.com/uploads/originals/2015/09/17/yellow-and-black-background-hd.jpg"
    },
    Author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorName : String
    }
});

module.exports = mongoose.model('Portfolio',portfolioSchema);
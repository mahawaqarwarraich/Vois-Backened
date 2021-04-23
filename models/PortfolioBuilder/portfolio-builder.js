const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    PortfolioData : {
        type: String
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
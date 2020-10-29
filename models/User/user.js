const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ( {
    Username : {
        type: String,
        required: true, 
        minlength: 3,
        maxlength: 20
    },
    Email : {
        type: String,
        required: true
    },
    Password : {
        type: String,
        required: true
    },
    Profile : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserProfile"
    }
});

module.exports = mongoose.model('User',userSchema);
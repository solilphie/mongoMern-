const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
prenom: {
type:String,
required:true,
},
nom: {
    type:String,
    required:true,
    },
email: {
type:String,
required:true,
unique:true,
},
password: {
type:String,
required:true,
},
adresse: {
    type:String,
    required:true,
    },
type: {
        type:String,
        required:true,
        },
categorie: {
    type:String,
    required:true,
    },
});
module.exports = User = mongoose.model("user", UserSchema);
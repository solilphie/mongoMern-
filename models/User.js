const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
first_name: {
type:String,
required:true,
},
last_name: {
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
adress: {
    type:String,
    required:true,
    },
usertypes: {
        type:String,
        required:true,
        },
categoryy: {
    type:String,
    required:true,
    },
token:{
    type:String,
    required:true,
    },
});
module.exports = User = mongoose.model("user", UserSchema);
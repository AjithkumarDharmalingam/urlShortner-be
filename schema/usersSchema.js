const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    firstName:{type:String, require:true},
    middleName:{type:String},
    lastName:{type:String, require:true},
    email:{type:String, require:true,
        validate:(value)=>validator.isEmail(value)
    },
    password:{type:String, require:true},
    token:{type:String},
    createdAt:{type:Date,default:Date.now()},
},{versionKey:false, collection:'user'})

const UserModel = mongoose.model('user',UserSchema)
module.exports = {UserModel}
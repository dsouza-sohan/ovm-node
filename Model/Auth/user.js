const mongoose = require('mongoose')

const userschema=mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim: true
    },
    lastname:{
        type:String,
        trim: true
    },
    username:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        lowercase: true,
        trim: true,
        required: true
    },
    password:{
        type:String,
        // minlength:6,
        // maxlength:8,
        required:true
    },
    phone:{
        type:Number,
        default:null
    },
    gender: {
        type: String,
        trim: true,
        default: null
    },
    profImage:{
        type:String,
        default:null
    },
    role:{
        type:String,
        trim:true,
        required:true,
        default:'User'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})


const User = mongoose.model('User',userschema)
module.exports = User
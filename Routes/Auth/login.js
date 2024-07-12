const express = require('express');
const router = express.Router();
const crypt = require('bcryptjs');
const User = require('../../Model/user');

const jwttoken = require('jsonwebtoken');

router.post('',async (req,res)=>{
    try{
        var userexists = await User.findOne({email:req.body.email, isActive:true});

        if(!userexists){

            res.status(400).json({
                code:400,
                message:'Invalid Email!',
                data:null,
                status:false
            })
        }

        var validatePass = await crypt.compare(req.body.password,userexists.password);
        if(!validatePass){
            res.status(400).json({
                code:400,
                message:'Invalid Password!',
                data:null,
                status:false
            })
        }

        var token = jwttoken.sign({_id:userexists._id,role:userexists.role},process.env.TOKEN_SECRET);

        var data = {
            id:userexists._id,
            role:userexists.role,
            firstname:userexists.firstname,
            lastname:userexists.lastname,
            profImage:userexists.profImage,
            token:token
        }
        res.status(200).json({
            code:200,
            message:'Login successfully',
            data:data,
            status:true
        })
    } catch(err){
        res.status(500).json({
            code:500,
            message:err,
            data:null,
            status:false
        })
    }
})

module.exports = router
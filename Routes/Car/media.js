const express = require('express');
const router = express.Router();
const multer = require('multer')

const Car = require('../../Model/Car/car');
const Media = require('../../Model/Car/media');

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=> {
        cb(null, file.originalname);
    }
})

const upload = multer ({
    storage: Storage
}).single('testUpload')

router.get('/', async(req,res)=> {
    res.send("upload file");
  });

router.post('/upload', async(req,res)=> {
    upload(req,res,(err)=>{
        console.log(res.file, req.file.filename)
        if(err){
            console.log(err)
        }
        else{
            const newUpload = new Media({
                photos:{
                    
                    filename: req.file.filename,
                    contentType: 'image'
                },
                car: req.body.car
            })
            newUpload.save()
            .then(()=>res.send("successfully uploaded"))
            .catch((err) => console.log(err));
        }
    })
})
module.exports = router
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

// router.post('/upload', (req, res) => {
//     console.log('Received request to upload file');

//     upload(req, res, async (err) => {
//         if (err) {
//             console.error('Error during file upload:', err);
//             return res.status(500).send('An error occurred while uploading');
//         }

//         console.log('File uploaded successfully:', req.file);

//         try {
//             const newUpload = new Media({
//                 //car: req.body.carId,  // Ensure you are passing carId in the request body
//                 photos: {
//                     data: req.file.filename,
//                     contentType: req.file.mimetype
//                 },
//                 video: req.body.video  // Optional, if you are also passing a video
//             });

//             console.log('Saving uploaded file data to database');

//             await newUpload.save();

//             console.log('Successfully saved to database');
//             res.send("Successfully uploaded");
//         } catch (saveError) {
//             console.error('Error saving to the database:', saveError.message);
//             res.status(500).send('Error saving to the database');
//         }
//     });
// });


  module.exports = router
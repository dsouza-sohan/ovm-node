const express = require('express');
const router = express.Router();

const Car = require('../../Model/Car/car');
const Feature = require('../../Model/Car/feature');
const History = require('../../Model/Car/history');
const Media = require('../../Model/Car/media');
const Seller = require('../../Model/Car/seller');
const CarListing = require('../../Model/Car/carListing');

// POST /cars - Create a new car listing
router.post('/cars', async (req, res) => {
    try {
        // Create a new car record
        const car = await Car.create(req.body.car);

        // Create a new seller record linked to the created car
        const seller = await Seller.create({ ...req.body.seller, car: car._id });

        // Create a new feature record
        const feature = await Feature.create({ ...req.body.features, car: car._id });

        // Create a new history record
        const history = await History.create({ ...req.body.history, car: car._id });

        // Create a new media record
        const media = await Media.create({ ...req.body.media, car: car._id });

        // Create a new car listing record linking all the above created records
        const carListing = await CarListing.create({
            car: car._id,
            seller: seller._id,
            features: feature._id,
            history: history._id,
            media: media._id,
        });

        res.status(201).json(carListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all car listings with pagination
router.get('/cars', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number, default is 1
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10

        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Query to fetch car listings with pagination
        const carListings = await CarListing.find()
            .populate({
                path: 'car',
                select: 'make model year bodyType mileage vin condition engineType transmission drivetrain fuelType exteriorColor interiorColor numberOfDoors numberOfSeats',
            })
            .populate({
                path: 'seller',
                select: 'sellerType contactInformation preferredContactMethod',
            })
            .populate({
                path: 'features',
                select: 'safetyFeatures entertainmentFeatures comfortFeatures convenienceFeatures',
            })
            .populate({
                path: 'history',
                select: 'accidentHistory serviceHistory ownershipHistory',
            })
            .populate({
                path: 'media',
                select: 'photos video',
            })
            .skip(skip)
            .limit(limit);

        // Count total number of car listings
        const totalCarListings = await CarListing.countDocuments();

        // Calculate total pages based on the limit
        const totalPages = Math.ceil(totalCarListings / limit);

        res.json({
            carListings,
            currentPage: page,
            totalPages,
            totalItems: totalCarListings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a specific car listing by ID
router.get('/cars/:id', async (req, res) => {
    try {
        const carListing = await CarListing.findById(req.params.id)
            .populate('car')
            .populate('seller')
            .populate('features')
            .populate('history')
            .populate('media');
        if (!carListing) {
            return res.status(404).json({ error: 'Car listing not found' });
        }
        res.json(carListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a car listing by ID
router.put('/cars/:id', async (req, res) => {
    try {
        const carListing = await CarListing.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('car')
            .populate('seller')
            .populate('features')
            .populate('history')
            .populate('media');
        if (!carListing) {
            return res.status(404).json({ error: 'Car listing not found' });
        }
        res.json(carListing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a car listing by ID
router.delete('/cars/:id', async (req, res) => {
    try {
        const carListing = await CarListing.findByIdAndDelete(req.params.id);
        if (!carListing) {
            return res.status(404).json({ error: 'Car listing not found' });
        }
        res.json({ message: 'Car listing deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router
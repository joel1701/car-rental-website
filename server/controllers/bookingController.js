//Function to check availability of car for given dates

import Booking from "../models/booking.js";
import Car from "../models/car.js";

const parseDateOnlyToUTC = (value) => {
    if (!value) return null;
    const [year, month, day] = String(value).split('T')[0].split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(Date.UTC(year, month - 1, day));
};

const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    })
    return bookings.length === 0; // if no bookings, car is available
}

// API to check availability of car for given date and location
export const checkCarAvailability = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        
        console.log('Search params:', { location, pickupDate, returnDate });
        
        // First, get ALL cars to debug
        const allCars = await Car.find({});
        console.log('Total cars in database:', allCars.length);
        console.log('All cars:', allCars.map(c => ({ brand: c.brand, model: c.model, location: c.location, isAvailable: c.isAvailable })));
        
        // Now search for location
        const cars = await Car.find({ location: { $regex: location, $options: 'i' }, isAvailable: true });
        
        console.log('Cars found for location "' + location + '":', cars.length);
        
        res.json({ success: true, cars: cars });
    } catch (error) {
        console.log('Error:', error.message);
        console.log('Error stack:', error.stack);
        res.json({ success: false, message: error.message });
    }
};

// API to create booking
export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const picked = parseDateOnlyToUTC(pickupDate);
        const returned = parseDateOnlyToUTC(returnDate);

        if (!picked || !returned) {
            return res.json({success: false, message: 'Invalid booking dates'});
        }

        if (returned <= picked) {
            return res.json({success: false, message: 'Return date must be after pickup date'});
        }

        const duplicateBooking = await Booking.findOne({
            user: _id,
            car,
            pickupDate: picked,
            returnDate: returned,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (duplicateBooking) {
            return res.json({ success: false, message: 'You already have this booking' });
        }

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success: false, message: 'Car is not available for the selected dates'});
        }

        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({success: false, message: 'Car not found'});
        }

        // Calculate whole-day rental duration from date-only values in UTC.
        const noOfDays = Math.round((returned - picked) / (1000 * 60 * 60 * 24));
        if (noOfDays < 1) {
            return res.json({success: false, message: 'Booking must be at least 1 day'});
        }
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate: picked,
            returnDate: returned,
            price,
            carBrand: carData.brand,
            carModel: carData.model,
            carImage: carData.image,
            carYear: carData.year,
            carCategory: carData.category,
            carLocation: carData.location,
        });

        res.json({success: true, message: 'Booking created successfully'});

    } catch (error) {
        if (error?.code === 11000) {
            return res.json({ success: false, message: 'You already have this booking' });
        }
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to List user Bookings
export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate('car').sort({createdAt: -1});
        const normalizedBookings = bookings.map((booking) => {
            const obj = booking.toObject();
            if (!obj.car) {
                obj.car = {
                    brand: obj.carBrand,
                    model: obj.carModel,
                    image: obj.carImage,
                    year: obj.carYear,
                    category: obj.carCategory,
                    location: obj.carLocation,
                };
            }
            return obj;
        });
        res.json({success: true, bookings: normalizedBookings});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: 'Unauthorized'});
        }
        const {_id} = req.user;
        const bookings = await Booking.find({owner: _id}).populate('car').select('-user.password').sort({createdAt: -1});
        const normalizedBookings = bookings.map((booking) => {
            const obj = booking.toObject();
            if (!obj.car) {
                obj.car = {
                    brand: obj.carBrand,
                    model: obj.carModel,
                    image: obj.carImage,
                    year: obj.carYear,
                    category: obj.carCategory,
                    location: obj.carLocation,
                };
            }
            return obj;
        });
        res.json({success: true, bookings: normalizedBookings});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body;
        const statusAliasMap = {
            booked: 'pending',
            completed: 'confirmed',
            pending: 'pending',
            confirmed: 'confirmed',
            cancelled: 'cancelled',
        };
        const normalizedStatus = statusAliasMap[String(status || '').toLowerCase()];

        if (!normalizedStatus) {
            return res.json({success: false, message: 'Invalid booking status'});
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({success: false, message: 'Booking not found'});
        }

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized'});
        }

        booking.status = normalizedStatus;
        await booking.save();
        res.json({success: true, message: 'Booking status updated successfully'});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


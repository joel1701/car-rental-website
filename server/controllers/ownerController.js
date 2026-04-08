
import User from '../models/user.js';
import Car from '../models/car.js';
import Booking from '../models/booking.js';


//api to change role of user
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: 'owner' });
        res.json({ success: true, message: 'Role changed to owner, now you can list cars' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//api to list car
export const addCar = async (req, res) => {

    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    try {
        const { _id } = req.user;

        if (!req.body.car) {
            return res.json({ success: false, message: 'car data is required' });
        }

        if (!req.file) {
            return res.json({ success: false, message: 'image is required' });
        }

        const parsedCar =
            typeof req.body.car === 'string'
                ? JSON.parse(req.body.car)
                : req.body.car;

        if (!parsedCar || typeof parsedCar !== 'object') {
            return res.json({ success: false, message: 'invalid car data' });
        }

        // Save local uploads path
        const image = req.file.path;

        await Car.create({
            ...parsedCar,
            owner: _id,
            image
        });

        res.json({ success: true, message: 'Car added successfully' });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to list owner cars
export const getOwnerCars = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'owner') {
            return res.json({ success: false, message: 'Not authorized as owner' });
        }
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: 'Car not found' });
        }
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: 'Car not found' });
        }
        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({ success: true, message: 'Car availability toggled', isAvailable: car.isAvailable });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to delete car
export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const deletedCar = await Car.findOneAndDelete({ _id: carId, owner: _id });

        if (!deletedCar) {
            return res.json({ success: false, message: 'Car not found' });
        }

        res.json({ success: true, message: 'Car deleted successfully' });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'owner') {
            return res.json({ success: false, message: 'Not authorized' });
        }
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const normalizeStatus = (status) => {
            const value = String(status || '').toLowerCase();
            if (value === 'booked') return 'pending';
            if (value === 'completed') return 'confirmed';
            return value;
        };

        const normalizedBookings = bookings.map((booking) => {
            const obj = booking.toObject();
            obj.status = normalizeStatus(obj.status);
            return obj;
        });

        const pendingBookingsCount = normalizedBookings.filter((booking) => booking.status === 'pending').length;
        const completedBookingsCount = normalizedBookings.filter((booking) => booking.status === 'confirmed').length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate revenue only for confirmed bookings in the current month.
        const monthlyRevenue = normalizedBookings
            .filter((booking) => {
                if (booking.status !== 'confirmed') return false;
                const createdAt = new Date(booking.createdAt);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            })
            .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: normalizedBookings.length,
            pendingBookings: pendingBookingsCount,
            completedBookings: completedBookingsCount,
            recentBookings: normalizedBookings.slice(0, 3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


//Api to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;

        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        // Save Cloudinary URL
        const image = req.file.path;

        await User.findByIdAndUpdate(_id, { image });

        res.json({
            success: true,
            message: "Image updated successfully",
            image
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car : {type: ObjectId, ref: "Car", required: true},
    carBrand: {type: String, default: ''},
    carModel: {type: String, default: ''},
    carImage: {type: String, default: ''},
    carYear: {type: Number, default: null},
    carCategory: {type: String, default: ''},
    carLocation: {type: String, default: ''},
    user : {type: ObjectId, ref: "User", required: true},
    owner : {type: ObjectId, ref: "User", required: true},
    pickupDate : {type: Date, required: true},
    returnDate : {type: Date, required: true},
    status : {type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'}, 
    price : {type: Number, required: true},
}, {timestamps: true})

bookingSchema.index(
    { user: 1, car: 1, pickupDate: 1, returnDate: 1 },
    { unique: true, name: 'unique_user_car_dates' }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from '../models/car.js';


//Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET);
}


//Register User
export const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password || password.length < 8){
            return res.status(400).json({ success : false, message: 'Please fill all fields' });
        }
        
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ success : false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        const token = generateToken(user._id.toString());
        res.json({success: true, token});


    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
        console.log(error);
    }

}

//Login User
export const loginUser = async (req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: 'Invalid credentials'});
        }
        const token = generateToken(user._id.toString());
        res.json({success: true, token});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
        console.log(error);
    }
}

//Get User data using token

export const getUserData = async (req, res)=>{
    try {
        const {user} = req;
        res.json({success: true, user});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
        console.log(error);
    }
}

//Get all cars booked by user
export const getCars = async (req, res)=>{
    try {
        const cars = await Car.find({isAvailable: true})
        res.json({success: true, cars});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
        console.log(error);
    }
}

//Get all available cars (public - no auth required)
export const getAvailableCars = async (req, res)=>{
    try {
        const cars = await Car.find({isAvailable: true})
        res.json({success: true, cars});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
        console.log(error);
    }
}
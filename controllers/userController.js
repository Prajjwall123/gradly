const User = require("../models/user");
const OTP = require("../models/otp");
const Profile = require("../models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/email");


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};



const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        
        const otpEntry = new OTP({
            full_name: fullName,
            email,
            password: hashedPassword,
            otp,
            expiresAt
        });

        
        await otpEntry.save();

        
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            
            await OTP.deleteOne({ _id: otpEntry._id });
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.status(201).json({
            message: "Registration initiated successfully. Please check your email for OTP."
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await OTP.findOne({ email, otp });
        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid OTP or email" });
        }

        if (new Date() > otpEntry.expiresAt) {
            await OTP.deleteOne({ _id: otpEntry._id });
            return res.status(400).json({ message: "OTP has expired" });
        }

        
        const user = new User({
            full_name: otpEntry.full_name,
            email: otpEntry.email,
            password: otpEntry.password
        });

        await user.save();

        try {
            console.log('Creating profile for user:', user._id);
            
            const profileData = {
                user: user._id,
                full_name: user.full_name,
                email: user.email
            };
            console.log('Profile data being created:', profileData);

            const profile = await Profile.create(profileData);
            console.log('Profile created successfully:', profile._id);
        } catch (profileError) {
            console.error('Error creating profile:', profileError);
            
            await User.deleteOne({ _id: user._id });
            throw new Error('Failed to create user profile');
        }

        await OTP.deleteOne({ _id: otpEntry._id });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: error.message });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    verifyOTP,
    login,
    updateUser,
    deleteUser
};

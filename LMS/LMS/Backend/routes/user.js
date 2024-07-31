import express from 'express';
import b1 from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/user.js'

const router = express.Router();
const key = 'your_jwt_secret';

router.post("/signup", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(404).json({ error: "user already exits" });
        }
        const salt = await b1.genSalt(6);
        const spass = await b1.hash(req.body.password, salt);
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: spass,
            role: req.body.role
        });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(600).send("Some Error occured");
    }

});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); 

        if (user) {
            const passcom = await b1.compare(password, user.password);
            if (!passcom) {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            } else {
                console.log('User ID:', user._id);
                const accessToken = jwt.sign({ userId: user._id }, key,{ expiresIn: '1h' });
                console.log(accessToken);
                res.json({
                    accessToken: accessToken, 
                    userId: user._id,
                    success: true, 
                    role: user.role
                });
            }
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.log("Error occurred:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


router.post('/verify-email', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = await b1.hash(newPassword, 10);
    const result = await User.updateOne(
        { email },
        { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount > 0) {
        res.json({ success: true, message: 'Password has been reset successfully.' });
    } else {
        res.json({ success: false, message: 'Error resetting password.' });
    }
});


export default router;
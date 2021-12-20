const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const {MY_SECRET_KEY} = require('../config/constants');

exports.register = async (req, res) => {
const {firstName, lastName, email, password} = req.body;

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(422).json({error: errors.array()})
}

const role = await Role.findOne({name: 'writer'});

const user = new User({
    firstName,
    lastName,
    email,
    password,
    role: mongoose.Types.ObjectId(role._id)
})

try{
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(401).json({message: 'User already exists.'})
    }

    const newUser = await user.save();

    res.json({message: 'User successfully created!', newUser});
}catch(error){
    res.status(400).json(new Error(error))
}
}


exports.login = async (req, res) => {
const {email, password} = req.body;

//Check if email and password exist in request
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(422).json({error: errors.array()})
}

try{
//Check if a user with this email exist or not
const existingUser = await User.findOne({email});
if(!existingUser){
    return res.status(404).json({message: 'User not exist!'})
}

//If exist , compare the passwords 
    await existingUser.comparePassword(password);


//If comparison is true, then we will return the jwt token
//You can also assign the expiration time in token itself.
const token = jwt.sign(
    { existingUser},
    MY_SECRET_KEY
)

res.json({
    message: 'Logged in successfully!',
    user: existingUser,
    jwtToken: token,
})


}catch(error){
    console.log(error)
    res.status(400).json({
        message: 'Email or password is wrong.'
    });
}
}

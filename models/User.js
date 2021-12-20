const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
}, {
    timestamps: true,
})

//using bcrypt of hash password
UserSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err);
        };

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){
                return next(err)
            }

            user.password = hash;
            next();
        })
    })
})

//comparing the passwords
UserSchema.methods.comparePassword = function (userPassword){
const user = this;


return new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, user.password, (err, isMatch) => {
        if(err){
            return reject(err);
        }

        if(!isMatch){
            return reject(false);
        }

        resolve(true);
     })
    })
}


module.exports = User = mongoose.model('User', UserSchema);
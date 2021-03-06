'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    registeredEvents: [{
            trackName: { type: String},
            firstName: { type: String},
            lastName: { type: String},
            eventDate: { type: String },
            needToRentBike: { type: Boolean},
            needToRentHelmet: { type: Boolean},
            needToRentSuit: { type: Boolean},
            needToRentGloves: { type: Boolean},
            needToRentBoots: { type: Boolean}
    }]
});

UserSchema.methods.serialize = function () {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        id: this._id || ''
    };
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };

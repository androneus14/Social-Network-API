const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            match: [/[\w._%+-]+@[\w.-]+\.[a-zA-z]{2,4}/, "Please enter a valid email",]
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            },
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },

    {
        toJSON: {
            getters: true
        },
    }
);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
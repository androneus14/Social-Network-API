const { User, Thought } = require('../models');

module.exports = {
    // GET ALL USERS
    getAllUsers (req, res) {
        User.find()
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // GET USER BY ID
    getUserById (req, res) {
        User.findOne({_id: req.params.userId})
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User found with this ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // CREATE A NEW USER
    newUser (req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // DELETE USER
    deleteUser (req, res) {
        User.findOneAndDelete({ _id: req.params.userId})
            .then((user) =>
                !user
                    ? res.stauts(404).json({ message: "No User found with this ID" })
                    : Thought.deleteMany({ _id: { $in: user.thoughts }})
            )
            .then(() => res.json({ message: "User and their thoughts successfully deleted." }))
            .catch((err) => res.status(500).json(err));
    },

    // UPDATE USER
    updateUser (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User found with this ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};

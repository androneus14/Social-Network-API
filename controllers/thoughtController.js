const { User, Thought } = require('../models');

module.exports = {
    // GET ALL THOUGHTS
    getAllThoughts (req, res) {
        Thought.find()
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    // GET THOUGHT BY ID
    getThoughtById (req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No Thought found with this ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // CREATE NEW THOUGHT 
    newThought (req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: {thoughts: _id }},
                    { new: true }
                );
            })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No User found with this ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // UPDATE THOUGHT ID
    updateThought (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: "No Thought found with this ID" })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE THOUGHT BY ID
    deleteThought (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { thought: { thoughtId: req.params.thoughtId }}},
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: "No User found with this ID"})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
};
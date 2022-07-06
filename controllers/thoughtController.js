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

    // CREATE NEW THOUGHT "Use $addToSet to add the new thought to the user"
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

    // UPDATE THOUGHT ID "Use $set to update the thought of the user"
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

    // DELETE THOUGHT BY ID "Use $pull to delete the thought from the user"
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

    // CREATE REACTION "Use $addToSet to add reaction to the thought"
    createReaction (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: "No Thought found with this ID" })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE REACTION "Use $pull to delete the reaction to the thought"
        deleteReaction (req, res) {
            Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId }}},
                { runValidators: true, new: true }
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No Thought found with this ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
        },
};
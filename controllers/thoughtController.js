const { User, Thought } = require('../models');

module.exports = {
    // GET ALL THOUGHTS
    getAllThoughts (req, res) {
        Thought.find({})
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

    // CREATE NEW THOUGHT AND ADD IT TO A USER "Use $push to add the new thought to the user"
    newThought (req, res) {
        Thought.create(req.body)
            .then(({ username, _id }) => {
                return User.findOneAndUpdate(
                    { username: username },
                    { $push: { thoughts: _id }},
                    { runValidators: true, new: true }
                )
            })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User found with this ID" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // UPDATE THOUGHT BY ID "Use $set to update the thought of the user"
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
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No Thought found with this ID" })
                    : User.findOneAndUpdate(
                        { username: thought.username },
                        { $pull : { thoughts: req.params.thoughtId }},
                        { runValidators: true, new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No User found with this ID" })
                    : res.json({ message: "Thought deleted" })
            )
            .catch((err) => res.status(500).json(err));
    },

    // NEW REACTION "Use $addToSet to add reaction to the thought"
    newReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then(thought => 
            !thought
                ? res.status(404).json({ message: "No Thought found with this ID" })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // DELETE REACTION "Use $pull to delete the reaction to the thought"
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }
        )
        .then(thought => 
            !thought
                ? res.status(404).json({ message: "No thought found with this ID" })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
};
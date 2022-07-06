const router = require('express').Router();

const{
    getAllUsers,
    getUserById,
    newUser,
    deleteUser,
    updateUser
} = require('../../controllers/userController');

router.route('/').get(getAllUsers).post(newUser);

router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
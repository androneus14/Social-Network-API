const router = require('express').Router();

const thoughtRoutes = require('./api/thoughtRoutes');
const userRoutes = require('./api/userRoutes');

router.use('/api/thoughts', thoughtRoutes);
router.use('/api/users', userRoutes);

module.exports = router;
const express = require('express');
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/search', UserController.searchUsers);


module.exports = router;
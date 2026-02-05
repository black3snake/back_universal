const express = require('express');
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.get('/', UserController.getUsers);


module.exports = router;
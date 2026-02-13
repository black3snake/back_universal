const express = require('express');
const UserController = require("../controllers/user.controller");
const upload = require("../utils/common/upload");
const router = express.Router();

router.get('/', UserController.getUser);
router.get('/:url', UserController.getUser);
router.post('/', upload.single('avatar'), UserController.create);
router.put('/:url', upload.single('avatar'), UserController.update);
// router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
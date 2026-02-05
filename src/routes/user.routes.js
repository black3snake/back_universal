const express = require('express');
const UserController = require("../controllers/user.controller");
const upload = require("../utils/common/upload");
const router = express.Router();

router.get('/', UserController.getUser);
router.get('/:url', UserController.getUser);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/:id/avatar', upload.single('avatar'), UserController.uploadAvatar);

module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const { addPoints } = require("../controller/point")

router.post("/add", authMiddleware, addPoints);

module.exports = router;
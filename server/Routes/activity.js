const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const { addActivity, getActivity } = require("../controller/activity")

router.post("/add", authMiddleware, addActivity);
router.get("/list/:roomId", authMiddleware, getActivity);

module.exports = router;
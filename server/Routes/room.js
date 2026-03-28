const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addRoom, getRooms, deleteRoom } = require("../controller/room")

router.post("/create", authMiddleware, addRoom);
router.get("/list", authMiddleware, getRooms);
router.delete("/:roomId", authMiddleware, deleteRoom);

module.exports = router;
//server/Routes/home.js
const express = require("express");
const HomeRouter = express.Router();
const multer = require("multer");

const upload = multer();


const { getPeopleCount, detectRoomFrame, getHealth } = require("../controller/home");

HomeRouter.post("/people-count", upload.single("file"), getPeopleCount);
HomeRouter.get("/health", getHealth);
HomeRouter.post("/detect-room-frame", upload.single("file"), detectRoomFrame);

module.exports = HomeRouter;

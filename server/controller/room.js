require("dotenv").config();
const Room = require("../models/room_model");
const User = require("../models/user_model");
const { getIO } = require("../config/socket");
const logger = require("../utils/logger");

// TODO: Add comments (tinatamad na ko man sub na) ┐ ( -“-) ┌

exports.addRoom = async (req, res, next) => {
  try {
    const io = getIO();
    const { room_name } = req.body;
    const userExists = await User.exists({ _id: req.userID });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRoom = await Room.findOne({ room_name, room_owner: req.userID })
    if (existingRoom) {
      logger.error({
        message: `ROOM CREATE -- Attempted to create a room with an existing name`,
        method: req.method,
        ip: req.ip,
      });
      return res
        .status(400)
        .json({ message: "Room with this name already exist." });
    }

    const room = new Room({
      room_name,
      room_owner: req.userID,
    });

    await room.save();
    logger.info({
      message: `ROOM CREATE -- Room added ${req.body.room_name}: With status code 201`,
      method: req.method,
      ip: req.ip,
    });

    const populatedRoom = await room.populate("room_owner", "first_name email");
    io.emit("roomAdded", populatedRoom);

    res.status(201).json({
      message: "Room added successfully",
      room: populatedRoom,
    });
  } catch (error) {
    logger.error({
      message: `ROOM CREATE -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({
      room_owner: req.userID,
    }).populate("room_owner", "first_name");
    logger.info({
      message: `ROOMS FETCHED -- ${rooms}`
    })

    res.status(200).json(rooms);
  } catch (error) {
    logger.error({
      message: `ROOM FETCH -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Verify that the user owns this room
    if (room.room_owner.toString() !== req.userID) {
      logger.error({
        message: `ROOM DELETE -- Unauthorized deletion attempt by user ${req.userID}`,
        method: req.method,
        ip: req.ip,
      });
      return res.status(403).json({ message: "Unauthorized to delete this room" });
    }

    await Room.findByIdAndDelete(roomId);
    
    logger.info({
      message: `ROOM DELETE -- Room deleted: ${room.room_name}`,
      method: req.method,
      ip: req.ip,
    });

    const io = getIO();
    io.emit("roomDeleted", { roomId });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    logger.error({
      message: `ROOM DELETE -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

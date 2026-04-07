require("dotenv").config();
const logger = require("../utils/logger");
const { getIO } = require("../config/socket");
const Device = require("../models/device_model");

exports.addDevice = async (req, res, next) => {
  try {
    const io = getIO();
    const { device_location, device_type, device_label } = req.body;
    const userID = req.userID;

    const existingDevice = await Device.exists({
      device_location: device_location,
    });

    if (existingDevice) {
      return res.status(400).json({
        message: "Theres already a sensor assigned to the room",
      });
    }

    const device = new Device({
      device_owner: req.userID,
      device_location,
      device_type,
      device_label,
    });

    io.emit("deviceAdded", {
      _id: device._id,
      device_location,
      device_type,
      device_label,
    });

    await device.save();
    logger.info({
      message: `DEVICE CREATE -- Device added ${req.body.device_label}: With status code 201`,
      method: req.method,
      ip: req.ip,
    });

    return res.status(201).json({
      message: "Device Added",
    });
  } catch (error) {
    logger.error({
      message: `DEVICE ADD -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const { roomId } = req.params;

    console.log("ROOM ID RECEIVED:", roomId);

    const devices = await Device.find({
      device_location: roomId,
    });

    console.log("DEVICES FOUND:", devices);

    res.status(200).json(devices);
  } catch (error) {
    console.error("GET DEVICE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

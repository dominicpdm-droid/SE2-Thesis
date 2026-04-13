require("dotenv").config();
const Room = require("../models/room_model");
const Activity = require("../models/activity_model");
const logger = require("../utils/logger");

// TODO: Add comments (tinatamad na ko man sub na) ┐ ( -“-) ┌

exports.addActivity = async (req, res, next) => {
  try {
    // const io = getIO();
    const { room_id, activity_message } = req.body;

    const activity = new Activity({
      room_id,
      activity_author: req.userID,
      activity_message,
    });

    await activity.save();

    res.status(201).json({
      message: "Activity added successfully",
    });
  } catch (error) {
    logger.error({
      message: `ACTIVITY ADDED -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const { roomId } = req.params;

    const response = await Activity.find({ room_id: roomId })
      .populate("activity_author", "first_name email")
      .sort({ activity_timestamp: -1 })
      .exec();

    res.status(200).json(response); 
    logger.info({
      message: `ACTIVITY FETCHED -- Activities for room ${roomId} fetched successfully`,
      method: req.method,
      ip: req.ip,
    });
  } catch (error) {
    logger.error({
      message: `ACTIVITY FETCHED -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });

    res.status(500).json({ message: error.message });
  }
};

require("dotenv").config();
const logger = require("../utils/logger");
const { getIO } = require("../config/socket");
const ROIPoint = require("../models/points_model");

exports.addPoints = async (req, res, next) => {
  try {
    const io = getIO();
    console.log("REQ BODY:", req.body);
    const userID = req.userID;

    logger.info({
      message: `ROI ADD -- ROI added ${req.body.org_name}: With status code 201`,
      method: req.method,
      ip: req.ip,
    });

    return res.status(201).json({
      message: "Organization Added",
    });
  } catch (error) {
    logger.error({
      message: `ROI ADD -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

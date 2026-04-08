require("dotenv").config();
const logger = require("../utils/logger");
const { getIO } = require("../config/socket");
const Organization = require("../models/organization_model");

exports.addOrg = async (req, res, next) => {
  try {
    const io = getIO();
    const { org_name } = req.body;
    const userID = req.userID;

    const existingOrg = await Organization.exists({
      org_name: org_name,
    });

    if (existingOrg) {
      return res.status(400).json({
        message: "Organization already exists",
      });
    }

    const org = new Organization({
      organization_name: org_name,
      organization_owner: userID,
    });

    io.emit("orgAdded", {
      _id: org._id,
      organization_name: org.organization_name,
    });

    await org.save();
    logger.info({
      message: `ORGANIZATION CREATE -- Organization added ${req.body.org_name}: With status code 201`,
      method: req.method,
      ip: req.ip,
    });

    console.log(req.body);

    return res.status(201).json({
      message: "Organization Added",
    });
  } catch (error) {
    logger.error({
      message: `ORGANIZATION ADD -- ${error.message}`,
      method: req.method,
      ip: req.ip,
    });
    res.status(500).json({ message: error.message });
  }
};

exports.getOrg = async (req, res) => {
  try {

    const organization = await Organization.find({
    });

    console.log("ORGANIZATION FOUND:", organization);

    res.status(200).json(organization);
  } catch (error) {
    console.error("GET ORGANIZATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
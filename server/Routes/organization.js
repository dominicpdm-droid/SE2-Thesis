const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const { addOrg, getOrg } = require("../controller/organization")

router.post("/addOrganization", authMiddleware, addOrg);
router.get("/getOrganization", authMiddleware, getOrg);

module.exports = router;
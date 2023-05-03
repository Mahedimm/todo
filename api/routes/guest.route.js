const express = require("express");
const router = express.Router();

const {baseUrl} = require("./../controllers/guest.controller");

router.get("", baseUrl);
router.get("/payment-redirect", (req,res) => res.redirect('https://caretutors.com'));

module.exports = router;

const express = require("express");
const router = express.Router();
const logincontroller = require("../controllers/logincontroller");
const bookcontroller = require("../controllers/bookcontroller");

router.get("/", logincontroller.login,bookcontroller.book);
router.get("/signup", logincontroller.signup);
router.post("/signup", logincontroller.signupentry);
router.post("/", logincontroller.loginsubmit, bookcontroller.book);
router.get("/logout", logincontroller.logout);

module.exports = router;

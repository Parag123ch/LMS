const express = require("express");
const router = express.Router();
const bookcontroller = require("../controllers/bookcontroller");
const middleware = require("../middleware.js");

router.get("/", bookcontroller.book);
router.post("/", middleware.userauth, bookcontroller.booksubmit);
router.get("/admin", middleware.adminauth, bookcontroller.bookapprovalrender);
router.post("/admin", middleware.adminauth, bookcontroller.bookresolve);
router.get("/admin/history", middleware.adminauth, bookcontroller.pastresolve);
router.get("/history", middleware.userauth, bookcontroller.userresolved);
router.post("/admin/add", middleware.adminauth, bookcontroller.addbook);
router.post("/admin/update", middleware.adminauth, bookcontroller.updatebooks);
router.post("/admin/return", middleware.adminauth, bookcontroller.returnbooks);
module.exports = router;

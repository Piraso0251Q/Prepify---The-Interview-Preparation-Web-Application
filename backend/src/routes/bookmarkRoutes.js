const express = require("express");
const router = express.Router();
const { getBookmarks, addBookmark, removeBookmark } = require("../controllers/bookmarkController");
const { protect } = require("../middleware/authMiddleware");


router.get(    "/",             protect, getBookmarks);   
router.post(   "/:questionId",  protect, addBookmark);    
router.delete( "/:questionId",  protect, removeBookmark); 

module.exports = router;

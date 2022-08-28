const express = require("express");
const router = express.Router();
const {
  getAllTrashNotes,
  deleteTrashNotes,
  restoreNotes,
} = require("../controllers/trashController");

router.route("/trash").get(getAllTrashNotes);
router.route("/trash/:id").delete(deleteTrashNotes).get(restoreNotes);

module.exports = router;

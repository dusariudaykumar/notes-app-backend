const express = require("express");
const router = express.Router();
const {
  getAllNotesFromArchive,
  deleteArchiveNotes,
  UnarchiveNotes,
} = require("../controllers/archiveController");

router.route("/archive").get(getAllNotesFromArchive);
router.route("/archive/:id").delete(deleteArchiveNotes).get(UnarchiveNotes);
module.exports = router;

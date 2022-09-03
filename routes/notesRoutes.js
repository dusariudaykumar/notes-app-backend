const express = require("express");
const router = express.Router();
const {
  createNotes,
  getAllNotes,
  updateNotes,
  deleteNotes,
  addToArchive,
} = require("../controllers/notesController");

router.route("/notes").get(getAllNotes);
router.route("/notes/create").post(createNotes);
router
  .route("/notes/:notesId")
  .patch(updateNotes)
  .delete(deleteNotes)
  .get(addToArchive);

module.exports = router;

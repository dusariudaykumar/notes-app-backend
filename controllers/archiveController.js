const Archive = require("../models/archive");
const Notes = require("../models/notes");
const Trash = require("../models/trash");

// helper function
const deleteNotes = async (notesId) => {
  return await Archive.findByIdAndDelete(notesId);
};

const getAllNotesFromArchive = async (req, res) => {
  const userId = req.user;
  try {
    const archive = await Archive.find({ userId }).populate(
      "userId",
      "name email _id"
    );
    return res.status(200).json({ success: true, archive });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong.Please try again!",
    });
  }
};

//delete and add to trash
const deleteArchiveNotes = async (req, res) => {
  const notesId = req.params.id;
  try {
    const findNotes = await Archive.findById(notesId);
    if (!findNotes) {
      return res
        .status(404)
        .json({ success: false, message: "Notes not found" });
    }
    const deletedNotes = await deleteNotes(notesId);

    const addToTrash = await Trash.create({
      title: deletedNotes.title,
      body: deletedNotes.body,
      bgcolor: deletedNotes.bgcolor,
      userId: deletedNotes.userId,
    });
    return res
      .status(200)
      .json({ succes: true, message: "Deleted from archive" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong.Please try again!",
    });
  }
};

//Unarchive (restore notes from archive)

const UnarchiveNotes = async (req, res) => {
  const notesId = req.params.id;
  try {
    const findNotes = await Archive.findById(notesId);
    if (!findNotes) {
      return res
        .status(404)
        .json({ success: false, message: "Notes not found" });
    }
    const deletedNotes = await deleteNotes(notesId);

    const restoreToNotes = await Notes.create({
      title: deletedNotes.title,
      body: deletedNotes.body,
      bgcolor: deletedNotes.bgcolor,
      userId: deletedNotes.userId,
    });
    return res.status(200).json({ succes: true, message: "Notes Unarchived" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong.Please try again!",
    });
  }
};

module.exports = {
  getAllNotesFromArchive,
  deleteArchiveNotes,
  UnarchiveNotes,
};

const Trash = require("../models/trash");
const Notes = require("../models/notes");

// get all tashed notes
const getAllTrashNotes = async (req, res) => {
  const userId = req.user._id;

  try {
    const trashNotes = await Trash.find({ userId }).populate(
      "userId",
      "name email _id"
    );
    res.status(200).json({ success: true, trashNotes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Somthing went wrong.Please try again!",
    });
  }
};

//delete notes from trash

const deleteTrashNotes = async (req, res) => {
  const notesId = req.params.id;

  try {
    const notes = await Trash.findById(notesId);

    if (!notes) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notes Id." });
    }

    const deletedNotes = await Trash.findByIdAndDelete(notesId);
    res
      .status(201)
      .json({ success: true, message: "Notes deleted from trash" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "somthing went wrong please try again",
    });
  }
};

// restore notes from trash to notes table

const restoreNotes = async (req, res) => {
  const notesId = req.params.id;

  try {
    const notes = await Trash.findById(notesId);

    if (!notes) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notes Id." });
    }

    const deletedNotes = await Trash.findByIdAndDelete(notesId);

    const restore = await Notes.create({
      title: deletedNotes.title,
      body: deletedNotes.body,
      bgcolor: deletedNotes.bgcolor,
      userId: deletedNotes.userId,
    });
    res
      .status(201)
      .json({ success: true, message: "Notes restored from trash" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "somthing went wrong please try again",
    });
  }
};

module.exports = {
  getAllTrashNotes,
  deleteTrashNotes,
  restoreNotes,
};

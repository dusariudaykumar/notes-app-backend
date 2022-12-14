const Notes = require("../models/notes");
const Trash = require("../models/trash");
const Archive = require("../models/archive");
// Get All Notes
const getAllNotes = async (req, res) => {
  const userId = req.user;

  try {
    const notes = await Notes.find({ userId }).populate(
      "userId",
      "name email _id"
    );
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthing went wrong.Please try again!",
    });
  }
};

//Create notes
const createNotes = async (req, res) => {
  const { title, body, bgcolor } = req.body;
  if (!title || !body) {
    return res
      .status(404)
      .json({ success: false, message: "please enter title and body" });
  }
  const userId = req.user;

  try {
    const note = await Notes.create({ title, body, bgcolor, userId });
    //
    return res.status(201).json({ success: true, note });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Somthing went wrong" });
  }
};

//update notes
const updateNotes = async (req, res) => {
  const { notesId } = req.params;
  const { title, body, bgcolor } = req.body;

  try {
    const note = await Notes.findById(notesId);
    if (!note) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notes Id." });
    }
    if (title && body && bgcolor) {
      note.title = title;
      note.body = body;
      note.bgcolor = bgcolor;
    }
    const updatedNotes = await note.save();
    return res.status(200).json({ success: true, updatedNotes });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "somthing went wrong please try again",
    });
  }
};

//delete notes

const deleteNotes = async (req, res) => {
  const notesId = req.params.notesId;

  try {
    const note = await Notes.findById(notesId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Notes not found" });
    }
    const deletedNotes = await Notes.findByIdAndDelete({ _id: notesId });

    // After deleting notes adding it to  trash
    const addTrash = await Trash.create({
      title: deletedNotes.title,
      body: deletedNotes.body,
      bgcolor: deletedNotes.bgcolor,
      userId: deletedNotes.userId,
      createdAt: deletedNotes.createdAt,
      updatedAt: deletedNotes.updatedAt,
    });

    return res.status(200).json({ success: true, message: "Notes deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "somthing went wrong please try again",
    });
  }
};

//move to archive
const addToArchive = async (req, res) => {
  const notesId = req.params.notesId;

  try {
    const note = await Notes.findById(notesId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Notes not found" });
    }
    const deletedNotes = await Notes.findByIdAndDelete({ _id: notesId });

    // After deleting notes adding it to  archive
    const addNotesToArchive = await Archive.create({
      title: deletedNotes.title,
      body: deletedNotes.body,
      bgcolor: deletedNotes.bgcolor,
      userId: deletedNotes.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Notes added to archive",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "somthing went wrong please try again",
    });
  }
};

module.exports = {
  createNotes,
  getAllNotes,
  updateNotes,
  deleteNotes,
  addToArchive,
};

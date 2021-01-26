const { Router } = require("express");
const {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
} = require("../controllers/notes.controller");
const {isAuthenticated}= require('../helpers/auth');
const router = Router();

//create notes
router.get("/notes/add", isAuthenticated,renderNoteForm);
router.post("/notes/add",isAuthenticated, createNewNote);
//get all notes

router.get("/notes",isAuthenticated, renderNotes);

//edit notes
router.get("/notes/edit/:id",isAuthenticated, renderEditForm);
router.put("/notes/edit/:id", isAuthenticated,updateNote);

//delete notes
router.delete("/notes/delete/:id",isAuthenticated, deleteNote);

module.exports = router;

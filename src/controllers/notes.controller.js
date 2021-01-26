const notesCtrl = {};
const Note = require("../models/Note");


notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};
notesCtrl.createNewNote = async (req, res) => {
  //console.log(req.body);
  const { title, description } = req.body;
  const newNote = new Note({ title, description });
  newNote.user=req.user.id;
  await newNote.save();

 // console.log(req.user);

  //res.send('create note');
  req.flash('success_msg','Note add successfully');
  res.redirect("/notes");
};

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({createdAt: 'desc'});
  res.render("notes/all-notes", { notes });
};
notesCtrl.renderEditForm = async (req, res) => {
   
  const note = await Note.findById(req.params.id);
  if(note.user!=req.user.id){
    return res.redirect('/notes');
  }
  res.render("notes/edit-note", { note });
};
notesCtrl.updateNote = async (req, res) => {
  //console.log(req.body);
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  //res.send("update note");
  req.flash('success_msg','Note updated successfully');
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  //res.send("delete note");
  //console.log(req.params.id);
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg','Note deleted successfully');
  res.redirect("/notes");
};
module.exports = notesCtrl;

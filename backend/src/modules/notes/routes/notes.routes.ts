import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';

export default function (notesController: NotesController): Router {
  const router = Router();

  // Route pour ajouter une note
  router.post('/add', (req, res) => notesController.addNote(req, res));

  // Route pour obtenir toutes les notes
  router.get('/all', (req, res) => notesController.getAllNotes(req, res));


  router.delete('/delete/:id', (req, res) => notesController.deleteNote(req, res));



  return router;
}

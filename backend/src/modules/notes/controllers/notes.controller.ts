import { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';

export class NotesController {
  private notesService: NotesService;

  constructor(notesService: NotesService) {
    this.notesService = notesService;
  }

  // Route pour ajouter une note
  public async addNote(req: Request, res: Response): Promise<void> {
    try {
      const { note } = req.body;
      if (!note) {
        res.status(400).json({ message: 'La note ne peut pas être vide.' });
        return;
      }

      const newNote = await this.notesService.addNote(note);
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'ajout de la note.' });
    }
  }

  // Route pour récupérer toutes les notes
  public async getAllNotes(req: Request, res: Response): Promise<void> {
    try {
      const notes = await this.notesService.getAllNotes();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notes.' });
    }
  }
  // Méthode pour supprimer une note
public async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'L\'ID de la note est requis.' });
        return;
      }
  
      const result = await this.notesService.deleteNote(id);
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Note non trouvée.' });
        return;
      }
  
      res.status(200).json({ message: 'Note supprimée avec succès.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la note.' });
    }
  }
  
}

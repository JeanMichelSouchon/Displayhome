import pool from '../../../common/database/db';
import { Note } from '../models/note.interface';

export class NotesService {
  // Ajouter une nouvelle note
  public async addNote(noteText: string): Promise<Note> {
    try {
      const query = 'INSERT INTO notes (note) VALUES (?)';
      const [result] = await pool.query(query, [noteText]);
      const res = result as any;
      return {
        id: res.insertId,
        note: noteText,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Récupérer toutes les notes
  public async getAllNotes(): Promise<Note[]> {
    try {
      const [results] = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
      return results as Note[];
    } catch (error) {
      console.error('Erreur lors de la récupération des notes:', error);
      throw new Error('Erreur interne du serveur');
    }
  }
  // Méthode pour supprimer une note
public async deleteNote(id: string): Promise<any> {
    try {
      const query = 'DELETE FROM notes WHERE id = ?';
      const [result] = await pool.query(query, [id]);
      return result;
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      throw new Error('Erreur interne du serveur');
    }
  }
  
}

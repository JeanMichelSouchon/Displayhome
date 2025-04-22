// Planète en 3D avec Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('planet'), antialias: true });
renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);  // Augmenter la taille du rendu

// Créer une sphère plus grande
const geometry = new THREE.SphereGeometry(4, 64, 64); // Rayon augmenté à 4 et plus de détails
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// Ajustement de la position de la caméra pour bien voir la sphère
camera.position.z = 8; // Recule la caméra pour mieux voir la sphère

function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.005;  // Rotation plus fluide
    renderer.render(scene, camera);
}

// Animation de la planète
animate();

// Gérer la redimension de la fenêtre pour adapter la taille du rendu
window.addEventListener('resize', () => {
    const width = window.innerWidth * 0.7;
    const height = window.innerHeight * 0.7;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});




// Gestion des notes
document.addEventListener('DOMContentLoaded', () => {
    const noteArea = document.getElementById('note-area');
    const saveButton = document.getElementById('save-note');
    const notesList = document.getElementById('notes-list');
    const noNotesMessage = document.getElementById('no-notes-message'); // Ajouter un élément pour afficher ce message

    // Sauvegarder la note lors du clic sur le bouton
    saveButton.addEventListener('click', async () => {
        const noteText = noteArea.value;

        if (noteText.trim() === '') {
            alert('Veuillez écrire une note avant de sauvegarder.');
            return;
        }

        try {
            // Envoyer la note au backend via une requête POST
            const response = await fetch('https://backend-service-387352143812.europe-west9.run.app/notes/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note: noteText })
            });

            if (response.ok) {
                alert('Note enregistrée !');
                noteArea.value = ''; // Réinitialiser la zone de texte
                loadNotes(); // Recharger les notes
            } else {
                alert('Erreur lors de l\'enregistrement de la note.');
            }
        } catch (error) {
            console.error('Erreur de réseau ou autre:', error);
            alert('Une erreur est survenue lors de l\'enregistrement de la note.');
        }
    });

    // Fonction pour récupérer et afficher les notes
    function loadNotes() {
        fetch('https://backend-service-387352143812.europe-west9.run.app/notes/all') // Assurez-vous que votre API est accessible à cette route
            .then(response => response.json())
            .then(notes => {
                notesList.innerHTML = ''; // Vide la liste des notes existantes avant de réafficher
                if (notes.length === 0) {
                    // Afficher un message si aucune note n'est présente
                    noNotesMessage.style.display = 'block';
                } else {
                    noNotesMessage.style.display = 'none';
                    notes.forEach(note => {
                        const noteElement = document.createElement('li');
                        noteElement.classList.add('note');

                        // Affichage de la note
                        const noteContent = document.createElement('p');
                        noteContent.textContent = note.note;

                        // Affichage de la date et de l'heure
                        const noteDate = document.createElement('p');
                        noteDate.classList.add('note-date');
                        const date = new Date(note.created_at); // Utilise le champ 'created_at' de la réponse
                        noteDate.textContent = `Créé le ${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`;

                        // Bouton de suppression
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Supprimer';
                        deleteButton.classList.add('delete-button');
                        deleteButton.addEventListener('click', () => deleteNote(note.id)); // Utiliser l'ID de la note pour la suppression

                        // Ajouter le bouton de suppression à l'élément de la note
                        noteElement.appendChild(noteContent);
                        noteElement.appendChild(noteDate);
                        noteElement.appendChild(deleteButton);

                        // Ajouter l'élément de la note à la liste
                        notesList.appendChild(noteElement);
                    });
                }
            })
            .catch(error => console.error('Erreur de récupération des notes :', error));
    }

    // Fonction pour supprimer une note
    function deleteNote(noteId) {
        fetch(`https://backend-service-387352143812.europe-west9.run.app/notes/delete/${noteId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Note supprimée avec succès');
                loadNotes(); // Recharger les notes après suppression
            } else {
                alert('Erreur lors de la suppression de la note.');
            }
        })
        .catch(error => console.error('Erreur de suppression de la note :', error));
    }

    // Charger les notes existantes au chargement de la page
    loadNotes();
});

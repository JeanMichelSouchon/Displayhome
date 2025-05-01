const api = require("./api");
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

camera.position.z = 8; 

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

// Fonction pour changer la forme
function changeShape(shape) {
    let newGeometry;

    switch (shape) {
        case 'sphere':
            newGeometry = new THREE.SphereGeometry(4, 64, 64);
            break;
        case 'cube':
            newGeometry = new THREE.BoxGeometry(4, 4, 4);
            break;
        case 'triangle':
            newGeometry = new THREE.ConeGeometry(4, 6, 9); 
            break;
        default:
            console.warn("Forme non reconnue :", shape);
            return;
    }

    // Remplacer l'ancienne géométrie par la nouvelle
    planet.geometry.dispose(); // Libérer l'ancienne géométrie
    planet.geometry = newGeometry;
}

// Ajout des écouteurs sur les boutons
document.getElementById('sphere-btn').addEventListener('click', () => changeShape('sphere'));
document.getElementById('cube-btn').addEventListener('click', () => changeShape('cube'));
document.getElementById('triangle-btn').addEventListener('click', () => changeShape('triangle'));




// Gestion des notes
document.addEventListener('DOMContentLoaded', () => {

    const rssContainer = document.getElementById("rss-feed");
    const feedUrl = encodeURIComponent("https://www.jeuxactu.com/rss/ja.rss"); // remplace par ton flux RSS
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.items) {
          data.items.slice(0, 7).forEach(item => {
            const article = document.createElement("div");
            article.style.border = "1px solid #444";
            article.style.borderRadius = "8px";
            article.style.padding = "10px";
            article.style.marginBottom = "10px";
            article.style.display = "flex";
            article.style.backgroundColor = "#222";
            article.style.color = "white";
  
            const image = document.createElement("img");
            image.src = item.thumbnail || "journal.png"; // image par défaut si pas d'image
            image.alt = "thumbnail";
            image.style.width = "100px";
            image.style.height = "100px";
            image.style.objectFit = "cover";
            image.style.marginRight = "10px";
            image.style.borderRadius = "6px";
  
            const content = document.createElement("div");
  
            const title = document.createElement("a");
            title.href = item.link;
            title.target = "_blank";
            title.textContent = item.title;
            title.style.fontSize = "1.1rem";
            title.style.fontWeight = "bold";
            title.style.color = "#4fc3f7";
            title.style.textDecoration = "none";
  
            const description = document.createElement("p");
            description.textContent = item.description.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
            description.style.margin = "5px 0";
            description.style.fontSize = "0.9rem";
  
            content.appendChild(title);
            content.appendChild(description);
  
            article.appendChild(image);
            article.appendChild(content);
  
            rssContainer.appendChild(article);
          });
        } else {
          rssContainer.innerHTML = "Aucun article trouvé.";
        }
      })
      .catch(err => {
        console.error("Erreur lors du chargement du RSS :", err);
        rssContainer.innerHTML = "Erreur lors du chargement du flux RSS.";
      });


    const noteArea = document.getElementById('note-area');
    const saveButton = document.getElementById('save-note');
    const notesList = document.getElementById('notes-list');
    const noNotesMessage = document.getElementById('no-notes-message'); // Ajouter un élément pour afficher ce message

    // Sauvegarder la note lors du clic sur le bouton
    saveButton.addEventListener('click', async () => {
        const noteText = noteArea.value;
    
        if (noteText.trim() === '') {
            displayMessage('note-message','Veuillez écrire une note avant de sauvegarder.','error');
            return;
        }
    
        try {
            // Envoyer la note au backend via une requête POST
            const response = await api.post('/notes/add', JSON.stringify({ note: noteText }));
    
            if (response.status === 201) {  // Utilisation de status au lieu de response.ok
                displayMessage('note-message', 'Note enregistrée !', 'success');
                noteArea.value = ''; // Réinitialiser la zone de texte
                loadNotes(); // Recharger les notes
            } else {
                displayMessage('note-message', 'Erreur lors de l\'enregistrement de la note.', 'error');

            }
        } catch (error) {
            console.error('Erreur de réseau ou autre:', error);  // Assurez-vous de bien capturer l'erreur ici
            displayMessage('note-message', 'Une erreur est survenue lors de l\'enregistrement de la note.', 'error');
        }
    });

    // Fonction pour récupérer et afficher les notes
    function loadNotes() {
        api.get('/notes/all')  // Assurez-vous que votre API est accessible à cette route
            .then(response => {
                const notes = response.data;  // Axios gère déjà la conversion en JSON
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
            .catch(error => {
                console.error('Erreur de récupération des notes :', error);
                displayMessage('note-message', 'Une erreur est survenue lors de la récupération des notes.', 'error');
            });
    }

    // Fonction pour supprimer une note
    function deleteNote(noteId) {
        api.delete(`/notes/delete/${noteId}`)
        .then(response => {
            if (response.status == 200) {
                displayMessage('note-message','Note supprimée avec succès','success');
                loadNotes(); // Recharger les notes après suppression
            } else {
                displayMessage('note-message','Erreur lors de la suppression de la note.','error');
            }
        })
        .catch(error => console.error('Erreur de suppression de la note :', error));
    }

    // Charger les notes existantes au chargement de la page
    loadNotes();
});
function displayMessage(elementId, message, type = "success") {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.style.color = type === "error" ? "red" : "limegreen";
}
const disconnectButton = document.getElementById('diconnect').querySelector('button');
if (disconnectButton) {
    disconnectButton.addEventListener('click', () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('token');

        // Redirection vers la page d'accueil (index.html)
        window.location.href = 'index.html';
    });
}
const { ipcRenderer } = require('electron');

document.getElementById('min-btn').addEventListener('click', () => ipcRenderer.send('window-control', 'minimize'));
document.getElementById('max-btn').addEventListener('click', () => ipcRenderer.send('window-control', 'maximize'));
document.getElementById('close-btn').addEventListener('click', () => ipcRenderer.send('window-control', 'close'));

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('time-overlay').textContent = timeString;
}

// Mise à jour immédiate + toutes les secondes
updateTime();
setInterval(updateTime, 1000);


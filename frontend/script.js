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

    // Charger la note sauvegardée
    noteArea.value = localStorage.getItem('userNote') || '';

    // Sauvegarder la note lors du clic sur le bouton
    saveButton.addEventListener('click', () => {
        localStorage.setItem('userNote', noteArea.value);
        alert('Note enregistrée !');
    });
});

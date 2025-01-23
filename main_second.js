import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load the GLB file
const loader = new GLTFLoader();
let mixer; // Used for animation
loader.load(
  './animation/mata_test.glb', // Replace with the actual path to your .glb file
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Check if animations exist
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[2]); // Play the first animation
      action.play();
    }
  },
  (xhr) => {
    console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('An error occurred while loading the GLB file:', error);
  }
);

// Animation loop
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta(); // Get the time between frames
  if (mixer) mixer.update(delta); // Update the animation mixer

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

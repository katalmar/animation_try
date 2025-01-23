import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, mixer, actions, currentAction, clock;

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.set(0, 2, 5);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load('./animation/animacion.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Initialize Animation Mixer
        mixer = new THREE.AnimationMixer(model);

        // Get all animations
        const clips = gltf.animations;
        actions = clips.map((clip) => mixer.clipAction(clip));

        // Play the first animation by default
        currentAction = actions[0];
        currentAction.play();

        // Add UI or key events to switch animations
        window.addEventListener('keydown', (event) => {
            if (event.key === '1') switchAnimation(0);
            if (event.key === '2') switchAnimation(1);
        });
    });

    animate();
}

function switchAnimation(index) {
    if (currentAction) currentAction.stop(); // Stop current animation
    currentAction = actions[index]; // Switch to new action
    currentAction.play(); // Play new animation
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta); // Update animations
    renderer.render(scene, camera);
}


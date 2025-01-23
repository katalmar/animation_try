import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, mixer, actions = [], currentAction, clock;

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

        // Check if animations exist
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);

            const clips = gltf.animations;
            actions = clips.map((clip) => mixer.clipAction(clip));

            console.log('Loaded Animations:', clips.map((clip) => clip.name));
            console.log('Actions:', actions);

            // Play the first animation by default
            currentAction = actions[0];
            if (currentAction) currentAction.play();

            // Add key events to switch animations
            window.addEventListener('keydown', (event) => {
                if (event.key === '1') switchAnimation(0);
                if (event.key === '2') switchAnimation(1);
            });
        } else {
            console.warn('No animations found in the GLB file.');
        }
    });

    animate();
}

function switchAnimation(index) {
    if (actions && actions[index]) {
        if (currentAction) currentAction.stop();
        currentAction = actions[index];
        currentAction.play();
    } else {
        console.warn('No animation exists at index:', index);
    }
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta); // Update animations
    renderer.render(scene, camera);
}

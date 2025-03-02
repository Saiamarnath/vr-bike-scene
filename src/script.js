import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene, Camera & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// Add VR Button
document.body.appendChild(VRButton.createButton(renderer));

// Load HDRI Environment
new RGBELoader().load('/vr-bike-scene/env.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

// Load Bike Model
const gltfLoader = new GLTFLoader();
gltfLoader.load('/vr-bike-scene/re.glb', function (gltf) {
    let bike = gltf.scene;
    bike.position.set(0, -4.8, -5);
    bike.scale.set(2, 2, 2);

    // Assign default material if textures are missing
    bike.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        }
    });

    scene.add(bike);
});

// Lighting
const sunLight = new THREE.DirectionalLight(0xffcc88, 2);
sunLight.position.set(5, 10, 10);
scene.add(sunLight);

// Animation Loop
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}
animate();

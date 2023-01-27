import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

// Loader
const textureLoader = new THREE.TextureLoader();

// Esfera
const sphereTexture = textureLoader.load('/textures/earth.jpg');
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: sphereTexture,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Particles
const count = 1000000;
const particlesGeometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < count; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // x
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // y
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // z
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    sizeAttenuation: false,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 0, 10);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Controls
const controls = new TrackballControls(camera, canvas);

const clock = new THREE.Clock();

const tick = () => {
    controls.update();
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y = elapsedTime * 0.1;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

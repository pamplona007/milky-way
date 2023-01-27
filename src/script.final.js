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
camera.position.z = 5;

// Loaders
const textureLoader = new THREE.TextureLoader();

// Sphere
const sphereTexture = textureLoader.load('/textures/earth.jpg');
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    map: sphereTexture,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

// Particles
const count = 1000000;
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; count > i; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // x
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // y
    vertices.push(THREE.MathUtils.randFloatSpread(5000) * 5); // z
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    sizeAttenuation: false,
    color: 0x888888,
});
const particles = new THREE.Points(geometry, particlesMaterial);
scene.add(particles);

// Controls
const controls = new TrackballControls(camera, canvas);
controls.dynamicDampingFactor = .05;
controls.minDistance = 1.3;

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 0, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.07);
scene.add(ambientLight);

const clock = new THREE.Clock();

const tick = () => {
    controls.update();
    const elapsedTime = clock.getElapsedTime();

    sphereMesh.rotation.y = elapsedTime * .1;
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

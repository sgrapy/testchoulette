import * as THREE from "https://unpkg.com/three@0.160.1/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?module";

const canvas = document.getElementById("webgl");

/* ---------------- SCENE ---------------- */
const scene = new THREE.Scene();

/* ---------------- CAMERA ---------------- */
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0.2, 6);

/* ---------------- RENDERER ---------------- */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* ---------------- LIGHTS ---------------- */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(4, 5, 6);
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 1);
fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

/* ---------------- MODEL ---------------- */
const loader = new GLTFLoader();
let bottle = null;

loader.load(
  "./bouteille.glb",
  (gltf) => {
    bottle = gltf.scene;

    bottle.scale.set(1.8, 1.8, 1.8);
    bottle.position.set(0, -1.2, 0);
    bottle.rotation.set(0, 0, 0);

    scene.add(bottle);
  },
  undefined,
  (error) => {
    console.error("Erreur chargement GLB :", error);
  }
);

/* ---------------- SCROLL ---------------- */
function getScrollProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) return 0;
  return THREE.MathUtils.clamp(scrollTop / maxScroll, 0, 1);
}

/* ---------------- ANIMATION ---------------- */
function animate() {
  requestAnimationFrame(animate);

  const progress = getScrollProgress();

  if (bottle) {
    // Déplacement gauche -> droite -> centre
    bottle.position.x = THREE.MathUtils.lerp(-1.2, 1.2, progress);

    // Descente légère
    bottle.position.y = THREE.MathUtils.lerp(-0.8, -1.5, progress);

    // Rotation sur elle-même
    bottle.rotation.y = progress * Math.PI * 4;

    // Inclinaison légère pour plus de style
    bottle.rotation.z = THREE.MathUtils.lerp(-0.12, 0.12, progress);
  }

  // Zoom caméra
  camera.position.z = THREE.MathUtils.lerp(6, 3.2, progress);

  // Petit mouvement vertical caméra
  camera.position.y = THREE.MathUtils.lerp(0.2, -0.1, progress);

  renderer.render(scene, camera);
}

animate();

/* ---------------- RESIZE ---------------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
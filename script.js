import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0.15, 6);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 1);
fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

const loader = new GLTFLoader();
let bottle = null;

loader.load(
  "./bouteille.glb",
  (gltf) => {
    bottle = gltf.scene;

    bottle.scale.set(0.3, 0.3, 0.3);
    bottle.position.set(3, 1, 0);
    bottle.rotation.set(0, 0, 0);

    scene.add(bottle);
  },
  undefined,
  (error) => {
    console.error("Erreur chargement GLB :", error);
  }
);

function getScrollProgress() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  return maxScroll > 0
    ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
    : 0;
}

function animate() {
  requestAnimationFrame(animate);

  const p = getScrollProgress();

  if (bottle) {
    bottle.position.x = THREE.MathUtils.lerp(1, 1.0, p);
    bottle.position.y = THREE.MathUtils.lerp(-0.8, -1.4, p);
    bottle.rotation.y = p * Math.PI * 4;
    bottle.rotation.z = THREE.MathUtils.lerp(-0.08, 0.08, p);
  }

  camera.position.z = THREE.MathUtils.lerp(6, 3.1, p);
  camera.position.y = THREE.MathUtils.lerp(0.15, -0.05, p);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
scene.add(camera);

/* ---------------- RENDERER ---------------- */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* ---------------- LIGHTS ---------------- */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

/* ---------------- RESPONSIVE SETTINGS ---------------- */
function getResponsiveSettings() {
  const width = window.innerWidth;
  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 900;

  if (isMobile) {
    return {
      isMobile: true,
      scale: 0.4,
      startX: 0,
      endX: 0,
      startY: -0.5,
      endY: -0.9,
      startCamZ: 6.8,
      endCamZ: 5.6,
      startCamY: 0.1,
      endCamY: -0.05,
      rotationMultiplier: Math.PI * 2
    };
  }

  if (isTablet) {
    return {
      isMobile: false,
      scale: 0.3,
      startX: 1.1,
      endX: 0.1,
      startY: -1.05,
      endY: -1.45,
      startCamZ: 6.4,
      endCamZ: 4.8,
      startCamY: 0.15,
      endCamY: -0.05,
      rotationMultiplier: Math.PI * 3
    };
  }

  return {
    isMobile: false,
    scale: 0.4,
    startX: 1.4,
    endX: 0.15,
    startY: -0.9,
    endY: -1.35,
    startCamZ: 6.2,
    endCamZ: 4.1,
    startCamY: 0.2,
    endCamY: -0.08,
    rotationMultiplier: Math.PI * 4
  };
}

let settings = getResponsiveSettings();

/* ---------------- MODEL ---------------- */
const loader = new GLTFLoader();
let bottle = null;

loader.load(
  "./bouteille.glb",
  (gltf) => {
    bottle = gltf.scene;

    applyBottleBaseState();
    scene.add(bottle);
  },
  undefined,
  (error) => {
    console.error("Erreur chargement GLB :", error);
  }
);

function applyBottleBaseState() {
  if (!bottle) return;

  bottle.scale.setScalar(settings.scale);
  bottle.position.set(settings.startX, settings.startY, 0);
  bottle.rotation.set(0, 0, 0);
}

function applyCameraBaseState() {
  camera.position.set(0, settings.startCamY, settings.startCamZ);
}

/* ---------------- SCROLL ---------------- */
function getScrollProgress() {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
}

/* ---------------- ANIMATION ---------------- */
applyCameraBaseState();

function animate() {
  requestAnimationFrame(animate);

  const p = getScrollProgress();

  if (bottle) {
    bottle.position.x = THREE.MathUtils.lerp(settings.startX, settings.endX, p);
    bottle.position.y = THREE.MathUtils.lerp(settings.startY, settings.endY, p);

    bottle.rotation.y = p * settings.rotationMultiplier;
    bottle.rotation.z = THREE.MathUtils.lerp(-0.06, 0.06, p);
  }

  camera.position.z = THREE.MathUtils.lerp(settings.startCamZ, settings.endCamZ, p);
  camera.position.y = THREE.MathUtils.lerp(settings.startCamY, settings.endCamY, p);

  renderer.render(scene, camera);
}

animate();

/* ---------------- RESIZE ---------------- */
window.addEventListener("resize", () => {
  settings = getResponsiveSettings();

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  applyCameraBaseState();
  applyBottleBaseState();
});
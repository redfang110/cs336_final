
/*
 * A container filled with spheres.
 */
var mouseX, mouseY, mouseZ;
let camera, scene, renderer; // ThreeJS globals
let world; // CannonJs world
let gameEnded;
let ballMats = [];
let ballSizes = [];
let floorMat, wallMat, red_planeMat;
let widthsegments = 32, heightsegments = 32;
let currentBall;

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0,.7,0);
scene.add(sphereMesh);

function initMats() {
  for (let i = 0; i < 5; i++) {
    const color = new THREE.Color(`hsl(${30 + i * 10}, 100%, 50%)`);
    const material = new THREE.MeshLambertMaterial({ color });
    ballMats.push(material);
  }
  const color = new THREE.Color(0xffffff);
  floorMat = new THREE.MeshLambertMaterial({ color });
}

function init() {
  initMats();
  ballSizes.push(0.5, 0.6, 1.0, 1.25, 2.0);
  mouseX = 0; 
  mouseY = 60;
  mouseZ = 0;

  gameEnded = false;
    
  // Initialize CannonJS
  world = new CANNON.World();
  world.gravity.set(0, -10, 0); // Gravity pulls things down
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 40;
    
  // Initialize ThreeJs
  const aspect = window.innerWidth / window.innerHeight;
  const width = 10;
  const height = width / aspect;
    
  camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    0, // near plane
    100 // far plane
  );
    
  /*
  // If you want to use perspective camera instead, uncomment these lines
  camera = new THREE.PerspectiveCamera(
    45, // field of view
    aspect, // aspect ratio
    1, // near plane
    100 // far plane
  );
  */
    
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);
    
  scene = new THREE.Scene();
    
  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
    
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);
    
  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

  currentBall = generateBall(Math.floor(Math.random() * 2));
}

function generateBall(index) {
  // ThreeJS
  const geometry = new THREE.SphereGeometry(ballSizes[index], widthsegments, heightsegments); 
  const mesh = new THREE.Mesh(geometry, ballMats[index]);
  mesh.position.set(mouseX, mouseY, mouseZ);
  scene.add(mesh);
    
  // CannonJS
  const shape = new CANNON.Sphere(ballSizes[index]);
  let mass = 10; // If it shouldn't fall then setting the mass to zero will keep it stationary
  mass *= ballSizes[index];
  const body = new CANNON.Body({ mass, shape });
  body.position.set(mouseX, mouseY, mouseZ);
  world.addBody(body);
    
  return {
    threejs: mesh,
    cannonjs: body,
    radius: ballSizes[index]
  };
}

function dropBall() {

  generateBall(Math.floor(Math.random() * 2));
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
      gameStart = true;
      dropBall();
  }

  if (event.code == 'ArrowLeft') {
      mouseX -= 0.5;
      if (mouseX <= -10){
          mouseX = -10;
      }
      // sphereMesh.position.set(mouseX, 0.7, mouseZ);
  }

  if (event.code == 'ArrowRight') {
      mouseX += 0.5;
      if (mouseX >= 10){
          mouseX = 10;
      }
      // sphereMesh.position.set(mouseX, 0.7, mouseZ);
  }

  if (event.code == 'ArrowUp') {
    mouseZ += 0.5;
    if (mouseZ >= 10){
      mouseZ = 10;
    }
    // sphereMesh.position.set(mouseX, 0.7, mouseZ);
  }

  if (event.code == 'ArrowDown') {
    mouseZ -= 0.5;
    if (mouseZ <= -10){
      mouseZ = -10;
    }
    // sphereMesh.position.set(mouseX, 0.7, mouseZ);
  }

});
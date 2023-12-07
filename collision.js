let camera, scene, renderer; // ThreeJS globals
let world; // CannonJS world

let balls = [];

let merge = false; // Flag set to true when two balls need to merge
let mergedBall1, mergedBall2; // These are CannonJS bodies; ids are used to find corresponding ThreeJS meshes

// Test materials; need one for each type of ball
const ballPhysMat1 = new CANNON.Material();
const ballPhysMat2 = new CANNON.Material();
const groundPhysMat = new CANNON.Material();

function animation() {

    updatePhysics();
    renderer.render(scene, camera);
}

function updatePhysics() {

    world.step(1 / 60); // Step forward the physics world

    if (merge) { // Merge balls if needed
        mergeBalls();
    }

    // Copy coordinates of objects from Cannon.js to Three.js
    balls.forEach((element) => {
        element.threejs.position.copy(element.cannonjs.position);
        element.threejs.quaternion.copy(element.cannonjs.quaternion);
    })
}

// Creates ball
function generateBall(x, y, z, radius) {
    
    // ThreeJS
    const geometry = new THREE.SphereGeometry(radius);
    const color = new THREE.Color('skyblue');
    const material = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);

    // CannonJS
    const body = new CANNON.Body({
        shape: new CANNON.Sphere(radius),
        type: CANNON.Body.DYNAMIC,
        mass: 5,
        material: ballPhysMat1,
        position: new CANNON.Vec3(x, y, z)
    });
    // Note that the event listener is attached to the CannonJS object, NOT the ThreeJS object
    body.addEventListener('collide', (e) => {
        if (e.body.material == e.target.material) {
            merge = true;
            mergedBall1 = e.body;
            mergedBall2 = e.target;
        }
    })
    world.addBody(body);

    // Return object containing ThreeJS object, CannonJS object, and radius
    return {
        threejs: mesh,
        cannonjs: body,
        radius
    };
}

// Merges mergedBall1 and mergedBall2 into 1 ball a level higher
function mergeBalls() {

    // Find midpoint between balls
    const newX = (mergedBall1.position.x + mergedBall2.position.x) / 2;
    const newY = (mergedBall1.position.y + mergedBall2.position.y) / 2;
    const newZ = (mergedBall1.position.z + mergedBall2.position.z) / 2;

    // Delete ball 2 on ThreeJS side
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].cannonjs.id == mergedBall2.id) {
            scene.remove(balls[i].threejs);
        }
    }

    // Delete ball 2 of CannonJS side
    world.remove(mergedBall2);

    // Set new shape of ball 1 on CannonJS side
    const shape = new CANNON.Sphere(1);
    mergedBall1.shapes = [];
    mergedBall1.addShape(shape);

    // Set new shape of ball 1 on ThreeJS side
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].cannonjs.id == mergedBall1.id) {
            balls[i].threejs.scale.set(2, 2, 2); // Hard coded numbers, replace in main project
            balls[i].threejs.material.color.setHex(0xff0000); // Change color (iterate to next color in main project)
        }
    }

    // Set position of ball 1 as midpoint on CannonJS side (ThreeJS side updated in updatePhysics)
    mergedBall1.position.set(newX, newY, newZ);

    // Set material of ball 1 on CannnonJS side (iterate to next material in material array in main project)
    mergedBall1.material = ballPhysMat2;

    // Reset flag
    merge = false;
}

function generateFloor() {

    // ThreeJS
    const geometry = new THREE.BoxGeometry(10, 0.5, 10);
    const color = new THREE.Color('darkgoldenrod');
    const material = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -1, 0);
    scene.add(mesh);

    // CannonJS
    const body = new CANNON.Body({ 
        shape: new CANNON.Box(new CANNON.Vec3(5, 0.25, 5)),
        type: CANNON.Body.STATIC,
        material: groundPhysMat,
        position: new CANNON.Vec3(0, -1, 0)
     });
    world.addBody(body);
}

function init() {

    // Initialize CannonJS
    world = new CANNON.World();
    world.gravity.set(0, -20, 0); // Gravity pulls things down
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 40;

    // Initialize ThreeJS
    scene = new THREE.Scene();

    // Replace with however main project makes floor
    generateFloor();

    // Test balls
    const ball = generateBall(0, 2, 0, 0.5);
    balls.push(ball);

    const ball2 = generateBall(0.1, 5, 0, 0.5);
    balls.push(ball2);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);

    // Camera
    const width = 20;
    const height = width * (window.innerHeight / window.innerWidth);
    camera = new THREE.OrthographicCamera(
        width / -2, // left
        width / 2, // right
        height / 2, // top
        height / -2, // bottom
        1, // near
        100 // far
    );

    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
    renderer.setAnimationLoop(animation);
}
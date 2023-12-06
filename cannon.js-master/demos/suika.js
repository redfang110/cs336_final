
/**
* A container filled with spheres.
*/

// Initialize Three.js
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var dt = 1/60, N=40;

var startTime = Date.now(), currentTime, cooldownTime;
var mouseX, mouseY, mouseZ;
var container, camera, scene, renderer;
var meshes=[];
var gameEnded;
var ballMats = [];
var ballSizes = [];
var floorMat, wallMat, red_planeMat;
var widthsegments = 32, heightsegments = 32;
var currentBall;
var balls = [];
var world = new CANNON.World();
scene = new THREE.Scene();

//for debugging
var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

init();
animate();

function initMats() {
    mat1 = new THREE.MeshBasicMaterial( { color: '#FF0000', side: THREE.DoubleSide } ); // red
    mat2 = new THREE.MeshBasicMaterial( { color: '#FFA500', side: THREE.DoubleSide } ); // orange
    mat3 = new THREE.MeshBasicMaterial( { color: '#FFFF00', side: THREE.DoubleSide } ); // yellow
    mat4 = new THREE.MeshBasicMaterial( { color: '#00FF00', side: THREE.DoubleSide } ); // green
    mat5 = new THREE.MeshBasicMaterial( { color: '#0000FF', side: THREE.DoubleSide } ); // blue
    ballMats.push(mat1, mat2, mat3, mat4, mat5);
        
    const color = new THREE.Color(0xffffff);
    floorMat = new THREE.MeshLambertMaterial({ color });
}

function init() {
    initMats();
    ballSizes.push(0.5, 0.6, 1.0, 1.25, 2.0);
    mouseX = 0; 
    mouseY = 16;
    mouseZ = 0;
    gameEnded = false;
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // camera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );

    camera.position.set( 40, 40, 10);
    scene.add( camera );

    // Controls
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];

    // lights
    var light, materials;
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xffffff, 1.75 );
    var d = 20;

    light.position.set( d, d, d );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 3*d;
    light.shadowCameraNear = d;
    light.shadowDarkness = 0.5;

    scene.add( light );

    // floor
    geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
    material = new THREE.MeshBasicMaterial( { color: '#c48341', side: THREE.DoubleSide } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    meshes.push(mesh);
    scene.add(mesh);

    wall1 = new THREE.PlaneGeometry( 10, 15, 1, 1 );
    wall1.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
    material = new THREE.MeshLambertMaterial( { color: '#a5e0e6', side: THREE.DoubleSide, transparent: true, opacity: 0.3  } );
    wallMesh = new THREE.Mesh( wall1, material );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.position.y = 7.5;
    wallMesh.position.x = 5;
    meshes.push(wallMesh);
    scene.add(wallMesh);

    wall2 = new THREE.PlaneGeometry( 10, 15, 1, 1 );
    wall2.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI / 2 ) );
    material = new THREE.MeshLambertMaterial( { color: '#a5e0e6', side: THREE.DoubleSide, transparent: true, opacity: 0.3  } );
    wallMesh = new THREE.Mesh( wall2, material );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.position.y = 7.5;
    wallMesh.position.x = -5;
    meshes.push(wallMesh);
    scene.add(wallMesh);

    wall3 = new THREE.PlaneGeometry( 10, 15, 1, 1 );
    wall3.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI) );
    material = new THREE.MeshLambertMaterial( { color: '#a5e0e6', side: THREE.DoubleSide, transparent: true, opacity: 0.3  } );
    wallMesh = new THREE.Mesh( wall3, material );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.position.y = 7.5;
    wallMesh.position.z = -5;
    meshes.push(wallMesh);
    scene.add(wallMesh);

    wall4 = new THREE.PlaneGeometry( 10, 15, 1, 1 );
    wall4.applyMatrix( new THREE.Matrix4().makeRotationZ( Math.PI) );
    material = new THREE.MeshLambertMaterial( { color: '#a5e0e6', side: THREE.DoubleSide, transparent: true, opacity: 0.3  } );
    wallMesh = new THREE.Mesh( wall4, material );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.position.y = 7.5;
    wallMesh.position.z = 5;
    meshes.push(wallMesh);
    scene.add(wallMesh);
          
    wallTop = new THREE.PlaneGeometry( 10, 10, 1, 1 );
    wallTop.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI/2) );
    material = new THREE.MeshLambertMaterial( { color: 'red', side: THREE.DoubleSide, transparent: true, opacity: 0.3  } );
    wallMesh = new THREE.Mesh( wallTop, material );
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    wallMesh.position.y = 15;
    //wallMesh.position.z = 5;
    meshes.push(wallMesh);
    scene.add(wallMesh);

    // cubes
    // var ballGeo = new THREE.SphereGeometry( 2, 20, 20 );
    // var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );

    // sphereMesh = new THREE.Mesh( ballGeo, ballMaterial );
    // sphereMesh.castShadow = true;
    // //sphereMesh.position.y = 8;
    // //sphereMesh.receiveShadow = true;
    // scene.add( sphereMesh );

          
    // Create world
     
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    // Tweak contact properties.
    world.defaultContactMaterial.contactEquationStiffness = 1e11; // Contact stiffness - use to make softer/harder contacts
    world.defaultContactMaterial.contactEquationRelaxation = 2; // Stabilization time in number of timesteps

    // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
    world.solver.iterations = 10;

    //world.gravity.set(0,0,-30);

    // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
    world.quatNormalizeFast = true;
    world.quatNormalizeSkip = 8; // ...and we do not have to normalize every step.

    // Materials
    var stone = new CANNON.Material('stone');
    var stone_stone = new CANNON.ContactMaterial(stone, stone, {
        friction: 0.3,
        restitution: 0.2
    });
    world.addContactMaterial(stone_stone);

    // ground plane
    var groundShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1))
    var groundBody = new CANNON.Body({ mass: 0, material: stone });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
    groundBody.position.set(0,0,0);
    // groundBody.quaternions = mesh.quaternions;
    world.addBody(groundBody);
    //demo.addVisual(groundBody);

    // // Plane -y
    // var planeShapeYmin = new CANNON.Plane();
    // var planeYmin = new CANNON.Body({ mass: 0, material: stone });
    // planeYmin.addShape(planeShapeYmin);
    // planeYmin.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    // planeYmin.position.set(0,0,0);
    // world.addBody(planeYmin);

    // plane -x
    var planeShapeXmin = new CANNON.Box(new CANNON.Vec3(5, 10, 0.1))
    var planeXmin = new CANNON.Body({ mass: 0 });
    planeXmin.addShape(planeShapeXmin);
    planeXmin.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/2);
    planeXmin.position.set(-5,5,0);
    world.addBody(planeXmin);
    //demo.addVisual(planeXmin);

    // Plane +x
    var planeShapeXmax = new CANNON.Box(new CANNON.Vec3(5, 10, 0.1))
    var planeXmax = new CANNON.Body({ mass: 0 });
    planeXmax.addShape(planeShapeXmax);
    planeXmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-Math.PI/2);
    planeXmax.position.set(5,5,0);
    world.addBody(planeXmax);

    // Plane -y
    var planeShapeYmin = new CANNON.Box(new CANNON.Vec3(5, 10, 0.1))
    var planeYmin = new CANNON.Body({ mass: 0 });
    planeYmin.addShape(planeShapeYmin);
    planeYmin.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,0),-Math.PI/2);
    planeYmin.position.set(0,5,-5);
    world.addBody(planeYmin);

    // Plane +y
    var planeShapeYmax = new CANNON.Box(new CANNON.Vec3(5, 10, 0.1))
    var planeYmax = new CANNON.Body({ mass: 0 });
    planeYmax.addShape(planeShapeYmax);
    planeYmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,0),Math.PI/2);
    planeYmax.position.set(0,5,5);
    world.addBody(planeYmax);

    // var sphereShape = new CANNON.Sphere(2);
    // sphereBody = new CANNON.Body({ mass: 5 });
    // sphereBody.addShape(sphereShape);
    // //sphereBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 5);
    // sphereBody.position.set(0, 10, 0); // Start the sphere above the box
    // // sphereBody.angularFactor = new CANNON.Vec3(0, 0, 1);
    // world.addBody(sphereBody);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setClearColor( scene.fog.color );

    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMapEnabled = true;

    window.addEventListener( 'resize', onWindowResize, false );
    currentBall = generateBall(Math.floor(Math.random() * 2), false);
}

function generateBall(index, falls) {
    // ThreeJS
    const geometry = new THREE.SphereGeometry(ballSizes[index], widthsegments, heightsegments); 
    const mesh = new THREE.Mesh(geometry, ballMats[index]);
    mesh.position.set(mouseX, mouseY, mouseZ);
    scene.add(mesh);
          
    // CannonJS
    const shape = new CANNON.Sphere(ballSizes[index]);
    var mass = 0; // If it shouldn't fall then setting the mass to zero will keep it stationary
    if (falls) {
        mass = 10;
        mass *= ballSizes[index];
    }
    const body = new CANNON.Body({ mass, shape });
    body.position.set(mouseX, mouseY, mouseZ);
    world.addBody(body);
          
    return {
        threejs: mesh,
        cannonjs: body,
        // radius: ballSizes[index],
        i: index
    };
}

function dropBall() {
    var tempInt = currentBall.i;
    var tempBall;
    scene.remove(currentBall.threejs);
    world.remove(currentBall.cannonjs);
    tempBall = generateBall(tempInt, true);
    tempBall.cannonjs.position.set(mouseX, mouseY - 2, mouseZ);
    tempBall.threejs.position.set(mouseX, mouseY - 2, mouseZ);
    balls.push(tempBall);
    currentBall = generateBall(Math.floor(Math.random() * 2), false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.handleResize();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        currentTime = Date.now();
        if (Math.floor((currentTime - startTime) / 1000) > 0) {
            startTime = Date.now();
            dropBall();
        }
    }
      
    if (event.code == 'ArrowLeft') {
        mouseZ += 0.5;
        if (mouseZ >= 4){
            mouseZ = 4;
        }
        currentBall.threejs.position.set(mouseX, mouseY, mouseZ);
        currentBall.cannonjs.position.set(mouseX, mouseY, mouseZ);
    }
      
    if (event.code == 'ArrowRight') {
        mouseZ -= 0.5;
        if (mouseZ <= -4){
            mouseZ = -4;
        }
        currentBall.threejs.position.set(mouseX, mouseY, mouseZ);
        currentBall.cannonjs.position.set(mouseX, mouseY, mouseZ);
    }
      
    if (event.code == 'ArrowUp') {
        mouseX -= 0.5;
        if (mouseX <= -4){
            mouseX = -4;
        }
        currentBall.threejs.position.set(mouseX, mouseY, mouseZ);
        currentBall.cannonjs.position.set(mouseX, mouseY, mouseZ);
    }
      
    if (event.code == 'ArrowDown') {
        mouseX += 0.5;
        if (mouseX >= 4){
            mouseX = 4;
        }
        currentBall.threejs.position.set(mouseX, mouseY, mouseZ);
        currentBall.cannonjs.position.set(mouseX, mouseY, mouseZ);
    }
      
});

function updateBodies() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].threejs.position.copy(balls[i].cannonjs.position);
    }
}

function animate() {
    updateBodies();
    requestAnimationFrame( animate );
    world.step(1 / 60);
    // sphereMesh.position.copy(sphereBody.position);
    controls.update();
    render();
}

function render() {
    // cannonDebugRenderer.update();  
    renderer.render( scene, camera );
}

setInterval(function() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    output(Math.floor(delta / 1000)); // in seconds
    // alternatively just show wall clock time:
    output(new Date().toUTCString());
}, 1000); // update about every second
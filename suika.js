// Set up Three.js scene
const scene = new THREE.Scene();
  scene.background = new THREE.Color('#add8e6');

  var shapes;
  shapes = [];

  var sphereGeometry4;
   var sphereMaterial4;
   var sphereMesh4;
   
   var sphereShape4; 
   var sphereBody4; 
   var gameStart = false;
   var xVal = 0;

  const aspect = window.innerWidth / window.innerHeight;
  const width = 1.5;
  const height = width / aspect;
  // Use an orthographic camera for 2D
  const camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    0, // near plane
    100 // far plane
  );

    //for debugging
    const hlp = new THREE.AxesHelper(1);
  scene.add(hlp);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Set up Cannon.js physics
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  // Create transparent box
  const boxGeometry = new THREE.BoxGeometry(1., 1.25, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.3 });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(0, -.1, 0);
  scene.add(boxMesh);

  // Create circle
  const sphereGeometry = new THREE.CircleGeometry(.05, 32);
  //const sphereGeometry = new THREE.CylinderGeometry(1,1,1,32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0,.7,0);
  scene.add(sphereMesh);

 // const sphereShape = new CANNON.Sphere(1);
//   const sphereShape = new CANNON.Cylinder(.1,.1,1,32);
//   const sphereBody = new CANNON.Body({ mass: 0 });
//   sphereBody.addShape(sphereShape);
//   sphereBody.position.set(0, .70, 0); // Start the sphere above the box
//   world.addBody(sphereBody);

  // Create collision
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  groundBody.position.set(0, -.70, 0);
  world.addBody(groundBody);

//   const backShape = new CANNON.Plane();
//   const backBody = new CANNON.Body({ mass: 0 });
//   backBody.addShape(backShape);
//   //backBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
//   backBody.position.set(0, 0, 1);
//   world.addBody(backBody);

//   const frontShape = new CANNON.Plane();
//   const frontBody = new CANNON.Body({ mass: 0 });
//   frontBody.addShape(frontShape);
//   frontBody.position.set(0, 0, 1);
//   world.addBody(frontBody);

  const rightBox = new CANNON.Plane();
  const rightBody = new CANNON.Body({mass: 0});
  rightBody.addShape(rightBox);
  rightBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),-Math.PI/2);
  rightBody.position.set(.5,0,0);
 // world.addBody(rightBody);

  const bottomMeshGeometry = new THREE.PlaneGeometry();
  const bottomMeshMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  const bottomMesh = new THREE.Mesh(bottomMeshGeometry, bottomMeshMaterial);
  bottomMesh.rotateY(Math.PI / 2.01);
  bottomMesh.position.copy(rightBody.position);
 // scene.add(bottomMesh);

  const leftBox = new CANNON.Plane();
  const leftBody = new CANNON.Body({mass: 0});
  leftBody.addShape(leftBox);
  leftBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),-Math.PI/2);
  leftBody.position.set(-.5,0,0);
  //world.addBody(leftBody);

  const bottomMeshGeometry2 = new THREE.PlaneGeometry();
  const bottomMeshMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
  const bottomMesh2 = new THREE.Mesh(bottomMeshGeometry2, bottomMeshMaterial2);
  bottomMesh2.rotateY(Math.PI /-2.01);
  bottomMesh2.position.copy(leftBody.position);
  //scene.add(bottomMesh2);

  // Set up camera position
  camera.position.z = 5;
  //camera.position.rotateY(); 

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.left = -newWidth / 2;
    camera.right = newWidth / 2;
    camera.top = newHeight / 2;
    camera.bottom = -newHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        gameStart = true;
        dropcircle();
      // On spacebar press and the sphere is not already in motion, apply an upward force
    //   sphereBody.mass = 6;
    //   sphereBody.applyLocalForce(new CANNON.Vec3(0, force, 0), sphereBody.position);
    }
    if (event.code == 'ArrowLeft'){
        xVal -= .04;
        if (xVal<=-.44){
            xVal = -0.44;
        }
       sphereMesh.position.set(xVal,.7,0);
    }
    if (event.code == 'ArrowRight'){
        xVal += .04;
        if (xVal>=.44){
            xVal = 0.44;
        }
       sphereMesh.position.set(xVal,.7,0);
    }
  });

  function dropcircle(){
     // Create circle
   //sphereGeometry4 = new THREE.CircleGeometry(.05, 32);
    var color = Math.floor(Math.random()*4);
    var colorVal = 'red';
    switch(color){
      case(1):
      colorVal = 'red';
      sphereMaterial.Color='red';
      break;
      case(2):
      colorVal = 'blue';
      sphereMaterial.Color='blue';
      break;
      case(3):
      colorVal = 'yellow';
      sphereMaterial.Color='yellow';
      break;
      case(4):
      default:
      colorVal = 'orange';
      sphereMaterial.Color='orange';
      break;
    }
    const sphereGeometry4 = new THREE.CylinderGeometry(.05,.05,2,32);
    sphereGeometry4.rotateX(Math.PI/2);
    sphereMaterial4 = new THREE.MeshBasicMaterial({ color: colorVal });
    sphereMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
    scene.add(sphereMesh4);

    // const sphereShape = new CANNON.Sphere(1);
    sphereShape4 = new CANNON.Cylinder(.05,.05,2,32);
    sphereBody4 = new CANNON.Body({ mass: 5 });
    sphereBody4.addShape(sphereShape4);
    //sphereBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 5);
    sphereBody4.position.set(xVal, .70, 0); // Start the sphere above the box
    sphereBody4.angularFactor = new CANNON.Vec3(0, 0, 1);
    world.addBody(sphereBody4);
  }

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Step the physics simulation forward
    world.step(1 / 60);

    // Update the Three.js mesh position based on Cannon.js body position
    //sphereMesh.position.copy(sphereBody.position);
    if(gameStart){
   // sphereMesh4.position.copy(sphereBody4.position);
    if(sphereBody4.position.x >=.44){
        sphereBody4.position.x = .44;
    }
    if(sphereBody4.position.x <=-.44){
        sphereBody4.position.x = -.44;
    }
    if(sphereBody4.position.z != 0){
        sphereBody4.position.z = 0.00;
    }
    // if(sphereBody4.position.y<-.65){
    //     sphereBody4.position.y=-.65;
    // }
    sphereMesh4.position.copy(sphereBody4.position);
    }
    //sphereMesh.rotation.z = sphereBody.angle;

    // Render the scene
    renderer.render(scene, camera);
  };

  // Start the animation loop
  animate();
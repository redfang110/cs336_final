
     /**
      * A container filled with spheres.
      */

      // Initialize Three.js
      if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      var dt = 1/60, N=40;

      

      var container, camera, scene, renderer;
      var meshes=[];
      var world = new CANNON.World();
      scene = new THREE.Scene();

      //for debugging
      var cannonDebugRenderer = new THREE.CannonDebugRenderer( scene, world );

      init();
      animate();

      function init() {

          container = document.createElement( 'div' );
          document.body.appendChild( container );

          // scene
         

          // const hlp = new THREE.AxesHelper(1);
          //  scene.add(hlp);
          //scene.fog = new THREE.Fog( 0x000000, 500, 10000 );

          // camera
          camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.5, 10000 );
          camera.position.set(Math.cos( Math.PI/5 ) * 30,
          5,
          Math.sin( Math.PI/5 ) * 30);
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
          var ballGeo = new THREE.SphereGeometry( 2, 20, 20 );
          var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x888888 } );

          sphereMesh = new THREE.Mesh( ballGeo, ballMaterial );
          sphereMesh.castShadow = true;
          //sphereMesh.position.y = 8;
          //sphereMesh.receiveShadow = true;
          scene.add( sphereMesh );

          
      //  // Create world
     
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

      var sphereShape = new CANNON.Sphere(2);
         sphereBody = new CANNON.Body({ mass: 5 });
         sphereBody.addShape(sphereShape);
        //sphereBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 5);
         sphereBody.position.set(0, 10, 0); // Start the sphere above the box
        // sphereBody.angularFactor = new CANNON.Vec3(0, 0, 1);
         world.addBody(sphereBody);



          renderer = new THREE.WebGLRenderer( { antialias: true } );
          renderer.setSize( window.innerWidth, window.innerHeight );
          //renderer.setClearColor( scene.fog.color );

          container.appendChild( renderer.domElement );

          renderer.gammaInput = true;
          renderer.gammaOutput = true;
          renderer.shadowMapEnabled = true;

          window.addEventListener( 'resize', onWindowResize, false );
      }

      function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          controls.handleResize();
          renderer.setSize( window.innerWidth, window.innerHeight );
      }

      function animate() {
          requestAnimationFrame( animate );
          world.step(1 / 60);
          sphereMesh.position.copy(sphereBody.position);
          controls.update();
          render();
      }

      function render() {
          cannonDebugRenderer.update();  
          renderer.render( scene, camera );
      }



 //     const bottomMeshGeometry = new THREE.PlaneGeometry();
 // const bottomMeshMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
 // const bottomMesh = new THREE.Mesh(bottomMeshGeometry, bottomMeshMaterial);
 // bottomMesh.rotateY(Math.PI / 2.01);
 // bottomMesh.position.copy(planeYmax.position);
 // scene.add(bottomMesh);

       // Create spheres
      //  var rand = 0.1;
      //  var h = 0;
      //  var sphereShape = new CANNON.Sphere(1); // Sharing shape saves memory
      //  world.allowSleep = true;
      //  for(var i=0; i<nx; i++){
      //    for(var j=0; j<ny; j++){
      //      for(var k=0; k<nz; k++){
      //        var sphereBody = new CANNON.Body({ mass: 7, material: stone });
      //        sphereBody.addShape(sphereShape);
      //        sphereBody.position.set(0,0,0);
      //        sphereBody.allowSleep = true;
      //        sphereBody.sleepSpeedLimit = 1;
      //        sphereBody.sleepTimeLimit = 5;

      //        world.addBody(sphereBody);
      //        //demo.addVisual(sphereBody);
      //      }
      //    }
      //  }
     

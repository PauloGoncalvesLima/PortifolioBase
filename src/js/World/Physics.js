import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export default class Physics {

  constructor(_options) {
    
    this.config = _options.config
    this.debug = _options.debug
    this.time = _options.time
    this.sizes = _options.sizes
    this.controls = _options.controls
    this.sounds = _options.sounds

    // debug setup
    // TODO: NO DEBUG YET

    // set functions
    this.setWorld();
    this.setModels();
    this.setMaterial();
    this.setFloor();
    this.setCar();


    // update on frame
    this.time.on('update', () => {
      this.world.step(1/60, this.time.delta, 3);
    });
  }

  setWorld() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, -5);
    
    // Doesn't use broadphase why ?????
    // TODO: Discover why he doesn't use it

    this.world.allowSleep = true;
    this.world.defaultContactMaterial.friction = 0;
    this.world.defaultContactMaterial.restitution = 0.2;

    // debug setup
    // TODO: NO DEBUG YET
  }

  setModels() {
    // set up visible wireframe models with THREE
    this.models = {};
    this.models.container = new THREE.Object3D();
    // model materials setup
    this.models.materials = {};
    this.models.materials.static = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
    this.models.materials.dynamic = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});
    this.models.materials.dynamicSleeping = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true});

    // debug setup
    // TODO: NO DEBUG YET
  }

  setMaterial() {
    // CANNON colision materials
    this.materials = {};

    // create materials
    this.materials.items = {};
    this.materials.items.floor = new CANNON.Material('floorMaterial');
    this.materials.items.dummy = new CANNON.Material('dummyMaterial');
    this.materials.items.wheel = new CANNON.Material('wheelMaterial');

    // material contacts
    this.materials.contacts = {};
    // Contact between floor -- dummy
    this.materials.contacts.floorDummy = new CANNON.ContactMaterial(
      this.materials.items.floor,
      this.materials.items.dummy,
      {
        friction: 0.05, 
        restitution: 0.3,
        contactEquationStiffness: 1000
      }
    );
    this.world.addContactMaterial(this.materials.contacts.floorDummy);
    
    // Contact between dummy -- dummy
    this.materials.contacts.dummyDummy = new CANNON.ContactMaterial(
      this.materials.items.dummy,
      this.materials.items.dummy,
      {
        friction: 0.5, 
        restitution: 0.3,
        contactEquationStiffness: 1000
      }
    );
    this.world.addContactMaterial(this.materials.contacts.dummyDummy);

    // Contact between floor -- wheel
    this.materials.contacts.floorWheel = new CANNON.ContactMaterial(
      this.materials.items.floor,
      this.materials.items.wheel,
      {
        friction: 0.3, 
        restitution: 0,
        contactEquationStiffness: 1000
      }
    );
    this.world.addContactMaterial(this.materials.contacts.floorWheel);
  }

  setFloor() {
    this.floor = {};
    this.floor.body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: this.materials.items.floor
    });

    this.world.addBody(this.floor.body);
  }

  setCar() {
    this.car = {};

    this.car.steering = 0;
    this.car.accelerating = 0;
    this.car.speed = 0;
    this.car.worldForward = new CANNON.Vec3();
    this.car.angle = 0;
    this.car.forwardSpeed = 0;
    this.car.oldPosition = new CANNON.Vec3();
    this.car.goingForward = true;

    this.car.options = {}
    // shape
    this.car.options.chassisWidth = 1.02
    this.car.options.chassisHeight = 1.16
    this.car.options.chassisDepth = 2.03
    // vertical position
    this.car.options.chassisOffset = new CANNON.Vec3(0, 0, 0.41)
    // CANNON mass/weight
    this.car.options.chassisMass = 20
    
    // Wheel Settings
    // wheel position
    this.car.options.wheelFrontOffsetDepth = 0.635
    this.car.options.wheelBackOffsetDepth = - 0.475
    this.car.options.wheelOffsetWidth = 0.39
    // wheel size
    this.car.options.wheelRadius = 0.25
    this.car.options.wheelHeight = 0.24
    // suspension spring settings
    this.car.options.wheelSuspensionStiffness = 25
    this.car.options.wheelSuspensionRestLength = 0.1
    // wheel friction with floor
    this.car.options.wheelFrictionSlip = 5
    // wheel damping settings
    this.car.options.wheelDampingRelaxation = 1.8
    this.car.options.wheelDampingCompression = 1.5
    this.car.options.wheelMaxSuspensionForce = 100000
    this.car.options.wheelRollInfluence =  0.01 // ??
    this.car.options.wheelMaxSuspensionTravel = 0.3
    this.car.options.wheelCustomSlidingRotationalSpeed = - 30
    this.car.options.wheelMass = 5
    
    // Controls Settings
    this.car.options.controlsSteeringSpeed = 0.005
    this.car.options.controlsSteeringMax = Math.PI * 0.17
    this.car.options.controlsSteeringQuad = false
    this.car.options.controlsAcceleratingMaxSpeed = 0.055
    this.car.options.controlsAcceleratingMaxSpeedBoost = 0.11
    this.car.options.controlsAcceleratingSpeed = 2
    this.car.options.controlsAcceleratingSpeedBoost = 3.5
    this.car.options.controlsAcceleratingQuad = true
    this.car.options.controlsBrakeStrength = 0.45

    // upside down
    this.car.upsideDown = {};
    this.car.upsideDown.state = 'watching'; // possible: watching | pending | turning
    this.car.upsideDown.pendingTimeout = null;
    this.car.upsideDown.turningTimeout = null;

    /**
     * Jump
     */
    this.car.jump = (_toReturn = true, _strength = 60) => {
      let worldPosition = this.car.chassis.body.position;
      worldPosition = worldPosition.vadd(new CANNON.Vec3(_toReturn ? 0.08: 0, 0, 0));
      this.car.chassis.body.applyImpulse(new CANNON.Vec3(0, 0, _strength), worldPosition);
    }

    /**
     * Create method
     */
    this.car.create = () => {
      // Chassis
      this.car.chassis = {}

      this.car.chassis.shape = new CANNON.Box (
        new CANNON.Vec3(
          this.car.options.chassisDepth * 0.5,
          this.car.options.chassisWidth * 0.5,
          this.car.options.chassisHeight * 0.5
        )
      );
      this.car.chassis.body = new CANNON.Body({ mass: this.car.options.chassisMass });
      this.car.chassis.body.allowSleep = false;
      this.car.chassis.body.position.set(0, 0, 12)
      this.car.chassis.body.sleep();
      this.car.chassis.body.addShape(this.car.chassis.shape, this.car.options.chassisOffset);
      this.car.chassis.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), - Math.PI * 0.5); // ??

      /**
       * Sound TODO
       */

       /**
       * Vehicle
       */
      this.car.vehicle = new CANNON.RaycastVehicle({
          chassisBody: this.car.chassis.body
      });

      /**
       * Wheel
       */
      this.car.wheels = {};
      this.car.wheels.options = {
          radius: this.car.options.wheelRadius,
          height: this.car.options.wheelHeight,
          suspensionStiffness: this.car.options.wheelSuspensionStiffness,
          suspensionRestLength: this.car.options.wheelSuspensionRestLength,
          frictionSlip: this.car.options.wheelFrictionSlip,
          dampingRelaxation: this.car.options.wheelDampingRelaxation,
          dampingCompression: this.car.options.wheelDampingCompression,
          maxSuspensionForce: this.car.options.wheelMaxSuspensionForce,
          rollInfluence: this.car.options.wheelRollInfluence,
          maxSuspensionTravel: this.car.options.wheelMaxSuspensionTravel,
          customSlidingRotationalSpeed: this.car.options.wheelCustomSlidingRotationalSpeed,
          useCustomSlidingRotationalSpeed: true,
          directionLocal: new CANNON.Vec3(0, 0, - 1),
          axleLocal: new CANNON.Vec3(0, 1, 0),
          chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0) // Will be changed for each wheel (??)
      };

      // Front left
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, this.car.options.wheelOffsetWidth, 0);
      this.car.vehicle.addWheel(this.car.wheels.options);

      // Front right
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, - this.car.options.wheelOffsetWidth, 0);
      this.car.vehicle.addWheel(this.car.wheels.options);

      // Back left
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, this.car.options.wheelOffsetWidth, 0);
      this.car.vehicle.addWheel(this.car.wheels.options);

      // Back right
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, - this.car.options.wheelOffsetWidth, 0);
      this.car.vehicle.addWheel(this.car.wheels.options);

      this.car.vehicle.addToWorld(this.world);

      // index each wheel
      this.car.wheels.indexes = {};
      this.car.wheels.indexes.frontLeft = 0;
      this.car.wheels.indexes.frontRight = 1;
      this.car.wheels.indexes.backLeft = 2;
      this.car.wheels.indexes.backRight = 3;
      
      // create CANNON body for each wheel
      this.car.wheels.bodies = [];
      for (const _wheelInfos of this.car.vehicle.wheelInfos) {
          const shape = new CANNON.Cylinder(_wheelInfos.radius, _wheelInfos.radius, this.car.wheels.options.height, 20)
          const body = new CANNON.Body({ mass: this.car.options.wheelMass, material: this.materials.items.wheel })
          const quaternion = new CANNON.Quaternion()
          quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)

          body.type = CANNON.Body.KINEMATIC

          body.addShape(shape, new CANNON.Vec3(), quaternion)
          this.car.wheels.bodies.push(body)
      }

      /**
       * Model
       */
      this.car.model = {};
      this.car.model.container = new THREE.Object3D();
      this.models.container.add(this.car.model.container);

      this.car.model.material = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
      this.car.model.chassis = new THREE.Mesh(
        new THREE.BoxBufferGeometry (
          this.car.options.chassisDepth, 
          this.car.options.chassisWidth, 
          this.car.options.chassisHeight
        ),
        this.car.model.material
      );
      this.car.model.container.add(this.car.model.chassis);

      this.car.model.wheels = [];
      const wheelGeometry = new THREE.CylinderBufferGeometry(
        this.car.options.wheelRadius, 
        this.car.options.wheelRadius, 
        this.car.options.wheelHeight, 
        8,
        1
      );

      for(let i = 0; i < 4; i++) {
          const wheel = new THREE.Mesh(wheelGeometry, this.car.model.material);
          this.car.model.container.add(wheel);
          this.car.model.wheels.push(wheel);
      }
    }

    /**
     * Destroy
     */
    this.car.destroy = () => {
      this.car.vehicle.removeFromWorld(this.world);
      this.models.container.remove(this.car.model.container);
    }

    /**
     * Recreate
     */
    this.car.recreate = () => {
      this.car.destroy();
      this.car.create();
      this.car.chassis.body.wakeUp();
    }

    /**
     * Brake
     */
    this.car.brake = (brakeStrength) => {
      this.car.vehicle.setBrake(brakeStrength, 0);
      this.car.vehicle.setBrake(brakeStrength, 1);
      this.car.vehicle.setBrake(brakeStrength, 2);
      this.car.vehicle.setBrake(brakeStrength, 3);
    }

    /**
     * Unbrake
     */
    this.car.unbrake = () => {
      this.car.vehicle.setBrake(0, 0);
      this.car.vehicle.setBrake(0, 1);
      this.car.vehicle.setBrake(0, 2);
      this.car.vehicle.setBrake(0, 3);
    }

    /**
     * Actions
     */
    this.controls.on('action', (_name) => {
      switch(_name) {
        case 'reset':
          this.car.recreate();
          break;
      }
    });

    /**
     * Cannon tick (clock)
     */
    this.world.addEventListener('postStep', () => {
      // update speed
      let positionDelta = new CANNON.Vec3();
      positionDelta.copy(this.car.chassis.body.position);
      positionDelta = positionDelta.vsub(this.car.oldPosition);

      this.car.oldPosition.copy(this.car.chassis.body.position);
      this.car.speed = positionDelta.length();

      // going Forward
      const localForward = new CANNON.Vec3(1,0,0);
      this.car.chassis.body.vectorToWorldFrame(localForward, this.car.worldForward);
      this.car.angle = Math.atan2(this.car.worldForward.y, this.car.worldForward.x);

      this.car.forwardSpeed = this.car.worldForward.dot(positionDelta);
      this.car.goingForward = this.car.forwardSpeed > 0;

      // upside down
      const localUp = new CANNON.Vec3(0, 0, 1);
      const worldUp = new CANNON.Vec3();
      this.car.chassis.body.vectorToWorldFrame(localUp, worldUp);

      if (worldUp.dot(localUp) < 0.5) {
        if (this.car.upsideDown.state === 'watching') {
          this.car.upsideDown.state = 'pending';
          this.car.upsideDown.pendingTimeout = window.setTimeout(() => {
            this.car.upsideDown.state = 'turning';
            this.car.jump(true);

            this.car.upsideDown.turningTimeout = window.setTimeout(() => {
              this.car.upsideDown.state = 'watching';
            }, 1000);
          }, 1000);
        }
      } else {
        if (this.car.upsideDown.state === 'pending') {
          this.car.upsideDown.state = 'watching'
          window.clearTimeout(this.car.upsideDown.pendingTimeout);
        }
      }

      // update wheel bodies
      for (let i = 0; i < this.car.vehicle.wheelInfos.length; i++) {
        this.car.vehicle.updateWheelTransform(i);

        // fetch wheel transform
        const transform = this.car.vehicle.wheelInfos[i].worldTransform;
        this.car.wheels.bodies[i].position.copy(transform.position);
        this.car.wheels.bodies[i].quaternion.copy(transform.quaternion);

        // rotate wheels on the right
        if(i === 1 || i === 3) {
            const rotationQuaternion = new CANNON.Quaternion(0, 0, 0, 1);
            rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI);
            this.car.wheels.bodies[i].quaternion = this.car.wheels.bodies[i].quaternion.mult(rotationQuaternion);
        }
      }

      // slow back down
      if (!this.controls.actions.up && !this.controls.actions.down) {
        let slowDownForce = this.car.worldForward.clone();

        if (this.car.goingForward) {
          slowDownForce = slowDownForce.negate();
        }

        slowDownForce.scale(this.car.chassis.body.velocity.length() * 0.1, slowDownForce);

        this.car.chassis.body.applyImpulse(slowDownForce, this.car.chassis.body.position);
      }
    });

    /**
     * Time tick (clock)
     */
    this.time.on('update', () => {
      
      /**
       * Copy CANNON body position/quaternions into THREE model
       */
      // update chassis model
      this.car.model.chassis.position.copy(this.car.chassis.body.position).add(this.car.options.chassisOffset);
      this.car.model.chassis.quaternion.copy(this.car.chassis.body.quaternion);

      // update wheel models
      for (const _wheelKey in this.car.wheels.bodies) {
        const wheelBody = this.car.wheels.bodies[_wheelKey];
        const wheelMesh = this.car.model.wheels[_wheelKey];

        wheelMesh.position.copy(wheelBody.position);
        wheelMesh.quaternion.copy(wheelBody.quaternion);
      }
      
      /**
       * Steering
       */
      const steerStrength = this.time.delta * this.car.options.controlsSteeringSpeed;

      // steer right
      if (this.controls.actions.right) {
        this.car.steering += steerStrength;
      }
      // steer left
      else if (this.controls.actions.left) {
        this.car.steering -= steerStrength;
      }
      // steer center
      else {
        if (Math.abs(this.car.steering) > steerStrength) {
          this.car.steering -= steerStrength * Math.sign(this.car.steering);
        } else {
          this.car.steering = 0;
        }
      }

      // clamp steer
      if (Math.abs(this.car.steering) > this.car.options.controlsSteeringMax) {
        this.car.steering = Math.sign(this.car.steering) * this.car.options.controlsSteeringMax
      }

      // update wheel turning
      this.car.vehicle.setSteeringValue(-this.car.steering, this.car.wheels.indexes.frontLeft);
      this.car.vehicle.setSteeringValue(-this.car.steering, this.car.wheels.indexes.frontRight);

      /**
       * Accelerate
       */
      const accelerationSpeed = this.controls.actions.boost ? this.car.options.controlsAcceleratingSpeedBoost : this.car.options.controlsAcceleratingSpeed;
      const accelerateStrength = this.time.delta * accelerationSpeed;
      const controlsAcceleratingMaxSpeed = this.controls.actions.boost ? this.car.options.controlsAcceleratingMaxSpeedBoost : this.car.options.controlsAcceleratingMaxSpeed
      
      // accelerate up
      if (this.controls.actions.up) {
        if (this.car.speed < controlsAcceleratingMaxSpeed || !this.car.goingForward) {
          this.car.accelerating = accelerateStrength;
        } else {
          this.car.accelerating = 0;
        }
      } else if (this.controls.actions.down) { // accelerate down
        if (this.car.speed < controlsAcceleratingMaxSpeed || !this.car.goingForward) {
          this.car.accelerating = accelerateStrength;
        } else {
          this.car.accelerating = 0;
        }
      } else {
        this.car.accelerating = 0;
      }

      this.car.vehicle.applyEngineForce (-this.car.accelerating, this.car.wheels.indexes.backLeft)
      this.car.vehicle.applyEngineForce (-this.car.accelerating, this.car.wheels.indexes.backRight)

      if(this.car.options.controlsSteeringQuad) {
        this.car.vehicle.applyEngineForce (-this.car.accelerating, this.car.wheels.indexes.frontLeft)
        this.car.vehicle.applyEngineForce (-this.car.accelerating, this.car.wheels.indexes.fontRight)
      }
      
      if (this.controls.actions.brake) {
        this.car.brake(this.car.options.controlsBrakeStrength)
      } else {
        this.car.unbrake();
      }
    });

    // create initial car
    this.car.create();

    // debug TODO:
  }

  /**
   * Adds the objs from threejs to cannonjs
   * @param {*} _options includes {meshes, offset, rotation, mass, sleep}
   */
  addObjectFromThree(_options) {
    // set up
    const collision = {};

    collision.model = {};
    collision.model.meshes = [];
    collision.model.container = new THREE.Object3D();
    this.models.container.add(collision.model.container);

    collision.children = [];

    // material
    const bodyMaterial = this.materials.items.dummy;

    // body
    collision.body = new CANNON.Body({
      position: new CANNON.Vec3(_options.offset.x, _options.offset.y, _options.offset.z),
      mass: _options.mass,
      material: bodyMaterial
    });
    collision.body.allowSleep = true;
    collision.body.sleepSpeedLimit = 0.01;
    if (_options.sleep) {
      collision.body.sleep();
    }

    this.world.addBody(collision.body); 

    // rotation (WHAT IS GOING ON HERE?) we still don't know
    if (_options.rotation) {
      const rotationQuaternion = new CANNON.Quaternion();
      rotationQuaternion.setFromEuler(_options.rotation.x, _options.rotation.y, _options.rotation.z, _options.rotation.order);
      collision.body.quaternion = collision.body.quaternion.mult(rotationQuaternion);
    }

    // center
    collision.center = new CANNON.Vec3();

    // shapes
    const shapes = [];

    // for each mesh define the type to add in cannonJs down bellow
    for (let i = 0; i < _options.meshes.length; i++) {
      const mesh = _options.meshes[i];

      // define shape
      let shape = null;

      // Regex that compares to the names on blender file and defines the shape that will be added in cannon
      if (mesh.name.match(/^cube_?[0-9]{0-3}?|box[0-9]{0,3}?$/i)) {
        shape = "box";
      } else if(mesh.name.match(/^cylinder_?[0-9]{0,3}?$/i)) {
          shape = 'cylinder';
      } else if(mesh.name.match(/^sphere_?[0-9]{0,3}?$/i)) {
          shape = 'sphere';
      } else if(mesh.name.match(/^center_?[0-9]{0,3}?$/i)) {
          shape = 'center';
      }

      let shapeGeometry = null;
      switch (shape) {
        case shape === 'center':
          collision.center.set(mesh.position.x, mesh.position.y, mesh.position.z);
          break
        case shape === 'cylinder':
          shapeGeometry = new CANNON.Cylinder(mesh.scale.x, mesh.scale.x, mesh.scale.z, 8);
          break
        case shape === 'box':
          const halfExtents = new CANNON.Vec3(mesh.scale.x * 0.5, mesh.scale.y * 0.5, mesh.scale.z * 0.5);
          shapeGeometry = new CANNON.Box(halfExtents);
          break
        case shape === 'sphere':
          shapeGeometry = new CANNON.Sphere(mesh.scale.x);
          break
        default:
          console.log('unamed shape') // TODO: better debug message
      }

      // other shape
      if (shape && shape != 'center') {

        // position
        const shapePosition = new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z);

        // quaternion
        const shapeQuaternion = new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
        
        // save
        shapes.push({ shapeGeometry, shapePosition, shapeQuaternion });

        // create model object (used for debuging)
        let modelGeometry = null;
        switch (shape) {
          case 'cylinder':
            modelGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 8, 1);
            modelGeometry.rotateX(Math.PI * 0.5);
            break;
          case 'box': 
            modelGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
            break;
          case 'sphere':
            modelGeometry = new THREE.SphereBufferGeometry(1, 8, 8);
            break;
          default:
            console.log('unamed shape') // TODO: better debug message
        }
        
        const modelMesh = new THREE.Mesh(modelGeometry, this.models.materials[_options.mass === 0 ? 'static' : 'dynamic']);
        modelMesh.position.copy(mesh.position);
        modelMesh.scale.copy(mesh.scale);
        modelMesh.quaternion.copy(mesh.quaternion);

        // save
        collision.model.meshes.push(modelMesh);
      }
    }

    // update meshes to match center (three)
    for (const _mesh of collision.model.meshes) {
      _mesh.position.x -= collision.center.x;
      _mesh.position.y -= collision.center.y;
      _mesh.position.z -= collision.center.z;

      collision.model.container.add(_mesh);
    }

    // updates shapes to match center (cannon)
    for (const _shape of shapes) {
      _shape.position.x -= collision.center.x;
      _shape.position.y -= collision.center.y;
      _shape.position.z -= collision.center.z;

      collision.body.addShape(_shape.shapeGeometry, _shape.shapePosition, _shape.shapeQuaternion);
    }

    // update body to match center
    collision.body.position.x += collision.center.x;
    collision.body.position.y += collision.center.y;
    collision.body.position.z += collision.center.z;

    // save origin
    collision.origin = {};
    collision.origin.position = collision.body.position.clone();
    collision.origin.quaternion = collision.body.quaternion.clone();
    collision.origin.sleep = _options.sleep;

    // update three model to follow cannon object
    this.time.on('update', () => {
      collision.model.container.position.set(collision.body.position.x, collision.body.position.y, collision.body.position.z);
      collision.model.container.quaternion.set(collision.body.quaternion.x, collision.body.quaternion.y, collision.body.quaternion.z, collision.body.quaternion.w);

      if (this.models.container.visible && _options.mass > 0) {
        for (const _mesh of collision.model.container.children) {
          _mesh.material = collision.body.sleepState === 2 ? this.models.materials.dynamicSleeping : this.models.materials.dynamic;
        }
      }
    });

    /**
     * Reset
     */
    collision.reset = () => {
      collision.body.position.copy(collision.origin.position);
      collision.body.quaternion.copy(collision.origin.quaternion);

      if (collision.origin.sleep) {
        collision.body.sleep();
      }
    }

    return collision;
  }
}
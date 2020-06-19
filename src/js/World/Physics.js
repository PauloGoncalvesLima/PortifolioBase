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
    this.setModel();
    this.setMaterial();
    this.setFloor();
    this.setCar();


    // update on frame
    this.time.on('update', () => {
      this.world.step(1/60, this.time.delta, 3);
    });
  }

  setWorld() {
    this.world = new CANNON.world();
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
    
    // Contact between floor -- dummy
    this.materials.contact = {};
    this.materials.floorDummy = new CANNON.ContactMaterial(
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
    this.materials.contact = {};
    this.materials.dummyDummy = new CANNON.ContactMaterial(
      this.materials.items.floor,
      this.materials.items.dummy,
      {
        friction: 0.05, 
        restitution: 0.3,
        contactEquationStiffness: 1000
      }
    );
    this.world.addContactMaterial(this.materials.contacts.floorDummy);

    // Contact between floor -- wheel
    this.materials.contact = {};
    this.materials.floorWheel = new CANNON.ContactMaterial(
      this.materials.items.floor,
      this.materials.items.dummy,
      {
        friction: 0.05, 
        restitution: 0.3,
        contactEquationStiffness: 1000
      }
    );
    this.world.addContactMaterial(this.materials.contacts.floorDummy);
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
    this.car.options.controlsAcceleratinMaxSpeed = 0.055
    this.car.options.controlsAcceleratinMaxSpeedBoost = 0.11
    this.car.options.controlsAcceleratingSpeed = 2
    this.car.options.controlsAcceleratingSpeedBoost = 3.5
    this.car.options.controlsAcceleratingQuad = true
    this.car.options.controlsBrakeStrength = 0.45

    // upside down
    this.car.updsideDown = {};
    this.car.updsideDown.state = 'watching'; // possible: watching | pending | turning
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
  }
}
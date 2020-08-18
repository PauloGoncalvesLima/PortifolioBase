import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Car {
    /**
     * Constructor
     */
    constructor(_options) {
        // options
        this.time = _options.time;
        this.resources = _options.resources;
        this.objects = _options.objects;
        this.physics = _options.physics;
        // this.shadows = _options.shadows
        // this.materials = _options.materials
        this.controls = _options.controls;
        // this.sounds = _options.sounds
        // this.renderer = _options.renderer
        this.camera = _options.camera;
        this.debug = _options.debug;
        this.config = _options.config;

        // set up
        this.container = new THREE.Object3D();
        this.position = new THREE.Vector3();

        // debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('car');
        }

        this.setModels();
        this.setMovement();
        this.setChassis();
        // this.setBacklights();
        this.setWheels();
        // TODO: transform controls maybe
    }
    
    /**
     * Gets models from loaded resources.
     */
    setModels() {
        this.models = {};
        this.models.chassis = this.resources.items.carChassis;
        // this.models.backlights = this.resources.items.carBacklights;
        this.models.wheel = this.resources.items.carWheel;
    }

    setMovement() {
        this.movement = {};
        this.movement.speed = new THREE.Vector3();
        this.movement.localSpeed = new THREE.Vector3();
        this.movement.acceleration = new THREE.Vector3();
        this.movement.localAcceleration = new THREE.Vector3();
        this.movement.direction = new THREE.Vector3();

        this.time.on('update', () => {
            // direction (for camera)
            this.movement.direction = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), this.chassis.object.rotation.z);

            // movement
            const movementSpeed = new THREE.Vector3();
            movementSpeed.copy(this.chassis.object.position).sub(this.chassis.oldPosition);
            this.movement.acceleration = movementSpeed.clone().sub(this.movement.speed);
            this.movement.speed.copy(movementSpeed);

            this.movement.localSpeed = this.movement.speed.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1,), - this.chassis.object.rotation.z);
            this.movement.localAcceleration = this.movement.acceleration.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1,), - this.chassis.object.rotation.z);

            // TODO: sound
        });
    }

    /**
     * Sets up chassis object and updates it
     * to its corresponding physics body.
     */
    setChassis() {
        this.chassis = {};
        this.chassis.offset = new THREE.Vector3(0, 0, - 0.28);
        console.log(this.models.chassis.scene);
        const meshOptions = { duplicated: true };
        this.chassis.object = this.objects.getConvertedMesh(this.models.chassis.scene.children, meshOptions);
        console.log(this.chassis.object);
        this.chassis.object.position.copy(this.physics.car.chassis.body.position);
        this.chassis.oldPosition = this.chassis.object.position.clone();
        this.container.add(this.chassis.object);

        // TODO: shadows??

        // update
        this.time.on('update', () => {
            // save old position
            this.chassis.oldPosition = this.chassis.object.position.clone();

            // update to physics position. FIXME: if transform controls is implemented
            this.chassis.object.position.copy(this.physics.car.chassis.body.position).add(this.chassis.offset);
            this.chassis.object.quaternion.copy(this.physics.car.chassis.body.quaternion);

            // update new positon
            this.position.copy(this.chassis.object.position);
        });
    }

    /**
     * Sets up each wheel object and updates
     * them to their corresponding physics body.
     */
    setWheels() {
        this.wheels = {};
        this.wheels.object = this.objects.getConvertedMesh(this.models.wheel.scene.children);
        this.wheels.items = [];

        // create each of the 4 wheels
        for (let i = 0; i < 4; i++) {
            const object = this.wheels.object.clone();

            this.wheels.items.push(object);
            this.container.add(object);
        }

        // update
        this.time.on('update', () => {
            // update each wheel to physics position. FIXME: if transform controls is implemented
            for (const _wheelKey in this.physics.car.wheels.bodies) {
                const wheelBody = this.physics.car.wheels.bodies[_wheelKey];
                const wheelObject = this.wheels.items[_wheelKey];

                wheelObject.position.copy(wheelBody.position);
                wheelObject.quaternion.copy(wheelBody.quaternion);
            }
        });
    }
}
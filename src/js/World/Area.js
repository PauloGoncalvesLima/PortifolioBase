import * as THREE from 'three';
import gsap from 'gsap';

import EventEmitter from '../utils/EventEmitter.js';
import AreaFloorBorderBufferGeometry from '../Geometries/AreaFloorBorderBuffer.js';
import AreaFenceBufferGeometry from '../Geometries/AreaFenceBuffer.js';
import AreaFenceMaterial from '../Materials/AreaFence.js';
import AreaFloorBordereMaterial from '../Materials/AreaFloorBorder.js';

export default class Area extends EventEmitter {
    constructor(_options) {
        super();

        // options
        this.config = _options.config;
        this.renderer = _options.renderer;
        this.resources = _options.resources;
        this.car = _options.car;
        this.sounds = _options.sounds;
        this.time = _options.time;
        this.position = _options.position;
        this.halfExtents = _options.halfExtents;
        this.hasKey = _options.hasKey;
        this.testCar = _options.testCar;
        this.active = _options.active;

        // set up
        this.container = new THREE.Object3D();
        this.container.position.x = this.position.x;
        this.container.position.y = this.position.y;
        this.container.matrixAutoUpdate = false;
        this.container.updateMatrix();

        this.initialTestCar = this.testCar; // ????
        this.isIn = false;

        // set up functions
        this.setFloorBorder();
        this.setFence();
        this.setInteractions();

        if (this.hasKey) {
            this.setKey();
        }
    }

    // Makes area interactable.
    activate() {
        this.active = true;

        if(this.isIn) {
            this.in();
        }
    }

    // Prevents interaction with area.
    deactivate() {
        this.active = false;

        if(this.isIn) {
            this.out();
        }
    }

    // Creates the floor border.
    setFloorBorder() {
        this.floorBorder = {};

        this.floorBorder.geometry = new AreaFloorBorderBufferGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, 0.25);
        this.floorBorder.material = new AreaFloorBordereMaterial();
        this.floorBorder.material.uniforms.uColor.value = new THREE.Color('white');
        this.floorBorder.material.uniforms.uAlpha.value = 0.5;
        this.floorBorder.material.uniforms.uLoadProgress.value = 1;
        this.floorBorder.material.uniforms.uProgress.value = 1;
        this.floorBorder.mesh = new THREE.Mesh(this.floorBorder.geometry, this.floorBorder.material);
        this.floorBorder.mesh.matrixAutoUpdate = false;

        this.container.add(this.floorBorder.mesh);
    }

    // Creates the fence.
    setFence() {
        this.fence = {};
        this.fence.depth = 0.5;
        this.fence.offset = 0.5;
        
        // geometry
        this.fence.geometry = new AreaFenceBufferGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, this.fence.depth);
        
        // material
        this.fence.material = new AreaFenceMaterial();
        this.fence.material.uniforms.uBorderAlpha.value = 0.5;
        this.fence.material.uniforms.uStrikeAlpha.value = 0.25;
        
        // mesh
        this.fence.mesh = new THREE.Mesh(this.fence.geometry, this.fence.material);
        this.fence.mesh.position.z = - this.fence.depth;

        this.container.add(this.fence.mesh);

        // update
        this.time.on('update', () => {
            // FIXME: don't use elapsed time
            this.fence.material.uniforms.uTime.value = this.time.elapsed;
        })
    }

    // Creates key prompt for area.
    setKey() {
        this.key = {};
        this.key.hiddenZ = 1.5;
        this.key.shownZ = 2.5;

        // Container
        this.key.container = new THREE.Object3D()
        this.key.container.position.z = this.key.hiddenZ
        this.container.add(this.key.container)

        // Enter Text
        this.key.enter = {}
        this.key.enter.size = 1.4
        this.key.enter.geometry = new THREE.PlaneBufferGeometry(this.key.enter.size, this.key.enter.size / 4, 1, 1)

        this.key.enter.texture = this.resources.items.areaEnterTexture
        this.key.enter.texture.magFilter = THREE.NearestFilter
        this.key.enter.texture.minFilter = THREE.LinearFilter

        this.key.enter.material = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: this.key.enter.texture, transparent: true, opacity: 0, depthWrite: false })

        this.key.enter.mesh = new THREE.Mesh(this.key.enter.geometry, this.key.enter.material)
        this.key.enter.mesh.rotation.x = Math.PI * 0.5
        this.key.enter.mesh.position.x = this.key.enter.size * 0.75
        this.key.enter.mesh.matrixAutoUpdate = false
        this.key.enter.mesh.updateMatrix()
        this.key.container.add(this.key.enter.mesh)

        // Enter Icon
        this.key.icon = {}
        this.key.icon.size = 0.75
        this.key.icon.geometry = new THREE.PlaneBufferGeometry(this.key.icon.size, this.key.icon.size, 1, 1)

        this.key.icon.texture = this.resources.items.areaKeyEnterTexture
        this.key.icon.texture.magFilter = THREE.NearestFilter
        this.key.icon.texture.minFilter = THREE.LinearFilter

        this.key.icon.material = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaMap: this.key.icon.texture, transparent: true, opacity: 0, depthWrite: false })

        this.key.icon.mesh = new THREE.Mesh(this.key.icon.geometry, this.key.icon.material)
        this.key.icon.mesh.rotation.x = Math.PI * 0.5
        this.key.icon.mesh.position.x = - this.key.enter.size * 0.15
        this.key.icon.mesh.matrixAutoUpdate = false
        this.key.icon.mesh.updateMatrix()
        this.key.container.add(this.key.icon.mesh)
    }

    // Triggers the area interaction result.
    interact(_showKey = true) {
        // Not active
        if (!this.active) {
            return;
        }

        // kill tweens
        gsap.killTweensOf(this.fence.mesh.position);
        gsap.killTweensOf(this.floorBorder.material.uniforms.uAlpha);
        gsap.killTweensOf(this.fence.material.uniforms.uBorderAlpha);

        if(this.hasKey) {
            gsap.killTweensOf(this.key.container.position);
            gsap.killTweensOf(this.key.icon.material);
            gsap.killTweensOf(this.key.enter.material);
        }

        // animate
        gsap.to(this.fence.mesh.position, {
            duration: 0.05,
            z: 0,
            onComplete: () => {
                gsap.to(this.fence.mesh.position, {
                    duration: 0.25,
                    z: 0.5,
                    ease: "back.out(2)" // FIXME: test ease distance
                })
                gsap.fromTo(this.floorBorder.material.uniforms.uAlpha,
                    { value: 1 },
                    { value: 0.5, duration: 1.5 }
                )
                gsap.fromTo(this.fence.material.uniforms.uBorderAlpha,
                    { value: 1 },
                    { value: 0.5, duration: 1.5 }
                )
            }
        })

        // key icon animation
        if (this.hasKey && _showKey) {
            this.key.container.position.z = this.key.shownZ;
            gsap.fromTo(this.key.icon.material, { opacity: 1 }, { opacity: 0.5, duration: 1.5 });
            gsap.fromTo(this.key.enter.material, { opacity: 1 }, { opacity: 0.5, duration: 1.5 });
        }

        // TODO: Sounds

        // trigger interaction result
        this.trigger('interact');
    }

    // Behaviour for entering area.
    in(_showKey = true) {
        this.isIn = true; // FIXME: maybe this should be after active check??

        // return if not active
        if (!this.active) {
            return;
        }

        // fence animation
        gsap.killTweensOf(this.fence.mesh.position);
        gsap.to(this.fence.mesh.position, {
            duration: 0.35,
            z: this.fence.offset,
            ease: "back.out(3)" // FIXME: test back distance
        })

        // key animation
        if (this.hasKey) {
            gsap.killTweensOf(this.key.container.position);
            gsap.killTweensOf(this.key.icon.material);
            gsap.killTweensOf(this.key.enter.material);

            if (_showKey) {
                gsap.to(this.key.container.position, {
                    duration: 0.35,
                    z: this.key.shownZ,
                    ease: "back.out(3)", // FIXME: test back distance
                    delay: 0.1
                })
                gsap.to(this.key.icon.material, {
                    duration: 0.35,
                    opacity: 0.5,
                    ease: "back.out(3)", // FIXME: test back distance
                    delay: 0.1
                })
                gsap.to(this.key.enter.material, {
                    duration: 0.35,
                    opacity: 0.5,
                    ease: "back.out(3)", // FIXME: test back distance
                    delay: 0.1
                })
            }
        }

        // change cursor to click // FIXME: check if cursor is in the box or not
        if (!this.config.touch) {
            this.renderer.domElement.classList.add('has-cursor-pointer');
        }

        // trigger the in event
        this.trigger('in');
    }

    // Behaviour for exiting area.
    out () {
        this.isIn = false;

        // fence animation
        gsap.killTweensOf(this.fence.mesh.position);
        gsap.to(this.fence.mesh.position, {
            duration: 0.35,
            z: - this.fence.depth,
            ease: "back.out(4)" // FIXME: test back distance
        })

        // key animation
        if (this.hasKey) {
            gsap.killTweensOf(this.key.container.position);
            gsap.killTweensOf(this.key.icon.material);
            gsap.killTweensOf(this.key.enter.material);

            if (_showKey) {
                gsap.to(this.key.container.position, {
                    duration: 0.35,
                    z: this.key.hiddenZ,
                    ease: "back.out(4)", // FIXME: test back distance
                    delay: 0.1
                })
                gsap.to(this.key.icon.material, {
                    duration: 0.35,
                    opacity: 0,
                    ease: "back.out(4)", // FIXME: test back distance
                    delay: 0.1
                })
                gsap.to(this.key.enter.material, {
                    duration: 0.35,
                    opacity: 0,
                    ease: "back.out(4)", // FIXME: test back distance
                    delay: 0.1
                })
            }
        }

        // change cursor to click // FIXME: check if cursor is in the box or not
        if (!this.config.touch) {
            this.renderer.domElement.classList.remove('has-cursor-pointer');
        }

        // trigger the out event
        this.trigger('out');
    }

    // TODO:
    setInteractions() {
        // create mesh for detecting the mouse cursor
        this.mouseMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(this.halfExtents.x * 2, this.halfExtents.y * 2, 1, 1),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        )
        this.mouseMesh.position.z = - 0.01;
        this.mouseMesh.matrixAutoUpdate = false;
        this.mouseMesh.updateMatrix();
        this.container.add(this.mouseMesh);

        this.time.on('update', () => {
            if (this.testCar) { // if meant to detect car
                // if the car is in the area
                const isIn = Math.abs(this.car.position.x - this.position.x) < Math.abs(this.halfExtents.x) &&
                             Math.abs(this.car.position.y - this.position.y) < Math.abs(this.halfExtents.y);
                if (isIn !== this.isIn) { // if 'in' state has changed
                    if (isIn) {
                        this.in(!this.config.touch);
                    } else {
                        this.out();
                    }
                }
            }
        })

        // interact if 'in' and key is pressed
        window.addEventListener('keydown', (_event) => {
            if ((_event.key === 'f' || _event.key === 'e' || _event.key === 'Enter') && this.isIn) {
                this.interact();
            }
        })
    }
}
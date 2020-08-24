// HARD TODO: most likely very different from original if we don't wish to parse shapes into buffer geometry.

import * as THREE from 'three';

export default class Objects {
    constructor(_options) {
        // options
        this.time = _options.time;
        this.resources = _options.resources;
        this.materials = _options.materials;
        this.physics = _options.physics;
        // this.shadows = _options.shadows
        // this.sounds = _options.sounds
        this.debug = _options.debug;

        // set up
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        this.items = [];
        this.floorShadows = [];

        this.setParsers();
        this.setMerge();
    }

    /**
     * Creates the parsers to detect the desired material
     * (using the material name on the original object) and
     * then create the mesh and apply the material.
     */
    setParsers() {
        this.parsers = {};

        this.parsers.items = [
            // shade
            {
                regex:/^shade([a-z]+)?_?[0-9]{0,3}/i,
                apply: (_mesh, _options) => {
                    // find material
                    const match = _mesh.material.name.match(/^shade([a-z]+)_?[0-9]{0,3}?/i);
                    const materialName = `${match[1].substring(0, 1).toLowerCase()}${match[1].substring(1)}`; // converts PastelCase to camelCase
                    let material = this.materials.shades.items[materialName];

                    // default
                    if (typeof material === 'undefined') {
                        material = new THREE.MeshNormalMaterial();
                    }

                    // create clone mesh with new shaded material
                    const mesh = _options.duplicated ? _mesh.clone() : _mesh;
                    mesh.material = material;

                    if (mesh.children.length) {
                        for (const _child of mesh.children) {
                            if (_child instanceof THREE.Mesh) {
                                _child.material = material;
                            }
                        }
                    }

                    return mesh;
                }
            },

            // pure
            {
                regex:/^pure([a-z]+)_?[0-9]{0,3}?/i,
                apply: (_mesh, _options) => {
                    // find material
                    const match = _mesh.material.name.match(/^pure([a-z]+)_?[0-9]{0,3}/i);
                    const materialName = match[1].toLowerCase();
                    let material = this.materials.pures.items[materialName];

                    // default
                    if (typeof material === 'undefined') {
                        material = new THREE.MeshNormalMaterial();
                    }

                    // create clone mesh with new pure material
                    const mesh = _options.duplicated ? _mesh.clone() : _mesh;
                    mesh.material = material;

                    return mesh;
                }
            }

            // floor TODO: maybe?
        ];

        // default parser for wrongly named meshes
        this.parsers.default = {
            apply: (_mesh, _options) => {
                // create clone mesh with default normal material
                const mesh = _options.duplicated ? _mesh.clone() : _mesh;
                let material = new THREE.MeshNormalMaterial();
                mesh.material = material;

                if (mesh.children.length) {
                    for (const _child of mesh.children) {
                        if (_child instanceof THREE.Mesh) {
                            _child.material = material;
                        }
                    }
                }

                return mesh;
            }
        }
    }

    setMerge() {
        // TODO: maybe ??
        // this.merge = {};
        // this.merge.items = {};

        // this.merge.container = new THREE.Object3D();
        // this.merge.container.matrixAutoUpdate = false;
        // this.container.add(this.merge.container);

        // this.merge.add = (_name, _mesh) => {

        // }
    }

    getConvertedMesh(_children, _options = {}) {
        const container = new THREE.Group();
        const center = new THREE.Vector3();

        this.preparse = (_child, _parent) => {
            // define center
            if (_child.name.match(/^center_?[0-9]{0,3}?/i)) {
                center.copy(_child.position);
            }

            // parse mesh
            if (_child instanceof THREE.Mesh) {
                // find parser and use default if not found
                let parser = this.parsers.items.find((_item) => _child.material.name.match(_item.regex));
                if (typeof parser === 'undefined') {
                    parser = this.parsers.default;
                }

                // apply parser to create mesh
                const mesh = parser.apply(_child, _options);

                // add mesh to container
                _parent.add(mesh);
            }

            // parse group recursively
            if (_child instanceof THREE.Group) {
                const newGroup = _child.clone(false);
                const baseGroupChildren = [..._child.children]; // prevents object skipping
                for (const _groupChild of baseGroupChildren) {
                    this.preparse(_groupChild, newGroup);
                }
                _parent.add(newGroup);
            }
        }

        // step through each child
        const baseChildren = [..._children]; // prevents object skipping
        for (const _child of baseChildren) {
            this.preparse(_child, container);
        }

        // recenter object
        if (center.length() > 0) {
            for (const _child of container.children) {
                console.log(_child);
                _child.position.sub(center);
            }
            container.position.add(center);
        }

        if (_options.mass && _options.mass === 0) {
            container.matrixAutoUpdate = false;
            container.updateMatrix();
        }

        return container;
    }

    add(_options) {
        // TODO:
    }
}
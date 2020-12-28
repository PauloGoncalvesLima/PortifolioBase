import * as THREE from 'three';

export default class InformationSection {
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.objects = _options.objects
        this.areas = _options.areas
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('infoSection');
        }

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.setLinks()
    }

    setLinks() {
        // set up
        this.links = {}
        this.links.x = 1.95
        this.links.y = - 1.5
        this.links.halfExtents = {}
        this.links.halfExtents.x = 1
        this.links.halfExtents.y = 1
        this.links.distanceBetween = 2.4
        this.links.items = []

        this.links.container = new THREE.Object3D()
        this.links.container.matrixAutoUpdate = false
        this.container.add(this.links.container)

        // Options
        this.links.options = [
            { href: 'mailto:paulogoncalves436@gmail.com' },
            { href: 'https://www.linkedin.com/in/paulo-gon%C3%A7alves-bbb463171/' },
            { href: 'https://github.com/PauloGoncalvesLima' },
            { href: 'https://twitter.com/0locomeu' }
        ]

        // create each link
        let i = 0;
        for (const _options of this.links.options) {
            const item = {};
            item.x = this.x + this.links.x + this.links.distanceBetween * i;
            item.y = this.y + this.links.y;
            item.href = _options.href;

            // create area
            item.area = this.areas.add({
                position: new THREE.Vector2(item.x, item.y),
                halfExtents: new THREE.Vector2(this.links.halfExtents.x, this.links.halfExtents.y)
            })
            item.area.on('interact', () => {
                window.open(_options.href, '_blank');
            })

            // save
            this.links.items.push(item);

            i++;
        }

        // updates area meta info for debugging
        this.links.update = () => {
            for (const _item of this.links.items) {
                _item.x = this.x + this.links.x + this.links.distanceBetween * i;
                _item.y = this.y + this.links.y;
                _item.area.updateArea({
                    position: new THREE.Vector2(_item.x, _item.y),
                    halfExtents: new THREE.Vector2(this.links.halfExtents.x, this.links.halfExtents.y)
                })
            }
        }

        // debug
        if (this.debug) {
            this.links.debugFolder = this.debugFolder.addFolder('links');
            this.links.debugFolder.open();

            this.links.debugFolder.add(this.links, 'x').step(0.001).min(-5).max(5).name('x').onFinishChange(this.links.update);
            this.links.debugFolder.add(this.links, 'y').step(0.001).min(-5).max(5).name('y').onFinishChange(this.links.update);
            this.links.debugFolder.add(this.links.halfExtents, 'x').step(0.001).min(0).max(5).name('halfExX').onFinishChange(this.links.update);
            this.links.debugFolder.add(this.links.halfExtents, 'y').step(0.001).min(0).max(5).name('halfExY').onFinishChange(this.links.update);
            this.links.debugFolder.add(this.links, 'distanceBetween').step(0.001).min(0).max(5).name('distanceBetween').onFinishChange(this.links.update);
        }
    }
}
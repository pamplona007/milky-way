import * as THREE from 'three';

export class Planet {
    constructor({
        name,
        radius,
        tilt,
        distance,
        orbitEccentricity,
        orbitPeriod,
        orbitColor = 0xffffff,
        rotationPeriod,
        texture,
    }) {
        this.name = name;
        this.radius = radius;
        this.tilt = tilt;
        this.distance = distance;
        this.orbitEccentricity = orbitEccentricity;
        this.orbitPeriod = orbitPeriod;
        this.rotationPeriod = rotationPeriod;
        this.texture = texture;
        this.orbitColor = orbitColor;

        this.clock = new THREE.Clock();

        this.majorAxis = this.distance / (1 + this.orbitEccentricity);
        this.minorAxis = this.distance;

        this.focusDistance = this.majorAxis * this.orbitEccentricity;
        this.focus = new THREE.Vector3(this.focusDistance, 0, 0);

        this.mesh = this.create();
        this.orbit = this.createOrbit();

        const planetFolder = gui.addFolder(this.name);
        planetFolder.close();
        const orbitFolder = planetFolder.addFolder('Orbit');
        orbitFolder.close();
        planetFolder.add(this, 'rotationPeriod', 0, 10, .1).name('Rotation Period');
        planetFolder.add(this, 'orbitPeriod', 0, 400, .1).name('Orbit Period');
        planetFolder.add(this, 'radius', 0, 10, .1).name('Radius');
        planetFolder.add(this, 'tilt', -90, 90, .1).name('Tilt');

        orbitFolder.addColor(this, 'orbitColor').name('Color');
        orbitFolder.add(this, 'orbitEccentricity', 0, 1, .01).name('Eccentricity');
        orbitFolder.add(this, 'distance', 0, 50, .1).name('Distance');
    }

    create() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: this.texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = this.name;
        mesh.rotation.x = THREE.MathUtils.degToRad(this.tilt);
        return mesh;
    }

    createOrbit() {
        const geometry = new THREE.EllipseCurve(0, 0, this.majorAxis, this.minorAxis, 0, 2 * Math.PI, false, Math.PI / 2);
        const points = geometry.getPoints(100);
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: this.orbitColor });
        const ellipse = new THREE.Line(geometry2, material);
        ellipse.rotation.x = THREE.MathUtils.degToRad(90);
        ellipse.position.set(this.focusDistance, 0, 0);
        return ellipse;
    }

    update() {
        const time = this.clock.getElapsedTime();
        const angle = (time / this.orbitPeriod) * 2 * Math.PI;
        const x = this.minorAxis * Math.sin(angle);
        const z = this.majorAxis * Math.cos(angle);
        this.mesh.position.set(x + this.focusDistance, 0, z);
        this.mesh.rotation.y = (time / this.rotationPeriod) * 2 * Math.PI;
    }

    get orbitEccentricity() {
        return this._orbitEccentricity;
    }

    set orbitEccentricity(value) {
        this._orbitEccentricity = value;
        this.majorAxis = this.distance / (1 + this._orbitEccentricity);
        this.minorAxis = this.distance;
        this.focusDistance = this.majorAxis * this._orbitEccentricity;
        this.focus = new THREE.Vector3(this.focusDistance, 0, 0);

        if (this.orbit) {
            this.orbit.geometry.dispose();
            this.orbit.geometry = this.createOrbit().geometry;

            this.orbit.position.set(this.focusDistance, 0, 0);
        }
    }

    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
        this.majorAxis = this.distance / (1 + this._orbitEccentricity);
        this.minorAxis = this.distance;
        this.focusDistance = this.majorAxis * this._orbitEccentricity;
        this.focus = new THREE.Vector3(this.focusDistance, 0, 0);

        if (this.orbit) {
            this.orbit.geometry.dispose();
            this.orbit.geometry = this.createOrbit().geometry;

            this.orbit.position.set(this.focusDistance, 0, 0);
        }
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = this.create().geometry;
        }
    }

    get orbitColor() {
        return this._orbitColor;
    }

    set orbitColor(value) {
        this._orbitColor = value;
        if (this.orbit) {
            this.orbit.material.dispose();
            this.orbit.material = this.createOrbit().material;
        }
    }

    get tilt() {
        return this._tilt;
    }

    set tilt(value) {
        this._tilt = value;
        if (this.mesh) {
            this.mesh.rotation.x = THREE.MathUtils.degToRad(this._tilt);
        }
    }
}


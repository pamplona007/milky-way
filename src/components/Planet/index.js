import * as THREE from 'three';

export class Planet {
    constructor({
        name,
        radius,
        tilt,
        distance,
        rotationSpeed,
        translationSpeed,
        orbit,
        texture,
    }) {
        this.name = name;
        this.radius = radius;
        this.tilt = tilt;
        this.distance = distance;
        this.rotationSpeed = rotationSpeed;
        this.translationSpeed = translationSpeed;
        this.orbit = orbit;
        this.texture = texture;

        this.mesh = this.creatPlanet();
        this.orbitLine = this.createOrbit();

        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.group.add(this.orbitLine);

        this.clock = new THREE.Clock();

        return this;
    }

    createOrbit() {
        const orbitCurve = new THREE.EllipseCurve(
            0,
            0,
            this.distance,
            this.distance * this.orbit.ellipse,
            0,
            2 * Math.PI,
            false,
            0,
        );

        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(100));
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        orbitLine.rotation.x = THREE.MathUtils.degToRad(90);

        return orbitLine;
    }

    creatPlanet() {
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 32, 32),
            new THREE.MeshStandardMaterial({
                map: this.texture,
            }),
        );
        planet.position.x = this.distance;
        planet.rotation.z = THREE.MathUtils.degToRad(this.tilt);
        return planet;
    }

    update() {
        const elapsedTime = this.clock.getElapsedTime();
        this.mesh.rotation.y += Math.PI / 180 * this.rotationSpeed;
        this.mesh.position.x = this.distance * Math.cos(elapsedTime * this.translationSpeed);
        this.mesh.position.z = this.distance * Math.sin(elapsedTime * this.translationSpeed) * this.orbit.ellipse;
    }

    set visible(value) {
        this.group.visible = value;
    }

    get visible() {
        return this.group.visible;
    }
}


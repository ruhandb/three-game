<template>
    <ObjectPainter :brickSize="config.blockLength" @on-set-block="onSetBlock"></ObjectPainter>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import RoundedBoxGeometry from '../util/RoundedBoxGeometry';
import DataService from '../util/dataService'
import { mouseEvents } from '../util/mouseEvents';
import ObjectPainter from './ObjectPainter.vue';
import bluePrintImage from "../assets/textures/blueprint.png";
import indoor_ft from "../assets/skyboxes/indoor/indoor_ft.jpg";
import indoor_bk from "../assets/skyboxes/indoor/indoor_bk.jpg";
import indoor_lf from "../assets/skyboxes/indoor/indoor_lf.jpg";
import indoor_rt from "../assets/skyboxes/indoor/indoor_rt.jpg";
import indoor_up from "../assets/skyboxes/indoor/indoor_up.jpg";
import indoor_dn from "../assets/skyboxes/indoor/indoor_dn.jpg";

const OBJECTS = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000),
    renderer: new THREE.WebGLRenderer({ antialias: true }),
    textureLoader: new THREE.TextureLoader(),
    controls: null,
    raycaster: new THREE.Raycaster()
}

const dataService = new DataService();

export default {
    name: 'GameView',
    props: {
        msg: String
    },
    components: {
        ObjectPainter
    },
    data() {
        return {
            config: {
                cameraSpeed: 0.02,
                brickSize: 10,
                blockLength: 16
            },
            control: {
                selectedColor: null,
                lastTimestamp: null,
                keydown: {}
            },
            input: {
                editObject: {},
            },
            output: {
                myCollection: []
            }
        }
    },
    computed: {
        minPos() {
            return this.maxPos * -1;
        },
        maxPos() {
            return this.config.brickSize * this.config.blockLength / 2;
        }
    },
    created() {
        this.output.myCollection = dataService.getData('myCollection') || [];


        OBJECTS.renderer.physicallyCorrectLights = true;
        OBJECTS.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(OBJECTS.renderer.domElement);
        OBJECTS.scene.background = this.createSkyBoxTexture();

        /* let block = this.createEditBlock();
        console.log("BLOCK", block.position);
        OBJECTS.scene.add(block); */

        //test
        this.input.editObject = dataService.getData('editObject');
        if (this.input.editObject) {
            console.log("edit");
            this.loadObject();
        } else {this.input.editObject = {}
            let box = this.createBox(0xffffff, { x: 0, y: 0, z: 0 });
            if (box) {
                console.log("box1")
                OBJECTS.scene.add(box);
            }
        }


        // Adding lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        OBJECTS.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(400, 200, -300);
        OBJECTS.scene.add(dirLight);
        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight2.position.set(-400, -200, 300);
        OBJECTS.scene.add(dirLight2);

        window.onkeydown = (e) => {
            this.control.keydown[e.key] = true;
        }
        window.onkeyup = (e) => {
            this.control.keydown[e.key] = false;
        }
        window.onmousemove = function () {
        }

        mouseEvents().leftClick().then(this.leftClick);
        mouseEvents().rightClick().then(this.rightClick);

        OBJECTS.controls = new OrbitControls(OBJECTS.camera, OBJECTS.renderer.domElement);

        //controls.update() must be called after any manual changes to the camera's transform
        OBJECTS.camera.position.set(0, 20, 100);
        OBJECTS.controls.update();

        OBJECTS.renderer.setAnimationLoop(this.animate);
    },
    methods: {
        leftClick(e) {
            const intersect = this.onMouseObject(e);
            if (intersect) {
                let x = Math.round(intersect.point.x);
                let y = Math.round(intersect.point.y);
                let z = Math.round(intersect.point.z);
                let xo = intersect.object.position.x;
                let yo = intersect.object.position.y;
                let zo = intersect.object.position.z;
                let xd = x > xo ? x - xo : xo - x;
                let yd = y > yo ? y - yo : yo - y;
                let zd = z > zo ? z - zo : zo - z;
                if (xd > yd && xd > zd) {
                    xo = x > xo ? xo + this.config.brickSize : xo - this.config.brickSize;
                } else if (yd > xd && yd > zd) {
                    yo = y > yo ? yo + this.config.brickSize : yo - this.config.brickSize;
                } else if (zd > xd && zd > yd) {
                    zo = z > zo ? zo + this.config.brickSize : zo - this.config.brickSize;
                }

                if (this.checkPos(xo) && this.checkPos(yo) && this.checkPos(zo)) {
                    let box = this.createBox(this.selectedColor, { x: xo, y: yo, z: zo });
                    if (box) {
                        OBJECTS.scene.add(box);
                    }
                }
            }
        },
        checkPos(pos) {
            return pos > this.minPos && pos <= this.maxPos;
        },
        rightClick(e) {
            const intersect = this.onMouseObject(e);
            if (intersect) {
                let object3D = intersect.object;
                if (!(object3D instanceof THREE.Object3D)) return false;
                if (object3D.geometry) object3D.geometry.dispose();

                if (object3D.material) {
                    if (object3D.material instanceof Array) {
                        object3D.material.forEach(material => material.dispose());
                    } else {
                        object3D.material.dispose();
                    }
                }
                object3D.removeFromParent();
                delete this.input.editObject[`x${object3D.position.x}y${object3D.position.y}z${object3D.position.z}`];
            }
        },
        onMouseObject(e) {
            const pointer = new THREE.Vector2();
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
            OBJECTS.raycaster.setFromCamera(pointer, OBJECTS.camera);
            const intersects = OBJECTS.raycaster.intersectObjects(OBJECTS.scene.children);
            return intersects.length > 0 ? intersects[0] : null;
        },
        loadObject() {
            Object.values(this.input.editObject).forEach(boxInfo => {
                console.log(boxInfo);
                const box = this.createBox(boxInfo.color, boxInfo.pos, true);
                if (box) {
                    OBJECTS.scene.add(box);
                }
            });
        },
        createSkyBoxTexture() {
            const skyboxImagepaths = [
                indoor_bk, indoor_ft, indoor_up, indoor_dn, indoor_rt, indoor_lf
            ];
            return new THREE.CubeTextureLoader().load(skyboxImagepaths);
        },
        onSetBlock(color) {
            this.selectedColor = color;
        },
        animate: function (timestamp) {
            if (!this.control.lastTimestamp) {
                this.control.lastTimestamp = timestamp;
                return;
            }
            const timeDelta = timestamp - this.control.lastTimestamp;
            /* const positionChange = this.config.cameraSpeed * timeDelta;
            if (this.control.keydown["w"]) {
                OBJECTS.camera.position.z -= positionChange;
            }
            if (this.control.keydown["s"]) {
                OBJECTS.camera.position.z += positionChange;
            }
            if (this.control.keydown["a"]) {
                OBJECTS.camera.position.x -= positionChange;
            }
            if (this.control.keydown["d"]) {
                OBJECTS.camera.position.x += positionChange;
            } */

            OBJECTS.controls.update();
            OBJECTS.renderer.render(OBJECTS.scene, OBJECTS.camera);
            this.control.lastTimestamp = timestamp;
        },
        createEditBlock: function () {
            const size = this.config.blockLength * this.config.brickSize;
            let geo = new THREE.BoxGeometry(size, size, size);
            let textureEditBox = OBJECTS.textureLoader.load(bluePrintImage);
            let mat = new THREE.MeshStandardMaterial({ map: textureEditBox, transparent: true, side: THREE.BackSide });
            //let mat = new THREE.MeshLambertMaterial({ color: 'white', side: THREE.BackSide });
            let block = new THREE.Mesh(geo, mat);
            //block.rotation.y = 1;
            return block;
        },
        createBox: function (color, pos, loading) {
            if (!this.input.editObject[`x${pos.x}y${pos.y}z${pos.z}`] || loading) {
                let boxGeom = new RoundedBoxGeometry(this.config.brickSize, this.config.brickSize, this.config.brickSize, 1, 1);
                /* let boxGeom = new THREE.BoxGeometry(this.config.brickSize, this.config.brickSize, this.config.brickSize); */

                let boxMat = new THREE.MeshLambertMaterial({ color: color });
                let box = new THREE.Mesh(boxGeom, boxMat);
                if (pos) {
                    box.position.set(pos.x, pos.y, pos.z);
                }
                this.input.editObject[`x${box.position.x}y${box.position.y}z${box.position.z}`] = {
                    color: color,
                    pos: {
                        x: box.position.x,
                        y: box.position.y,
                        z: box.position.z,
                    }
                }
                //test
                dataService.setData('editObject', this.input.editObject);

                return box;
            }
            return null;
        }
    },
}
</script>

<style>
body {
    margin: 0px;
}
</style>
<template>
    <div></div>
</template>

<script>
import * as THREE from 'three';

export default {
    name: 'GameView',
    props: {
        msg: String
    },
    created() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.rotation.x = 0.1;
        camera.rotation.y = 0.1;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.physicallyCorrectLights = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x008811 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        // Adding lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(300, 300, -300);
        scene.add(dirLight);

        const KEYDOWN = {};

        window.onkeydown = function (e) {
            KEYDOWN[e.key] = true;
        }

        window.onkeyup = function (e) {
            KEYDOWN[e.key] = false;
        }
        window.onmousemove = function () {
            /* camera.rotation.x -= (e.movementY / 200);
            camera.rotation.y -= (e.movementX / 200); */
        }
        window.onmousedown = function (e) {
            console.log(e);
            /* camera.rotation.x -= (e.movementY / 200);
            camera.rotation.y -= (e.movementX / 200); */
        }

        //let lastKnownScrollPosition;
        document.addEventListener('wheel', function (e) {
            /* console.log(e);
            lastKnownScrollPosition = window.scrollY; */
            camera.position.y -= e.wheelDelta / 600;
            camera.position.z -= e.wheelDelta / 600;

        });

        camera.position.z = 5;
        camera.position.y = 5;
        camera.rotation.x = -1;
        cube.rotation.y = 1;
        //camera.rotation.y = 0.1;

        renderer.setAnimationLoop(animate);

        const cameraSpeed = 0.005;
        let lastTimestamp;
        function animate(timestamp) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
                return;
            }
            const timeDelta = timestamp - lastTimestamp;
            const positionChange = cameraSpeed * timeDelta;
            //cube.rotation.x += 0.02;
            //cube.rotation.y += 0.01;
            if (KEYDOWN["w"]) {
                camera.position.z -= positionChange;
            }
            if (KEYDOWN["s"]) {
                camera.position.z += positionChange;
            }
            if (KEYDOWN["a"]) {
                camera.position.x -= positionChange;
            }
            if (KEYDOWN["d"]) {
                camera.position.x += positionChange;
            }

            renderer.render(scene, camera);
            lastTimestamp = timestamp;
        }

    },
}
</script>

<style scoped>
</style>
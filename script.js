const scene = new THREE.Scene();

// ** Câmeras
const cameraPerspective = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
cameraPerspective.position.z = 5;

const cameraOrthographic = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 10);
cameraOrthographic.position.set(0, 0, 5);

// ** Objeto
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

// ** Shaders
const vertexShader = `
    precision highp float;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    attribute vec3 position;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    precision highp float;

    uniform vec2 resolution;

    void main() {
        float gradient = gl_FragCoord.y / resolution.y;
        vec3 color = mix(vec3(0.5, 0.0, 1.0), vec3(1.0, 0.0, 0.0), gradient);
        gl_FragColor = vec4(color, 1.0);
    }
`;

const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ** Movimento
let activeCamera = cameraPerspective;
let rotationAxis = 'Y';

function animate() {
    requestAnimationFrame(animate);

    if (rotationAxis === 'X') {
        cube.rotation.x += 0.01;
    } else if (rotationAxis === 'Y') {
        cube.rotation.y += 0.01;
    }

    renderer.render(scene, activeCamera);
}
animate();

// ** Botões
document.getElementById('camera-switch').addEventListener('click', () => {
    activeCamera = (activeCamera === cameraPerspective) ? cameraOrthographic : cameraPerspective;
});

document.getElementById('rotate-x').addEventListener('click', () => {
    rotationAxis = 'X';
});

document.getElementById('rotate-y').addEventListener('click', () => {
    rotationAxis = 'Y';
});
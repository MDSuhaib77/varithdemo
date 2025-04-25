// Globe visualization with historical markers
let scene, camera, renderer, globe, controls;
let markers = [];

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('globe-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    // Create Earth globe
    const globeGeometry = new THREE.SphereGeometry(100, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
        bumpMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
        bumpScale: 0.5,
        specularMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
        specular: new THREE.Color('grey')
    });
    globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 150;
    controls.maxDistance = 400;

    // Start animation loop
    animate();
}

// Add markers for historical sites
function addHistoricalMarkers() {
    const historicalSites = [
        { name: "Mohenjo-daro", lat: 27.3255, lon: 68.1375 },
        { name: "Harappa", lat: 30.6280, lon: 72.8647 },
        { name: "Pataliputra", lat: 25.6111, lon: 85.1444 },
        { name: "Taxila", lat: 33.7463, lon: 72.7871 },
        { name: "Nalanda", lat: 25.1381, lon: 85.4445 }
    ];

    historicalSites.forEach(site => {
        const marker = createMarker(site.lat, site.lon);
        markers.push(marker);
        scene.add(marker);
    });
}

// Create a marker for a specific location
function createMarker(lat, lon) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const geometry = new THREE.SphereGeometry(2, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xD4AF37 }); // Gold color
    const marker = new THREE.Mesh(geometry, material);

    marker.position.x = -(100 * Math.sin(phi) * Math.cos(theta));
    marker.position.y = 100 * Math.cos(phi);
    marker.position.z = 100 * Math.sin(phi) * Math.sin(theta);

    return marker;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize globe on window load
window.addEventListener('load', init);
window.addEventListener('resize', onWindowResize);
// Three.js effects for NextWave.Au website
// This file handles the 3D animations and effects using Three.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the 3D hero animation
    initHero3DEffect();
});

// Hero Section 3D Effect
function initHero3DEffect() {
    const container = document.getElementById('hero-canvas-container');
    
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        container.clientWidth / container.clientHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particle system
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Color palette for particles
    const palette = [
        new THREE.Color(0x3b82f6), // Blue
        new THREE.Color(0x8b5cf6), // Purple
        new THREE.Color(0x2563eb), // Darker blue
        new THREE.Color(0x7c3aed)  // Darker purple
    ];
    
    // Set positions and colors for each particle
    for (let i = 0; i < particleCount; i++) {
        // Position
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 50;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color
        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material for particles
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Add some floating 3D objects
    addFloatingObjects(scene);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse movement
        targetX = mouseX * 0.2;
        targetY = mouseY * 0.2;
        
        // Rotate particle system
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.0005;
        
        // Move camera based on mouse position
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Animate floating objects
        scene.children.forEach(child => {
            if (child.userData && child.userData.isFloatingObject) {
                child.rotation.x += child.userData.rotationSpeed.x;
                child.rotation.y += child.userData.rotationSpeed.y;
                child.rotation.z += child.userData.rotationSpeed.z;
                
                // Floating movement
                child.position.y = child.userData.baseY + Math.sin(Date.now() * child.userData.floatSpeed) * child.userData.floatAmplitude;
            }
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Add floating geometric objects to the scene
function addFloatingObjects(scene) {
    // Create several geometric objects with different shapes, sizes, and positions
    const geometries = [
        new THREE.IcosahedronGeometry(3, 0), // Low-poly sphere
        new THREE.OctahedronGeometry(2.5, 0), // Octahedron
        new THREE.TetrahedronGeometry(2, 0), // Tetrahedron
        new THREE.TorusGeometry(1.5, 0.5, 16, 32) // Torus (donut)
    ];
    
    // Materials with gradient-like colors
    const materials = [
        new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        }),
        new THREE.MeshBasicMaterial({
            color: 0x7c3aed,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        })
    ];
    
    // Create and position each object
    for (let i = 0; i < geometries.length; i++) {
        const mesh = new THREE.Mesh(geometries[i], materials[i]);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = (Math.random() - 0.5) * 30;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        // Store the base Y position for floating animation
        mesh.userData = {
            isFloatingObject: true,
            baseY: mesh.position.y,
            floatSpeed: 0.0005 + Math.random() * 0.0005,
            floatAmplitude: 1 + Math.random() * 2,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            }
        };
        
        scene.add(mesh);
    }
    
    // Add a subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
}

// Create a subtle background effect for other sections
function createBackgroundEffect(containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create a simple wave effect
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Create wave effect by modifying vertices
        const time = Date.now() * 0.001;
        const positions = planeGeometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Create wave pattern
            const waveX = 0.5 * Math.sin(x / 5 + time);
            const waveY = 0.5 * Math.cos(y / 5 + time);
            
            positions.setZ(i, waveX + waveY);
        }
        
        positions.needsUpdate = true;
        
        // Rotate plane slowly
        plane.rotation.x = Math.sin(time * 0.1) * 0.2;
        plane.rotation.y = Math.cos(time * 0.1) * 0.2;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Initialize additional background effects when scrolling to specific sections
document.addEventListener('scroll', function() {
    // This could be expanded to add 3D effects to other sections when they come into view
    // For now, we're focusing on the hero section effect
});

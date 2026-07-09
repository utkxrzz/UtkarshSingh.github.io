// Utkarsh Singh - 3D AI Product Manager Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingAnimation();
  initBackgroundThree();
  initHeroThree();
  initScrollAnimations();
});

// 1. Navigation Interactivity
function initNavbar() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  // Change navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Dynamic active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const isExpanded = navLinksContainer.classList.contains('active');
      menuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

// 2. Typing Animation
function initTypingAnimation() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const words = [
    "AI Product Management",
    "Large Language Models",
    "Product Strategy & ROI",
    "Data-Driven Growth"
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before starting next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// 3. Three.js Background Particle Constellation (Neural Network)
function initBackgroundThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Camera Setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Creation
  const particleCount = window.innerWidth < 768 ? 100 : 250;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Generate positions spread out
    positions[i] = (Math.random() - 0.5) * 120; // x
    positions[i+1] = (Math.random() - 0.5) * 120; // y
    positions[i+2] = (Math.random() - 0.5) * 60; // z

    // Velocities
    velocities.push({
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Particle Texture / Material
  const pMaterial = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 1.2,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particlesGeometry, pMaterial);
  scene.add(particleSystem);

  // Mouse interactivity variables
  let mouse = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };

  window.addEventListener('mousemove', (event) => {
    targetMouse.x = (event.clientX / window.innerWidth - 0.5) * 15;
    targetMouse.y = -(event.clientY / window.innerHeight - 0.5) * 15;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Dynamic easing for mouse influence
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Slowly rotate the whole particle system
    particleSystem.rotation.y += 0.0006;
    particleSystem.rotation.x += 0.0002;

    // Apply drift to camera based on mouse
    camera.position.x = mouse.x;
    camera.position.y = mouse.y;
    camera.lookAt(scene.position);

    // Update individual particle positions
    const posArr = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Update by velocity
      posArr[idx] += velocities[i].x;
      posArr[idx+1] += velocities[i].y;
      posArr[idx+2] += velocities[i].z;

      // Bounce/Wrap boundaries
      if (Math.abs(posArr[idx]) > 60) velocities[i].x *= -1;
      if (Math.abs(posArr[idx+1]) > 60) velocities[i].y *= -1;
      if (Math.abs(posArr[idx+2]) > 30) velocities[i].z *= -1;
    }

    particlesGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
}

// 4. Hero Section 3D rotating AI Core
function initHeroThree() {
  const canvas = document.getElementById('three-hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Core Group
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Core Elements
  // 1. Inner Sphere (Solid representation)
  const sphereGeo = new THREE.DodecahedronGeometry(1.2, 1);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x8b5cf6,
    emissive: 0x4c1d95,
    shininess: 80,
    flatShading: true,
    transparent: true,
    opacity: 0.85
  });
  const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(innerSphere);

  // 2. Outer Wireframe Cage (Neural Nodes)
  const cageGeo = new THREE.IcosahedronGeometry(2.0, 1);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const outerCage = new THREE.Mesh(cageGeo, cageMat);
  coreGroup.add(outerCage);

  // 3. Glowing core dots on the outer cage vertices
  const cageVertices = cageGeo.getAttribute('position').array;
  const dotGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const dotsGroup = new THREE.Group();

  for (let i = 0; i < cageVertices.length; i += 3) {
    const x = cageVertices[i];
    const y = cageVertices[i+1];
    const z = cageVertices[i+2];
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(x, y, z);
    dotsGroup.add(dot);
  }
  outerCage.add(dotsGroup);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 50);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Core Modes Configuration
  const modes = [
    {
      name: "Strategic Mind",
      innerColor: 0x8b5cf6, // Violet
      outerColor: 0x06b6d4, // Cyan
      emissive: 0x4c1d95,
      rotSpeed: 0.008,
      pulseSpeed: 1.5,
      description: "Optimizing for long-term vision & ROI"
    },
    {
      name: "Analytical Engine",
      innerColor: 0x06b6d4, // Cyan
      outerColor: 0x10b981, // Green
      emissive: 0x0891b2,
      rotSpeed: 0.02,
      pulseSpeed: 3.5,
      description: "Processing metrics & data tradeoffs"
    },
    {
      name: "Technical Architect",
      innerColor: 0xf59e0b, // Yellow/Orange
      outerColor: 0x8b5cf6, // Violet
      emissive: 0xb45309,
      rotSpeed: 0.012,
      pulseSpeed: 2.0,
      description: "Fine-tuning models & orchestrating systems"
    }
  ];

  let currentModeIdx = 0;
  const modeLabel = document.getElementById('core-mode-name');
  const modeDesc = document.getElementById('core-mode-desc');

  // Trigger State change on click
  canvas.addEventListener('click', () => {
    currentModeIdx = (currentModeIdx + 1) % modes.length;
    const mode = modes[currentModeIdx];

    // Smoothly transition colors
    gsap.to(innerSphere.material.color, {
      r: new THREE.Color(mode.innerColor).r,
      g: new THREE.Color(mode.innerColor).g,
      b: new THREE.Color(mode.innerColor).b,
      duration: 0.8
    });

    gsap.to(innerSphere.material.emissive, {
      r: new THREE.Color(mode.emissive).r,
      g: new THREE.Color(mode.emissive).g,
      b: new THREE.Color(mode.emissive).b,
      duration: 0.8
    });

    gsap.to(outerCage.material.color, {
      r: new THREE.Color(mode.outerColor).r,
      g: new THREE.Color(mode.outerColor).g,
      b: new THREE.Color(mode.outerColor).b,
      duration: 0.8
    });

    // Update DOM descriptors
    if (modeLabel && modeDesc) {
      modeLabel.textContent = mode.name;
      modeDesc.textContent = mode.description;

      // Glow color adjustments
      modeLabel.className = 'gradient-text';
      if (currentModeIdx === 0) modeLabel.classList.add('glow-text-purple');
      if (currentModeIdx === 1) modeLabel.classList.add('glow-text-cyan');
      if (currentModeIdx === 2) modeLabel.classList.add('glow-text-purple');
    }

    // Click effect (Scale pulse)
    gsap.fromTo(coreGroup.scale, 
      { x: 0.8, y: 0.8, z: 0.8 }, 
      { x: 1, y: 1, z: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" }
    );
  });

  // Track Mouse movement for slight tilt rotation
  let targetRotationX = 0;
  let targetRotationY = 0;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.clientWidth - 0.5;
    const y = (e.clientY - rect.top) / canvas.clientHeight - 0.5;
    targetRotationX = y * 0.5;
    targetRotationY = x * 0.5;
  });

  canvas.addEventListener('mouseleave', () => {
    targetRotationX = 0;
    targetRotationY = 0;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  let time = 0;

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    const mode = modes[currentModeIdx];

    // Constant Rotation
    innerSphere.rotation.y -= mode.rotSpeed;
    innerSphere.rotation.x -= mode.rotSpeed * 0.5;

    outerCage.rotation.y += mode.rotSpeed * 0.6;
    outerCage.rotation.x += mode.rotSpeed * 0.3;

    // Mesh scaling animation (Pulse)
    const pulseFactor = Math.sin(time * mode.pulseSpeed) * 0.05 + 1.0;
    innerSphere.scale.set(pulseFactor, pulseFactor, pulseFactor);

    // Eased mouse-interaction tilt
    coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;
    coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
}

// 5. Scroll Trigger Timeline & Slide-In Animations
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('.timeline-item, .glass-panel, .project-card');

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('scrolled-in');
    
    // Skill bars animation trigger
    if (element.classList.contains('about-card')) {
      const fills = document.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
      });
    }
  };

  const hideScrollElement = (element) => {
    element.classList.remove('scrolled-in');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };

  // Add scroll-in setup CSS inline for elements
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    .timeline-item, .glass-panel, .project-card {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .timeline-item.scrolled-in, .glass-panel.scrolled-in, .project-card.scrolled-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);

  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });

  // Run once initially
  setTimeout(handleScrollAnimation, 300);
}

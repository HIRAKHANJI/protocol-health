// ================================================================
// Protocol Health — Landing v2 · Three.js hero scene
// Glassy crystal + orbiting data cards + particle field
// ================================================================
(function(){
  const THREE = window.THREE;
  if(!THREE){ console.warn('THREE not loaded'); return; }

  const mount = document.getElementById('hero-3d');
  if(!mount) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 7, 18);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  function resize(){
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ─────── Lighting ───────
  const amb = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(amb);

  const keyLight = new THREE.PointLight(0xc8f542, 2.4, 20);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xf5a623, 1.2, 18);
  rimLight.position.set(-4, -2, -2);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x7b68ee, 0.8, 18);
  fillLight.position.set(-3, 3, 3);
  scene.add(fillLight);

  // ─────── Central crystal (icosahedron) ───────
  const crystalGroup = new THREE.Group();
  scene.add(crystalGroup);

  const ico = new THREE.IcosahedronGeometry(1.35, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1a,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.85,
    thickness: 1.5,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
    emissive: 0xc8f542,
    emissiveIntensity: 0.08,
  });
  const crystal = new THREE.Mesh(ico, crystalMat);
  crystalGroup.add(crystal);

  // wireframe halo
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.42, 0),
    new THREE.MeshBasicMaterial({ color: 0xc8f542, wireframe: true, transparent: true, opacity: 0.25 })
  );
  crystalGroup.add(wire);

  // inner glow sphere
  const innerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.65 })
  );
  crystalGroup.add(innerGlow);

  // ─────── Orbit rings ───────
  function makeRing(radius, tube, color, opacity){
    const g = new THREE.TorusGeometry(radius, tube, 16, 80);
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    return new THREE.Mesh(g, m);
  }
  const ring1 = makeRing(2.3, 0.005, 0xc8f542, 0.4);
  ring1.rotation.x = Math.PI / 2.2;
  scene.add(ring1);
  const ring2 = makeRing(2.8, 0.004, 0xf5a623, 0.3);
  ring2.rotation.x = Math.PI / 1.6;
  ring2.rotation.y = Math.PI / 6;
  scene.add(ring2);
  const ring3 = makeRing(3.3, 0.003, 0x7b68ee, 0.25);
  ring3.rotation.x = Math.PI / 3;
  ring3.rotation.z = Math.PI / 4;
  scene.add(ring3);

  // ─────── Orbiting data nodes ───────
  const nodes = [];
  const nodeData = [
    { r: 2.3, a: 0,            speed: 0.28, color: 0xc8f542, size: 0.11 },
    { r: 2.3, a: Math.PI * 0.6, speed: 0.28, color: 0xc8f542, size: 0.08 },
    { r: 2.3, a: Math.PI * 1.3, speed: 0.28, color: 0xc8f542, size: 0.09 },
    { r: 2.8, a: Math.PI * 0.3, speed: -0.18, color: 0xf5a623, size: 0.1  },
    { r: 2.8, a: Math.PI * 1.1, speed: -0.18, color: 0xf5a623, size: 0.07 },
    { r: 3.3, a: Math.PI * 0.8, speed: 0.12, color: 0x7b68ee, size: 0.09 },
    { r: 3.3, a: Math.PI * 1.7, speed: 0.12, color: 0x7b68ee, size: 0.07 },
  ];
  nodeData.forEach(nd => {
    const g = new THREE.SphereGeometry(nd.size, 16, 16);
    const m = new THREE.MeshBasicMaterial({ color: nd.color });
    const mesh = new THREE.Mesh(g, m);

    // halo
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(nd.size * 2.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: nd.color, transparent: true, opacity: 0.18 })
    );
    mesh.add(halo);

    scene.add(mesh);
    nodes.push({ mesh, ...nd });
  });

  // ─────── Particle field ───────
  const particleCount = 180;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for(let i = 0; i < particleCount; i++){
    const r = 4 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    pPos[i*3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc8f542, size: 0.025, transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ─────── Mouse tilt ───────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  mount.addEventListener('mousemove', (e) => {
    const r = mount.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
  });
  mount.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  // ─────── Render loop ───────
  const clock = new THREE.Clock();
  let rafId;

  function tick(){
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    // crystal rotation
    crystalGroup.rotation.y += 0.004;
    crystalGroup.rotation.x += 0.0015;
    wire.rotation.y -= 0.0025;
    wire.rotation.x -= 0.001;

    // crystal breathing
    const breath = 1 + Math.sin(t * 1.2) * 0.03;
    crystalGroup.scale.set(breath, breath, breath);
    innerGlow.material.opacity = 0.55 + Math.sin(t * 2) * 0.15;

    // rings
    ring1.rotation.z += 0.003;
    ring2.rotation.z -= 0.002;
    ring3.rotation.z += 0.0015;

    // orbiting nodes
    nodes.forEach((n, i) => {
      n.a += n.speed * 0.01;
      n.mesh.position.set(
        Math.cos(n.a) * n.r,
        Math.sin(n.a * 1.3) * 0.6 + Math.sin(i) * 0.3,
        Math.sin(n.a) * n.r
      );
    });

    // particles gentle drift
    particles.rotation.y += 0.0006;
    particles.rotation.x = Math.sin(t * 0.1) * 0.1;

    // mouse tilt
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    scene.rotation.y = mouseX;
    scene.rotation.x = mouseY;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  // pause offscreen
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        if(!rafId) tick();
      } else if(rafId) {
        cancelAnimationFrame(rafId); rafId = null;
      }
    });
  }, { threshold: 0.05 });
  io.observe(mount);
})();

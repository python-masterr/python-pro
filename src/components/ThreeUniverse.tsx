import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Eye, EyeOff, RotateCcw, Compass, Sparkles, Layers } from 'lucide-react';

interface ThreeUniverseProps {
  onSelectNode?: (targetScreenId: string) => void;
  isHeroMode?: boolean;
}

// Pre-allocated math objects to ensure ZERO garbage collection in the animation loop
const _vec3 = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export const ThreeUniverse: React.FC<ThreeUniverseProps> = ({ onSelectNode, isHeroMode = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [activePreset, setActivePreset] = useState<'orbit' | 'top' | 'core'>('orbit');

  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060a16);
    scene.fog = new THREE.FogExp2(0x060a16, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 7, 18);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controlsRef.current = controls;

    // Room Environment for PBR Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Balanced 3-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 3, 30);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    const purpleGlow = new THREE.PointLight(0x818cf8, 2.5, 25);
    purpleGlow.position.set(8, -4, 6);
    scene.add(purpleGlow);

    // 1. Central Hero: Double Helix / Torus Knot representing Python's Dual Synergy
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const knotGeometry = new THREE.TorusKnotGeometry(2.4, 0.42, 120, 24, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.25,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    materialsRef.current.push(knotMaterial);

    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    knotMesh.castShadow = !isSoftwareGl;
    knotMesh.receiveShadow = !isSoftwareGl;
    coreGroup.add(knotMesh);

    // Inner glowing sphere
    const innerCoreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    // Contact shadow radial plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      opacity: 0.7,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.5;
    scene.add(shadowPlane);

    // 2. Orbiting Interactive Educational Nodes (The 6 Curriculum Pillars)
    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;
    scene.add(nodesGroup);

    const nodeDefinitions = [
      {
        id: 'baee8f1dc4454ee69f565c4fde23e18a',
        name: 'Notes Library (24)',
        color: 0x3b82f6,
        radius: 6.2,
        speed: 0.35,
        angleOffset: 0,
        shape: 'dodecahedron',
      },
      {
        id: '5545d973bd764455b5c0c40d06fb3cbd',
        name: 'Coding Playground (18)',
        color: 0x10b981,
        radius: 8.4,
        speed: 0.28,
        angleOffset: (Math.PI * 2) / 5,
        shape: 'box',
      },
      {
        id: '6fc67d4502744d38aa42564b119968c6',
        name: 'Interactive Quiz (20)',
        color: 0xf59e0b,
        radius: 7.0,
        speed: 0.42,
        angleOffset: (Math.PI * 4) / 5,
        shape: 'octahedron',
      },
      {
        id: '5ea0e323b05d45c6a3385b505c82d8e9',
        name: 'Interview Prep (30)',
        color: 0xec4899,
        radius: 9.6,
        speed: 0.22,
        angleOffset: (Math.PI * 6) / 5,
        shape: 'sphere',
      },
      {
        id: '0564c997316b4fc3a3870059e738eb52',
        name: '90-Day Roadmap',
        color: 0x8b5cf6,
        radius: 11.0,
        speed: 0.18,
        angleOffset: (Math.PI * 8) / 5,
        shape: 'icosahedron',
      },
    ];

    const nodeMeshes: {
      mesh: THREE.Mesh;
      def: typeof nodeDefinitions[0];
      halo: THREE.Mesh;
    }[] = [];

    nodeDefinitions.forEach((def) => {
      let geo: THREE.BufferGeometry;
      switch (def.shape) {
        case 'box':
          geo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
          break;
        case 'octahedron':
          geo = new THREE.OctahedronGeometry(0.7);
          break;
        case 'dodecahedron':
          geo = new THREE.DodecahedronGeometry(0.65);
          break;
        case 'icosahedron':
          geo = new THREE.IcosahedronGeometry(0.7);
          break;
        default:
          geo = new THREE.SphereGeometry(0.6, 24, 24);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.25,
        metalness: 0.7,
        emissive: def.color,
        emissiveIntensity: 0.35,
      });
      materialsRef.current.push(mat);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { id: def.id, name: def.name };
      mesh.castShadow = !isSoftwareGl;

      // Halo ring around each node
      const haloGeo = new THREE.RingGeometry(0.9, 1.15, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      mesh.add(halo);

      nodesGroup.add(mesh);
      nodeMeshes.push({ mesh, def, halo });
    });

    // 3. Ambient Starfield / Particle Nebula (1,200 stars)
    const particleCount = isSoftwareGl ? 400 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xfacc15),
      new THREE.Color(0x34d399),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const starfield = new THREE.Points(particleGeo, particleMat);
    scene.add(starfield);

    // 4. Raycasting on mouse pointer for interactive selection
    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const intersects = _raycaster.intersectObjects(
        nodeMeshes.map((n) => n.mesh)
      );

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        setHoveredNode(target.userData.name || null);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const intersects = _raycaster.intersectObjects(
        nodeMeshes.map((n) => n.mesh)
      );

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        const targetId = target.userData.id;
        if (targetId && onSelectNode) {
          onSelectNode(targetId);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop with delta clock
    const clock = new THREE.Clock();
    let animationFrameId = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * rotationSpeed;

      // Rotate central hero knot
      coreGroup.rotation.x = time * 0.2;
      coreGroup.rotation.y = time * 0.35;
      innerCoreMesh.rotation.y = -time * 0.5;

      // Rotate starfield slowly
      starfield.rotation.y = time * 0.03;

      // Update orbiting educational nodes
      nodeMeshes.forEach(({ mesh, def, halo }) => {
        const currentAngle = time * def.speed + def.angleOffset;
        const x = Math.cos(currentAngle) * def.radius;
        const z = Math.sin(currentAngle) * def.radius;
        const y = Math.sin(time * 0.7 + def.angleOffset) * 1.5;

        mesh.position.set(x, y, z);
        mesh.rotation.x += delta * 1.2;
        mesh.rotation.y += delta * 1.5;
        halo.rotation.z += delta * 0.8;
      });

      controls.update();
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();

      // Dispose geometries and materials
      knotGeometry.dispose();
      innerCoreGeo.dispose();
      shadowGeo.dispose();
      particleGeo.dispose();
      materialsRef.current.forEach((m) => m.dispose());
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [rotationSpeed]);

  // Wireframe toggle
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Camera presets
  const applyPreset = (preset: 'orbit' | 'top' | 'core') => {
    setActivePreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'orbit') {
      camera.position.set(0, 7, 18);
      controls.target.set(0, 0, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 22, 0.1);
      controls.target.set(0, 0, 0);
    } else if (preset === 'core') {
      camera.position.set(0, 1.5, 5.5);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  return (
    <div className={`relative w-full ${isHeroMode ? 'h-[520px] md:h-[620px]' : 'h-[500px]'} overflow-hidden rounded-2xl bg-[#060a16] border border-blue-900/30 shadow-2xl`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Spec / Interactive Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Interactive 3D Python Universe</span>
        </div>
        {hoveredNode && (
          <div className="px-3 py-1.5 rounded-full bg-blue-600/90 text-white text-xs font-bold border border-blue-400/40 shadow-xl animate-fade-in">
            Click to launch: {hoveredNode}
          </div>
        )}
      </div>

      {/* Top-Right Orbit Hint */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:block">
        <div className="text-[11px] text-slate-400 bg-slate-900/70 border border-slate-700/50 rounded-lg px-2.5 py-1">
          Drag to Orbit · Scroll to Zoom
        </div>
      </div>

      {/* Ergonomic Bottom Control Dock (Three.js Skill standard: 100% unobstructed center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[760px] pointer-events-auto transition-transform duration-300">
        {/* Toggle Cinema / Zen Mode Tab */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900/85 hover:bg-slate-800 border border-slate-700/60 rounded-t-lg transition flex items-center gap-1 shadow-md cursor-pointer"
          >
            {isCollapsed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>{isCollapsed ? 'Show 3D Controls' : 'Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* Collapsible Dock */}
        {!isCollapsed && (
          <div className="bg-slate-900/90 border border-blue-500/25 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Camera Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 flex items-center gap-1 mr-1">
                <Compass className="w-3.5 h-3.5 text-blue-400" /> View:
              </span>
              <button
                onClick={() => applyPreset('orbit')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activePreset === 'orbit'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Orbit
              </button>
              <button
                onClick={() => applyPreset('top')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activePreset === 'top'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Planetary Top
              </button>
              <button
                onClick={() => applyPreset('core')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activePreset === 'core'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Python Core
              </button>
            </div>

            {/* Wireframe & Speed Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition cursor-pointer ${
                  wireframe
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{wireframe ? 'Shaded' : 'Wireframe'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Speed:</span>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-18 accent-blue-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  applyPreset('orbit');
                  setRotationSpeed(1);
                  setWireframe(false);
                }}
                title="Reset View"
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

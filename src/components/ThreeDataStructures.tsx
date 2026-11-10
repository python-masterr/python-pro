import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Box, Binary, Hash, Cpu, Layers } from 'lucide-react';

type StructureType = 'list' | 'bst' | 'hashmap' | 'memory';

export const ThreeDataStructures: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedStructure, setSelectedStructure] = useState<StructureType>('list');
  const [isPlaying, setIsPlaying] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const structureGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
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

    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.Fog(0x0a0f1d, 10, 45);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 6, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 1.0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(8, 14, 8);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2, 20);
    rimLight.position.set(-6, 2, -6);
    scene.add(rimLight);

    // Floor grid
    const grid = new THREE.GridHelper(24, 24, 0x1e3a8a, 0x172554);
    grid.position.y = -2;
    scene.add(grid);

    // Structure group container
    const structGroup = new THREE.Group();
    structureGroupRef.current = structGroup;
    scene.add(structGroup);

    // Build the visual based on selectedStructure
    rebuildStructure(structGroup, selectedStructure);

    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (structGroup) {
        if (isPlaying) {
          structGroup.rotation.y += delta * 0.25;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedStructure]);

  // Helper to clear and build 3D mesh representations
  const rebuildStructure = (group: THREE.Group, type: StructureType) => {
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    if (type === 'list') {
      // 1. Python List: Contiguous Array with Memory Pointers
      const items = ['10', '"Python"', 'True', '3.14', '[1, 2]'];
      const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6];

      items.forEach((item, i) => {
        // Base slot
        const slotGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
        const slotMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.6,
          roughness: 0.3,
        });
        const slotMesh = new THREE.Mesh(slotGeo, slotMat);
        slotMesh.position.set((i - 2) * 2.2, 0, 0);
        group.add(slotMesh);

        // Pointer column connecting to value
        const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
        const stemMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
        const stemMesh = new THREE.Mesh(stemGeo, stemMat);
        stemMesh.position.set((i - 2) * 2.2, 1.1, 0);
        group.add(stemMesh);

        // Referenced Object in Python heap
        const valGeo = new THREE.DodecahedronGeometry(0.7);
        const valMat = new THREE.MeshPhysicalMaterial({
          color: colors[i],
          metalness: 0.8,
          roughness: 0.2,
          emissive: colors[i],
          emissiveIntensity: 0.3,
        });
        const valMesh = new THREE.Mesh(valGeo, valMat);
        valMesh.position.set((i - 2) * 2.2, 2.3, 0);
        group.add(valMesh);
      });
    } else if (type === 'bst') {
      // 2. Binary Search Tree
      const nodes = [
        { x: 0, y: 3.5, z: 0, label: '50 (Root)' },
        { x: -3, y: 1.5, z: 0, label: '30' },
        { x: 3, y: 1.5, z: 0, label: '70' },
        { x: -4.5, y: -0.5, z: 0, label: '20' },
        { x: -1.5, y: -0.5, z: 0, label: '40' },
        { x: 1.5, y: -0.5, z: 0, label: '60' },
        { x: 4.5, y: -0.5, z: 0, label: '80' },
      ];

      const connections = [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4],
        [2, 5],
        [2, 6],
      ];

      // Draw connecting branches
      connections.forEach(([pIndex, cIndex]) => {
        const parent = nodes[pIndex];
        const child = nodes[cIndex];
        const points = [
          new THREE.Vector3(parent.x, parent.y, parent.z),
          new THREE.Vector3(child.x, child.y, child.z),
        ];
        const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          linewidth: 2,
        });
        const line = new THREE.Line(curveGeo, lineMat);
        group.add(line);
      });

      // Nodes
      nodes.forEach((node, idx) => {
        const sphereGeo = new THREE.SphereGeometry(0.65, 32, 32);
        const sphereMat = new THREE.MeshPhysicalMaterial({
          color: idx === 0 ? 0xf59e0b : 0x3b82f6,
          metalness: 0.8,
          roughness: 0.2,
          emissive: idx === 0 ? 0xd97706 : 0x1d4ed8,
          emissiveIntensity: 0.4,
          clearcoat: 1.0,
        });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(node.x, node.y, node.z);
        group.add(mesh);
      });
    } else if (type === 'hashmap') {
      // 3. Hash Map / Python Dictionary Buckets
      for (let bucket = 0; bucket < 6; bucket++) {
        // Hash bucket chamber
        const bucketGeo = new THREE.BoxGeometry(1.8, 0.4, 2.2);
        const bucketMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          wireframe: false,
          metalness: 0.8,
          roughness: 0.3,
        });
        const bucketMesh = new THREE.Mesh(bucketGeo, bucketMat);
        bucketMesh.position.set((bucket - 2.5) * 2.2, -0.5, 0);
        group.add(bucketMesh);

        // Key-Value entry pairs inside bucket
        const entryCount = bucket % 2 === 0 ? 1 : bucket === 3 ? 2 : 0;
        for (let e = 0; e < entryCount; e++) {
          const entryGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.7, 16);
          const entryMat = new THREE.MeshPhysicalMaterial({
            color: bucket === 3 ? 0xef4444 : 0x10b981,
            metalness: 0.7,
            roughness: 0.2,
            emissive: bucket === 3 ? 0x991b1b : 0x065f46,
            emissiveIntensity: 0.35,
          });
          const entryMesh = new THREE.Mesh(entryGeo, entryMat);
          entryMesh.position.set(
            (bucket - 2.5) * 2.2,
            0.5 + e * 1.1,
            (e - 0.5) * 0.4
          );
          group.add(entryMesh);
        }
      }
    } else if (type === 'memory') {
      // 4. Object Identity vs Value (`is` vs `==`)
      // Two identical immutable strings sharing the same interned memory address
      const memSlotA = new THREE.BoxGeometry(2.4, 2.4, 0.4);
      const memMatA = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
      });
      const memBoxA = new THREE.Mesh(memSlotA, memMatA);
      memBoxA.position.set(0, 1.5, 0);
      group.add(memBoxA);

      // Pointers 'x' and 'y' pointing to the same interned object
      const varX = new THREE.SphereGeometry(0.6, 24, 24);
      const varMatX = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const meshX = new THREE.Mesh(varX, varMatX);
      meshX.position.set(-4, 2.5, 2);
      group.add(meshX);

      const varY = new THREE.SphereGeometry(0.6, 24, 24);
      const varMatY = new THREE.MeshStandardMaterial({ color: 0x34d399 });
      const meshY = new THREE.Mesh(varY, varMatY);
      meshY.position.set(-4, 0.5, 2);
      group.add(meshY);

      // Pointer lines
      const linePts1 = [new THREE.Vector3(-4, 2.5, 2), new THREE.Vector3(0, 1.5, 0)];
      const line1 = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePts1),
        new THREE.LineBasicMaterial({ color: 0x38bdf8 })
      );
      group.add(line1);

      const linePts2 = [new THREE.Vector3(-4, 0.5, 2), new THREE.Vector3(0, 1.5, 0)];
      const line2 = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(linePts2),
        new THREE.LineBasicMaterial({ color: 0x34d399 })
      );
      group.add(line2);
    }
  };

  const getExplanation = () => {
    switch (selectedStructure) {
      case 'list':
        return {
          title: 'Python List Internal Memory Architecture',
          points: [
            'Python lists are dynamic arrays storing contiguous pointers (references) to objects on the heap, NOT the raw values themselves.',
            'O(1) index access: list[i] computes memory address via: base_address + i * pointer_size.',
            'Over-allocation strategy: appending allocates extra capacity (4, 8, 16, 25...) to guarantee amortized O(1) appends.',
          ],
        };
      case 'bst':
        return {
          title: 'Binary Search Tree & Traversal Complexity',
          points: [
            'Left child < Node < Right child rule enables O(log N) average search, insertion, and deletion.',
            'In-Order Traversal (Left → Root → Right) yields the elements in strictly sorted ascending order.',
            'Worst case degrades to O(N) if elements are inserted sorted; balanced variants (AVL/Red-Black) maintain O(log N).',
          ],
        };
      case 'hashmap':
        return {
          title: 'Python Dict (Hash Table) & Collision Resolution',
          points: [
            'hash(key) generates an integer, mapped via bitwise modulo to bucket index (e.g. hash & (mask)).',
            'Python 3.6+ uses a compact dict representation: indices sparse array pointing into an insertion-ordered dense array.',
            'Collisions are resolved via open addressing with pseudo-random perturbation sequence (O(1) average lookup).',
          ],
        };
      case 'memory':
        return {
          title: "Memory Model: Object Identity ('is') vs Equality ('==')",
          points: [
            "'==' checks value equality (__eq__), while 'is' checks object identity (whether id(a) == id(b)).",
            'Small integer caching (-5 to 256) and string interning cause Python to reuse the exact same memory address.',
            'Mutable objects (lists, dicts) always allocate fresh heap memory even with identical contents.',
          ],
        };
    }
  };

  const explanation = getExplanation();

  return (
    <div className="space-y-4">
      {/* 3D Visualizer Canvas */}
      <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-[#0a0f1d] border border-blue-900/40 shadow-2xl">
        <div ref={mountRef} className="w-full h-full" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/85 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Data Structures Explorer</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs font-medium">
            {selectedStructure.toUpperCase()}
          </div>
        </div>

        {/* Structure Selector Pill Bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 p-1 rounded-xl backdrop-blur-md">
          <button
            onClick={() => setSelectedStructure('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedStructure === 'list'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>List Array</span>
          </button>
          <button
            onClick={() => setSelectedStructure('bst')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedStructure === 'bst'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Binary Tree</span>
          </button>
          <button
            onClick={() => setSelectedStructure('hashmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedStructure === 'hashmap'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Hash Map</span>
          </button>
          <button
            onClick={() => setSelectedStructure('memory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedStructure === 'memory'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Memory Model</span>
          </button>
        </div>

        {/* Bottom Playback Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 px-4 py-2 rounded-xl backdrop-blur-md">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer"
            title={isPlaying ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-xs text-slate-300 font-medium">
            {isPlaying ? 'Rotating' : 'Paused'}
          </span>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <span className="text-[11px] text-slate-400">Drag to Orbit · Scroll to Zoom</span>
        </div>
      </div>

      {/* Concept Breakdown Card */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          {explanation.title}
        </h4>
        <ul className="space-y-2 text-sm text-slate-300">
          {explanation.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold text-xs mt-0.5">▸</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';

function App() {
  const [markedPoints, setMarkedPoints] = useState([]);

  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    let loadedModel;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/anatomy/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene;
      loadedModel.scene.scale.set(100, 100, 100);
      test.scene.add(gltfScene.scene);
    });

    const canvas = test.renderer.domElement;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);

      raycaster.setFromCamera(mouse, test.camera);

      const intersects = raycaster.intersectObject(loadedModel.scene, true);

      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point.clone();
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 5, 5),
          new THREE.MeshBasicMaterial({ color: 0x800080 })
        );
        marker.position.copy(intersectionPoint);
        test.scene.add(marker);
        // const intersectionPoint = intersects[0].point.clone();
        const newMarkedPoints = [...markedPoints, intersectionPoint];
        setMarkedPoints(prevMarkedPoints => [...prevMarkedPoints, intersectionPoint]);
        console.log(markedPoints)


      }
    };

    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas id="myThreeJsCanvas" />

      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
      >
        <h2>Marked Points:</h2>
        <ul>
          {markedPoints.map((point, index) => (
            <li key={index}>X: {point.x.toFixed(2)}, Y: {point.y.toFixed(2)}, Z: {point.z.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;


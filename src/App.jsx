
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';

function App() {
  const [markedPoints, setMarkedPoints] = useState([]);
  const [Test, setTest] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedCoordinates, setUploadedCoordinates] = useState('');
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

        console.log(newMarkedPoints[0])


      }
    };
    const clearMarkedPoints = () => {
      // Clear markers from the scene
      const markersToRemove = test.scene.children.filter(child => child.type === 'Mesh');
      markersToRemove.forEach(marker => test.scene.remove(marker));

      // Clear the markedPoints state
      setMarkedPoints([]);
    };



    document.querySelector("#btns").addEventListener('click', clearMarkedPoints)
    // document.querySelector("#upload").addEventListener('click', clearMarkedPoints)
    canvas.addEventListener('click', handleMouseClick);
    setTest(test)
    return () => {
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, []);

  const handleApply = () => {
    const parsedCoordinates = parseCoordinates(uploadedCoordinates);
    // parsedCoordinates.forEach((coordinate) => {
    //   // Create a marker at each parsed coordinate using your existing logic
    // });
    try {
      const parsedCoordinate = JSON.parse(uploadedCoordinates);

      // Create a marker at the parsed position
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 5, 5),
        new THREE.MeshBasicMaterial({ color: 0x800080 })
      );

      marker.position.set(parsedCoordinate.x, parsedCoordinate.y, parsedCoordinate.z);
      Test.scene.add(marker);

      // Update the markedPoints state
      setMarkedPoints(prevMarkedPoints => [...prevMarkedPoints, parsedCoordinate]);

      // Close the modal
      closeModal();
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
  };

  const openModal = () => {

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleTextareaChange = (event) => {
    setUploadedCoordinates(event.target.value);
  };


  const parseCoordinates = (coordinates) => {
    debugger
    // Implement your coordinate parsing logic here
    // Return an array of parsed coordinates
    // For example: [{ x: 0, y: 0, z: 0 }, ...]
    return [];
  };


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
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 220,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
      >
        <button id="btns" >clear</button>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 280,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
      >
        <button onClick={openModal} id="upload" >upload</button>
      </div>
      {isModalOpen && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 280,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }} className="modal">
          <textarea
            value={uploadedCoordinates}
            onChange={handleTextareaChange}
            placeholder="Enter coordinates..."
          />
          <button onClick={handleApply}>Apply</button>
          <button id="apply" onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;


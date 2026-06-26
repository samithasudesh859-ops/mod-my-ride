import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export function CarModel({ 
  color, 
  engineOn, 
  selectedWheel = 'silver', 
  cameraView = 'default',
  glassColor = '#ffffff',   
  glassOpacity = 0.2        
}) {
  const { scene, materials } = useGLTF('/uploads_files_5364626_s60.glb');
  const { camera, controls } = useThree();

  
  useEffect(() => {
    if (!controls) return;
    let targetCameraPos = { x: 4, y: 2, z: 5 };
    let targetControlLookAt = { x: 0, y: 0.3, z: 0 };

    switch (cameraView) {
      case 'front':
        targetCameraPos = { x: 0, y: 0.8, z: 4.5 };
        targetControlLookAt = { x: 0, y: 0.4, z: 0 };
        break;
      case 'side':
        targetCameraPos = { x: -4.5, y: 0.6, z: 0 };
        targetControlLookAt = { x: 0, y: 0.3, z: 0 };
        break;
      case 'rear':
        targetCameraPos = { x: 0, y: 1.0, z: -4.5 };
        targetControlLookAt = { x: 0, y: 0.4, z: 0 };
        break;
      case 'top':
        targetCameraPos = { x: 0.1, y: 5, z: 0.1 };
        targetControlLookAt = { x: 0, y: 0, z: 0 };
        break;
      default:
        break;
    }

    gsap.to(camera.position, { x: targetCameraPos.x, y: targetCameraPos.y, z: targetCameraPos.z, duration: 1.5, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: targetControlLookAt.x, y: targetControlLookAt.y, z: targetControlLookAt.z, duration: 1.5, ease: 'power3.inOut', onUpdate: () => controls.update() });
  }, [cameraView, camera, controls]);


  
  useEffect(() => {
    if (!materials || !scene) return;

   
    scene.traverse((object) => {
      if (object.isMesh && object.name === 's60_body001') {
        if (!object.isCustomMaterialApplied) {
          object.material = new THREE.MeshStandardMaterial({
            roughness: 0.15,
            metalness: 0.85,
          });
          object.isCustomMaterialApplied = true;
        }
        object.material.color.set(color);
        object.material.needsUpdate = true;
      }
    });

   
    scene.traverse((object) => {
      if (object.isMesh) {
        if (
          object.name === 'Desirefx_me_reflect_taillight_bottom_Desirefx_me_reflect_tailli' || 
          object.material?.name === 'PaletteMaterial002'
        ) {
        
          if (!object.isCustomGlassApplied) {
            object.material = new THREE.MeshStandardMaterial({
              roughness: 0.05,
              metalness: 0.5,
              depthWrite: true,
            });
            object.isCustomGlassApplied = true;
          }
          
          object.material.transparent = true;
          object.material.opacity = glassOpacity; 
          object.material.color.set(glassColor);   
          object.material.needsUpdate = true;
        }
      }
    });

   
    if (materials['Rims.001']) {
      if (selectedWheel === 'black') {
        materials['Rims.001'].color.set('#111111');
        materials['Rims.001'].roughness = 0.25;
        materials['Rims.001'].metalness = 0.7;
      } else if (selectedWheel === 'gold') {
        materials['Rims.001'].color.set('#d4af37');
        materials['Rims.001'].roughness = 0.1;
        materials['Rims.001'].metalness = 1.0;
      } else {
        materials['Rims.001'].color.set('#cccccc');
        materials['Rims.001'].roughness = 0.15;
        materials['Rims.001'].metalness = 0.9;
      }
      materials['Rims.001'].needsUpdate = true;
    }

    if (materials['Tire.001']) {
      materials['Tire.001'].color.set('#151515');
      materials['Tire.001'].roughness = 0.85;
      materials['Tire.001'].metalness = 0.1;
    }

    
    scene.traverse((object) => {
      if (object.isMesh) {
       
        if (object.name === 's60_headlightglass_L' || object.name === 's60_headlightglass_R') {
          object.material = object.material.clone();
          if (engineOn) {
            object.material.color.set('#ffffff');
            object.material.emissive.set('#ffffff');
            object.material.emissiveIntensity = 35;
          } else {
            object.material.color.set('#ffffff');
            object.material.emissive.set('#000000');
            object.material.emissiveIntensity = 0;
          }
          object.material.needsUpdate = true;
        }

        
        if (
          object.name === 'Desirefx_me_reflectDark_taillight_out_Desirefx_me_reflectDa' || 
          object.name === 'Desirefx_me_reflectDark_taillight_out_Desirefx_me_reflectDa001' ||
          object.name === 'sunburst_body002_1'
        ) {
          object.material = object.material.clone();
          if (engineOn) {
            object.material.color.set(object.name === 'sunburst_body002_1' ? '#ffffff' : '#ff0000');
            object.material.emissive.set(object.name === 'sunburst_body002_1' ? '#ffffff' : '#ff0000');
            object.material.emissiveIntensity = object.name === 'sunburst_body002_1' ? 15 : 25;
          } else {
            object.material.color.set(object.name === 'sunburst_body002_1' ? '#cccccc' : '#ffffff');
            object.material.emissive.set('#000000');
            object.material.emissiveIntensity = 0;
          }
          object.material.needsUpdate = true;
        }
      }
    });

  }, [color, engineOn, selectedWheel, glassColor, glassOpacity, materials, scene]);

  return (
    <group>
      <primitive object={scene} />
      {engineOn && (
        <group>
          <spotLight position={[-0.7, 0.6, 1.8]} target-position={[-0.7, 0, 6]} angle={Math.PI / 3.5} penumbra={0.7} intensity={60} distance={12} color="#ffffff" castShadow />
          <pointLight position={[-0.7, 0.2, 2.2]} intensity={35} distance={5} color="#ffffff" />
          <spotLight position={[0.7, 0.6, 1.8]} target-position={[0.7, 0, 6]} angle={Math.PI / 3.5} penumbra={0.7} intensity={60} distance={12} color="#ffffff" castShadow />
          <pointLight position={[0.7, 0.2, 2.2]} intensity={35} distance={5} color="#ffffff" />
          <pointLight position={[-0.6, 0.3, -2.3]} intensity={45} distance={6} color="#ff0000" castShadow />
          <pointLight position={[0.6, 0.3, -2.3]} intensity={45} distance={6} color="#ff0000" castShadow />
        </group>
      )}
    </group>
  );
}
// src/features/app/student/tutor/TutorAvatar.tsx
// 3D professor avatar adapted from schoolme's professor.tsx for Vyasa (Vite).
// Identical Three.js / React Three Fiber logic — just different import paths.

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import type { AvatarMood } from "../../../../hooks/useGazeTrack";
import {
  type LipSyncData,
  type VisemeName,
  getCurrentViseme,
  getAmplitude,
  SILENCE_THRESHOLD,
  VISEME_TARGETS,
  VISEME_INTENSITY,
  VISEME_JAW,
} from "../../../../hooks/useLipSync";

// Avatar model lives in public/avatars/ — same as schoolme
const AVATAR_PATH = "/avatars/698f2ae7e61aa2e2a22d0ed2.glb";

type ModelProps = {
  externalIsTalking: boolean;
  currentMood: AvatarMood;
  lipSyncRef: React.RefObject<LipSyncData>;
};

function Model({ currentMood, lipSyncRef }: ModelProps) {
  const { scene } = useGLTF(AVATAR_PATH);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as Record<string, unknown> & {
    nodes: Record<string, THREE.SkinnedMesh>;
    materials: Record<string, THREE.Material>;
  };

  const morphRefs = useRef({ smile: 0, browDown: 0, browUp: 0, squint: 0 });
  const blinkState = useRef({
    isBlinking: false,
    blinkStartTime: 0,
    nextBlinkTime: 2,
  });
  const visemeBlend = useRef<Record<string, number>>(
    Object.fromEntries(VISEME_TARGETS.map((k) => [k, 0])),
  );

  useFrame((state, delta) => {
    const head = nodes.Wolf3D_Head as THREE.SkinnedMesh | undefined;
    const teeth = nodes.Wolf3D_Teeth as THREE.SkinnedMesh | undefined;
    if (!head || !teeth) return;

    const t = state.clock.getElapsedTime();
    const exprLerp = Math.min(1, 5 * delta);
    const visLerp = Math.min(1, 20 * delta);

    let targetSmile = 0,
      targetBrowDown = 0,
      targetBrowUp = 0,
      targetSquint = 0;
    switch (currentMood) {
      case "happy":
        targetSmile = 0.35;
        targetSquint = 0.15;
        break;
      case "serious":
        targetBrowDown = 0.35;
        targetSquint = 0.1;
        break;
      case "surprise":
        targetBrowUp = 0.45;
        targetSmile = 0.05;
        break;
      default:
        targetSmile = 0.05;
    }

    morphRefs.current.smile = THREE.MathUtils.lerp(
      morphRefs.current.smile,
      targetSmile,
      exprLerp,
    );
    morphRefs.current.browDown = THREE.MathUtils.lerp(
      morphRefs.current.browDown,
      targetBrowDown,
      exprLerp,
    );
    morphRefs.current.browUp = THREE.MathUtils.lerp(
      morphRefs.current.browUp,
      targetBrowUp,
      exprLerp,
    );
    morphRefs.current.squint = THREE.MathUtils.lerp(
      morphRefs.current.squint,
      targetSquint,
      exprLerp,
    );

    let autoBlinkValue = 0;
    if (t > blinkState.current.nextBlinkTime) {
      blinkState.current.isBlinking = true;
      blinkState.current.blinkStartTime = t;
      blinkState.current.nextBlinkTime = t + 2 + Math.random() * 4;
    }
    if (blinkState.current.isBlinking) {
      const progress = (t - blinkState.current.blinkStartTime) / 0.15;
      if (progress >= 1) blinkState.current.isBlinking = false;
      else autoBlinkValue = Math.sin(progress * Math.PI);
    }

    const lsData = lipSyncRef.current;
    let currentViseme: VisemeName = "sil";
    if (lsData.isActive) {
      const elapsed =
        lsData.audioElement && !lsData.audioElement.paused
          ? lsData.audioElement.currentTime
          : (performance.now() - lsData.startTime) / 1000;
      const timelineViseme = getCurrentViseme(lsData.timeline, elapsed);
      if (
        lsData.analyser &&
        lsData.analyserBuffer &&
        timelineViseme !== "sil"
      ) {
        currentViseme =
          getAmplitude(lsData.analyser, lsData.analyserBuffer) >=
          SILENCE_THRESHOLD
            ? timelineViseme
            : "sil";
      } else {
        currentViseme = timelineViseme;
      }
    }

    const smileScale = lsData.isActive ? 0.3 : 1.0;
    const microBrow = lsData.isActive
      ? Math.max(0, Math.sin(t * 3.5) * 0.06 + Math.sin(t * 7.1) * 0.03)
      : 0;
    const jawValue = Math.min(0.45, VISEME_JAW[currentViseme] * 1.0);

    const hDict = head.morphTargetDictionary;
    const hInfl = head.morphTargetInfluences;
    const tDict = teeth.morphTargetDictionary;
    const tInfl = teeth.morphTargetInfluences;
    if (!hDict || !hInfl || !tDict || !tInfl) return;

    const bL = hDict["eyeBlinkLeft"],
      bR = hDict["eyeBlinkRight"];
    const bdL = hDict["browDownLeft"],
      bdR = hDict["browDownRight"];
    const bIU = hDict["browInnerUp"];
    const mSm = hDict["mouthSmile"] ?? hDict["mouthSmileLeft"];
    if (bL !== undefined)
      hInfl[bL] = THREE.MathUtils.lerp(
        hInfl[bL],
        Math.min(1, autoBlinkValue + morphRefs.current.squint),
        visLerp,
      );
    if (bR !== undefined)
      hInfl[bR] = THREE.MathUtils.lerp(
        hInfl[bR],
        Math.min(1, autoBlinkValue + morphRefs.current.squint),
        visLerp,
      );
    if (bdL !== undefined)
      hInfl[bdL] = THREE.MathUtils.lerp(
        hInfl[bdL],
        morphRefs.current.browDown,
        exprLerp,
      );
    if (bdR !== undefined)
      hInfl[bdR] = THREE.MathUtils.lerp(
        hInfl[bdR],
        morphRefs.current.browDown,
        exprLerp,
      );
    if (bIU !== undefined)
      hInfl[bIU] = THREE.MathUtils.lerp(
        hInfl[bIU],
        morphRefs.current.browUp + microBrow,
        exprLerp,
      );
    if (mSm !== undefined)
      hInfl[mSm] = THREE.MathUtils.lerp(
        hInfl[mSm],
        morphRefs.current.smile * smileScale,
        exprLerp,
      );

    for (const target of VISEME_TARGETS) {
      const vName = target.replace("viseme_", "") as VisemeName;
      const tgtVal =
        vName === currentViseme
          ? Math.min(1, VISEME_INTENSITY[currentViseme])
          : 0;
      visemeBlend.current[target] = THREE.MathUtils.lerp(
        visemeBlend.current[target],
        tgtVal,
        visLerp,
      );
      const hi = hDict[target],
        ti = tDict[target];
      if (hi !== undefined) hInfl[hi] = visemeBlend.current[target];
      if (ti !== undefined) tInfl[ti] = visemeBlend.current[target];
    }

    const jawIdx = hDict["jawOpen"];
    if (jawIdx !== undefined)
      hInfl[jawIdx] = THREE.MathUtils.lerp(hInfl[jawIdx], jawValue, visLerp);
  });

  return (
    <group dispose={null}>
      <primitive object={nodes.Hips} />
      {[
        "Wolf3D_Hair",
        "Wolf3D_Body",
        "Wolf3D_Outfit_Bottom",
        "Wolf3D_Outfit_Footwear",
        "Wolf3D_Outfit_Top",
      ].map(
        (name) =>
          nodes[name] && (
            <skinnedMesh
              key={name}
              geometry={nodes[name].geometry}
              material={materials[name.replace("Wolf3D_", "Wolf3D_")]}
              skeleton={nodes[name].skeleton}
            />
          ),
      )}
      {nodes.EyeLeft && (
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
      )}
      {nodes.EyeRight && (
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
      )}
      {nodes.Wolf3D_Head && (
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
      )}
      {nodes.Wolf3D_Teeth && (
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
      )}
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.6, 1.2);
    camera.lookAt(0, 1.6, 0);
  }, [camera]);
  return null;
}

export interface TutorAvatarProps {
  isTalking: boolean;
  mood: AvatarMood;
  lipSyncRef: React.RefObject<LipSyncData>;
}

export default function TutorAvatar({
  isTalking,
  mood,
  lipSyncRef,
}: TutorAvatarProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f8fafc] dark:bg-[#0f0f0f]">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 1.6, 1.2], fov: 28 }}
        shadows
        onCreated={({ gl }) => gl.setClearColor("#f8fafc")}
      >
        <CameraController />
        <Environment preset="city" />
        <ambientLight intensity={0.7} />
        <spotLight
          color="#fff"
          intensity={8}
          position={[2, 5, 2]}
          angle={0.7}
          penumbra={0.5}
          castShadow
        />
        <Model
          externalIsTalking={isTalking}
          currentMood={mood}
          lipSyncRef={lipSyncRef}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(AVATAR_PATH);

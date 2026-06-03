import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";

const LINE_OVERSHOOT = 0.5;
const DASH_SIZE = 0.03;
const GAP_SIZE = 0.04;
const OUTSIDE_ARC_THICKNESS = 0.05;
const OUTSIDE_ARC_STEP = degToRad(15);

const StaticOutlineCircle = ({ outerCircleRadius = 3.5 }) => {
  // Generate the circle points once. Close the loop by repeating the first point.
  const points = useMemo(() => {
    const segments = 64;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([
        Math.cos(angle) * outerCircleRadius,
        Math.sin(angle) * outerCircleRadius,
        0,
      ]);
    }
    return pts;
  }, [outerCircleRadius]);

  return (
    <>
      {/**circle */}
      <Line
        points={points}
        color="white"
        lineWidth={1} // in pixels
        dashed
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
      />
      {/** Horizontal line */}
      <Line
        points={[
          [0, 0, 0],
          [outerCircleRadius, 0, 0],
        ]}
        color="white"
        lineWidth={2} // in pixels
        dashed
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
      />
      {/** 30 degree line upward */}
      <Line
        rotation={[0, 0, Math.PI / 6]}
        points={[
          [0, 0, 0],
          [outerCircleRadius + LINE_OVERSHOOT, 0, 0],
        ]}
        color="white"
        lineWidth={1} // in pixels
        dashed
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
      />
      {/** 30 degree line downward */}
      <Line
        rotation={[0, 0, -Math.PI / 6]}
        points={[
          [0, 0, 0],
          [outerCircleRadius + LINE_OVERSHOOT, 0, 0],
        ]}
        color="white"
        lineWidth={1} // in pixels
        dashed
        dashSize={DASH_SIZE}
        gapSize={GAP_SIZE}
      />

      <SlowWiperLine outerCircleRadius={outerCircleRadius} />
    </>
  );
};

const SlowWiperLine = ({ outerCircleRadius }) => {
  const groupRef = useRef();
  const shortArcRef = useRef();
  const speed = 0.01;
  const shortArcSpeed = 0.3;
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = elapsed * speed;
    }
    if (shortArcRef.current) {
      shortArcRef.current.rotation.z = -elapsed * shortArcSpeed;
    }
  });
  return (
    <>
      <group ref={groupRef}>
        <Line
          rotation={[0, 0, Math.PI / 2.7]}
          points={[
            [0, 0, 0],
            [outerCircleRadius + LINE_OVERSHOOT, 0, 0],
          ]}
          color="white"
          lineWidth={2} // in pixels
          dashed
          dashSize={DASH_SIZE}
          gapSize={GAP_SIZE}
        />
      </group>
      <mesh ref={shortArcRef}>
        <ringGeometry
          args={[
            outerCircleRadius - OUTSIDE_ARC_THICKNESS * 0.5,
            outerCircleRadius + OUTSIDE_ARC_THICKNESS * 0.5,
            32,
            3,
            0,
            OUTSIDE_ARC_STEP,
          ]}
        />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

export default StaticOutlineCircle;

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const LINE_OVERSHOOT = 0.5;
const DASH_SIZE = 0.03;
const GAP_SIZE = 0.04;

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
  const speed = 0.01;
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * speed;
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
    </>
  );
};

export default StaticOutlineCircle;

import { useState, useEffect } from "react";
import useAnimationStore from "../../stores/useAnimationStore";
import gsap from "gsap";
import * as THREE from "three";

console.log("GrayTriangles loaded", useAnimationStore);

const GrayTriangles = ({ circleDivisions = 30, outerCircleRadius = 3.5 }) => {
  const arcStep = (2 * Math.PI) / circleDivisions;
  return (
    <group>
      {Array.from({ length: circleDivisions }).map((_, i) => (
        <OneGrayTriangle
          key={i}
          outerCircleRadius={outerCircleRadius}
          arcStep={arcStep}
          arcAngle={i * arcStep}
          index={i}
        />
      ))}
    </group>
  );
};

const OneGrayTriangle = ({
  outerCircleRadius,
  arcAngle = 0,
  arcStep,
  index,
}) => {
  const currentStep = useAnimationStore((state) => state.currentStep);
  const [arcLengthFinal, setArcLengthFinal] = useState(0);
  const triangleRadius = outerCircleRadius * 0.6;
  const animationProgress = { value: 0 };
  useEffect(() => {
    if (currentStep === index) {
      gsap.to(animationProgress, {
        value: 1,
        duration: 1,
        onUpdate: () => {
          setArcLengthFinal(arcStep * animationProgress.value);
        },
      });
    }
  }, [currentStep, index, arcStep]);
  return (
    <group>
      <mesh rotation={[0, 0, arcAngle]}>
        <circleGeometry args={[triangleRadius, 3, arcStep, -arcLengthFinal]} />
        <meshBasicMaterial color="gray" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default GrayTriangles;

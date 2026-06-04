import { useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import useAnimationStore from "../../stores/useAnimationStore";
import gsap from "gsap";
import * as THREE from "three";

const TIP_RING_THICKNESS = 0.01;
const SLIGHT_MISALIGN_ANGLE = (2 * Math.PI) / 180; // 1 degree

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgressValue, setAnimationProgressValue] = useState(0);
  const [animationProgressValueFaster, setAnimationProgressValueFaster] =
    useState(0.5); // start with 0.5 offset and lerp to 1

  const triangleRadius = outerCircleRadius * 0.6;
  const radiatingLineLength = outerCircleRadius - triangleRadius;

  const animationProgress = { value: 0, valueFaster: 0.5 };
  useEffect(() => {
    if (currentStep === index) {
      gsap.to(animationProgress, {
        value: 1,
        valueFaster: 1,
        duration: 0.5,
        ease: "circ.out",
        onStart: () => {
          setIsAnimating(true);
        },
        onUpdate: () => {
          setArcLengthFinal(arcStep * animationProgress.value);
          setAnimationProgressValue(animationProgress.value);
          setAnimationProgressValueFaster(animationProgress.valueFaster * 1.1);
        },
      });
    }
  }, [currentStep, index, arcStep]);
  return (
    <group>
      {/* actual gray triangle */}
      <mesh rotation={[0, 0, arcAngle]}>
        <circleGeometry args={[triangleRadius, 1, arcStep, -arcLengthFinal]} />
        <meshBasicMaterial color="gray" side={THREE.DoubleSide} />
      </mesh>
      {/**tip white arc */}
      <group rotation={[0, 0, arcAngle]}>
        <group
          position={[triangleRadius, 0, 0]}
          rotation={[0, 0, SLIGHT_MISALIGN_ANGLE]}
        >
          <mesh position={[-triangleRadius, 0, 0]}>
            <ringGeometry
              args={[
                triangleRadius - TIP_RING_THICKNESS,
                triangleRadius + TIP_RING_THICKNESS,
                1,
                1,
                arcStep,
                -arcLengthFinal,
              ]}
            />
            <meshBasicMaterial color="white" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
      {/**tip red dot, right hand side */}
      {isAnimating && ( //suddenly show red dot if white line is swiping into place
        <>
          <mesh rotation={[0, 0, arcAngle]}>
            <ringGeometry
              args={[
                triangleRadius - TIP_RING_THICKNESS * 1.2,
                triangleRadius + TIP_RING_THICKNESS * 1.2,
                1,
                1,
                0,
                -arcStep / 20,
              ]}
            />
            <meshBasicMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
          {/**tip red dot, right hand side */}
          <mesh rotation={[0, 0, arcAngle]}>
            <ringGeometry
              args={[
                triangleRadius - TIP_RING_THICKNESS * 1.2,
                triangleRadius + TIP_RING_THICKNESS * 1.2,
                1,
                1,
                arcStep,
                -arcStep / 15,
              ]}
            />
            <meshBasicMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {/**
       * radiating lines from gray triangle tip to the outer circle
       *
       */}
      {isAnimating && animationProgressValue < 0.99 && (
        <group rotation={[0, 0, arcAngle]}>
          {/*red line, then white, at the triangle beginning, i.e 0 rotation, faster animation*/}
          <Line
            points={[
              [
                triangleRadius +
                  radiatingLineLength * animationProgressValueFaster,
                0,
                0,
              ], //starting line position moves toward circle end as well
              [
                triangleRadius +
                  radiatingLineLength *
                    (animationProgressValueFaster * 0.75 + 0.25), //start at quarter length of gap b/n triangle and outer circle
                0,
                0,
              ],
            ]}
            color="red"
            lineWidth={7}
          />
          <Line
            points={[
              [
                triangleRadius +
                  radiatingLineLength *
                    (animationProgressValueFaster * 0.75 + 0.25),
                0,
                0,
              ], //starting line position moves toward circle end as well
              [
                triangleRadius +
                  radiatingLineLength *
                    (animationProgressValueFaster * 0.5 + 0.5), //line endpoint at halfway of gap b/n triangle and outer circle
                0,
                0,
              ],
            ]}
            color="white"
            lineWidth={7}
          />
          {/*red line, then white, at the triangle end, i.e arcStep rotation*/}
          <Line
            rotation={[0, 0, arcStep]}
            points={[
              [
                triangleRadius + radiatingLineLength * animationProgressValue,
                0,
                0,
              ], //starting line position moves toward circle end as well
              [
                triangleRadius +
                  radiatingLineLength * (animationProgressValue * 0.75 + 0.25), //start at quarter length of gap b/n triangle and outer circle
                0,
                0,
              ],
            ]}
            color="red"
            lineWidth={7}
          />
          <Line
            rotation={[0, 0, arcStep]}
            points={[
              [
                triangleRadius +
                  radiatingLineLength * (animationProgressValue * 0.75 + 0.25),
                0,
                0,
              ], //starting line position moves toward circle end as well
              [
                triangleRadius +
                  radiatingLineLength * (animationProgressValue * 0.5 + 0.5), //start at half length
                0,
                0,
              ],
            ]}
            color="white"
            lineWidth={7}
          />
        </group>
      )}
    </group>
  );
};

export default GrayTriangles;

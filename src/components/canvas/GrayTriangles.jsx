import { useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import useAnimationStore from "../../stores/useAnimationStore";
import gsap from "gsap";
import * as THREE from "three";

const TIP_RING_THICKNESS = 0.01;
const SLIGHT_MISALIGN_ANGLE = (2 * Math.PI) / 180; // 2 degrees. because it looks nice :-)
const Z_OFFSET = 0.003;

const GrayTriangles = ({ circleDivisions = 30, outerCircleRadius = 3.5 }) => {
  const keyElementIndex = useAnimationStore((state) => state.keyElementIndex);

  const arcStep = (2 * Math.PI) / circleDivisions;
  const cachedTriangles = useAnimationStore((state) => state.cachedTriangles);
  //  probably best to push older triangles into an array that you can render later

  return (
    <group>
      {/** Animating triangles */}
      {Array.from({ length: keyElementIndex + 2 }).map((_, i) => {
        const effectiveIndex = 30 - i;
        return (
          <OneGrayTriangle
            key={`${keyElementIndex}-${i}`}
            outerCircleRadius={outerCircleRadius}
            keyElementIndex={keyElementIndex}
            arcStep={arcStep}
            arcAngle={effectiveIndex * arcStep}
            index={effectiveIndex}
          />
        );
      })}
      {/** Static triangles (older, cached ones)*/}
      {cachedTriangles.map((triangle) => {
        //don't render latest layer since it's still animating
        if (triangle.keyElementIndex === keyElementIndex) {
          return null;
        }
        return (
          <OneGrayCachedTriangle
            key={`cached-${triangle.savedKey}`}
            arcStep={arcStep}
            arcAngle={triangle.arcAngle}
            triangleRadius={triangle.triangleRadius}
            zPosition={triangle.zPosition}
          />
        );
      })}
    </group>
  );
};

const OneGrayTriangle = ({
  outerCircleRadius,
  arcAngle = 0,
  arcStep,
  index,
  keyElementIndex,
}) => {
  const currentStep = useAnimationStore((state) => state.currentStep);
  const effectiveStep = 30 - currentStep;

  const [arcLengthFinal, setArcLengthFinal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgressValue, setAnimationProgressValue] = useState(0);
  const [animationProgressValueFaster, setAnimationProgressValueFaster] =
    useState(0.5); // start with 0.5 offset and lerp to 1

  const keyIndexOffset =
    (outerCircleRadius * (1 - 0.45) * keyElementIndex) / 30; //30 levels for the arc to jump to

  const triangleRadius = outerCircleRadius * 0.45 + keyIndexOffset;
  const radiatingLineRadiusEnd = outerCircleRadius * 1.1;
  const radiatingLineLength = radiatingLineRadiusEnd - triangleRadius;

  const animationProgress = { value: -0.5, valueFaster: -0.2 };
  useEffect(() => {
    if (effectiveStep === index && keyElementIndex > 0) {
      //cache triangles like this:
      const savedKey = `${effectiveStep}-${keyElementIndex}`;
      const cachedTriangles = useAnimationStore.getState().cachedTriangles;
      const exists = cachedTriangles.some((t) => t.savedKey === savedKey);
      if (!exists)
        useAnimationStore.setState({
          cachedTriangles: [
            ...cachedTriangles,
            {
              step: effectiveStep,
              arcAngle,
              keyElementIndex,
              savedKey: `${effectiveStep}-${keyElementIndex}`,
              triangleRadius,
              zPosition: Z_OFFSET * keyElementIndex,
            },
          ],
        });

      //animate wiper movement, and radiating lines
      gsap.to(animationProgress, {
        value: 1,
        valueFaster: 1,
        duration: 0.65,
        ease: "circ.out",
        onStart: () => {
          setIsAnimating(true);
        },
        onUpdate: () => {
          setArcLengthFinal(arcStep * animationProgress.value);
          setAnimationProgressValue(animationProgress.value);
          setAnimationProgressValueFaster(animationProgress.valueFaster);
        },
      });
    }
  }, [currentStep, index, arcStep]);
  return (
    <group position={[0, 0, Z_OFFSET * keyElementIndex]}>
      {/* actual gray triangle */}
      <mesh rotation={[0, 0, arcAngle]}>
        <circleGeometry
          args={[triangleRadius * 1, 1, arcStep, -arcLengthFinal]}
        />
        <meshBasicMaterial
          color="gray"
          transparent
          side={THREE.DoubleSide}
          opacity={0.07}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
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
                    (animationProgressValueFaster * 0.5 + 0.5), //start at quarter length of gap b/n triangle and outer circle
                0,
                0,
              ],
            ]}
            color="red"
            lineWidth={1}
            polygonOffset
          />
          <Line
            points={[
              [
                triangleRadius +
                  radiatingLineLength *
                    (animationProgressValueFaster * 0.5 + 0.5),
                0,
                0,
              ], //starting line position moves toward circle end as well
              [
                triangleRadius + radiatingLineLength, //line endpoint at halfway of gap b/n triangle and outer circle
                0,
                0,
              ],
            ]}
            color="white"
            lineWidth={5}
            polygonOffset
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
            lineWidth={3}
            polygonOffset
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
            lineWidth={5}
            polygonOffset
          />
        </group>
      )}
    </group>
  );
};
const OneGrayCachedTriangle = ({
  arcAngle = 0,
  arcStep,
  zPosition,
  triangleRadius,
}) => {
  //arcAngle
  //triangleRadius
  //keyElementIndex
  //step

  return (
    <group position={[0, 0, zPosition]}>
      {/* actual gray triangle */}
      <mesh rotation={[0, 0, arcAngle]}>
        <circleGeometry args={[triangleRadius * 1, 1, arcStep, -arcStep]} />
        <meshBasicMaterial
          color="gray"
          transparent
          side={THREE.DoubleSide}
          opacity={0.05}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
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
                -arcStep,
              ]}
            />
            <meshBasicMaterial color="white" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
      {/**tip red dot, right hand side */}
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
    </group>
  );
};

export default GrayTriangles;

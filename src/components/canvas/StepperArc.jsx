import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import useAnimationStore from "../../stores/useAnimationStore";

const ANGLE_STEP = degToRad(360 / 30); // divide circle into 30 parts, convert to radians
const STEPPER_SPEED = 1.3;

const StepperArc = ({ outerCircleRadius }) => {
  const arcThickness = 0.1;
  const arcSweep = (2 * Math.PI) / 30; //assuming input array of 30 elements. should probably make dynamic
  const arcRadius = outerCircleRadius * 0.8;
  const arcRef = useRef();
  const previousStep = useRef();

  useFrame((state) => {
    // console.log(state.clock.elapsedTime);
    const currentStep = Math.floor(
      (state.clock.elapsedTime * STEPPER_SPEED) / ANGLE_STEP,
    );
    if (arcRef.current && currentStep !== previousStep.current) {
      arcRef.current.rotation.z = ANGLE_STEP * currentStep;
      useAnimationStore.setState({ currentStep });
      previousStep.current = currentStep;
    }
  });
  return (
    <>
      <group ref={arcRef} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <ringGeometry
            args={[
              arcRadius - arcThickness * 0.5,
              arcRadius + arcThickness * 0.5,
              32,
              1,
              0,
              arcSweep,
            ]}
          />
          <meshBasicMaterial color="red" side={2} />
        </mesh>
      </group>
    </>
  );
};

export default StepperArc;

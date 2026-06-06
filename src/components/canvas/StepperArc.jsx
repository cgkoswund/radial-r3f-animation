import { degToRad } from "three/src/math/MathUtils.js";
import useAnimationStore from "../../stores/useAnimationStore";

const ANGLE_STEP = degToRad(360 / 30); // divide circle into 30 parts, convert to radians
// const STEPPER_SPEED = 1.3 * 1.2;

const StepperArc = ({ outerCircleRadius }) => {
  const currentStep = useAnimationStore((state) => state.currentStep);
  const keyElementIndex = useAnimationStore((state) => state.keyElementIndex);

  const arcThickness = 0.1;
  const arcSweep = (2 * Math.PI) / 30; //assuming input array of 30 elements. should probably make dynamic

  const keyIndexOffset =
    (outerCircleRadius * (1 - 0.45) * keyElementIndex) / 30; //20 levels for the arc to jump to
  const arcRadius = outerCircleRadius * 0.45 + arcThickness + keyIndexOffset;
  //make "current step", shift progressively clockwise with the key index
  const effectiveStep = 30 - currentStep; //array size of 30, clockwise
  const stepperArcRotation = ANGLE_STEP * effectiveStep;

  return (
    <>
      <group rotation={[0, 0, stepperArcRotation]}>
        <mesh>
          <ringGeometry
            args={[
              arcRadius - arcThickness * 0.5,
              arcRadius + arcThickness * 0.5,
              3,
              1,
              0,
              arcSweep,
            ]}
          />
          <meshBasicMaterial
            color={keyElementIndex % 2 === 0 ? "red" : "white"}
            side={2}
          />
        </mesh>
      </group>
    </>
  );
};

export default StepperArc;

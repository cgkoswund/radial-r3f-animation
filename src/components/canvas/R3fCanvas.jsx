import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "../../styles/R3fCanvas.module.css";
import StaticOutlineCircle from "./StaticOutlineCircle";
import StepperArc from "./StepperArc";
import GrayTriangles from "./GrayTriangles";

const OUTER_CIRCLE_RADIUS = 3.5;

const R3fCanvas = () => {
  return (
    <div className={styles.container}>
      <Canvas>
        <color attach="background" args={["#1a1a1a"]} />
        <OrbitControls />
        <StepperArc outerCircleRadius={OUTER_CIRCLE_RADIUS} />
        <GrayTriangles outerCircleRadius={OUTER_CIRCLE_RADIUS} />
        <StaticOutlineCircle outerCircleRadius={OUTER_CIRCLE_RADIUS} />
      </Canvas>
    </div>
  );
};

export default R3fCanvas;

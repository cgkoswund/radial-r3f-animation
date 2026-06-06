import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import styles from "../../styles/R3fCanvas.module.css";
import StaticOutlineCircle from "./StaticOutlineCircle";
import StepperArc from "./StepperArc";
import GrayTriangles from "./GrayTriangles";
import RedLinesNodeAnimation from "./RedLinesNodeAnimation";
import mainTimerLogic from "../../mainTimerLogic";
// import { useProgress } from "@react-three/drei";

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
        <RedLinesNodeAnimation />
        <MonitorLoadingThenStartAnimation />
      </Canvas>
    </div>
  );
};

//let's wait for the 3D to be available  before we start animating data
const MonitorLoadingThenStartAnimation = () => {
  useEffect(() => {
    let cancelTimer = () => {};
    cancelTimer = mainTimerLogic(); //run insertion sort with delay per loop step (for animation)
    return () => {
      // cancel duplicated timer logic (component mounts twice in dev)
      cancelTimer();
    };
  }, []);
  return null;
};

export default R3fCanvas;

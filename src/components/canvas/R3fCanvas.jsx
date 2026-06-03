import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "../../styles/R3fCanvas.module.css";

const R3fCanvas = () => {
  return (
    <div className={styles.container}>
      <Canvas>
        <OrbitControls />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  );
};

export default R3fCanvas;

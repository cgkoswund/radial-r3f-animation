//the red lines node sort of animation :-)
import { Line, Text } from "@react-three/drei";
import generatePointsOnACircle from "../../utils/generatePointsOnACircle";
import { /*useEffect,*/ useState } from "react";
import useAnimationStore from "../../stores/useAnimationStore";

const RedLinesNodeAnimation = () => {
  const arrayToSort = useAnimationStore.getState().arrayToSort; //get constant array only once
  //nodes start as a circle, then progress inward over time.
  const [latestPoints /*, setLatestPoints*/] = useState(
    generatePointsOnACircle((3.5 + 0.2) * 1.1, arrayToSort.length - 1) || [],
  );

  return (
    <>
      {/**White chain line of connected numbers */}
      {latestPoints.map((point, index) => {
        // space for debug logs

        return (
          <group key={index} scale={0.88 + 0.004 * (index + 1)}>
            <Line
              key={index}
              points={[
                latestPoints[index],
                latestPoints[(index + 1) % latestPoints.length],
              ]}
              dashSize={0.05}
              gapSize={0.025}
              dashed
              color="pink"
              lineWidth={1.3}
            />
            <mesh position={point}>
              <planeGeometry args={[0.065, 0.065]} />
              <meshBasicMaterial color="blue" />
            </mesh>
            <Text
              position={[point[0] + 0.13, point[1], point[2]]}
              fontSize={0.13}
              color="white"
              anchorX="left"
              anchorY="middle"
            >
              {arrayToSort[index] === 0 ? "INSERTION SORT" : arrayToSort[index]}
            </Text>
          </group>
        );
      })}
      {/** @TODO: Red line node system showing current number under processing step */}
    </>
  );
};

export default RedLinesNodeAnimation;

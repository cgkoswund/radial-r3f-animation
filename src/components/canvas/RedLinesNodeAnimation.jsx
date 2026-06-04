//the red lines node sort of animation :-)
import { Line, Text } from "@react-three/drei";
import generatePointsOnACircle from "../../utils/generatePointsOnACircle";
import { /*useEffect, useRef,*/ useState } from "react";
import generateUnsortedArray from "../../utils/generateUnsortedArray";

const SIZE_OF_ARRAY_TO_SORT = 30; //@TODO: make this "global" like the outer circle radius
const ARRAY_TO_SORT = generateUnsortedArray(SIZE_OF_ARRAY_TO_SORT);

const RedLinesNodeAnimation = () => {
  // const statingPoints = useRef(generatePointsOnACircle(3.5, 30));
  //nodes start as a circle, then progress inward over time.
  const [latestPoints /*, setLatestPoints*/] = useState(
    generatePointsOnACircle(3.5 + 0.2, ARRAY_TO_SORT.length) || [],
  );

  // useEffect(() => {
  //     console.log("RedLinesNodeAnimation mounted");
  //     statingPoints.current = generatePointsOnACircle(3.5, 30);
  //     setLatestPoints(statingPoints.current);
  // }, [setLatestPoints]);
  return (
    <>
      {/**White chain line of connected numbers */}
      {latestPoints.map((point, index) => (
        <group key={index}>
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
            {ARRAY_TO_SORT[index] === 0
              ? "INSERTION SORT"
              : ARRAY_TO_SORT[index]}
          </Text>
        </group>
      ))}
      {/** @TODO: Red line node system showing current number under processing step */}
    </>
  );
};

export default RedLinesNodeAnimation;

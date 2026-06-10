//the red lines node sort of animation :-)
import { Line, Text } from "@react-three/drei";
import generatePointsOnACircle from "../../utils/generatePointsOnACircle";
import { /*useEffect,*/ useState } from "react";
import useAnimationStore from "../../stores/useAnimationStore";
import * as THREE from "three";

let keyElementPosition = new THREE.Vector3();

const RedLinesNodeAnimation = () => {
  const arrayToSort = useAnimationStore.getState().arrayToSort; //get constant array only once
  const startingArray = useAnimationStore.getState().startingArray; //get constant array only once
  const whiteChainArray = useAnimationStore.getState().whiteChainArray; //get constant array only once

  //nodes start as a circle, then progress inward over time.
  const [latestPoints /*, setLatestPoints*/] = useState(
    generatePointsOnACircle((3.5 + 0.2) * 1.1, arrayToSort.length - 1) || [],
  );
  //might be useful to fetch in useframe instead once animation becomes continues, to avoid duplicate renders on multiple state changes
  const keyElementIndex = useAnimationStore((state) => state.keyElementIndex);
  const insertionSlotIndex = useAnimationStore(
    (state) => state.insertionSlotIndex,
  );
  //log keyElementIndex
  console.log("keyElementIndex", keyElementIndex);

  return (
    <>
      <WhiteChainLine
        latestPoints={latestPoints}
        startingArray={startingArray}
        whiteChainArray={whiteChainArray}
        keyElementIndex={keyElementIndex}
        keyElementPosition={keyElementPosition}
      />
      {/** @TODO: Red line node system showing current number under processing step */}
      <RedLines
        keyElementIndex={keyElementIndex}
        arrayToSort={arrayToSort}
        latestPoints={latestPoints}
        insertionSlotIndex={insertionSlotIndex}
        startingArray={startingArray}
        whiteChainArray={whiteChainArray}
      />
    </>
  );
};

const WhiteChainLine = ({
  latestPoints,
  /*arrayToSort, startingArray,*/ whiteChainArray,
  keyElementIndex,
}) => {
  return (
    <>
      {/**White chain line of connected numbers */}
      {latestPoints.map((point, index) => {
        // space for debug logs

        return (
          <group key={index} /*scale={0.88 + 0.004 * (index + 1)*/>
            {index !== keyElementIndex - 1 && (
              <Line
                key={index}
                points={[
                  latestPoints[
                    index > 0 && index === keyElementIndex ? index - 1 : index
                  ],
                  latestPoints[(index + 1) % latestPoints.length],
                ]}
                dashSize={0.05}
                gapSize={0.025}
                dashed
                color="pink"
                lineWidth={1.3}
              />
            )}
            {index !== keyElementIndex && (
              <>
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
                  {whiteChainArray[index] === 0
                    ? "INSERTION SORT"
                    : whiteChainArray[index]}
                </Text>
              </>
            )}
          </group>
        );
      })}
    </>
  );
};

const RedLines = ({
  keyElementIndex /*
  arrayToSort,
  startingArray,*/,
  latestPoints,
  insertionSlotIndex,
  whiteChainArray,
}) => {
  const prevWhiteChainTextPosition = latestPoints[insertionSlotIndex - 1] || [
    0, 0, 0,
  ];
  const nextWhiteChainTextPosition = latestPoints[insertionSlotIndex] || [
    0, 0, 0,
  ];

  //convert to vertors for easy manipulation
  const prevWhiteChainTextVector = new THREE.Vector3(
    ...prevWhiteChainTextPosition,
  );
  const nextWhiteChainTextVector = new THREE.Vector3(
    ...nextWhiteChainTextPosition,
  );
  //place the new point in a way that keeps the chain length consistent between points
  const redLineVector = getEquilateralTriangleThirdPoint(
    prevWhiteChainTextVector,
    nextWhiteChainTextVector,
  );

  keyElementPosition.copy(redLineVector);

  const redWebArray = latestPoints.slice(
    insertionSlotIndex - 1,
    keyElementIndex,
  );

  return (
    <>
      <Text
        fontSize={0.2}
        color="red"
        position={[redLineVector.x + 0.3, redLineVector.y, redLineVector.z]}
        anchorX="center"
        anchorY="middle"
      >
        {whiteChainArray[keyElementIndex] === 0
          ? "INSERTION SORT"
          : whiteChainArray[keyElementIndex]}
      </Text>
      {redWebArray.map((_, index) => {
        if (!_ || _.length === 0) {
          return null;
        }
        return (
          <group key={`red-web-${index}`}>
            <Line
              points={[redLineVector, _]}
              dashed
              dashSize={0.05}
              gapSize={0.025}
              color="white"
              lineWidth={2}
              transparent
              opacity={index >= 10 ? 0 : 1 - index * 0.075}
            />
            <Line
              points={[redLineVector, _]}
              color="red"
              lineWidth={3}
              transparent
              opacity={index >= 10 ? 0 : 1 - index * 0.1}
            />
          </group>
        );
      })}
    </>
  );
};

//insert the sorted number such that it forms an equilateral triangle with the two adjacent numbers
const getEquilateralTriangleThirdPoint = (
  a,
  b,
  normal = new THREE.Vector3(0, 0, 1),
) => {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const perp = new THREE.Vector3()
    .crossVectors(normal, dir) // ⟂ to base, in the plane
    .setLength((dir.length() * Math.sqrt(3)) / 2);

  //two possibilities. but just pick the one closer to 0,0,0
  const p1 = mid.clone().add(perp);
  const p2 = mid.clone().sub(perp);
  return p1.length() < p2.length() ? p1 : p2;
};

export default RedLinesNodeAnimation;

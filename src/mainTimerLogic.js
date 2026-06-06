import useAnimationStore from "./stores/useAnimationStore";
import generateUnsortedArray from "./utils/generateUnsortedArray";

const STEP_DELAY_MS = 100;

//add +1 though due to first test being around circle. extra point closes the loop
const SIZE_OF_ARRAY_TO_SORT = 30; //@TODO: make this "global" like the outer circle radius
const ARRAY_TO_SORT = generateUnsortedArray(SIZE_OF_ARRAY_TO_SORT);

useAnimationStore.setState({ arrayToSort: ARRAY_TO_SORT });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tempNumberBucket = 0;
const mainTimerLogic = () => {
  //initial sleep for page load
  sleep(2000);

  //scoped cancel and sort cos useEffect cleanup
  // was stopping everything lmao
  let isCancelled = false;

  async function runInsertionSort() {
    //go through each slot in the array
    for (let i = 1; i < ARRAY_TO_SORT.length; i++) {
      //broadcast the "i" value to all animating elements
      useAnimationStore.setState({ keyElementIndex: i });
      tempNumberBucket = ARRAY_TO_SORT[i];
      // compare current slot with previous slots
      conmpareToLeftNumbers: for (let j = i; j >= 0; j--) {
        useAnimationStore.setState({ insertionSlotIndex: j });
        if (ARRAY_TO_SORT[j - 1] > tempNumberBucket) {
          ARRAY_TO_SORT[j] = ARRAY_TO_SORT[j - 1];
        } else {
          ARRAY_TO_SORT[j] = tempNumberBucket;
          break conmpareToLeftNumbers;
        }
        if (isCancelled) {
          return;
        }
        await sleep(STEP_DELAY_MS); //timer for animation. else it will just appear as final state
        //double check so sleep doesn't miss the cancellation
        if (isCancelled) {
          return;
        }

        useAnimationStore.setState({ currentStep: j });
      }
    }
  }

  //timer derived from insertion sort steps
  runInsertionSort();

  return () => {
    isCancelled = true; //for canceling duplicated timer logic in dev useEffect (mounts twice)
  };
};

export default mainTimerLogic;

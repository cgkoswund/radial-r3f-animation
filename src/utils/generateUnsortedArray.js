const generateUnsortedArray = (n) => {
  const sortedArray = Array.from({ length: n + 1 }, (_, i) => i);

  let unsortedArray = [...sortedArray];
  for (let i = unsortedArray.length - 1; i > 0; i--) {
    //generate random integer and use as index
    const j = Math.floor(Math.random() * (i + 1));
    //swap elements at indices i and j.
    // "Fisher-Yates shuffle" (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    [unsortedArray[i], unsortedArray[j]] = [unsortedArray[j], unsortedArray[i]];
  }
  return unsortedArray;
};

export default generateUnsortedArray;

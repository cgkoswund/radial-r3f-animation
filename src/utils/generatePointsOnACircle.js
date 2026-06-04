// Generate the circle points once. Close the loop by repeating the first point.
const generatePointsOnACircle = (radius, segments) => {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
  }
  return pts;
};

export default generatePointsOnACircle;

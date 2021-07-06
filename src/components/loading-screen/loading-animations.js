// animation files are named like this -> [1,n].json
const animFiles = [1, 32];

const colors = [
  [255, 203, 0],
  [255, 235, 129],
  [215, 116, 251],
  [255, 254, 202],
  [254, 255, 213],
  [255, 243, 244],
  [0, 183, 255],
  [104, 75, 75],
  [255, 201, 254],
  [161, 84, 255],
  [255, 217, 69],
  [0, 207, 255],
  [154, 166, 140],
  [255, 239, 153],
  [255, 233, 166],
  [255, 241, 166],
  [255, 59, 160],
  [255, 255, 255],
  [255, 250, 213],
  [202, 255, 55],
  [249, 242, 232],
  [0, 231, 255],
  [255, 239, 0],
  [255, 253, 227],
  [39, 184, 255],
  [228, 255, 39],
  [253, 187, 255],
  [255, 73, 150],
  [255, 232, 161],
  [253, 139, 94],
  [94, 104, 253],
  [255, 74, 133]
];

export function getRandomAnimation () {
  const min = animFiles[0];
  const max = animFiles[1];

  // which is also its color index + 1 on colors arrays
  const fileName = Math.floor(min + (max - min + 1) * Math.random());

  return {
    fileName,
    color: colors[fileName - 1]
  };
}

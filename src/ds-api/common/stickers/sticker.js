export function formatSticker (sticker, index) {
  // todo: some stickers don't have colors, check backend.
  const colors = sticker.colors ? sticker.colors : [[255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255]];

  return {
    index: index,
    uniqueId: sticker.uniqueId,

    thumbFile: {
      mainColor: `rgb(${colors[0].join(',')})`,
      ...sticker.thumbFile
    },

    animation: {
      loaded: false,
      json: null
    },

    ...sticker
  };
}

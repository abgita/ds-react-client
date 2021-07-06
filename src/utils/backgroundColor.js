import { getCssLinearGradient } from '../colors';

export const defaultColor = [238, 238, 238];

function changeBackground (sticker, style = document.body.style) {
  const colorIndex = 0;
  let stickerColor;

  if (!sticker?.colors[colorIndex] || sticker.colors[colorIndex].length !== 3) {
    stickerColor = defaultColor;
  } else {
    stickerColor = sticker.colors[0];
  }

  style.backgroundImage = getCssLinearGradient(stickerColor);
}

export { changeBackground };

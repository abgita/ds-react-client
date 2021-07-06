import { changeBackground, defaultColor } from './backgroundColor';
import { getCssLinearGradient } from '../colors';

const validValue = { colors: [[0, 0, 0]] };
const style = { backgroundImage: 'none' };

beforeEach(() => {
  style.backgroundImage = 'none';
});

test('I return nothing!', () => {
  expect(changeBackground()).toBeUndefined();
});

test('valid input', () => {
  changeBackground(validValue, style);
  expect(style.backgroundImage).toBe(getCssLinearGradient(validValue.colors[0]));
});

test('incomplete input', () => {
  changeBackground(null, style);
  expect(style.backgroundImage).toBe(getCssLinearGradient(defaultColor));
});

test('wrong input', () => {
  changeBackground({ colors: [0] }, style);
  expect(style.backgroundImage).toBe(getCssLinearGradient(defaultColor));
});

test('no style', () => {
  changeBackground();
  expect(style.backgroundImage).toBe('none');
});

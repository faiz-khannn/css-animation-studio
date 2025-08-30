
import type { AnimationState, StyleState } from '../types';

export const generateCssFromState = (
  styles: StyleState,
  animation: AnimationState,
  keyframes: string
): { css: string; keyframes: string } => {
  
  const transformParts = [
    styles.transform.translateX !== 0 ? `translateX(${styles.transform.translateX}px)` : '',
    styles.transform.translateY !== 0 ? `translateY(${styles.transform.translateY}px)` : '',
    styles.transform.scale !== 1 ? `scale(${styles.transform.scale})` : '',
    styles.transform.rotate !== 0 ? `rotate(${styles.transform.rotate}deg)` : '',
    styles.transform.skewX !== 0 ? `skewX(${styles.transform.skewX}deg)` : '',
    styles.transform.skewY !== 0 ? `skewY(${styles.transform.skewY}deg)` : '',
  ].filter(Boolean);
  
  const filterParts = [
    styles.filter.blur > 0 ? `blur(${styles.filter.blur}px)` : '',
    styles.filter.brightness !== 1 ? `brightness(${styles.filter.brightness})` : '',
    styles.filter.contrast !== 1 ? `contrast(${styles.filter.contrast})` : '',
    styles.filter.grayscale > 0 ? `grayscale(${styles.filter.grayscale})` : '',
    styles.filter.hueRotate > 0 ? `hue-rotate(${styles.filter.hueRotate}deg)` : '',
    styles.filter.saturate !== 1 ? `saturate(${styles.filter.saturate})` : '',
    styles.filter.sepia > 0 ? `sepia(${styles.filter.sepia})` : '',
  ].filter(Boolean);

  let css = `.animated-element {\n`;
  if (transformParts.length > 0) {
    css += `  transform: ${transformParts.join(' ')};\n`;
  }
  if (filterParts.length > 0) {
    css += `  filter: ${filterParts.join(' ')};\n`;
  }
  css += `  background-color: ${styles.other.backgroundColor};\n`;
  css += `  border-radius: ${styles.other.borderRadius}px;\n`;
  css += `  opacity: ${styles.other.opacity};\n`;

  if (animation.name && animation.name !== 'none') {
    css += `  animation-name: ${animation.name};\n`;
    css += `  animation-duration: ${animation.duration}s;\n`;
    css += `  animation-timing-function: ${animation.timingFunction};\n`;
    css += `  animation-delay: ${animation.delay}s;\n`;
    css += `  animation-iteration-count: ${animation.iterationCount};\n`;
    css += `  animation-direction: ${animation.direction};\n`;
    css += `  animation-fill-mode: ${animation.fillMode};\n`;
  }
  css += `}`;

  return { css, keyframes: animation.name && animation.name !== 'none' ? keyframes : '' };
};

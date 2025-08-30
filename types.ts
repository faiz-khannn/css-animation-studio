export interface TransformState {
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  skewX: number;
  skewY: number;
}

export interface FilterState {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  saturate: number;
  sepia: number;
}

export interface OtherStyleState {
  backgroundColor: string;
  borderRadius: number;
  opacity: number;
}

export interface StyleState {
  transform: TransformState;
  filter: FilterState;
  other: OtherStyleState;
}

export interface AnimationState {
  name: string;
  duration: number;
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end';
  delay: number;
  iterationCount: string;
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface GeminiResponse {
  styles: StyleState;
  animation: AnimationState;
  keyframes: string;
}

export interface AnimationFullState {
  styles: StyleState;
  animation: AnimationState;
  keyframes: string;
}

export interface SavedAnimation extends AnimationFullState {
  id: string;
  name: string;
}

export interface Preset {
  name: string;
  state: AnimationFullState;
}

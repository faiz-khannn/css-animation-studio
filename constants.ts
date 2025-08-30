import type { AnimationState, StyleState, Preset } from './types';

// FIX: Removed a circular self-import of DEFAULT_STYLE_STATE and DEFAULT_ANIMATION_STATE.
// These constants are defined within this file, so importing them is unnecessary and causes a conflict.

export const DEFAULT_STYLE_STATE: StyleState = {
  transform: {
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
  },
  filter: {
    blur: 0,
    brightness: 1,
    contrast: 1,
    grayscale: 0,
    hueRotate: 0,
    saturate: 1,
    sepia: 0,
  },
  other: {
    backgroundColor: '#38bdf8', // sky-500
    borderRadius: 8,
    opacity: 1,
  },
};

export const DEFAULT_ANIMATION_STATE: AnimationState = {
  name: 'spin',
  duration: 4,
  timingFunction: 'linear',
  delay: 0,
  iterationCount: 'infinite',
  direction: 'normal',
  fillMode: 'none',
};

export const TIMING_FUNCTIONS: AnimationState['timingFunction'][] = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end'
];

export const DIRECTIONS: AnimationState['direction'][] = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
];

export const FILL_MODES: AnimationState['fillMode'][] = [
  'none',
  'forwards',
  'backwards',
  'both',
];


export const PRESETS: Preset[] = [
  {
    name: 'Select a preset...',
    state: {
      styles: DEFAULT_STYLE_STATE,
      animation: DEFAULT_ANIMATION_STATE,
      keyframes: '@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}',
    },
  },
  {
    name: 'Shake',
    state: {
      styles: DEFAULT_STYLE_STATE,
      animation: {
        name: 'shake',
        duration: 0.82,
        timingFunction: 'ease-in-out',
        delay: 0,
        iterationCount: 'infinite',
        direction: 'normal',
        fillMode: 'both',
      },
      keyframes: `@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}`,
    },
  },
  {
    name: 'Pulse',
    state: {
      styles: DEFAULT_STYLE_STATE,
      animation: {
        name: 'pulse',
        duration: 2,
        timingFunction: 'ease-in-out',
        delay: 0,
        iterationCount: 'infinite',
        direction: 'normal',
        fillMode: 'both',
      },
      keyframes: `@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}`,
    },
  },
    {
    name: 'Bounce',
    state: {
      styles: DEFAULT_STYLE_STATE,
      animation: {
        name: 'bounce',
        duration: 1,
        timingFunction: 'ease-in-out',
        delay: 0,
        iterationCount: 'infinite',
        direction: 'normal',
        fillMode: 'both',
      },
      keyframes: `@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}`,
    },
  },
];
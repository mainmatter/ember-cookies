import { importSync } from '@embroider/macros';

let assign;

try {
  assign = importSync('@ember/polyfills').assign;
} catch (error) {
  // Couldn't import @ember/polyfills, doesn't exist in v5.
  // This is needed for Ember v5 support where the polyfill is already removed.
}

export default Object.assign || assign;

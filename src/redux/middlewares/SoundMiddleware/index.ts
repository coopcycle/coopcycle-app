import Sound from 'react-native-sound';
import { startSound, stopSound } from '../../App/actions';

// Make sure sound will play even when device is in silent mode
Sound.setCategory('Playback');

export default ({ getState, dispatch }) => {
  let isSoundReady = false;
  let isSoundPlaying = false;
  const bell = new Sound(
    'misstickle__indian_bell_chime.wav',
    Sound.MAIN_BUNDLE,
    error => {
      if (error) {
        return;
      }

      bell.setNumberOfLoops(-1);
      isSoundReady = true;
    },
  );

  return next => action => {
    const result = next(action);

    if (action.type === startSound.type) {
      if (isSoundReady && !isSoundPlaying) {
        isSoundPlaying = true;
        bell.play(success => {
          if (!success) {
            bell.reset();
          }
        });
      }

      return result;
    }

    if (action.type === stopSound.type) {
      if (isSoundPlaying) {
        bell.stop(() => {});
        isSoundPlaying = false;
      }

      return result;
    }

    return result;
  };
};

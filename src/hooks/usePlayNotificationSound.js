import { useCallback, useEffect, useState } from 'react';
import Sound from 'react-native-sound';

// Make sure sound will play even when device is in silent mode
Sound.setCategory('Playback');

export default function usePlayNotificationSound(notifications) {
  const [sound, setSound] = useState(null);
  const [isSoundReady, setIsSoundReady] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  // load sound
  useEffect(() => {
    const bell = new Sound(
      'misstickle__indian_bell_chime.wav',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          return;
        }

        bell.setNumberOfLoops(-1);

        setSound(bell);
        setIsSoundReady(true);
      },
    );
  }, []);

  const startSound = useCallback(() => {
    if (isSoundReady && !isSoundPlaying) {
      sound.play(success => {
        if (!success) {
          sound.reset();
        }
      });

      setIsSoundPlaying(true);
    }
  }, [isSoundReady, isSoundPlaying, sound]);

  const stopSound = useCallback(() => {
    if (isSoundReady && isSoundPlaying) {
      sound.stop(() => {});
      setIsSoundPlaying(false);
    }
  }, [isSoundPlaying, isSoundReady, sound]);

  useEffect(() => {
    if (notifications.length > 0) {
      startSound();
    } else {
      stopSound();
    }
  }, [notifications, startSound, stopSound]);

  return { isSoundPlaying, stopSound };
}

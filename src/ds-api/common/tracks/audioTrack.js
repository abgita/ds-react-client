export function mute (track, mute) {
  if (!track.audio || !track.isPlayable) return;

  track.audio.volume = mute ? 0 : 1;
}

export function play (track, loop = true, volume = 1) {
  if (track.playing) return;

  if (!track.audio && track.isPlayable) {
    const audio = new Audio(track.previewURL);

    audio.loop = loop;
    audio.volume = volume;

    track.audio = audio;

    track.stopAudio = () => {
      audio.removeEventListener('ended', track.stopAudio);
      audio.removeEventListener('pause', track.stopAudio);

      audio.pause();
      audio.remove();

      track.audio = null;
      track.playing = false;

      delete track.stopAudio;
    };

    const onPlay = () => {
      audio.addEventListener('ended', track.stopAudio);
      audio.addEventListener('pause', track.stopAudio);

      track.playing = true;
    };

    const onError = () => {
      track.playing = false;
      track.audio = null;
    };

    const onPlayEventListener = () => {
      audio.removeEventListener('onplay', onPlayEventListener);

      onPlay();
    };

    audio.addEventListener('onplay', onPlayEventListener);

    // see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#return_value
    try {
      audio.play()?.then(onPlay).catch(onError);
    } catch (ignored) {
      onError();
    }
  }
}

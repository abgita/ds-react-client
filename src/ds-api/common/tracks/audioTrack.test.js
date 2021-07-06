/* eslint-disable jest/no-done-callback */
import { play, mute } from './audioTrack';

function setupAudio (failsOnPlay = false, hasPromises = true) {
  const EVENT_NAME = {
    ON_PLAY: 'onplay',
    ON_ENDED: 'ended',
    ON_PAUSE: 'pause'
  };

  const listeners = {
    onplay: [],
    ended: [],
    pause: []
  };

  function fireEvent (eventName) {
    return () => {
      listeners[eventName].forEach(callback => {
        // when a listener is removed.
        if (typeof callback !== 'function') return;

        callback();
      });
    };
  }

  HTMLMediaElement.prototype.addEventListener = (eventName, callback) => {
    if (!listeners[eventName]) throw Error('invalid event name');

    listeners[eventName].push(callback);
  };

  HTMLMediaElement.prototype.removeEventListener = (eventName, callback) => {
    if (!listeners[eventName]) throw Error('invalid event name');

    const index = listeners[eventName].indexOf(callback);

    if (index >= 0) listeners[eventName][index] = null;
  };

  HTMLMediaElement.prototype.play = () => {
    if (failsOnPlay) {
      const error = Error('cannot play media');

      if (!hasPromises) {
        throw error;
      } else {
        return Promise.reject(error);
      }
    }

    fireEvent(EVENT_NAME.ON_PLAY)();

    setTimeout(fireEvent(EVENT_NAME.ON_ENDED), 1000);

    if (hasPromises) return Promise.resolve();
  };

  HTMLMediaElement.prototype.pause = fireEvent(EVENT_NAME.ON_PAUSE);
}

const trackMock = {
  audio: null,
  playing: false,
  isPlayable: true,
  previewURL: 'fake.mp3'
};

let track;

beforeEach(() => {
  track = { ...trackMock };
});

it('starts playing', done => {
  setupAudio();

  play(track);

  setTimeout(() => {
    expect(track.playing).toBe(true);
    expect(track.audio).toBeDefined();

    done();
  }, 100); // wait for the promise on #play to complete
});

it('stops playing', done => {
  setupAudio();

  play(track);

  setTimeout(() => {
    expect(track.playing).toBe(true);
    expect(track.audio).toBeDefined();

    track.stopAudio();

    expect(track.playing).toBe(false);
    expect(track.audio).toBe(null);

    done();
  }, 100); // wait for the promise on #play to complete
});

it('fails to play', done => {
  setupAudio(true);

  play(track);

  setTimeout(() => {
    expect(track.playing).toBe(false);
    expect(track.audio).toBe(null);

    done();
  }, 100); // wait for the promise on #play to complete
});

it('plays without promises', () => {
  setupAudio(false, false);

  play(track);

  expect(track.playing).toBe(true);
  expect(track.audio).toBeDefined();
});

it('fails without promises', () => {
  setupAudio(true, false);

  play(track);

  expect(track.playing).toBe(false);
  expect(track.audio).toBe(null);
});

test('toggle track playback', () => {
  const track = {
    audio: {
      volume: 1
    },
    isPlayable: true
  };

  mute(track, true);

  expect(track.audio.volume).toBe(0);

  mute(track, false);

  expect(track.audio.volume).toBe(1);
});

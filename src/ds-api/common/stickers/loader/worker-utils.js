export class WorkerListener {
    #callback;
    #runOnce = true;

    constructor ({ callback, runOnce }) {
      this.#callback = callback;
      this.#runOnce = runOnce;
    }

    shouldRunOnce () {
      return this.#runOnce;
    }

    getCallback () {
      return this.#callback;
    }
}

export class WorkerChannel {
    #activeListeners;
    #oldListeners;

    #active = true;

    constructor () {
      this.#activeListeners = new Map();
      this.#oldListeners = new Map();
    }

    close () {
      this.#activeListeners.clear();
      this.#oldListeners.clear();

      this.#active = false;
    }

    /**
     * Listen to event 'eventId' in this channel.
     *
     * @param eventId string
     * @param listener WorkerListener
     */
    listen (eventId, listener) {
      if (!this.#active) return;

      WorkerChannel.#push(this.#activeListeners, eventId, listener);
    }

    /**
     * Stop 'listener' from listening to 'eventId' in this channel.
     *
     * @param eventId string
     * @param listener WorkerListener
     */
    stopListen (eventId, listener) {
      if (!this.#active) return;

      WorkerChannel.#push(this.#oldListeners, eventId, listener);
    }

    /**
     * Emit 'eventId' event's content to its listeners in this channel.
     *
     * @param eventId string
     * @param content any
     */
    emit (eventId, content) {
      if (!this.#active) return;

      const eventListeners = this.#activeListeners.get(eventId);

      if (!eventListeners || eventListeners.length === 0) return;

      for (const listener of eventListeners) {
        if (listener.shouldRunOnce()) {
          this.stopListen(eventId, listener);
        }

        listener.getCallback()(content);
      }

      const noMoreListeners = this.#cleanup(eventId, eventListeners);

      if (noMoreListeners) this.#activeListeners.delete(eventId);
    }

    /**
     * Remove old listeners of 'eventId' from 'activeListeners".
     *
     * @param eventId string
     * @param activeListeners Array
     * @returns {boolean} whether 'activeListeners' is empty or not.
     */
    #cleanup (eventId, activeListeners) {
      const canceledListeners = this.#oldListeners.get(eventId);

      if (!canceledListeners) return true;

      let isEmpty = false;

      for (let i = 0, l = canceledListeners.length, listener; i < l; i++) {
        listener = canceledListeners[i];

        const listenerIndex = activeListeners.indexOf(listener);

        if (listenerIndex < 0) continue;

        activeListeners.splice(listenerIndex, 1);

        if (activeListeners.length === 0) {
          isEmpty = true;

          break;
        }
      }

      return isEmpty;
    }

    /**
     * Appends 'value' into array from map[key].<br/>
     * If map[key] is undefined, create it.
     *
     * @param map Map<string, Array>
     * @param key any
     * @param value any
     */
    static #push (map, key, value) {
      let array = map.get(key);

      if (!array) {
        array = [];

        map.set(key, array);
      }

      array.push(value);
    }
}

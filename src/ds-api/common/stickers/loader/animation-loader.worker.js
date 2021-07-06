/* eslint-env worker */

import pako from 'pako';

const route = 'sticker/animation/';

self.addEventListener('message', async event => {
  // expected event data -> { id: String, fileId: String }
  const anim = event.data;

  const url = event.data.url + route + anim.fileId;

  fetch(url, { method: 'GET' }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    return response.arrayBuffer();
  }).then(buffer => {
    const data = pako.inflate(buffer, { to: 'string' });

    self.postMessage({ id: anim.id, content: JSON.parse(data) });
  }).catch(err => {
    console.error(err);

    self.postMessage({ id: anim.id, content: { error: 'Cannot load animation!' } });
  });
});

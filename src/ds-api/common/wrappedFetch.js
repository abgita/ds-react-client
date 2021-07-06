const METHODS = {
  GET: 'GET',
  POST: 'POST'
};

async function wrappedFetch (url, requestInit, method, parser = 'json') {
  if (!method) throw new Error("No 'method' specified.");

  const response = await fetch(url, {
    ...requestInit,
    method: method
  });

  if (!response.ok) {
    throw response.status;
  }

  try {
    switch (parser) {
      case 'text':
        return await response.text();
      case 'buffer':
        return await response.arrayBuffer();
      case 'blob':
        return await response.blob();
      case 'formData':
        return await response.formData();
      case 'json':
      default:
        return await response.json();
    }
  } catch (error) {
    throw new Error(error);
  }
}

export function post (url, requestInit, parser) {
  return wrappedFetch(url, requestInit, METHODS.POST, parser);
}

export function get (url, requestInit, parser) {
  return wrappedFetch(url, requestInit, METHODS.GET, parser);
}

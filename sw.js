'use strict'

onfetch = function (event) {

  event.respondWith(
    caches.match(event.request)
      .then((response) => {

        // Cache hit - return response
        if (response) {
          console.log('CACHE', event.request.url)
          return response
        }

        console.log('NETWORK', event.request.url)
        return fetch(event.request)
      })
      .catch((e) => console.error(e)))
}

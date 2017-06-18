'use strict';

self.addEventListener('fetch', function (event) {
    if (event.request.method === 'GET') {
        caches.open('LE_CACHE').then(function (cache) {

            debugger;

            return cache.match(event.request)
                .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        console.log('CACHE', event.request.url);
                        return response
                    }

                    console.log('NETWORK', event.request.url);
                    return fetch(event.request)
                })
                .catch((e) => console.error(e));

        });
    }
});

// onfetch = function (event) {
//
//     event.respondWith(caches.match(event.request)
//         .then((response) => {
//
//             // Cache hit - return response
//             if (response) {
//                 console.log('CACHE', event.request.url);
//                 return response
//             }
//
//             console.log('NETWORK', event.request.url);
//             return fetch(event.request)
//         })
//         .catch((e) => console.error(e)))
// };

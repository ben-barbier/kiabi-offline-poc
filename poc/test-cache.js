'use strict'

const reader = new FileReader()
let theFile

// const nf = new Intl.NumberFormat()

// caches.open('CACHE_TEST')
//   .then((cache) => {
//
//     cache.keys().then((keys) => {
//
//       Promise.all(keys.map((k) => {
//         return cache.match(k).then(function (resp) {
//           if (resp) {
//             return resp.blob()
//           }
//         })
//       }))
//         .then((blobs) => {
//
//           const totalSize = blobs
//             .map((blob) => {
//               return blob.size
//             })
//             .reduce((a, b) => a + b, 0)
//
//           details.innerHTML = `total count: ${keys.length}
// total size: ${nf.format(totalSize)}`
//         })
//     })
//   })
//   .catch((e) => console.error(e))

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    if (granted)
      console.log('Storage will not be cleared except by explicit user action')
    else
      console.log('Storage may be cleared by the UA under storage pressure.')
  })
}

if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(({ quota, usage }) => {
    details.innerHTML = `quota:${quota / (1024 ** 3)} usage: ${usage / (1024 ** 3)} diff:${(quota - usage) / (1024 ** 3)}`
  })
}

imageInput.onchange = function (e) {

  console.log(e.target.files)
  reader.readAsArrayBuffer(e.target.files[0])
  reader.onload = function (e) {
    theFile = e.target.result
  }
}

uploadMany.onclick = function () {
  for (let i = 0; i < howMany.value; i++) {
    console.log('save in cache', i)
    putInCache(theFile)
  }
}

function putInCache(body) {

  caches.open('CACHE_TEST')
    .then((cache) => {

      const request = new Request(`image-${new Date().getTime()}.jpg`)
      const response = new Response(body, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })

      cache.put(request, response)
    })
    .catch((e) => console.error(e))
}

const storeFoo = localforage.createInstance({ name: 'foo' })
const storeBar = localforage.createInstance({ name: 'bar' })

storeFoo.setItem('foo', { foo: 42 })
storeBar.setItem('bar', { foo: 42 })

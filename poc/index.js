'use strict'

navigator.serviceWorker.register('sw.js')
  .then((reg) => {
    console.log(reg)
  })
  .catch((e) => console.error(e))

const reader = new FileReader()

imageInput.onchange = function (e) {

  console.log(e.target.files)
  reader.readAsArrayBuffer(e.target.files[0])
  reader.onload = function (e) {
    const arrayBuffer = e.target.result
    putInCache(`image-${new Date().getTime()}.jpg`, arrayBuffer)
  }
}

caches.open('LE_CACHE')
  .then((cache) => {
    return cache.keys()
  })
  .then((keys) => {
    console.log(keys)
    keys.forEach(({ url }) => {
      allImages.innerHTML += `<img src="${url}" alt="" height="100px" width="200px">`
    })
  })
  .catch((e) => console.error(e))

// fetch('image.jpg')
//   .then((response) => {
//     return response.arrayBuffer()
//   })
//   .then((ab) => {
//     putInCache('/image.jpg', ab)
//   })
//   .catch((e) => console.error(e))
//
function putInCache(url, body) {

  caches.open('LE_CACHE')
    .then((cache) => {

      const request = new Request(url)
      const response = new Response(body, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })

      cache.put(request, response)
    })
    .catch((e) => console.error(e))
}

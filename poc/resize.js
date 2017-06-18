'use strict'

const reader = new FileReader()

imageInput.onchange = function (e) {

  let blob = e.target.files[0]
  createImageBitmap(blob)
    .then((imageBitmap) => {

      if (imageBitmap.width <= 1024 && imageBitmap.height <= 1024) {
        destImage.src = URL.createObjectURL(blob)
        return
      }

      const ratio = imageBitmap.height / imageBitmap.width

      const offScreenCanvas = document.createElement('canvas')
      const ctx = offScreenCanvas.getContext('2d')

      // landscape
      if (imageBitmap.width > imageBitmap.height) {
        offScreenCanvas.width = 1024
        offScreenCanvas.height = 1024 * ratio
      }
      // portrait
      else {
        offScreenCanvas.width = 1024 / ratio
        offScreenCanvas.height = 1024
      }

      ctx.drawImage(imageBitmap, 0, 0, offScreenCanvas.width, offScreenCanvas.height)

      offScreenCanvas.toBlob((bb) => {

        // foo.jpg
        reader.readAsArrayBuffer(bb)
        reader.onload = function (e) {
          const arrayBuffer = e.target.result
          putInCache(`foo.jpg`, arrayBuffer)
        }

      }, 'image/jpeg')
    })
    .catch((e) => console.error(e))
}

function putInCache(url, body) {

  caches.open('LE_CACHE')
    .then((cache) => {

      const request = new Request(url)
      const response = new Response(body, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      })

      console.log('SAVED')

      cache.put(request, response)
    })
    .catch((e) => console.error(e))
}

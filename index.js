'use strict';

const maxWidth = 256;
const maxHeight = 256;

navigator.serviceWorker && navigator.serviceWorker.register('sw.js').then(() => {
    displayCachedImages();
});

document.getElementById('image-input').onchange = (input) => {

    let current_file = input.target.files[0];
    if (current_file.type.indexOf('image') === 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
            let image = new Image();
            image.src = event.target.result;
            image.onload = function () {
                let resizedDimentions = getResizedDimentions(image, maxWidth, maxHeight);
                const resizedImageCanvas = getResizedImageCanvas(this, resizedDimentions);
                document.getElementById('images').innerHTML += `<img src="${resizedImageCanvas.toDataURL(current_file.type)}" alt="">`;
                putCanvasInCache(`image-${new Date().getTime()}.jpg`, resizedImageCanvas);
            }
        };
        reader.readAsDataURL(current_file);
    }

};

function getResizedImageCanvas(image, dimentions) {
    const resizedImageCanvas = document.createElement('canvas');
    resizedImageCanvas.width = dimentions.width;
    resizedImageCanvas.height = dimentions.height;
    resizedImageCanvas.getContext('2d').drawImage(image, 0, 0, dimentions.width, dimentions.height);
    return resizedImageCanvas;
}

function getResizedDimentions(image, maxWidth, maxHeight) {
    let resizedDimentions = {
        width: image.width,
        height: image.height
    };
    if (image.width >= image.height) {
        if (image.width > maxWidth) {
            resizedDimentions.height *= maxWidth / image.width;
            resizedDimentions.width = maxWidth;
        }
    } else {
        if (image.height > maxHeight) {
            resizedDimentions.width *= maxHeight / image.height;
            resizedDimentions.height = maxHeight;
        }
    }
    return resizedDimentions;
}

function putCanvasInCache(url, canvas) {
    canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            putInCache(url, arrayBuffer);
        };
        reader.readAsArrayBuffer(blob);
    }, 'image/jpeg');
}

function putInCache(url, body) {
    return caches.open('LE_CACHE')
        .then((cache) => {
            const request = new Request(url);
            const response = new Response(body, {
                headers: {
                    'Content-Type': 'image/jpeg',
                },
            });
            return cache.put(request, response);
        });
}

function displayCachedImages() {
    caches.open('LE_CACHE')
        .then((cache) => cache.keys())
        .then((keys) => {
            const imagesDomTag = document.getElementById('images');
            keys.forEach(({url}) => {
                imagesDomTag.innerHTML += `<img src="${url}" alt="">`
            })
        });
}
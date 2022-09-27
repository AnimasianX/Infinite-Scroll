const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];


// Unsplash API
let initialPhotoCount = 5;
let isInitialLoad = true;
const apiKey = <Your API key here>;
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialPhotoCount}`;

//Function to determine if it is initial load, if not, it should be updated with a greater value
function updateApiWithNewValue(newCount) {
    apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}`;
}

//Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}
// helper function
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

// create elements for links and photos
function displayPhotos() {
    totalImages = photosArray.length;
    //run function for each object in the array
    photosArray.forEach((photo) => {
        //create <a> to link to unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // item.setAttribute('href', photo.links.html);
        // item.setAttribute('target', '_blank');
        //create image or photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.description,
            title: photo.description,
        });
        //Event Listener, check when each photo is finished loading
        img.addEventListener('load', imageLoaded);
        // img.setAttribute('src', photo.urls.regular);
        // img.setAttribute('alt', photo.description);
        // img.setAttribute('title', photo.description);
        //put image inside anchor element, then put both inside our image container
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}
// Get Photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiURL);
        photosArray = await response.json();
        displayPhotos();
        if (isInitialLoad) {
            updateApiWithNewValue(30);
            isInitialLoad = false;
        }
    } catch (error) {
        //catch error here
    }
}

//check to see if scrolled to bottom of page, so that we can load more images
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        imagesLoaded = 0;
        getPhotos();
    }
})

//on load
getPhotos();

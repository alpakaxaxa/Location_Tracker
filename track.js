window.addEventListener("load", initWatchLocation)

function initWatchLocation() {
    const APIRootURL = "http://localhost:1337";
    const URL = "http://localhost:1337/distinctive-places";
    
    const locationMargin = 0.03;
    let audioTrack;
    let distinctivePlaces;
    let oldTargetArea;
    fetchDistinctivePlaces(URL)
    .then((data) => {
        distinctivePlaces = data;
    })
    const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
    }

    id = navigator.geolocation.watchPosition(success, error, options);

    function success(pos) {
        let crd = pos.coords;
        targetArea = targetAreaCheck(distinctivePlaces, crd, locationMargin);
        if (targetArea != null && targetArea != oldTargetArea) {
            populateDistinctivePlace(targetArea)
        } else {
            console.log('Continue waiting')
        }
    }

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    function showPosition(coords, targetEl) {
        targetEl.innerHTML = "Longitude: " + coords.longitude + " Latitude: " + coords.latitude;
    }

    function targetAreaCheck(crdTargets, crd, crdMargin) {
        let target;
        try {
            crdTargets.forEach(crdTarget => {
                if (crdTarget.Latitude - crdMargin <= crd.latitude && crdTarget.Latitude + crdMargin >= crd.latitude &&
                    crdTarget.Longitude - crdMargin <= crd.longitude && crdTarget.Longitude + crdMargin >= crd.longitude) {
                    target = crdTarget
                }
            })
        } finally {
            return target
        }
    }

    async function fetchDistinctivePlaces(URL) {
        let response = await fetch(URL);
        let data = await response.json();
        return await data
    }

    function populateDistinctivePlace(distinctivePlace) {
        let title = document.getElementById("title");
        let description = document.getElementById("description");
        let audio = document.getElementById("audio");
        //let audio = new Audio(APIRootURL + distinctivePlace.AudioInformation.url)
        audio.src = APIRootURL + distinctivePlace.AudioInformation.url;
        title.innerHTML = distinctivePlace.Name;
        description.innerHTML = distinctivePlace.Description;
        oldTargetArea = distinctivePlace;
    }
}
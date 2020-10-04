window.addEventListener("load", initWatchLocation)

function initWatchLocation() {
    const URL = "http://localhost:1337/distinctive-places";
    const locationMargin = 0.03;
    let audioTrack;
    let distinctivePlaces = [];

    (async () => {
        await fetchDistinctivePlaces(URL, distinctivePlaces)
    })()

    const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
    }

    id = navigator.geolocation.watchPosition(success, error, options);

    function success(pos) {
        let crd = pos.coords;
        let targetEL = document.getElementById("location");
        showPosition(crd, targetEL);
        console.log(distinctivePlaces);
        targetArea = targetAreaCheck(distinctivePlaces[0], crd, locationMargin);
        if (targetArea != null) {
            console.log('Congratulations, you reached the target');
        } else {
            console.log('Did not find target')
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
        crdTargets.forEach(crdTarget => {
            if (crdTarget.Latitude - crdMargin <= crd.latitude && crdTarget.Latitude + crdMargin >= crd.latitude &&
                crdTarget.Longitude - crdMargin <= crd.longitude && crdTarget.Longitude + crdMargin >= crd.longitude) {
                target = crdTarget
            }
        })
        return target
    }

    async function fetchDistinctivePlaces(URL, fetchTarget) {
        let response = await fetch(URL);
        let data = await response.json();
        fetchTarget.push(data);
        return
    }

}
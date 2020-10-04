window.addEventListener("load", initWatchLocation)
let play = document.getElementById("play");
let pause = document.getElementById("pause");
let mute = document.getElementById("mute");
let progress = document.getElementById("progress");

play.addEventListener("click", playAudio);
pause.addEventListener("click", pauseAudio);
mute.addEventListener("click", muteAudio);
progress.addEventListener("click", seek);

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
        audio.src = APIRootURL + distinctivePlace.AudioInformation.url;
        title.innerHTML = distinctivePlace.Name;
        description.innerHTML = distinctivePlace.Description;
        oldTargetArea = distinctivePlace;
    }
}

function playAudio() {
    let audio = document.getElementById("audio");
    audio.play();
    setInterval(function () {
        updateSongProgress();
    }, 1000);
}

function pauseAudio() {
    let audio = document.getElementById("audio");
    audio.pause();
}

function muteAudio() {
    let audio = document.getElementById("audio");
    audio.muted = !audio.muted;
}

function updateSongProgress() {
    let audio = document.getElementById("audio");
    let progress = document.getElementById("progress");
    progress.value = Math.round(audio.currentTime / audio.duration * 100);
}

function seek(e) {
    let audio = document.getElementById("audio");
    let progress = document.getElementById("progress");
    let percent = e.offsetX / this.offsetWidth;
    audio.currentTime = percent * audio.duration;
    progress.value = percent / 100;
}
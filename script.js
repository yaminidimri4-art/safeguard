/* USER ID */

function saveUserId() {

    const id = document.getElementById("userId").value.trim();

    if (id === "") {
        alert("Please enter User ID");
        return;
    }

    localStorage.setItem("safeGuardUserId", id);

    alert("User ID saved successfully!");
}


/* LOAD DATA */

window.onload = function () {

    const savedId =
        localStorage.getItem("safeGuardUserId");

    if (savedId) {
        document.getElementById("userId").value = savedId;
    }

    displayContacts();
};


/* SOS */

let sosRunning = false;

function startSOS() {

    if (sosRunning) return;

    sosRunning = true;

    const button =
        document.getElementById("sosButton");

    const text =
        document.getElementById("sosText");

    const sub =
        document.getElementById("sosSubText");

    let count = 3;

    button.classList.add("countdown");

    text.innerText = count;
    sub.innerText = "Get ready...";


    const timer = setInterval(function () {

        count--;

        if (count > 0) {

            text.innerText = count;

        } else {

            clearInterval(timer);

            text.innerText = "SOS";
            sub.innerText = "Emergency Alert";

            button.classList.remove("countdown");

            emergencyAlert();

            sosRunning = false;
        }

    }, 1000);
}


/* SOS ALERT */

function emergencyAlert() {

    const contacts =
        JSON.parse(
            localStorage.getItem("safeGuardContacts")
        ) || [];

    let message =
        "SOS Emergency Alert activated!";

    if (contacts.length > 0) {

        message +=
            "\nSaved contact: " +
            contacts[0].name +
            " - " +
            contacts[0].number;
    }

    alert(message);

    if (navigator.vibrate) {

        navigator.vibrate([
            300,
            150,
            300,
            150,
            500
        ]);
    }

    playBeep();
}


/* BEEP */

function playBeep() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const audio =
            new AudioContext();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();

        oscillator.type = "square";

        oscillator.frequency.value = 850;

        gain.gain.value = 0.08;

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.7
        );

    } catch (error) {

        console.log("Audio unavailable");
    }
}


/* SAVE CONTACT */

function saveContact() {

    const name =
        document.getElementById("contactName")
            .value.trim();

    const number =
        document.getElementById("contactNumber")
            .value.trim();


    if (name === "" || number === "") {

        alert("Please enter contact name and number");

        return;
    }


    let contacts =
        JSON.parse(
            localStorage.getItem("safeGuardContacts")
        ) || [];


    contacts.push({
        name: name,
        number: number
    });


    localStorage.setItem(
        "safeGuardContacts",
        JSON.stringify(contacts)
    );


    document.getElementById("contactName").value = "";

    document.getElementById("contactNumber").value = "";


    displayContacts();

    alert("Contact saved successfully!");
}


/* SHOW CONTACTS */

function displayContacts() {

    const list =
        document.getElementById("contactList");

    const contacts =
        JSON.parse(
            localStorage.getItem("safeGuardContacts")
        ) || [];


    list.innerHTML = "";


    contacts.forEach(function (contact, index) {

        const div =
            document.createElement("div");

        div.className = "saved-contact";


        div.innerHTML = `
            <span>
                👤 <strong>${contact.name}</strong>
                &nbsp; ${contact.number}
            </span>

            <button
                class="delete"
                onclick="deleteContact(${index})">
                Delete
            </button>
        `;


        list.appendChild(div);
    });
}


/* DELETE CONTACT */

function deleteContact(index) {

    let contacts =
        JSON.parse(
            localStorage.getItem("safeGuardContacts")
        ) || [];


    contacts.splice(index, 1);


    localStorage.setItem(
        "safeGuardContacts",
        JSON.stringify(contacts)
    );


    displayContacts();
}


/* LOCATION */

function getLocation() {

    const result =
        document.getElementById("locationResult");


    if (!navigator.geolocation) {

        result.innerText =
            "Location is not supported by this browser.";

        return;
    }


    result.innerText =
        "Detecting your location...";


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;


            result.innerHTML = `
                📍 Location detected successfully.<br>
                Latitude:
                <strong>${lat.toFixed(5)}</strong>
                &nbsp;&nbsp;
                Longitude:
                <strong>${lon.toFixed(5)}</strong>
            `;
        },

        function () {

            result.innerText =
                "Please allow location permission.";

        }
    );
}
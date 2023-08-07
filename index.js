import { Telegram } from 'https://telegram.org/js/telegram-web-app.js';
var startlocations = []
var endlocations = []
var vehtypes = []
var trailertype = ''
var vehstatus = ''
var vehmin = 1
var vehmax = 10
var deliverydate = ''
var readytoshipwithin = ''
var minpayment = 0
var minpaymentpermile = 0

  let tg = new Telegram();
    tg.expand();
    tg.MainButton.setText("DONE"); //изменяем текст кнопки иначе
    tg.MainButton.textColor = "#00B67B"; //изменяем цвет текста кнопки
    tg.MainButton.color = "#212426"; //изменяем цвет бэкграунда кнопки
    tg.MainButton.show()
    Telegram.WebApp.onEvent('mainButtonClicked', function () {
        tg.sendData(startlocations);
        //при клике на основную кнопку отправляем данные в строковом виде
    });
function getDataFromCSVFile(csvFile, callback) {
    $.ajax({
        url: csvFile,
        dataType: 'text',
        success: function (csvData) {
            var data = [];
            var lines = csvData.split(/\r\n|\n/);
            var headers = lines[0].replace(/"/g, '').split(',');
            var cityIndex = headers.indexOf('city');
            var stateIndex = headers.indexOf('state_id');
            var latIndex = headers.indexOf('lat');
            var lngIndex = headers.indexOf('lng');

            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentLine = lines[i].replace(/"/g, '').split(',');
                obj['city'] = currentLine[cityIndex];
                obj['state_id'] = currentLine[stateIndex];
                obj['lat'] = parseFloat(currentLine[latIndex]);
                obj['lng'] = parseFloat(currentLine[lngIndex]);
                data.push(obj);
            }
            callback(data);
        }
    });
}

function toggleTextInputend() {
    var checkbox = document.querySelector('.endcheck');
    var textInput = document.getElementById('end-location-input-state');
    var cityinput = document.getElementById('end-location-input');
    var radiusinput = document.getElementById('end-location-radius')

    if (checkbox.checked) {
        textInput.style.display = 'block';
        radiusinput.style.display = 'none'
        cityinput.style.display = 'none'
    } else {
        radiusinput.style.display = 'block'
        cityinput.style.display = 'block'
        textInput.style.display = 'none';
    }
}
function toggleTextInputstart() {
    var checkbox = document.querySelector('.startcheck');
    var textInput = document.getElementById('start-location-input-state');
    var cityinput = document.getElementById('start-location-input');
    var radiusinput = document.getElementById('start-location-radius')

    if (checkbox.checked) {
        textInput.style.display = 'block';
        radiusinput.style.display = 'none'
        cityinput.style.display = 'none'
    } else {
        radiusinput.style.display = 'block'
        cityinput.style.display = 'block'
        textInput.style.display = 'none';
    }
}

function getLatLngFromCSV(city, state) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "uscities.csv", // Replace with the path to your CSV file
            dataType: 'text',
            success: function (csvData) {
                var data = [];
                var lines = csvData.split(/\r\n|\n/);
                var headers = lines[0].replace(/"/g, '').split(',');
                var cityIndex = headers.indexOf('city');
                var stateIndex = headers.indexOf('state_id');
                var latIndex = headers.indexOf('lat');
                var lngIndex = headers.indexOf('lng');

                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentLine = lines[i].replace(/"/g, '').split(',');
                    obj['city'] = currentLine[cityIndex];
                    obj['state_id'] = currentLine[stateIndex];
                    obj['lat'] = parseFloat(currentLine[latIndex]);
                    obj['lng'] = parseFloat(currentLine[lngIndex]);
                    data.push(obj);
                }

                var cityData = data.find((item) => item.city === city && item.state_id === state);
                if (cityData) {
                    resolve({ lat: cityData.lat, lng: cityData.lng });
                } else {
                    resolve(null); // City not found in the CSV data
                }
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}


// Function to add start location to JSON file and display it on the page
function addStartLocation() {

    var startLocationInput = document.getElementById("start-location-input");
    var startLocationRadius = document.getElementById("start-location-radius");
    var startLocationsContainer = document.getElementById("start-locations-container");
    var startstate = document.getElementById("start-location-input-state")
    if (startstate.style.display == "block") {
        var locationCard = document.createElement("div");
        locationCard.className = "location-card";

        locationCard.textContent = startstate.value;

        var removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.classList.add("Minus");
        removeButton.id = startlocations.length
        removeButton.addEventListener("click", function () {
            startLocationsContainer.removeChild(locationCard);
            console.log(removeButton.id)
            startlocations.splice(parseInt(removeButton.id), 1)
            var minusButtons = startLocationsContainer.getElementsByClassName("Minus");

            // Loop through each button and update its ID
            for (var i = 0; i < minusButtons.length; i++) {
                minusButtons[i].id = i.toString();
            }
            console.log(startlocations)
        });


        // Get all the button elements with class "Minus" inside the container

        locationCard.appendChild(removeButton);

        startLocationsContainer.appendChild(locationCard);
        startlocations.push({ state: startstate.value })
        console.log(startlocations)
        // Clear input fields after adding the location
        startLocationInput.value = "";
        startLocationRadius.value = "";


    }
    if (startstate.style.display == "none") {
        if (startLocationRadius.value === "") {
            startLocationRadius.value = 25;
        }

        if (startLocationInput.value !== "" || (startLocationInput.value !== "" && startLocationRadius.value === "")) {
            var city = startLocationInput.value.split(",")[0];
            var state = startLocationInput.value.split(",")[1].split(" ").join(""); // Replace "some_state" with the actual state (e.g., "CA")
            var radius = parseInt(startLocationRadius.value);
            console.log(city, state, radius)
            var locationCard = document.createElement("div");
            locationCard.className = "location-card";

            locationCard.textContent = city + ", " + state + ", " + startLocationRadius.value + " miles around";

            var removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("Minus");
            removeButton.id = startlocations.length
            removeButton.addEventListener("click", function () {
                startLocationsContainer.removeChild(locationCard);
                console.log(removeButton.id)
                startlocations.splice(parseInt(removeButton.id), 1)
                var minusButtons = startLocationsContainer.getElementsByClassName("Minus");

                // Loop through each button and update its ID
                for (var i = 0; i < minusButtons.length; i++) {
                    minusButtons[i].id = i.toString();
                }
                console.log(startlocations)
            });


            // Get all the button elements with class "Minus" inside the container

            locationCard.appendChild(removeButton);

            startLocationsContainer.appendChild(locationCard);

            // Get latitude and longitude from the CSV data
            getLatLngFromCSV(city, state)
                .then(function (latLng) {
                    console.log(latLng);

                    if (latLng) {
                        var locationData = {
                            city: city,
                            state: state,
                            lat: latLng.lat,
                            lng: latLng.lng,
                            radius: parseInt(startLocationRadius.value),
                        };

                        // Save locationData to the JSON file using your preferred method (e.g., AJAX, fetch, etc.)
                        // Replace `saveLocationDataToJSONFile` with the actual function to save the data

                    }
                    startlocations.push(locationData)
                    console.log(startlocations)
                    // Clear input fields after adding the location
                    startLocationInput.value = "";
                    startLocationRadius.value = "";
                })
        }
    }
}

function addEndLocation() {
    var endLocationInput = document.getElementById("end-location-input");
    var endLocationRadius = document.getElementById("end-location-radius");
    var endLocationsContainer = document.getElementById("end-locations-container");
    var endstate = document.getElementById("end-location-input-state")
    if (endstate.style.display == "block") {
        var locationCard = document.createElement("div");
        locationCard.className = "location-card";

        locationCard.textContent = endstate.value;

        var removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.classList.add("Minus");
        removeButton.id = endlocations.length
        removeButton.addEventListener("click", function () {
            endLocationsContainer.removeChild(locationCard);
            console.log(removeButton.id)
            endlocations.splice(parseInt(removeButton.id), 1)
            var minusButtons = endLocationsContainer.getElementsByClassName("Minus");

            // Loop through each button and update its ID
            for (var i = 0; i < minusButtons.length; i++) {
                minusButtons[i].id = i.toString();
            }
            console.log(endlocations)
        });


        // Get all the button elements with class "Minus" inside the container

        locationCard.appendChild(removeButton);

        endLocationsContainer.appendChild(locationCard);
        endlocations.push({ state: endstate.value })
        console.log(endlocations)
        // Clear input fields after adding the location
        endLocationInput.value = "";
        endLocationRadius.value = "";


    }
    if (endstate.style.display == "none") {
        if (endLocationRadius.value === "") {
            endLocationRadius.value = 25;
        }

        if (endLocationInput.value !== "" || (endLocationInput.value !== "" && endLocationRadius.value === "")) {
            var city = endLocationInput.value.split(",")[0];
            var state = endLocationInput.value.split(",")[1].split(" ").join(""); // Replace "some_state" with the actual state (e.g., "CA")
            var radius = parseInt(endLocationRadius.value);
            console.log(city, state, radius)
            var locationCard = document.createElement("div");
            locationCard.className = "location-card";

            locationCard.textContent = city + ", " + state + ", " + endLocationRadius.value + " miles around";

            var removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("Minus");
            removeButton.id = endlocations.length
            removeButton.addEventListener("click", function () {
                endLocationsContainer.removeChild(locationCard);
                console.log(removeButton.id)
                endlocations.splice(parseInt(removeButton.id), 1)
                var minusButtons = endLocationsContainer.getElementsByClassName("Minus");

                // Loop through each button and update its ID
                for (var i = 0; i < minusButtons.length; i++) {
                    minusButtons[i].id = i.toString();
                }
                console.log(endlocations)
            });


            // Get all the button elements with class "Minus" inside the container

            locationCard.appendChild(removeButton);

            endLocationsContainer.appendChild(locationCard);

            // Get latitude and longitude from the CSV data
            getLatLngFromCSV(city, state)
                .then(function (latLng) {
                    console.log(latLng);

                    if (latLng) {
                        var locationData = {
                            city: city,
                            state: state,
                            lat: latLng.lat,
                            lng: latLng.lng,
                            radius: parseInt(endLocationRadius.value),
                        };

                        // Save locationData to the JSON file using your preferred method (e.g., AJAX, fetch, etc.)
                        // Replace `saveLocationDataToJSONFile` with the actual function to save the data

                    }
                    endlocations.push(locationData)
                    console.log(endlocations)
                    // Clear input fields after adding the location
                    endLocationInput.value = "";
                    endLocationRadius.value = "";
                })
        }
    }
}



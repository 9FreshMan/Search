
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
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentLine = lines[i].replace(/"/g, '').split(',');
                obj['city'] = currentLine[cityIndex];
                obj['state_id'] = currentLine[stateIndex];
                data.push(obj);
            }
            callback(data);
        }
    });
}



function addStartLocation() {
    var startLocationInput = document.getElementById("start-location-input");
    var startLocationRadius = document.getElementById("start-location-radius");
    var startLocationsContainer = document.getElementById("start-locations-container");

    var locationCard = document.createElement("div");
    locationCard.className = "location-card";
    locationCard.textContent = startLocationInput.value + " " + startLocationRadius.value + " miles";

    startLocationsContainer.appendChild(locationCard);

    // Очистка полей после добавления
    startLocationInput.value = "";
    startLocationRadius.value = "";
}

function addEndLocation() {
    var endLocationInput = document.getElementById("end-location-input");
    var endLocationRadius = document.getElementById("end-location-radius");
    var endLocationsContainer = document.getElementById("end-locations-container");

    var locationCard = document.createElement("div");
    locationCard.className = "location-card";
    locationCard.textContent = endLocationInput.value + " " + endLocationRadius.value + " miles";

    endLocationsContainer.appendChild(locationCard);

    // Очистка полей после добавления
    endLocationInput.value = "";
    endLocationRadius.value = "";
}

$(document).ready(function () {
    $('#conditions').hide();
    $('#forecast').hide();
})
// Display Conditions
function displayConditions(zip, units) {
    $.ajax({
        type: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?APPID=3b9084cb3c434d36b38b0104c68ea869&zip=' + zip + ",us&units=" + units,
    })
    .done(function (result) {
    // Temp and Wind Units (Imperial or Metric)
        var tempUnit, windUnit;
        if (units == "imperial") {
            tempUnit = "F";
            windUnit = "mph";
        } else if (units == "metric") {
            tempUnit = "C";
            windUnit = "m/s";
        }
        $('#conditions').show();
        $('#conditions h2').text('Current Conditions for ' + result.name);
        $('#conditions-icon').attr('src', "http://openweathermap.org/img/w/" + result.weather[0].icon + '.png');
        $('#conditions-description').text(result.weather[0].main);
        $('#temperature').text(result.main.temp + " " + tempUnit);
        $('#humidity').text(result.main.humidity + "%");
        $('#wind').text(result.wind.speed + " " + windUnit);
    })
    // Web service connection error
    .fail(function () {
        displayError('Error connecting to web service. Please try again later.');
    });
}
// Display Forecast
function displayForecast(zip, units) {
    $.ajax({
        type: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast?APPID=3b9084cb3c434d36b38b0104c68ea869&zip=' + zip + ",us&units=" + units
    })
    .done(function (results) {
        // Temp Units (Imperial or Metric)
        var tempUnit;
        if (units == "imperial") {
            tempUnit = "F";
        } else if (units == "metric") {
            tempUnit = "C";
        }
        $('#forecast').show();
        $('#forecast table tr').empty();
        for (i = 0; i < 5; i++) {
            var weather = results.list[i*8];
            $('#date-row').append($('<td>').text(weather.dt_txt.split(" ")[0]));
    
            $('#summary-row').append($('<td>')
                .append($('<img>').attr('src', "http://openweathermap.org/img/w/" + weather.weather[0].icon + '.png'))
                .append($('<span>').text(weather.weather[0].main)));
            $('#high-row').append($('<td>')
                .text("H: " + weather.main.temp_max + " " + tempUnit)); 
            $('#low-row').append($('<td>')
                .text("L: " + weather.main.temp_min + " " + tempUnit));
        }
    })
    .fail(function () {
        displayError('Error connecting to web service. Please try again later.');
    });
}
// Display Results
function displayResults() {
    $('#error-messages').empty();
    // if valid zipcode
    if ($('#zipcode')[0].validity.valid) {
        displayConditions($('#zipcode').val(), $('#units').val());
        displayForecast($('#zipcode').val(), $('#units').val());
    // else invalid zipcode
    } else {
        displayError('Please enter a 5-digit zip code.')
    }
}
// Display Error
function displayError(msg) {
    $('#error-messages').append($('<li>')
        .text(msg)
        .attr({ class: 'list-group-item list-group-item-danger' }))
}
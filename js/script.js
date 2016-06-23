
var geolocate = function() {
	// Use geolocate to get latitude and longitude
	// Default the view type to current.
	var successFunction = function(positionObj) {
		console.log(positionObj)
		var lat = positionObj.coords.latitude,
			lng = positionObj.coords.longitude

		location.hash = lat + "/" + lng + "/current"
	}

	navigator.geolocation.getCurrentPosition(successFunction, errorCallback)
}


var WeatherRouter = Backbone.Router.extend({
	routes: {
		":lat/:lng/current": "handleCurrentWeather",
		":lat/:lng/daily": "handleDailyWeather",
		":lat/:lng/hourly": "handleHourlyWeather",
		"*catchall": "handleDefault"
	},

	handleCurrentWeather: function(lat,lng) {
		console.log("Current weather route matched. coords are ", lat, lng)
	}

	handleDefault: function(){
		geolocate()
	},

	initialize: function(){
		Backbone.history.start()
	}

})

var rtr = new WeatherRouter()


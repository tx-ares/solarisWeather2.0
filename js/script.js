//1 - Sanity check. We are good to go.
console.log("It's dat boi. Waddup world!")
//2 - Check 2.  jQuery is loaded.
console.log($)

//Grabbing our main container node
var containerEl = document.querySelector("#tempContainer")

//3 - geolocate is where we get our coords to work with. 
var geolocate = function() {
	// Use geolocate to get latitude and longitude
	// Default the view type to current.

	//9 - Good, we got our coords , so we will pass in response object and store the lat and lng coordinates, and then also, add them to our hash, which triggers our hash change! So... back to the router.
	var successFunction = function(positionObj) {
		console.log(positionObj)
		var lat = positionObj.coords.latitude,
			lng = positionObj.coords.longitude

		location.hash = lat + "/" + lng + "/current"
	}

	var errorCallback = function(err){
		throw new err("Cannot find geolocation.  Check browser settings for location services.")
	}
	//8 - Now inside geolocate we will use the native geolocation function to get our coordinates, along with the 2 parameters , 1st one in case of successful coordinate retrieval , and 2nd if it fails.
	navigator.geolocation.getCurrentPosition(successFunction, errorCallback)
}

function hashToObject() {
    //10 - First we trim a bit of our hash by taking off the last character which is an extra '/'.
    var hashRoute = location.hash.substr(1)
        // console.log(hashRoute)
        //11 - Then we split the hash into parts by using any '/'s in it as a divider.  This gives us 3 parts:  a Latitude, a longitude, and a viewType.
    var hashParts = hashRoute.split('/')

    return {
        lat: hashParts[0],
        lng: hashParts[1],
        viewType: hashParts[2]
    }
}

//13 - Remember the purpose our model is to make the proper request with the coordinates we've collected.
var WeatherModel = Backbone.Model.extend({

	//15 - There are special reserved functions , one being 'url' which is specifically meant to concatenate, store, and return a url string.
	url: function(){
		// console.log(forecast)
		var apiKey = "6fec34b5cf75de90f7d3add762e6e30b"
		var baseUrl = "https://api.forecast.io/forecast/"

		//16 - Now, we will require those coords again, best way for us to retrieve them is from our router, so let's capture them with 'this'.  Using 'this' here will freeze the instance of our model object , and its inputs we passed earlier.
		var fullUrl = baseUrl + apiKey + "/" + this.lat + ',' + this.lng
		
		console.log(fullUrl)
		return fullUrl
	},

	//17 - To bring the frozen coords from our model into our scope here, we will intialize a function that simply stores them in a local variable.
	initialize: function(inputLat, inputLng) {
		this.lat = inputLat
		this.lng = inputLng
	},

	// _render: function() {

	// }


})

var renderCurrent = function(respObj){
	
	console.log(respObj)

	var htmlString = ""
    htmlString += '<div id="weatherContainer">'
    htmlString += '<div class="iconContainer">'
    htmlString += '<canvas id="icon1" width="460" height="460"></canvas>'
    htmlString += '</div>'
    htmlString += '<div class="detailContainer">'
    htmlString += '<p class="temperature"> ' + respObj.currently.temperature + ' °f</p>'
    htmlString += '<p class="rainChance">  ' + respObj.currently.precipProbability + ' %</p>'
    htmlString += '</div>'
    htmlString += '</div>'
    var iconString = respObj.currently.icon

    console.log(iconString)
    containerEl.innerHTML = htmlString
    skycons(iconString, 1)
}

var renderHourly = function(respObj){
	console.log("rending hourly")
	var htmlString = ''
    var hoursArray = respObj.hourly.data

    for (var i = 1; i < 7; i++) {
        var hourObject = hoursArray[i]
        console.log(hourObject)
        
        var iconString = hourObject.icon
        console.log(iconString)
        var iconId = "icon" + i

        var timeStamp = hourObject.time
        var timeConvert = new Date(timeStamp * 1000)
        var hours = (timeConvert.getHours()) % 12;
        // console.log(hours)
        var dayNight = ""
        if (timeConvert.getHours() > 12) {
            dayNight = "PM"
        } else {
            dayNight = "AM"
        }
        if (hours === 0) {
            hours = 12
        }

        var minutes = "0" + timeConvert.getMinutes()

        htmlString += '<div class="hour">'
        htmlString += '<p><span class="hourTime">' + hours + ":" + minutes + dayNight + "</span>"
        htmlString += '<canvas class="skycon" id="' + iconId + '" width="64" height="64" data-icon="' + iconString + '">' + '</canvas>'
        htmlString += '<span class="hourTemp">' + hourObject.temperature.toPrecision(2) + '&deg;' + '</span></p>'
        htmlString += '</div>'
        skycons(iconString, i + 1)
    }

    containerEl.innerHTML = htmlString
    var allSkycons = document.querySelectorAll('canvas.skycon')

    for (var i = 0; i < allSkycons.length; i++) {
        var iconData = allSkycons[i].dataset.icon
        skycons(iconData, i + 1)
    }
}

var renderDaily = function(respObj){
	console.log("rendering daily")
	console.log(respObj)
    var htmlString = ''
    var daysArray = respObj.daily.data

    htmlString += '<p>' + respObj.daily.summary + '</p>'

    for (var i = 1; i < 6; i++) {
        var dayObject = daysArray[i]
        var iconString = dayObject.icon
        console.log(dayObject)
            // console.log(i)
            // var counter = i++

        var iconId = "icon" + i
        console.log(typeof iconId, iconId)
            // create a variable called iconId. iconId will be set for each canvas element,
            // and you will pass it into the skycons function, so that each skycon is 
            // synched up with the weather-day that you are adding it to.
        htmlString += '<div class="day">'
        htmlString += '<canvas class="skycon" id="' + iconId + '" width="128" height="128" data-icon="' + iconString + '">' + '</canvas>'
            // console.log(htmlString) 
        htmlString += '<p class="max">' + dayObject.temperatureMax.toPrecision(2) + '&deg; High</p>' ///append the the tempatureMax attribute to the html string//
        htmlString += '<p class="min">' + dayObject.temperatureMin.toPrecision(2) + '&deg; Low</p>' ///append the the tempatureMin attribute to the html string//
        htmlString += '</div>'

        console.log(iconString + " <<< this is getting passed into skycons.")
        console.log(typeof i)
        skycons(iconString, i)
        console.log(htmlString)
    }

    containerEl.innerHTML = htmlString
    var allSkycons = document.querySelectorAll('canvas.skycon')

    for (var i = 0; i < allSkycons.length; i++) {
        var iconData = allSkycons[i].dataset.icon
        skycons(iconData, i + 1)
    }

}

//Helper function for our buttons to switch views.
function handleForecastTypeClick(eventObj) {
	console.log("handleForecastTypeClick has fired!")
    var viewType = eventObj.target.className
        // console.log(viewType)
    if (!viewType) {
        return
    }
    //9 - Additionally, we create a new hash with hashToObject()
    var hashData = hashToObject()
        // console.log(hashData)
    location.hash = hashData.lat + '/' + hashData.lng + '/' + viewType
}
//Helper function for our initializer to activate our button's routing.
function addAllEventListeners() {
	var currentlyButtonEl = document.querySelector(".currently")
	var hourlyButtonEl = document.querySelector(".hourly")
	var dailyButtonEl = document.querySelector(".daily")

	currentlyButtonEl.addEventListener('click', handleForecastTypeClick)
	hourlyButtonEl.addEventListener('click', handleForecastTypeClick)
	dailyButtonEl.addEventListener('click', handleForecastTypeClick)
}

//Skycons for fancy animations.
function skycons(iconString, i) {
    var formattedIcon = iconString.toUpperCase().replace(/-/g, "_")
    var skycons = new Skycons({ "color": "lightgoldenrodyellow" });
    // on Android, a nasty hack is needed: {"resizeClear": true}

    // console.log(iconString)
    // console.log(i)

    var iconId = "icon" + i
    console.log(typeof iconId, iconId)

    // you can add to a canvas by it's ID...
    skycons.add("icon" + i, Skycons[formattedIcon]);

    // ...or by the canvas DOM element itself.
    //skycons.add(document.getElementById("icon2"), Skycons.RAIN);

    // if you're using the Forecast API, you can also supply
    // strings: "partly-cloudy-day" or "rain".

    // start animation!
    skycons.play();

    // you can also halt animation with skycons.pause()

    // want to change the icon? no problem:
    //skycons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);

    // want to remove one altogether? no problem:
    //skycons.remove("icon2");
}


//4 - Creating the router is going to many things for us.  We will go step by step..
var WeatherRouter = Backbone.Router.extend({
	//6 - Then, we go to our routes and so far, the only one that will work is our catch all. 
	routes: {
		//10 - Now that our router has successfully passed our current hash string, we want to write a handler for those coordinates we got.
		":lat/:lng/current": "handleCurrentWeather",
		":lat/:lng/daily": "handleDailyWeather",
		":lat/:lng/hourly": "handleHourlyWeather",
		"*catchall": "handleDefault"
	},

	//11 - We want to make sure we are passing in the coordinates, and creating our first Weather Model.
	handleCurrentWeather: function(lat,lng) {

		// 12 -  We will define what's inside our model above..
		var wm = new WeatherModel(lat,lng) 

		// 14 -  And now, we can use another reserved function called 'fetch()' which specifically looks for our built in function called 'url' in the weather model.
		wm.fetch().then(function(respObj){
			renderCurrent(respObj)
		})

		console.log("Current weather route matched. coords are ", lat, lng)
	},

	handleDailyWeather: function(lat,lng) {

		var wm = new WeatherModel(lat,lng) 
		// 14 -  And now, we can use another reserved function called 'fetch()' which specifically looks for our built in function called 'url' in the weather model.
		wm.fetch().then(function(respObj){
			renderDaily(respObj)
		})
	},

	handleHourlyWeather: function(lat,lng) {
		
		var wm = new WeatherModel(lat,lng) 

		wm.fetch().then(function(respObj){
			renderHourly(respObj)
		})
	},

	//7 - Handle default will fire our geolocate...
	handleDefault: function(){
		geolocate()
	},

	//5 - First thing that fires is our initialize.  Which uses a special backbone command that starts to listen for hashchanges.
	initialize: function(){
		Backbone.history.start()
		addAllEventListeners()
	}

})

// var wv = new WeatherView(WeatherModel)
var rtr = new WeatherRouter()


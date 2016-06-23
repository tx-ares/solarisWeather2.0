//1 - Sanity check. We are good to go.
console.log("It's dat boi. Waddup world!")
//2 - Check 2.  jQuery is loaded.
console.log($)

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

//13 - Remember the purpose our model is to make the proper request with the coordinates we've collected.
var WeatherModel = Backbone.Model.extend({
	
	//14 - There are special reserved functions , one being 'url' which is specifically meant to concatenate, store, and return a url string.
	url: function(){
		var apiKey = "6fec34b5cf75de90f7d3add762e6e30b"
		var baseUrl = "https://api.forecast.io/forecast/"
			
		var fullUrl = baseUrl + apiKey + "/" + location.hash.substr(1).split("/")[0] + ',' + location.hash.split("/")[1]
		
		console.log(fullUrl)
		return fullUrl
	},


})

var WeatherView = Backbone.View.extend({


  // tagName: "li",

  // className: "document-row",

  // events: {
  //   "click .icon":          "open",
  //   "click .button.edit":   "openEditDialog",
  //   "click .button.delete": "destroy"
  // },

  // initialize: function() {
  //   this.listenTo(this.model, "change", this.render);
  // },

  

	initialize: function(model) {
		this.listenTo(this.model, this.render)
	},

	render: function() {
   		console.log("render fired")
  	},
})

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
		//12 -  We will define what's inside our model above..
		var wm = new WeatherModel() 

		//14 -  And now, we can use another reserved function called 'fetch()'
		wm.fetch().then(function(respObj){
			console.log(respObj)
		})

		console.log("Current weather route matched. coords are ", lat, lng)
	},

	//7 - Handle default will fire our geolocate...
	handleDefault: function(){
		geolocate()
	},
	//5 - First thing that fires is our initialize.  Which uses a special backbone command that starts to listen for hashchanges.
	initialize: function(){
		Backbone.history.start()
	}

})

var wv = new WeatherView(WeatherModel)
var rtr = new WeatherRouter()


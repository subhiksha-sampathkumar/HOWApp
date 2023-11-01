const trakt = "https://api.trakt.tv"; //base URL for any Trakt API requests

/*
 * Functions for Trakt API requests.
 */
async function getRoute() {
  
  let basicAPI = 'https://www.mapquestapi.com/directions/v2/route?key=';
  let basicAPI2 = '&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA';
  //let KEY =  'nZ4odR6cZjGAvoO8h63UqxISgthj3vra';
  //let KEY = 'nZ4odR6cZjGAvoO8h63UqxISgthj3vra';
  let KEY = process.env.API_KEY;
  //let query1 = '&includeIngredients=';
  //let query2 = '&diet=vegetarian&number=5';
  let reqUrl = basicAPI + KEY + basicAPI2; 
  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        
        //'x-api-key': process.env.SPOONACULAR_CLIENT_ID,
        //'X-api-Host': 'api.spoonacular.com'
      }
    }
  );
  return await response.json();
}
async function getRoutePoints(pointA,pointB) {
  
  let basicAPI = 'https://www.mapquestapi.com/directions/v2/route?key=';
  let basicAPI2 = '&from='+pointA + '&to=' + pointB;
  //let KEY =  'nZ4odR6cZjGAvoO8h63UqxISgthj3vra';
  let KEY = 'nZ4odR6cZjGAvoO8h63UqxISgthj3vra';
  //let query1 = '&includeIngredients=';
  //let query2 = '&diet=vegetarian&number=5';
  let reqUrl = basicAPI + KEY + basicAPI2; 
  var response = await fetch(
    reqUrl,
    {
      method: "GET",
      headers: {
        
        //'x-api-key': process.env.SPOONACULAR_CLIENT_ID,
        //'X-api-Host': 'api.spoonacular.com'
      }
    }
  );
  return await response.json();
}
async function getTrendingMovies() {
  let reqUrl = `${trakt}/movies/trending`;
  var response = await fetch(
    reqUrl,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
  );
  return await response.json();
}

async function getMovieRatings(id) {
  let reqUrl = `${trakt}/movies/${id}/ratings`;
  let response = await fetch(
    reqUrl,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
  );
  return await response.json(); //convert response to JSON and return it
}

async function getMovieSummary(id) {
  let reqUrl = `${trakt}/movies/${id}`;
  let response = await fetch(
    reqUrl,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
  );
  return await response.json();
}

async function getPopularShows() {
  let reqUrl = `${trakt}/shows/popular`;
  var response = await fetch(
    reqUrl,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID,
              }
    }
  );
  return await response.json();
}

module.exports = {
  getTrendingMovies,
  getPopularShows,
  getMovieRatings,
  getRoute,
  getRoutePoints,
  getMovieSummary
  };
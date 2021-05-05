// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')
const { mainModule } = require('process')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)


  // 🔥 hw6: your recipe and code starts here!
  
  // get the parameters for year and genre
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre

  // if the parameters are undefined, return error message
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `ERROR: Year and / or Genre were not recognized. Please define the year and genre of movies to retrieve movie list!` // a string of data
    }
  }
  
  // if the year and genre ARE defined then define object to return
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through the csv items to identify those that match given criteria
    for (let i=0; i < moviesFromCsv.length; i++) {

      let movie = moviesFromCsv[i]

      // ignore movies that have "\\N" for genres or runtimeMinutes
      if (movie.genres != "\\N" || movie.runtimeMinutes != "\\N") {
                    
        // check if the movie matches the year and genre selections
        if (movie.startYear == year && movie.genres.includes(genre) == true) {
          
          // if yes, then add one to the counter
          returnValue.numResults = returnValue.numResults + 1

          // and define a return object with primary title, release date and all genres
          let movieToReturn = {
            primaryTitle: movie.primaryTitle,
            yearReleased: movie.startYear,
            genres: movie.genres
          }

          // push the movie object to the array in the return object
          returnValue.movies.push(movieToReturn)

        }
      }
    }
    
    // if no movies are found with provided criteria, provide some guidance for the parameters
    
    if (returnValue.numResults == 0) {
      return {
        statusCode: 200,
        body: `No movies were found matching your criteria. Our database has movies from 2010 - 2020 in the genres of Action, Adventure, Animation, Biography, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Musical, Mystery, Romance, Sci-Fi, Sport, Thriller, War. Please try again with a different year and / or genre!`
      }
    }

    else {

    // return the list of relevant movies as a JSON string

    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
      }
    }
  }
}
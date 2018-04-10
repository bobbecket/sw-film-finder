const SWAPI_PEOPLE_SEARCH_BASE_URL = 'https://swapi.co/api/people/?search=';

let films = [ "The Phantom Menace",
              "Attack of the Clones",
              "Revenge of the Sith",
              "A New Hope",
              "The Empire Strikes Back",
              "Return of the Jedi",
              "The Force Awakens"];

let filmHTML = "";

function getDataFromApi(searchTerm, callback) {
  const searchURL = SWAPI_PEOPLE_SEARCH_BASE_URL + searchTerm;
  const query = "";
  $.getJSON(searchURL, query, callback);
}


function generateFilmHTML(item)
{
  const strLen = item.length;
  const charPos = strLen - 2;
  let filmNum = item.charAt(charPos) - 1;
  
  filmHTML = filmHTML + "<div>Film: " + films[filmNum] + "</div>";
}

function displayFilmData(data)
{
  data.results[0].films.forEach(generateFilmHTML);
  
  console.log(filmHTML);

  /*
  const numResultsString = numResults + ' results';
  $('.js-search-num-results').html(numResultsString);
  */
  $('.js-search-results').prop('hidden', false).html(filmHTML);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayFilmData);
  });
}

$(watchSubmit);

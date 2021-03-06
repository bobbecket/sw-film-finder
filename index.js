const SWAPI_PEOPLE_SEARCH_BASE_URL = 'https://swapi.co/api/people/?search=';

let films = [ "A New Hope",
              "The Empire Strikes Back",
              "Return of the Jedi",
              "The Phantom Menace",
              "Attack of the Clones",
              "Revenge of the Sith",
              "The Force Awakens"];

let filmHTML = "";
let charName = "";
let ytVidCount = 0;

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromYTApi(searchTerm, callback)
{
  const query =
  {
    part: 'snippet',
    q: `${searchTerm}`,
    maxResults: 4,
    key: 'AIzaSyChe4eEkLQFrhADTPumU0g6BKdgOmsjpIo'
  }

  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function makeYouTubeCard(thumbnailImageURL, videoTitle, videoDescription, videoURL)
{
  return `
    <div class="col-md-6">
      <div class="card">
        <img class="card-img-top" src="${thumbnailImageURL}" alt="${videoTitle}">
        <div class="card-body">
          <h5 class="card-title">${videoTitle}</h5>
          <p class="card-text">${videoDescription}</p>
          <a href="${videoURL}" class="btn btn-primary">Watch Now</a>
        </div>
      </div>
    </div>
    `;
}

function generateYouTubeHTML(result)
{
  const videoType = result.id.kind;

  if (videoType == 'youtube#video')
  {
    const thumbnailImageURL = result.snippet.thumbnails.medium.url;
    const videoTitle = result.snippet.title;
    const videoDescription = result.snippet.description;
    const videoURL = 'https://www.youtube.com/watch?v=' + result.id.videoId;

    ytVidCount++;
    if ((ytVidCount % 2) == 1) // Odd vid count, start new row
    {
      return `<div class="row">` + makeYouTubeCard(thumbnailImageURL, videoTitle, videoDescription, videoURL);
    }
    else // Even vid count, end current row
    {
      return makeYouTubeCard(thumbnailImageURL, videoTitle, videoDescription, videoURL) + `</div>`;
    }
  }
  else
  {
    return ``;
  }
}

function displayYouTubeSearchData(data)
{
  let youTubeHTML = `<div class="row">
  <h5 class="text-center">Related Videos</h5>
  </div>`;

  youTubeHTML += data.items.map((item, index) => generateYouTubeHTML(item)).join('');

  $('.js-yt-search-results').prop('hidden', false).html(youTubeHTML);
}

function getDataFromApi(searchTerm, callback)
{
  const searchURL = SWAPI_PEOPLE_SEARCH_BASE_URL + searchTerm;
  const query = "";
  $.getJSON(searchURL, query, callback);
}

function generateFilmHTML(item)
{
  const strLen = item.length;
  const charPos = strLen - 2;
  let filmNum = item.charAt(charPos) - 1;

  filmHTML = filmHTML + `<p class="card-text">` + films[filmNum] + `</p>`;
}

function displayFilmData(data)
{
  if (data.results.length == 0)
  {
    // Character not found -- display dismissible alert
    const alertTpl = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      @message
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;

    const alertHTML = alertTpl.replace('@message', `Character not found`);

    $('.js-alerts-container').prop('hidden', false).html(alertHTML);
  }
  else
  {
    // Hide the alert
    $('.js-alerts-container').prop('hidden', true).html("");

    // Display the film data for this character
    charName = data.results[0].name;
    filmHTML =
    `<div class="card bg-light mb-3">
      <div class="card-header"><strong>${charName}</strong></div>
      <div class="card-body">
        <h5 class="card-title">Appears in:</h5>
    `;

    data.results[0].films.forEach(generateFilmHTML);

    filmHTML = filmHTML + "</div></div>";

    $('.js-search-results').prop('hidden', false).html(filmHTML);

    // Get YouTube data and display it
    const searchTerm = "star wars " + charName;
    getDataFromYTApi(searchTerm, displayYouTubeSearchData);
  }
}

function watchSubmit()
{
  $('.js-search-form').submit(event =>
  {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#inlineFormInputName');
    const query = queryTarget.val();

    // reset globals
    filmHTML = "";
    charName = "";
    ytVidCount = 0;

    // close the alert (if already open)
    $('.js-alerts-container').alert('close');

    // clear out the input
    queryTarget.removeAttr('placeholder');
    queryTarget.val("");

    // Get film data and display it
    getDataFromApi(query, displayFilmData);
  });
}

$(watchSubmit);

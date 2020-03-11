/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const NOIMAGE = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";

//Handles tasks on page load
function start() {
  $("#shows-list").on("click", ".episodebutton", getEpisodes);
  $("#search-form").on("submit", handleSearch); 
}

async function searchShows(query) {
  let searchResult =  await axios.get(
    "http://api.tvmaze.com/search/shows",
    {params: {q:query}});
    let showArray = [];
    
    for (show of searchResult.data){
      showArray.push(show.show);
    }
    let cleanArray = []
    for (let {id, name, summary, image} of showArray) {
      if (!image) {
        image = NOIMAGE;
      } else {
        image = image.medium;
      }
      let cleanShow = {id,name,summary,image}
      cleanArray.push(cleanShow);
    }

  return cleanArray;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();


  for (let show of shows) {
    let $episodeButton = $("<button>").on("click", )

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}" style="max-width: 200px; max-height:200px; text-align: center;">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button value="${show.id}" class="episodebutton">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
}


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(event) {
  event.preventDefault();
  console.log("Clicked the episodes button");
  let id = event.target.value;
  console.log("The show ID, maybe: " + id);

  let episodes = await axios.get(
    `http://api.tvmaze.com/shows/${id}/episodes`
  );
  let episodesArray = [];

  for (let {id, name, season, number} of episodes.data) {
    let cleanEpisode = {id, name, season, number};
    episodesArray.push(cleanEpisode);
  }

  populateEpisodes(episodesArray);
}

function populateEpisodes(episodes){
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  $("#episodes-area").show();
  for (let episode of episodes) {
  
    let $item = $(
      `<li data-episode-id="${episode.id}">${episode.name} (season ${episode.season}, number ${episode.number}).</li>`);

    $episodesList.append($item);
  }
}

$(start);

const playBtn = document.querySelector("#mainPlayBtn");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");

const trackTitleDiv = document.querySelector(".track-title-div");
const artistNameDiv = document.querySelector(".artist-name-div");
const imgDiv = document.querySelector(".song-img");
const imgProp = document.getElementById("prop-cover");

const lyricsTab = document.querySelector(".lyrics-tab");
const albumsTab = document.querySelector(".albums-tab");
const artistTab = document.querySelector(".artist-tab");
const displayArea = document.getElementById("display-container");

const lyricsEl = document.querySelector(".song-lyrics");
const albumsEl = document.querySelector(".other-albums");
const artistEl = document.querySelector(".related-artists");

const SEARCH_LYRICS_API = "http://api.genius.com";
const LYRICS_API_KEY =
  "J7CBV8Sz1LJfOFq0p2GlWpL4uXpUTuJV2p2tsT5A3PrTWJIM5A5WwTvf78rzIU20";
const SEARCH_LYRICS_API_HOST = "api.genius.com";

const SPOTIFY_API_KEY = "c6a6472fc9mshd1b10b4c6715bdbp13dde1jsn07171d93260b";
const SPOTIFY_API_URL = "https://spotify23.p.rapidapi.com";
const SPOTIFY_HOST_URL = "spotify23.p.rapidapi.com";

const urlArtist = `${SEARCH_LYRICS_API}/search/?q=Ed%20Sheeran&per_page=10&page=1`;
const urlLyrics = `${SEARCH_LYRICS_API}/song/lyrics/?id=2949128`;

const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${LYRICS_API_KEY}`,
  },
};

let currentHitIndex = 0;
let hits = [];

async function fetchArtistInfo() {
  try {
    const response = await fetch(urlArtist, options);
    const result = await response.json();

    // Set hits globally
    hits = result.hits;

    // Check if there are hits
    if (hits.length > 0) {
      const currentHit = hits[currentHitIndex];
      const songCover = currentHit.result.song_art_image_thumbnail_url;
      const songTitle = currentHit.result.full_title;
      const artistName = currentHit.result.primary_artist.name;

      // Clear previous content
      imgDiv.innerHTML = "";
      artistNameDiv.innerHTML = "";
      trackTitleDiv.innerHTML = "";

      const artistNameEl = document.createElement("span");
      artistNameEl.classList.add("artist-name");
      artistNameEl.textContent = artistName;
      artistNameDiv.appendChild(artistNameEl);

      const coverEl = document.createElement("img");
      coverEl.classList.add("cover");
      imgProp.style.display = "none";
      coverEl.src = songCover;
      imgDiv.appendChild(coverEl);

      const titleEl = document.createElement("h3");
      titleEl.classList.add("track-title");
      titleEl.textContent = songTitle;
      trackTitleDiv.appendChild(titleEl);
    } else {
      // Handle case when there are no hits
      console.log("No hits found in the API response.");
    }
  } catch (error) {
    console.error(error);
  }
}

fetchArtistInfo();

async function fetchLyrics() {
  try {
    const response = await fetch(urlLyrics, options);
    const result = await response.json();

    const lyrics = result.lyrics.lyrics.body.html;

    const lyricsDisplay = document.createElement("p");
    lyricsDisplay.classList.add("p-lyrics");
    lyricsDisplay.innerHTML = lyrics;

    lyricsEl.appendChild(lyricsDisplay);

    const anchorTags = lyricsEl.querySelectorAll("a");
    anchorTags.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Links are disabled.");
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// fetchLyrics();

const urlRelatedArtists = `${SPOTIFY_API_URL}/artist_related/?id=6eUKZXaKkcviH0Ku9w2n3V`;
const urlArtistAlbums = ` ${SPOTIFY_API_URL}/artist_albums/?id=6eUKZXaKkcviH0Ku9w2n3V&offset=0&limit=100`;

const optionsSpotify = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": `${SPOTIFY_API_KEY}`,
    "X-RapidAPI-Host": `${SPOTIFY_HOST_URL}`,
  },
};

async function fetchRelatedArtists() {
  try {
    const response = await fetch(urlRelatedArtists, optionsSpotify);
    const result = await response.json();

    const relatedArtists = result.artists;

    relatedArtists.map((relatedArtist) => {
      const relatedArtistImage = `${relatedArtist.images[1].url}`;
      const relatedArtistName = `${relatedArtist.name}`;

      const divEl = document.createElement("div");
      const imgEl = document.createElement("img");
      const pArtistEl = document.createElement("p");

      pArtistEl.classList.add("artist-name");

      imgEl.src = relatedArtistImage;
      imgEl.alt = relatedArtistName;
      pArtistEl.textContent = relatedArtistName;

      divEl.append(imgEl, pArtistEl);
      artistEl.appendChild(divEl);
    });
  } catch (error) {
    console.error(error);
  }
}

fetchRelatedArtists();

async function fetchAlbums() {
  try {
    const response = await fetch(urlArtistAlbums, optionsSpotify);
    const result = await response.json();

    const albums = result.data.artist.discography.albums.items;

    albums.map((album) => {
      const imageSrc = `${album.releases.items[0].coverArt.sources[0].url}`;
      const nameAlbum = `${album.releases.items[0].name}`;
      const year = `${album.releases.items[0].date.year}`;

      const divEl = document.createElement("div");
      const imgEl = document.createElement("img");
      const pAlbums = document.createElement("p");
      const pAlbumYear = document.createElement("p");

      pAlbums.classList.add("albums");
      pAlbumYear.classList.add("album-year");

      imgEl.src = imageSrc;
      imgEl.alt = nameAlbum;
      pAlbums.textContent = nameAlbum;
      pAlbumYear.textContent = year;

      divEl.append(imgEl, pAlbums, pAlbumYear);
      albumsEl.appendChild(divEl);
    });
  } catch (error) {
    console.error(error);
  }
}

fetchAlbums();

btnNext.addEventListener("click", function () {
  currentHitIndex = (currentHitIndex + 1) % hits.length;
  fetchArtistInfo();
});

btnPrev.addEventListener("click", function () {
  currentHitIndex = (currentHitIndex - 1 + hits.length) % hits.length;
  fetchArtistInfo();
});

lyricsTab.addEventListener("click", function () {
  artistTab.style.fontWeight = "300";
  albumsTab.style.fontWeight = "300";
  lyricsTab.style.fontWeight = "bold";

  lyricsEl.style.display = "flex";
  albumsEl.style.display = "none";
  artistEl.style.display = "none";
});

albumsTab.addEventListener("click", function () {
  artistTab.style.fontWeight = "300";
  lyricsTab.style.fontWeight = "300";
  albumsTab.style.fontWeight = "bold";

  lyricsEl.style.display = "none";
  albumsEl.style.display = "flex";
  artistEl.style.display = "none";
});

artistTab.addEventListener("click", function () {
  albumsTab.style.fontWeight = "300";
  lyricsTab.style.fontWeight = "300";
  artistTab.style.fontWeight = "bold";

  lyricsEl.style.display = "none";
  albumsEl.style.display = "none";
  artistEl.style.display = "flex";
});

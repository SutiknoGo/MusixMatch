if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('./service-worker.js')
            .then((reg) => {
                console.log('Service worker registered. scope: ', reg.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
let deferredPrompt;

console.log('cari sw');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

install.addEventListener('click', (e) => {
    deferredPrompt.prompt();	
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
            } else {
            console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
});

// https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=5&country=it&f_has_lyrics=1&apikey=00db4374259d474f1e530e7cf75bc23c
const __BASE_URL__      = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/';
const __TRACK_LIST__    = 'chart.tracks.get?chart_name=top&page=1&page_size=10&country=us&f_has_lyrics=1';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';
// const __MANGA_DETAIL__  = 'https://www.mangaeden.com/api/track/';
// const __BASE_IMG_URL__  = 'https://cdn.mangaeden.com/mangasimg/98x/';

// Memory
let tracks = [];
let trackList = [];
let current_list_length = 0;
const list_increment = 10;

fetch(__BASE_URL__ + __TRACK_LIST__ + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleResponse)
    .catch(error);

function handleResponse(data) {
    // array of track.
    tracks = data.message.body;
    trackList = tracks.track_list;
    console.log(trackList);

    showTrack(10, 1);
}

/**
 * 
 * @param {*} number 
 * new method.
 * better way to load track element.
 * 
 */
function showTrack(number = 10, ranking = 1) {
    list_element = document.getElementById('list');
    loadTrackElement(list_element, number, ranking);
}

// /**
//  * 
//  * @param {*} list_element html tag element. Element with id `list`.
//  * @param {*} number number of track to be loaded.
//  * 
//  */
function loadTrackElement(list_element, number, ranking) {
    if (trackList.length <= 0 || number <= 0) {
        return;
    }

    let track = trackList.pop();
    console.log(track.track);

    var div_utama = document.createElement('div');
    var div_home  = document.createElement('div');
    div_home.className = 'home-post';
    var div_post  = document.createElement('div');
    div_post.className = 'post-meta';
    var icon      = document.createElement('i');
    icon.className = 'icon-file icon-2x';
    var div_entry  = document.createElement('div');
    div_entry.className = 'entry-content';
    var button_lyric = document.createElement('button');
    button_lyric.className = 'btn btn-dark btn-lg btn-block';
    button_lyric.innerHTML = 'View Lyrics >>';


    button_lyric.onclick = () => {
        location.href = './detail_track.html?track_id=' + track.track.track_id;
    };

    // child contains: 
    var artist     = document.createElement('span');
    var rank     = document.createElement('span');
    var album      = document.createElement('p');
    var track2     = document.createElement('p');
    var genre      = document.createElement('p');
    var lastUpdate = document.createElement('p');

    // var entry = document.createElement('div');

    
    artist.innerHTML = track.track.artist_name;
    artist.className += 'date';
    artist.style.fontSize = "17px";

    rank.innerHTML = ranking;
    rank.className += 'tags';
    rank.style.fontSize = "20px";
    
    
    album.innerHTML = "Album : " + track.track.album_name;
    album.className += 'album';
    album.style.fontWeight = "bold";

    track2.innerHTML = "Track : " + track.track.track_name;
    track2.className += 'track';

    if(track.track.primary_genres.music_genre_list.length == 0){
        genre.innerHTML = "Genre : - ";
        genre.className += 'genre';

    } else {
        genre.innerHTML = "Genre : " + track.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
        genre.className += 'genre';
    }

    date = track.track.updated_time.slice(0, 10);

    lastUpdate.innerHTML = "Updated Time : " + date;
    lastUpdate.className += 'updatedTime';
    

    // div_utama.appendChild(artist);
    // div_utama.appendChild(album);
    // div_utama.appendChild(track2);
    // div_utama.appendChild(lastUpdate);

    div_post.appendChild(icon);
    div_post.appendChild(artist);
    div_post.appendChild(rank);

    div_entry.appendChild(album);
    div_entry.appendChild(track2);
    div_entry.appendChild(genre);
    div_entry.appendChild(lastUpdate);
    div_entry.appendChild(button_lyric);

    div_home.appendChild(div_post);
    div_home.appendChild(div_entry);

    div_utama.appendChild(div_home);
    div_utama.className += 'span6';
    div_utama.style.marginBottom = "50px";

    list_element.appendChild(div_utama);

    setTimeout(function(){ loadTrackElement(list_element, number - 1, ranking + 1) }, 1500);
}

function error(e) {
    console.log(e);
}
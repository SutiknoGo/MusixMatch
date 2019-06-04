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
const __ARTIST_LIST__   = 'chart.artists.get?page=1&page_size=10&country=all';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';

// Memory
let artists = [];
let artistList = [];
let current_list_length = 0;
const list_increment = 10;

fetch(__BASE_URL__ + __ARTIST_LIST__ + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleResponse)
    .catch(error);

function handleResponse(data) {
    // array of artist.
    artists = data.message.body;
    artistList = artists.artist_list;
    console.log(artistList);

    showArtist(10, 1);
}

/**
 * 
 * @param {*} number 
 * new method.
 * better way to load artist element.
 * 
 */
function showArtist(number = 10, ranking = 1) {
    list_element = document.getElementById('list');
    loadArtistElement(list_element, number, ranking);
}

// /**
//  * 
//  * @param {*} list_element html tag element. Element with id `list`.
//  * @param {*} number number of artist to be loaded.
//  * 
//  */
function loadArtistElement(list_element, number, ranking) {
    if (artistList.length <= 0 || number <= 0) {
        return;
    }

    let artist = artistList.pop();
    console.log(artist);

    var div_utama = document.createElement('div');
    var div_home  = document.createElement('div');
    div_home.className = 'home-post';
    var div_post  = document.createElement('div');
    div_post.className = 'post-meta';
    var icon      = document.createElement('i');
    icon.className = 'icon-file icon-2x';
    var div_entry  = document.createElement('div');
    div_entry.className = 'entry-content';

    var button_album = document.createElement('button');
    button_album.className = 'btn btn-dark btn-lg btn-block';
    button_album.innerHTML = 'View All Album >>';

    var button_track = document.createElement('button');
    button_track.className = 'btn btn-theme btn-lg btn-block';
    button_track.innerHTML = 'View All Track >>';

    button_album.onclick = () => {
        location.href = './artist_album.html?artist_id=' + artist.artist.artist_id;
    };

    button_track.onclick = () => {
        location.href = './artist_track.html?artist_id=' + artist.artist.artist_id;
    };

    // child contains: 
    var artist_name  = document.createElement('span');
    var rank         = document.createElement('span');
    var country      = document.createElement('p');
    var alias        = document.createElement('p');
    var twitter      = document.createElement('p');
    var lastUpdate   = document.createElement('p');

    // var entry = document.createElement('div');

    
    artist_name.innerHTML = artist.artist.artist_name;
    artist_name.className += 'date';
    artist_name.style.fontSize = "17px";

    rank.innerHTML = ranking;
    rank.className += 'tags';
    rank.style.fontSize = "20px";
    
    
    if(artist.artist.artist_country == 0){
        country.innerHTML = "Country : -";
        country.className += 'country';
        country.style.fontWeight = "bold";

    } else {
        country.innerHTML = "Country : " + artist.artist.artist_country;
        country.className += 'country';
        country.style.fontWeight = "bold";
    }

    if(artist.artist.artist_alias_list.length == 0){
        alias.innerHTML = "Alias : - ";
        alias.className += 'alias';

    } else {
        alias.innerHTML = "Alias : " + artist.artist.artist_alias_list[0].artist_alias;
        alias.className += 'alias';
    }

    if(artist.artist.artist_twitter_url == 0){
        twitter.innerHTML = "Twitter : - ";
        twitter.className += 'twitter';

    } else {
        twitter.innerHTML = "Twitter : " + artist.artist.artist_twitter_url;
        twitter.className += 'twitter';
        twitter.style.cursor += 'pointer';
        twitter.style.textDecoration += 'underline';
        twitter.onclick = () => {
            location.href = artist.artist.artist_twitter_url;
        };
    }

    date = artist.artist.updated_time.slice(0, 10);

    lastUpdate.innerHTML = "Updated Time : " + date;
    lastUpdate.className += 'updatedTime';
    

    // div_utama.appendChild(artist);
    // div_utama.appendChild(album);
    // div_utama.appendChild(artist2);
    // div_utama.appendChild(lastUpdate);

    div_post.appendChild(icon);
    div_post.appendChild(artist_name);
    div_post.appendChild(rank);

    div_entry.appendChild(country);
    div_entry.appendChild(alias);
    div_entry.appendChild(twitter);
    div_entry.appendChild(lastUpdate);
    div_entry.appendChild(button_album);
    div_entry.appendChild(button_track);

    div_home.appendChild(div_post);
    div_home.appendChild(div_entry);

    div_utama.appendChild(div_home);
    div_utama.className += 'span6';
    div_utama.style.marginBottom = "50px";

    list_element.appendChild(div_utama);

    setTimeout(function(){ loadArtistElement(list_element, number - 1, ranking + 1) }, 1500);
}

function error(e) {
    console.log(e);
}
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
const __GENRE_LIST__   = 'music.genres.get';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';

// Memory
let genres = [];
let genreList = [];
let current_list_length = 0;
const list_increment = 10;

fetch(__BASE_URL__ + __GENRE_LIST__ + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleResponse)
    .catch(error);

function handleResponse(data) {
    // array of genre.
    genres = data.message.body;
    genreList = genres.music_genre_list;
    console.log(genreList);

    showGenre(10);
}

/**
 * 
 * @param {*} number 
 * new method.
 * better way to load genre element.
 * 
 */
function showGenre(number = 10) {
    list_element = document.getElementById('list');
    loadGenreElement(list_element, number);
}

// /**
//  * 
//  * @param {*} list_element html tag element. Element with id `list`.
//  * @param {*} number number of genre to be loaded.
//  * 
//  */
function loadGenreElement(list_element, number) {
    if (genreList.length <= 0 || number <= 0) {
        return;
    }

    let genre = genreList.pop();
    console.log(genre);

    var div_utama = document.createElement('div');
    var div_home  = document.createElement('div');
    div_home.className = 'home-post';
    var div_post  = document.createElement('div');
    div_post.className = 'post-meta';
    var icon      = document.createElement('i');
    icon.className = 'icon-file icon-2x';
    var div_entry  = document.createElement('div');
    div_entry.className = 'entry-content';

    var button_detail = document.createElement('button');
    button_detail.className = 'btn btn-dark btn-lg btn-block';
    button_detail.innerHTML = 'View Track >>';


    button_detail.onclick = () => {
        location.href = './detail_genre.html?genre_id=' + genre.music_genre.music_genre_id;
    };

    // child contains: 
    var genre_name  = document.createElement('span');

    
    genre_name.innerHTML = genre.music_genre.music_genre_name;
    genre_name.className += 'date';
    genre_name.style.fontSize = "17px";
    

    div_post.appendChild(icon);
    div_post.appendChild(genre_name);

    div_entry.appendChild(button_detail);

    div_home.appendChild(div_post);
    div_home.appendChild(div_entry);

    div_utama.appendChild(div_home);
    div_utama.className += 'span6';
    div_utama.style.marginBottom = "50px";

    list_element.appendChild(div_utama);

    setTimeout(function(){ loadGenreElement(list_element, number - 1) }, 1500);
}

function error(e) {
    console.log(e);
}
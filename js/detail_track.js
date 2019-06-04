const urlParams = new URLSearchParams(window.location.search);
const trackId = urlParams.get('track_id');
// title.innerHTML = "Manga ID: " + mangaId;

const __BASE_URL__      = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/';
const __TRACK_LYRICS__  = 'track.lyrics.get?track_id=';
const __TRACK__         = 'track.get?track_id=';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';

// Lyrics
fetch(__BASE_URL__ + __TRACK_LYRICS__ + trackId + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleLyricResponse)
    .catch(error);

function handleLyricResponse(data) {
    console.log('Lyric: ', data.message.body.lyrics.lyrics_body);

    data_lyric      = document.getElementById('lyric');
    var div_utama   = document.createElement('div');
    var title   = document.createElement('h1');    
    var div_home  = document.createElement('div');
    div_home.className = 'home-post';
    var div_entry  = document.createElement('div');
    div_entry.className = 'entry-content';
    var lyric       = document.createElement('pre');

    

    title.innerHTML = 'Lyric';
    title.style.textAlign = "center";
    title.style.fontWeight= "bold";
    lyric.innerHTML = data.message.body.lyrics.lyrics_body;

    div_entry.appendChild(title);
    div_entry.appendChild(lyric);

    div_home.appendChild(div_entry);

    div_utama.appendChild(div_home);
    div_utama.className += 'span12';
    data_lyric.appendChild(div_utama);
}



// Detail Track
fetch(__BASE_URL__ + __TRACK__ + trackId + __API_KEY__)
    .then((resp2) => resp2.json())
    .then(handleTrackResponse)
    .catch(error);


function handleTrackResponse(data){
    console.log('Track :', data);

    let track = data.message.body.track;

    data_track = document.getElementById('track');
    
    var div_utama = document.createElement('div');

    var div_home  = document.createElement('div');
    div_home.className = 'home-post';

    var div_post  = document.createElement('div');
    div_post.className = 'post-meta';

    var icon      = document.createElement('i');
    icon.className = 'icon-file icon-2x';

    var div_entry  = document.createElement('div');
    div_entry.className = 'entry-content';

    var button_back = document.createElement('button');
    button_back.className = 'btn btn-dark btn-lg btn-block';
    button_back.innerHTML = '<< Back to see other Popular Track';

    button_back.onclick = () => {
        location.href = './track.html';
    };

    var artist     = document.createElement('span');
    var album      = document.createElement('p');
    var track2     = document.createElement('p');
    var genre      = document.createElement('p');
    var explicit   = document.createElement('p');
    var lastUpdate = document.createElement('p');


    artist.innerHTML = track.artist_name;
    artist.className += 'date';
    
    album.innerHTML = "Album : " + track.album_name;
    album.className += 'album';
    album.style.fontWeight = "bold";

    track2.innerHTML = "Track : " + track.track_name;
    track2.className += 'track';

    if(track.primary_genres.music_genre_list.length == 0){
        genre.innerHTML = "Genre : - ";
        genre.className += 'genre';

    } else {
        genre.innerHTML = "Genre : " + track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
        genre.className += 'genre';
    }

    if(track.explicit == 0){
        explicit.innerHTML = "Explicit Words : No ";
        explicit.className += 'explicit';

    } else {
        explicit.innerHTML = "Explicit Words : Yes";
        explicit.className += 'explicit';
    }

    date = track.updated_time.slice(0, 10);

    lastUpdate.innerHTML = "Updated Time : " + date;
    lastUpdate.className += 'updatedTime';


    div_post.appendChild(icon);
    div_post.appendChild(artist);

    div_entry.appendChild(album);
    div_entry.appendChild(track2);
    div_entry.appendChild(genre);
    div_entry.appendChild(explicit);
    div_entry.appendChild(lastUpdate);
    div_entry.appendChild(button_back);

    div_home.appendChild(div_post);
    div_home.appendChild(div_entry);

    div_utama.appendChild(div_home);
    div_utama.className += 'span12';
    div_utama.style.marginBottom = "50px";

    data_track.appendChild(div_utama);

}

function error(e) {
    console.log(e);
}
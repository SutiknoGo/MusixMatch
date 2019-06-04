const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('artist_id');

const __BASE_URL__      = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/';
const __TRACK__         = 'track.search?f_artist_id=';
const __SEARCH__        = '&page_size=10&page=1&s_track_rating=desc';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';

// Lyrics
fetch(__BASE_URL__ + __TRACK__ + artistId + __SEARCH__ + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleTrackResponse)
    .catch(error);

function handleTrackResponse(data) {
    tracks = data.message.body;
    trackList = tracks.track_list
    console.log('Tracks length: ', trackList.length);

    number = trackList.length;
    showTrack(number);
}

function showTrack(number, ranking=1) {
    list_element = document.getElementById('list');
    button_back = document.getElementById('back');
    
     // Button Back
    var button   = document.createElement('button');
    button.className = 'btn btn-dark btn-lg btn-block';
    button.innerHTML = '<< View Other Artist';
    button.style.marginBottom = '10px';

    button.onclick = () => {
        location.href = './artist.html';
    };

    button_back.appendChild(button);

    loadTrackElement(list_element, number, ranking, button_back);
}

function loadTrackElement(list_element, number, ranking, button_back) {
    if (trackList.length <= 0 || number <= 0) {
        return;
    }

    let track = trackList.pop();
    console.log(track);

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
    button_detail.innerHTML = 'View Lyric >>';


    button_detail.onclick = () => {
        location.href = './artist_track_lyric.html?track_id=' + track.track.track_id;
    };

    // child contains: 
    var track_name   = document.createElement('span');
    var rank         = document.createElement('span');
    var album        = document.createElement('p');
    var explicit     = document.createElement('p');
    var genre        = document.createElement('p');
    var artist       = document.createElement('p');
    var lastUpdate   = document.createElement('p');

    
    track_name.innerHTML = track.track.track_name;
    track_name.className += 'date';
    track_name.style.fontSize = "17px";
    
    rank.innerHTML = ranking;
    rank.className += 'tags';
    rank.style.fontSize = "20px";

    album.innerHTML = "Album : " + track.track.album_name;
    album.className = 'album';
    album.style.fontWeight = 'bold';

    artist.innerHTML = "Artist : " + track.track.artist_name;
    artist.className = 'artist';

    if (track.track.primary_genres.music_genre_list.length == 0) {
        genre.innerHTML = "Genre : - ";
        genre.className += 'genre';

    } else {
        genre.innerHTML = "Genre : " + track.track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
        genre.className += 'genre';
    }

    if (track.track.explicit == 0) {
        explicit.innerHTML = "Explicit Words : No ";
        explicit.className += 'explicit';

    } else {
        explicit.innerHTML = "Explicit Words : Yes";
        explicit.className += 'explicit';
    }

    date = track.track.updated_time.slice(0, 10);

    lastUpdate.innerHTML = "Updated Time : " + date;
    lastUpdate.className += 'updatedTime';



    div_post.appendChild(icon);
    div_post.appendChild(track_name);
    div_post.appendChild(rank);

    div_entry.appendChild(album);
    div_entry.appendChild(explicit);
    div_entry.appendChild(genre);
    div_entry.appendChild(artist);
    div_entry.appendChild(lastUpdate);
    div_entry.appendChild(button_detail);

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
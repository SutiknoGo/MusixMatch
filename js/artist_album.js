const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('artist_id');

const __BASE_URL__      = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/';
const __ALBUM__         = 'artist.albums.get?artist_id=';
const __SEARCH__        = '&s_release_date=desc&g_album_name=1';
const __API_KEY__       = '&apikey=00db4374259d474f1e530e7cf75bc23c';

// Lyrics
fetch(__BASE_URL__ + __ALBUM__ + artistId + __SEARCH__ + __API_KEY__)
    .then((resp) => resp.json())
    .then(handleAlbumResponse)
    .catch(error);

function handleAlbumResponse(data) {
    albums = data.message.body.album_list;
    // console.log('Album: ', albums);

    number = albums.length;
    showAlbum(number);
}

function showAlbum(number, ranking=1) {
    list_element = document.getElementById('list');
    button_back = document.getElementById('back');
    
    // Button Back
    var button   = document.createElement('button');
    button.className = 'btn btn-dark btn-lg btn-block';
    button.innerHTML = '<< View Album From Other Artists';
    button.style.marginBottom = '10px';

    button.onclick = () => {
        location.href = './artist.html'; 
    };
    button_back.appendChild(button);

    loadAlbumElement(list_element, number, ranking);
}

function loadAlbumElement(list_element, number, ranking) {
    if (albums.length <= 0 || number <= 0) {
        return;
    }

    let album = albums.pop();
    console.log(album);

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
    button_detail.innerHTML = " View all tracks from '"+  album.album.album_name  + "' >> ";


    button_detail.onclick = () => {
        location.href = './artist_album_track.html?album_id=' + album.album.album_id;
    };

    // child contains: 
    var album_name   = document.createElement('span');
    var rank         = document.createElement('span');
    var pline        = document.createElement('p');
    var release      = document.createElement('p');
    var genre        = document.createElement('p');
    var artist       = document.createElement('p');
    var lastUpdate   = document.createElement('p');

    
    album_name.innerHTML = album.album.album_name;
    album_name.className += 'date';
    album_name.style.fontSize = "17px";
    
    rank.innerHTML = ranking;
    rank.className += 'tags';
    rank.style.fontSize = "20px";

    if (album.album.album_pline == 0){
        pline.innerHTML = "Pline : - ";
        pline.className += 'pline';
    } else {
        pline.innerHTML = "Pline : " +  album.album.album_pline;
        pline.className += 'pline';
    }

    release.innerHTML =  "Release Date : " + album.album.album_release_date;
    release.className += 'release';

    artist.innerHTML =  "Artist : " + album.album.artist_name;
    artist.className += 'artist';


    if(album.album.primary_genres.music_genre_list.length == 0){
        genre.innerHTML = "Genre : - ";
        genre.className += 'genre';

    } else {
        genre.innerHTML = "Genre : " + album.album.primary_genres.music_genre_list[0].music_genre.music_genre_name;
        genre.className += 'genre';
    }

    date = album.album.updated_time.slice(0, 10);

    lastUpdate.innerHTML = "Updated Time : " + date;
    lastUpdate.className += 'updatedTime';



    div_post.appendChild(icon);
    div_post.appendChild(album_name);
    div_post.appendChild(rank);

    div_entry.appendChild(release);
    div_entry.appendChild(pline);
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

    setTimeout(function(){ loadAlbumElement(list_element, number - 1, ranking + 1) }, 1500);
}

function error(e) {
    console.log(e);
}
import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';


function App() {
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
  const args = JSON.parse(document.getElementById("data").text);
  const [numClicks, setNumClicks] = useState(0);
  const [artists, setArtists] = useState(args.artist_ids);
  const [entered_artist, setEnteredArtists] = useState('');

  const deleteArtist = (id) => {
    setArtists(artists.filter(el => el !== id));
  }

  function onButtonClick() {
    console.log(JSON.stringify({ "num_clicks": numClicks }))
    fetch('/increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "num_clicks": numClicks }),
    }
    ).then(response => response.json()).then(data => {
      console.log(data);
      setNumClicks(data.num_clicks_server);
    });
  }

  function add() {
    return console.log('Clicked!')
  }

  return (
    <>
      <h1> Song Explorer </h1>
      <button onClick={onButtonClick}> Click me! </button>
      <h1>Button has been clicked {numClicks} times!</h1>
      {args.has_artists_saved ? (
        <>
          <h2>{args.song_name}</h2>
          <h3>{args.song_artist}</h3>
          <div>
            <img src={args.song_image_url} width={300} height={300} />
          </div>
          <div>
            <audio controls>
              <source src={args.preview_url} />
            </audio>
          </div>
          <a href={args.genius_url}> Click here to see lyrics! </a>
        </>
      ) : (
        <h2>Looks like you don't have anything saved! Use the form below!</h2>
      )
      }
      <>
        <h1>Your saved artists:</h1>
        {artists.map(artist_id => {
          return (
            <div>
              <p>{artist_id}</p> <button onClick={() => deleteArtist(artist_id)}>Delete</button>
            </div>
          )
        })}
      </>
      <h1>Save a favorite artist ID for later:</h1>
      <form method="POST" action="/save">
        <input type="text" name="artist_id" />
        <input type="submit" value="Submit" />
        <input type="submit" value="Add" onClick={add} />
      </form>
    </>
  );
}

export default App;

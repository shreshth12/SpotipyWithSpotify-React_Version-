import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';


function App() {
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
  const args = JSON.parse(document.getElementById("data").text);
  const [artists, setArtists] = useState(args.artist_ids);
  const [error, setError] = useState('');

  const deleteArtist = (id) => {
    setArtists(artists.filter(el => el !== id));
  }

  function addArtist(event) {
    event.preventDefault();
    const artist_name = event.target.artist_name.value;
    setArtists(oldArray => [...oldArray, artist_name]);
  };

  function printAddedArtists(event) {
    event.preventDefault()
    // console.log(JSON.stringify({ "artists": artists }));
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "artists": artists }),
    }).then(response => response.json()).then(data => {
      console.log(data);
      setArtists(data.artists_from_server);
      if (data.error) {
        setError("Invalid artist ID: " + data.whichArg);
      }
      else {
        window.location.reload(true);
      }
    })

  }

  return (
    <>
      <h3>{error}</h3>
      <h1> {args.current_user}'s Song Explorer </h1>
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

      <form onSubmit={(event) => addArtist(event)}>
        <input type="text" name="artist_name" />
        <button type="submit">Add</button>
        <button type="submit" onClick={(event) => printAddedArtists(event)}>Submit</button>
      </form>
    </>
  );
}

export default App;

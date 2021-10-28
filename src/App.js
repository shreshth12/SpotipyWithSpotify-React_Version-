import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
  crossorigin="anonymous"
/>

function App() {
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
  const args = JSON.parse(document.getElementById("data").text);
  const [artists, setArtists] = useState(args.artist_ids);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState("");

  const deleteArtist = (id) => {
    setArtists(artists.filter(el => el !== id));
  }

  function addArtist(event) {
    event.preventDefault();
    const artist_name = event.target.artist_name.value;
    setArtists(oldArray => [...oldArray, artist_name]);
    setInputValue("");
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
      <div class="alert alert-danger" role="alert">
        <h3>{error}</h3>
      </div>

      <h1 className="text-uppercase font-weight-bold"> {args.current_user}'s Song Explorer </h1>
      {args.has_artists_saved ? (
        <>
          <div className="container border border-dark">
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
            <p><a href={args.genius_url}> Click here to see lyrics! </a></p>
          </div>
        </>
      ) : (
        <h2>Looks like you don't have anything saved! Use the form below!</h2>
      )
      }
      <>
        <div className="container border border-dark">
          <h1>Your saved artists:</h1>
          {artists.map(artist_id => {
            return (
              <div className="container">
                {artist_id} <button className="btn btn-danger btn-sm" onClick={() => deleteArtist(artist_id)}>Delete</button><br></br>
              </div>
            )
          })}
        </div>
      </>
      <div className="container border border-dark">

        <h1>Save a favorite artist ID for later:</h1>

        <form onSubmit={(event) => addArtist(event)}>
          <input type="text" name="artist_name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <button type="submit" className="btn btn-secondary btn-sm">Add</button>
          <button type="submit" className="btn btn-success btn-sm" onClick={(event) => printAddedArtists(event)}>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;

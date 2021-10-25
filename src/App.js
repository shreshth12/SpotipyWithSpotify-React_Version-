import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';


function App() {
  // fetches JSON data passed in by flask.render_template and loaded
  // in public/index.html in the script with id "data"
  const args = JSON.parse(document.getElementById("data").text);

  // TODO: Implement your main page as a React component.
  let has_artists_saved = false;
  return(
    <>
    <h1> Song Explorer</h1>
		{ args.has_artists_saved ? (
      <>
			<h2>{ args.song_name }</h2>
			<h3>{ args.song_artist }</h3>
			<div>
				<img src={ args.song_image_url } width={300} height={300}/>
			</div>
			<div>
				<audio controls>
					<source src={ args.preview_url }/>
				</audio>
			</div>
			<a href={ args.genius_url }> Click here to see lyrics! </a>
      </>
  ):(
    <h2>Looks like you don't have anything saved! Use the form below!</h2>
  )
  }
		<h1>Save a favorite artist ID for later:</h1>
		<form method="POST" action="/save">
            <input type="text" name="artist_id"/>
            <input type="submit" value="Submit"/>
        </form>
    </>
  );
}

export default App;

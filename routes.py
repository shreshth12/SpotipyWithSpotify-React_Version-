from vars import app, db
import flask, os, base64, requests, random, json
from genius import get_lyrics_link
from spotify import get_access_token, get_song_data
from flask import redirect, url_for
from flask_login import login_user, current_user, login_required, logout_user
from models import Artist, User

bp = flask.Blueprint("bp", __name__, template_folder="./build")


@bp.route("/index")
@login_required
def index():
    # TODO: insert the data fetched by your app main page here as a JSON
    artists = Artist.query.filter_by(username=current_user.username).all()
    artist_ids = [a.artist_id for a in artists]
    has_artists_saved = len(artist_ids) > 0
    if has_artists_saved:
        artist_id = random.choice(artist_ids)

        # API calls
        access_token = get_access_token()
        (song_name, song_artist, song_image_url, preview_url) = get_song_data(
            artist_id, access_token
        )
        genius_url = get_lyrics_link(song_name)

    else:
        (song_name, song_artist, song_image_url, preview_url, genius_url) = (
            None,
            None,
            None,
            None,
            None,
        )

    DATA = {
        "has_artists_saved": has_artists_saved,
        "song_name": song_name,
        "song_artist": song_artist,
        "song_image_url": song_image_url,
        "preview_url": preview_url,
        "genius_url": genius_url,
        "artist_ids": artist_ids,
        "current_user": current_user.username,
    }

    data = json.dumps(DATA)
    return flask.render_template(
        "index.html",
        data=data,
    )


app.register_blueprint(bp)


def get_access_token():
    auth = base64.standard_b64encode(
        bytes(
            f"{os.getenv('SPOTIFY_CLIENT_ID')}:{os.getenv('SPOTIFY_CLIENT_SECRET')}",
            "utf-8",
        )
    ).decode("utf-8")
    response = requests.post(
        "https://accounts.spotify.com/api/token",
        headers={"Authorization": f"Basic {auth}"},
        data={"grant_type": "client_credentials"},
    )
    json_response = response.json()
    return json_response["access_token"]


@app.route("/signup")
def signup():
    return flask.render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_post():
    username = flask.request.form.get("username")
    user = User.query.filter_by(username=username).first()
    if user:
        pass
    else:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()

    return flask.redirect(flask.url_for("login"))


@app.route("/login")
def login():
    return flask.render_template("login.html")


@app.route("/login", methods=["POST"])
def login_post():
    username = flask.request.form.get("username")
    user = User.query.filter_by(username=username).first()
    if user:
        login_user(user)
        return flask.redirect(flask.url_for("bp.index"))

    else:
        return flask.jsonify({"status": 401, "reason": "Username or Password Error"})


@app.route("/save", methods=["POST"])
def save():
    artists = flask.request.json.get("artists")
    # artist_id = flask.request.form.get("artist_id")
    all_artists = Artist.query.filter_by(username=current_user.username).all()

    if len(artists) == 0:
        for x in all_artists:
            db.session.delete(x)
            db.session.commit()

    for artist in artists:
        try:
            username = current_user.username
            access_token = get_access_token()
            get_song_data(artist, access_token)

            all_artists = Artist.query.filter_by(username=username).all()

            if len(artists) == 0:
                for x in all_artists:
                    db.session.delete(x)
                    db.session.commit()

            for x in all_artists:
                if x.artist_id not in artists:
                    db.session.delete(x)
                    db.session.commit()

            url = Artist.query.filter_by(artist_id=artist, username=username).first()
            if url:
                pass
            else:
                db.session.add(Artist(artist_id=artist, username=username))
                db.session.commit()
        except Exception:
            print(f"Artist ID: {artist} was invalid")
            flask.flash("Invalid artist ID entered")

    return flask.jsonify({"artists_from_server": artists})


@app.route("/")
def main():
    if current_user.is_authenticated:
        return flask.redirect(flask.url_for("bp.index"))
    return flask.redirect(flask.url_for("login"))


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("login"))

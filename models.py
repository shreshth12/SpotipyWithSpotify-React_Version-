from vars import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_name):
    return User.query.get(user_name)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))

    def __repr__(self):
        return f"<User {self.username}>"

    def get_username(self):
        return self.username


class Artist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f"<Artist {self.artist_id}>"


db.create_all()

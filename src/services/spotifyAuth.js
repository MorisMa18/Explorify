export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectURL = 'http://localhost:3000/';
const clientId = '724eb56595034da2a4693dacc30288f0';

// Scopes
const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "playlist-modify-public",
    "playlist-modify-private",
];

// Strip the access_token
export const getTokenFromResponse = () => {
    return window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
  
        return initial;
      }, {});
  };

// Construct loginURL
export const loginURL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectURL}&scope=${scopes.join(
    '%20'
)}&response_type=token&show_dialog=true`;
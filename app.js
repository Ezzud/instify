/*


	File and package requirement


*/
const SpotifyWebApi = require('spotify-web-api-node');
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');
const credentials = require('./credentials.json');
const cookieStore = new FileCookieStore('./cookies.json');
const config = require('./config.json');

/*


	Variables


*/
let spotifyReady = false;
let instaReady = false;
var insta_acc;
var spotify_acc;

/*


	Check if missing credentials


*/
if (!credentials) {
    console.error(`Le fichier de configuration est vide ou inexistant!`)
    process.exit(0);
}
if (!credentials.spotifyClientID || !credentials.spotifyClientSecret || !credentials.instagramUsername || !credentials.instagramPassword) {
    console.error(`Une valeur de connexion est manquante dans le fichier "credentials.json"`);
    process.exit(0);
}


/*


	API Calls


*/
const spotifyApi = new SpotifyWebApi({
    clientId: credentials.spotifyClientID,
    clientSecret: credentials.spotifyClientSecret
});
spotifyApi.setAccessToken(credentials.accessToken);
spotifyApi.setRefreshToken(credentials.refreshToken);
const username = credentials.instagramEmail;
const password = credentials.instagramPassword;
const client = new Instagram({
    username: username,
    password: password,
    cookieStore: cookieStore
});



/*


	Account connection test


*/
console.log("Connecting")
async function spotifyConnect() {
    let profile = await spotifyApi.getMe();
    if (!profile) {
        return false;
    } else {
    	spotify_acc = profile.body.display_name
        spotifyReady = true
        return true;
    }
}

async function instagramConnect() {
client.login()
  	  .then(async() => {
  	  	instaReady = true
    	let profile = await client.getProfile()
    	console.log(`Connected as ${profile.username}`)
    	insta_acc = profile.username
 	   })
  	  .catch(err => {
  	  	console.error(err)
  	  })
}



/*


	Main function


*/
async function run() {
	let oldtitle;
	await instagramConnect()
	await refresh()
    setInterval(async () => {
        if (await spotifyConnect() === false) return;
        if(instaReady === false) return;
        let data = await spotifyApi.getMyCurrentPlaybackState().catch(err => {
            console.error(err)
        })
        if (data.body && data.body.is_playing) {
            let song = await spotifyApi.getMyCurrentPlayingTrack().catch(err => {
                console.error(err)
            })
            let title = song.body.item.name
            if(title === oldtitle) {
            let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
            return;
            }
            oldtitle = title;
            let artist = song.body.item.artists[0].name;
            let format = config.track.replace("%title%", title).replace("%author%", artist);
            format = config.bio.replace("%track%", format)
    		if(instaReady === false) return;
            console.log(format)
            let profile = await client.getProfile()
            await client.updateProfile({ username:profile.username, name:profile.first_name, gender:profile.gender, phoneNumber:profile.phone_number, email:profile.email, website:profile.external_url, biography:`${format}`})
            let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
            console.log("Bio updated!")
        } else {
        	let title = "Rien du tout"
        	if(title === oldtitle) {
                    let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
            return;
        	}
        	oldtitle = title
        	let format = config.bio.replace("%track%", "Rien pour le moment")
        	let profile = await client.getProfile()
            await client.updateProfile({ username:profile.username, name:profile.first_name, gender:profile.gender, phoneNumber:profile.phone_number, email:profile.email, website:profile.external_url, biography:`${format}`})
            let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
            console.log("Bio updated!")
        }
    }, 5000);
}

function refresh() {
	    spotifyApi.refreshAccessToken().then(function(data) {
        	console.log('The access token has been refreshed!');
        	spotifyApi.setAccessToken(data.body['access_token']);
    	}, function(err) {
        	console.log('Could not refresh access token', err);
    	});
	setInterval(async () => {
	    spotifyApi.refreshAccessToken().then(function(data) {
        	console.log('The access token has been refreshed!');
        	spotifyApi.setAccessToken(data.body['access_token']);
    	}, function(err) {
        	console.log('Could not refresh access token', err);
    	});
	}, 60000)
}
run()
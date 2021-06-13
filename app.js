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
if (!credentials.spotifyClientID || !credentials.spotifyClientSecret || !credentials.instagramEmail || !credentials.instagramPassword || !credentials.accessToken || !credentials.refreshToken) {
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
    client.login().then(async () => {
        instaReady = true
        let profile = await client.getProfile()
        console.log(`Connected as ${profile.username}`)
        insta_acc = profile.username
    }).catch(err => {
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
        if (instaReady === false) return;
        let data = await spotifyApi.getMyCurrentPlaybackState().catch(err => {
            console.error(err)
        })
        if (data.body && data.body.is_playing) {
            let song = await spotifyApi.getMyCurrentPlayingTrack().catch(err => {
                console.error(err)
            })
            let title = song.body.item.name
            if (title === oldtitle) {
            let artist = song.body.item.artists[0].name;
            let timefor = await formatDate(song.body.progress_ms);
            let timeto = await formatDate(song.body.item.duration_ms);
            let pourcent = (song.body.progress_ms * 100) / song.body.item.duration_ms
            pourcent = await makePourcent(pourcent, timefor, timeto)
            let format = config.track.replace("%title%", title).replace("%author%", artist).replace("%duration%", pourcent);
            format = config.bio.replace("%track%", format)
            if (instaReady === false) return;
            let profile = await client.getProfile()
            await client.updateProfile({
                username: profile.username,
                name: profile.first_name,
                gender: profile.gender,
                phoneNumber: profile.phone_number,
                email: profile.email,
                website: profile.external_url,
                biography: `${format}`
            })
            let bio = await client.getProfile()
            bio = bio.biography
                console.clear()
                console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
                return;
            }
            oldtitle = title;
            let artist = song.body.item.artists[0].name;
            let timefor = await formatDate(song.body.progress_ms);
            let timeto = await formatDate(song.body.item.duration_ms);
            let pourcent = (song.body.progress_ms * 100) / song.body.item.duration_ms
            pourcent = await makePourcent(pourcent, timefor, timeto)
            let format = config.track.replace("%title%", title).replace("%author%", artist).replace("%duration%", pourcent);
            format = config.bio.replace("%track%", format)
            if (instaReady === false) return;
            let profile = await client.getProfile()
            await client.updateProfile({
                username: profile.username,
                name: profile.first_name,
                gender: profile.gender,
                phoneNumber: profile.phone_number,
                email: profile.email,
                website: profile.external_url,
                biography: `${format}`
            })
            let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}\nPourcent: ${pourcent}`)
            console.log("Bio updated!")
        } else {
            let title = config.nolistening
            if (title === oldtitle) {
                let bio = await client.getProfile()
                bio = bio.biography
                console.clear()
                console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
                return;
            }
            oldtitle = title
            let format = config.bio.replace("%track%", config.nolistening)
            let profile = await client.getProfile()
            await client.updateProfile({
                username: profile.username,
                name: profile.first_name,
                gender: profile.gender,
                phoneNumber: profile.phone_number,
                email: profile.email,
                website: profile.external_url,
                biography: `${format}`
            })
            let bio = await client.getProfile()
            bio = bio.biography
            console.clear()
            console.log(`Compte Spotify: ${spotify_acc || `Inconnu`}\nCompte Instagram: ${insta_acc || `Inconnu`}\nBio: ${bio}`)
            console.log("Bio updated!")
        }
    }, 10000);
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

function formatDate(t) {
    let remainingTime = new Date(t)
    let roundTowardsZero = remainingTime > 0 ? Math.floor : Math.ceil;
    let minutes = roundTowardsZero(remainingTime / 60000) % 60,
        seconds = roundTowardsZero(remainingTime / 1000) % 60;
    let m;
    let s;
    if (minutes > 0) {
        m = `${minutes}m`
    } else if (minutes === 0) {
        m = ``
    } else {
        m = ``
    }
    if (seconds > 0) {
        s = `${seconds}s`
    } else if (seconds === 0) {
        s = ``
    } else {
        s = ``
    }
    let msg = `${m || " "} ${s || " "}`
    return msg;
}

function makePourcent(n, tf, tt) {
    let pr = "0s [—————] 0s";
    if (n <= 20) {
        pr = `${tf} [🟠————] ${tt}`
    } else if (n > 20 && n <= 40) {
        pr = `${tf} [—🟠———] ${tt}`
    } else if (n > 40 && n <= 60) {
        pr = `${tf} [——🟠——] ${tt}`
    } else if (n > 60 && n <= 80) {
        pr = `${tf} [———🟠—] ${tt}`
    } else if (n > 80 && n <= 100) {
        pr = `${tf} [————🟠] ${tt}`
    }
    return pr;
}
run()
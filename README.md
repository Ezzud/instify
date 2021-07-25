# Instify
![Logo](https://repository-images.githubusercontent.com/376559510/f0030580-cc72-11eb-9e8c-9f2ee01a8aca)

[![Size](https://img.shields.io/github/last-commit/Ezzud/instify)]()\
[![Github package.json version](https://img.shields.io/github/package-json/v/Ezzud/instify)]()\
[![Downloads](https://img.shields.io/github/downloads/Ezzud/instify/total)]\
<br>

If you like the code and want to support me:<br>
[![follow](https://img.shields.io/github/followers/Ezzud?label=Follow%20me&style=social)]() [![follow](https://img.shields.io/github/stars/Ezzud/instify?style=social)]() [![follow](https://img.shields.io/github/watchers/Ezzud/instify?label=Follow%20repository&style=social)]()
<h2>Description</h2>
Displays your spotify current track on your instagram biography, editable track display and biography


<h2>Features</h2>
<p>

- 15s delay
- Spotify Token auto-refresh
- Prevent fast profile updating so I won't be blocked :D
- Work on a computer or a vps
</p>


<h2>Installation</h2>

<h3>Requirements</h3>
<p>

- [NodeJS and NPM](https://nodejs.org/en/download/)
- Download [the repository](https://github.com/Ezzud/instify/archive/refs/heads/main.zip)
- Spotify Account (Free or Premium, don't care)
- Instagram Account (Private or Public, don't care too)

</p>

<h3>How to launch program</h3>
<p>

- Extract the source code on your computer
- ⚠⚠ Open the `credentials.json` and see how to get all the credentials below! ⚠⚠
- Edit `config.json` file as you want, but DON'T REMOVE %title%, %author% and %track% ! (PS: \n = a line break)
- Copy path to the extracted folder
- Press Windows + R, write `cmd` and press **Enter**
- on the console, write: `cd Path/to/the/code` and press enter
- Now write `npm install --save` and press enter
- once all the packages have been installed, write `node app.js`
If all the credentials are valid, program should start and change your bio as the window is opened every 5s

</p>


<h3>How to get ClientID and ClientSecret:</h3>
<p>

- Go to: https://developer.spotify.com/dashboard/
- Connect to your spotify account
- Click on "create an app"
- Choose a name, description, and accept terms
- Copy **ClientID** and click on "*Show client secret*"
- Now you have your client id and secret!

</p>

<h3>How to get AccessToken and RefreshToken</h3>
<p>

- *Go on your spotify dashboard*
- Click on your application
- Click on **edit settings**
- On the "redirect URI" tab, add the website `https://ezzud.tk/portfolio/`
- Copy and go on this url with changing client ID by your application client id: `https://accounts.spotify.com/authorize?response_type=code&client_id=YOUR CLIENT ID&scope=user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing&redirect_uri=https:%2F%2Fezzud.tk%2Fportfolio%2F&show_dialog=true`
- Accept authorization
- U got redirected on `ezzud.tk/portfolio/?code=random_code`
- Copy all the caracters after "?code="
- Press Windows + R, Write "cmd" and press Enter
- Copy with changing values by your application values and your code: 
```bash

curl -d grant_type=authorization_code -d client_id=YOUR CLIENT ID -d client_secret=YOUR CLIENT SECRET -d code=THE CODE YOU COPIED BEFORE -d redirect_uri=https%3A%2F%2Fezzud.tk%2Fportfolio%2F https://accounts.spotify.com/api/token
```

- If all is good u will receive something like this: 
```json

{
"access_token":"Random characters unique to each account",
"token_type":"Bearer",
"expires_in":3600,
"refresh_token":"Random characters unique to each account",
"scope":"user-modify-playback-state user-read-playback-state user-read-currently-playing user-read-email user-read-private"
}
```
- Copy list of characters after "access_token" and paste in the `credentials.json` file, for the value **accessToken**
- Copy list of characters after "refresh_token" and paste in the `credentials.json` file, for the value **refreshToken**

</p>


<br></br>



You can support me on paypal: https://paypal.me/ezzudd

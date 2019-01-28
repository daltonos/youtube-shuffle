const express = require('express')
const http = require('http')
const app = express()
const port = 3000
const {google} = require('googleapis');
const youtube = google.youtube('v3');

let arrayOfIds = [];
let finalRes;
let playlistId = [INSERT_PLAYLIST_ID_HERE_FROM_YOUTUBE];


function getPageFromPlaylist(nextToken) {
    let requestObject = {
      key: [PLACE_YOUR_YOUTUBE_APP_KEY_HERE_FROM_GOOGLE_CONSOLE],
      part: 'id,snippet',
      playlistId: playlistId,
      maxResult: 10,
    }
    
    if (nextToken != 'start') requestObject.pageToken = nextToken;

    youtube.playlistItems.list(requestObject , (err, results) => {

        if(err) return;
        
        //accumulate ids
        results.data.items.forEach(function(video){
            arrayOfIds.push(video.snippet.resourceId.videoId);
        });
        
        if(results.data.nextPageToken){
            getPageFromPlaylist(results.data.nextPageToken);
        } else {
            finalRes.send(arrayOfIds[Math.floor(Math.random()*arrayOfIds.length)]);
        }
    });
}

app.get('/', (req, res) => {
    finalRes = res;
    playlistId = req.query.playlist;
    getPageFromPlaylist('start');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

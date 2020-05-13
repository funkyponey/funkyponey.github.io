// This script was written to extract values of a CSV file (single column) and append its values
// as parameters in an API call.  
// Written in node.js by E.Perl on 12/05/2020

var unirest = require("unirest");
var neatCsv = require('neat-csv');
var fs = require('fs');

// place your csv file in the same directory and replace the string below with the file name
fs.readFile("twitch_topStreams_tagsIds.csv", async (err,data) => {
    if (err) {
        console.error(err)
        return
    } 
    var csvArray = await neatCsv(data);
    console.log(csvArray.length);

    // this will concatenate all the values of csvArray with a delimiter in between
    // e.g. if csvArray[0] = "tag1" and csvArray[1] = "tag2" and delimiter delimiter = "&tag_id="
    // then values = "&tag_id=tag1&tag_id=tag2"
    var values = '';
    var delimiter = "&tag_id="
    for(var i = 1; i < csvArray.length; i++){
        values += delimiter + Object.values(csvArray[i]);
    }
    console.log(values);

    // replace the string with your API endpoint + the first parameter to be repeated (in this format: "?key=")
    // the final value of "url", with the example above, will be 
    // https://api.twitch.tv/helix/tags/streams?tag_id=&tag_id=tag1&tag_id=tag2
    var url = "https://api.twitch.tv/helix/tags/streams?tag_id=" + Object.values(csvArray[0]) + values
    console.log(url);
    var req = unirest("GET", url);

    req.headers({
        // change the below with your API client ID
        "Client-ID": "xxxxxxxx",
        "useQueryString": true,
        // change the below with your authorization token if necessary
        "Authorization": "Bearer xxxxxxx"
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
        var json = JSON.stringify(res.body);
        // replace the name of the json file in which we will write the results
        fs.writeFileSync("twitch_topStreams_tagsIds.json", json);
    });

});



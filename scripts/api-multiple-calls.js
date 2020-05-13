// This script reads elements from a csv file and make as many unique API calls using those elements as parameters
// this is useful when an API call accepts one parameter at a time only
// written in node.js by E.Perl on 12/05/2020

var unirest = require("unirest");
var neatCsv = require('neat-csv');
var fs = require('fs');

// replace with the name of your csv file containing the elements
fs.readFile("test.csv", async (err,data) => {
    if (err) {
        console.error(err)
        return
    } 

    // loops through the csv and puts the elements into an array
    var csvArray = await neatCsv(data);
    var userIDs = [];
    for(var i = 0; i < csvArray.length; i++){
        userIDs.push(Object.values(csvArray[i]));
    }

    // creates an array with each API calls
    var urls = [];
    for (var x = 0; x < userIDs.length; x++){
        // change with your API endpoint + the key of your parameter (in the format ?key= or &key=)
        urls.push("https://api.twitch.tv/helix/users/follows?first=1&to_id=" + userIDs[x][0])
    }

    var requests = urls.map(function(id) {
        return new Promise(function(resolve, reject) {
            
          return unirest.get(id)
                .header({
                    // replace the below with the client id
                    "Client-ID": "xxx",
                    "useQueryString": true,
                    // replace the below with your auth token if needed
                    "Authorization": "Bearer xxx"
                })
                .end(function(data){
                resolve(data);
                        
          });
        });
      });

      // runs as many API calls as there are
      Promise.all(requests).then(function(result) {
        var content = result.map(function(user) {
          return user.body;    
        });
      
        // the code below is not necessary. i needed to extract only one portion of the API response (i.e. total amount of followers) and push that into an array
        var totals = [];
        var values = Object.entries(content);
        for (var x = 0; x < values.length; x++){
          var value = values[x][1];
          totals.push(value["total"]);
        }
        
        var json = [];
        for (var y = 0; y < userIDs.length; y++){
          var users = Number(userIDs[y][0]);
          var usersTotals = {user:users, total:totals[y]};
          json.push(usersTotals);
        }

        // this will write the API response into a json file
        var txt = JSON.stringify(json);
        fs.writeFileSync("finaltest.json", txt);

      });

});



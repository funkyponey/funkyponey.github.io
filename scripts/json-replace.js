/* this script replaces all occurences of a specified character in a json file by another character of your choice */
/* use cases: when exporting a jsonl file into bigquery and there's an unsupported character */
/* written for node.js */

var fs = require('fs');

// replace this value with the name of your json file without the extension
var jsonFile = "TESTstreamstags"

var txtFile = "interim.txt"

var jsonData = fs.readFileSync(jsonFile + ".json");

fs.writeFileSync(txtFile, jsonData);
var txtData = fs.readFileSync(txtFile);

var content = JSON.parse(txtData);
var str = JSON.stringify(content);

// change the character between the 2 // (in this case -) that you want to replace
// change the character between the 2 '' (in this case _) that you want it replaced with
var replacedTxt = str.replace(/-/g, '_');

// the script will keep your original json file and create new json file with the same name apprended by - NEW.
fs.writeFileSync(jsonFile + " - NEW.json", replacedTxt);
fs.unlinkSync(txtFile);

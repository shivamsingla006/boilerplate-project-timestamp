// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const req = require('express/lib/request');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
let checkIfValidDate = (date) => {
  // Check if the date parameter is empty
  if (!date) {
      return { isEmpty: true };
  }

  // If it's a number (Unix timestamp), treat it as valid
  if (!isNaN(date) && !isNaN(parseFloat(date))) {
      return { isDateType: false }; // Unix timestamp
  }

  // Try to parse the date string
  let newDate = new Date(date);
  if (isNaN(newDate.getTime())) {
      return { isDateType: true }; // Invalid date string
  }

  return { isDateType: false }; // Valid date string
}

app.get("/api/:date?", function(req, res) {  // Making the date parameter optional
  let validObj = checkIfValidDate(req.params.date);
  
  if (validObj.isEmpty) {
      // If date is empty, return the current time in both unix and utc formats
      return res.json({
          unix: Number(new Date().getTime()),
          utc: new Date().toUTCString()
      });
  } else if (validObj.isDateType) {
      // If it's an invalid date string, return an error
      return res.json({
          error: "Invalid Date"
      });
  } else {
      // If it's a valid date or Unix timestamp, return the time in both formats
      let date = new Date(req.params.date);
      if (!isNaN(req.params.date)) {
          // If it's a Unix timestamp, use the timestamp to generate the date
          date = new Date(Number(req.params.date));
      }
      return res.json({
          unix: date.getTime(),
          utc: date.toUTCString()
      });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

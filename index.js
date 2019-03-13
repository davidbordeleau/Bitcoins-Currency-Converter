const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  var crypto = req.body.crypto;
  var fiat = req.body.fiat;

  var amount = req.body.amount;

  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: fiat,
      amount: amount
    }
  };

  request(options, function(error, response, body) {
    var data = JSON.parse(body);
    var price = data.price;

    var currentDate = data.time;

    let today = new Date();

    let hr = today.getHours();
    let min = ('0'+today.getMinutes()).slice(-2);

    let options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("result", {
      hr: hr,
      min: min,
      day: day,
      data: data,
      price: price,
      crypto: crypto,
      fiat: fiat,
      amount: amount
    });
  });
});

app.listen(3000, function() {
  console.log("Our server is running on port 3000");
});



const express = require('express');
const app = express();
const port  = 3000;
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Code when getting a POST request from signup button
app.post("/", function(req, res){

    //using bodyParser to get info from input fields
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //creating a data object to send to mailchimp servers
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const listID = "da4edc1dce";
    const url = "https://us17.api.mailchimp.com/3.0/lists/" + listID;
    const options = {
        method: "POST",
        auth: "ManrajSingh6:{apiKey}"
    }
        
    const request = https.request(url, options, function(response){

        //if successfull response, proceed with the signup process
        //else send user to failure page to try again
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
            response.on("data", function(data){
                console.log(JSON.parse(data));
            });
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Started server on port: " + port);
});

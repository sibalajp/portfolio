const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const request = require('request');
const path = require('path')
const fs = require('fs');


const app = express();

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/static"))
app.use(express.static(__dirname + "/js"))

app.get('/', (req, res) => {
	res.render('index')
})



app.post('/send', (req,res) => {
    

    const secretKey = "6LcBKYoUAAAAAKgEcJTMWVcUmx7TGhEHBGT-7x_w";

    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
        
    const output = `
    <p> Message From Portfolio </p>
       <h3> Contact Detail </h3>
        <ul>
            <li>First Name: ${req.body.first_name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
    <p></p>
    `

    let transporter = nodemailer.createTransport({
        host: 'in-v3.mailjet.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '6a167c56dc5c83f634bfcf7d22e548a1', 
            pass: '7dc249606bf889e1b5dd4877ad54bef3'  
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    let mailOptions = {
        from: '"Portfolio Mail" <sibalajp@gmail.com>', 
        to: 'sibalajp@gmail.com', 
        subject: 'POTFIOLIO MESSAGE from: ' + req.body.first_name , 
        text: 'Hello world?',
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);  
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('index', {msg: 'MAIL SENT'});
    });

    
    });



	

    

});



app.listen(process.env.PORT || 3000)
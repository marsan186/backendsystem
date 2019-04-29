const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

exports.sendMailtoUser = function (req, res, next) {

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fsefood2019@gmail.com',
            pass: 'fsAdmin@123'
        }
    }));

    var mailOptions = {
        from: 'fsefood2019@gmail.com',
        to: req,
        subject: 'Vendor Registered Successfully',
        text: 'Vendor register successfully. You will get confirmation shortly!!!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + req);
        }
    });

}


exports.sendOtpToUser = function (req, res, next) {

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fsefood2019@gmail.com',
            pass: 'fsAdmin@123'
        }
    }));

    var mailOptions = {
        from: 'fsefood2019@gmail.com',
        to: req.restarunt_email,
        subject: 'Password Rest - OTP',
        text: 'Please use the below one time password!!!' + req.otp
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to : ' + req);
        }
    });

}


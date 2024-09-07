const express = require("express");
const route = express.Router();
const nodemailer = require("nodemailer");

const angular_user = process.env.ANGULAR_USER
const angular_admin = process.env.ANGULAR_ADMIN

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7e3551d2c579dd",
        pass: "d7d81cbbda2439",
    },
});

function sendEmail(status, body) {
    const mailData = {
        from: "sohandsouza276@gmail.com",
        to: body.to,
        subject: body.subject,
        // text: text,
        html: getTemplate(status, body),
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return error;
        } else {
            return info;
        }
        // res.status(200).send({ message: "Mail send", message_id: info.messageId });
    });
}

function getTemplate(template, body) {
    if (template == "welcome") {
        const welcomeEmail = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>Hand 2 Hand</title>
        
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        
            <style>
                .ReadMsgBody {width: 100%; background-color: #ffffff;}
                .ExternalClass {width: 100%; background-color: #ffffff;}
        
                        /* Windows Phone Viewport Fix */
                @-ms-viewport { 
                    width: device-width; 
                }
            </style>
        
            <!--[if (gte mso 9)|(IE)]>
                <style type="text/css">
                    table {border-collapse: collapse;}
                    .mso {display:block !important;} 
                </style>
            <![endif]-->
        
        </head>
        <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
            <!-- Mail.ru Wrapper -->
            <div id="mailsub">
                <!-- Wrapper -->
                <center class="wrapper" style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                    <!-- Old wrap -->
                    <div class="webkit">
                        <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <!-- Start Section (1 column) -->
                                        <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331" align="center" style="width: 100%; padding: 0; margin: 0; background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__bg.png?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                                            <tbody >
                                                <tr><td colspan="3" height="20"></td></tr>
                                                <tr>
                                                    <td width="330" style="width: 33%;"></td>
                                                    <!-- Logo -->
                                                    <td width="300" style="width: 30%;" align="center">
                                                        <a  target="_blank" border="0" style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                                            HAND2HAND
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="100"></td></tr>
                                                <!-- Main Title -->
                                                <tr>
                                                    <td colspan="3" height="60" align="center">
                                                        <div border="0" style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">HELLO `+ body.firstname + ' ' + body.lastname + `, </div>
                                                    </td>
                                                </tr>
                                                <!-- Line 1 -->
                                                <tr>
                                                    <td colspan="3" height="20" valign="bottom" align="center">
                                                        <img src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true" alt="line" border="0" width="464" height="5" style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;" >
                                                    </td>
                                                </tr>
                                                <!-- Meta title -->
                                                <tr>
                                                    <td colspan="3">
                                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="padding: 0; margin: 0; width: 100%;">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                    <td align="center">
                                                                        <div border="0" style="border: none; height: 60px;">
                                                                            <p style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                                                            “Leadership really comes down to two fundamental things and if you get them right, then you’re 80 percent of the way there. The first one is establishing the vision for a team; the second one is establishing a culture for your organization that helps contribute to mission success.”
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="160"></td></tr>
                                                <tr>
                                                    <td width="330"></td>
                                                    <!-- Button Start -->
                                                    <td width="300" align="center" height="52">
                                                        <div style="background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__btn.png?raw=true); background-size: 100% 100%; background-position: center center; width: 225px;">
                                                            <a  href="`+ angular_user + `" width="160" height="52" border="0" bgcolor="#009789" style="border: none; outline: none; display: block; width:160px; height: 52px; text-transform: uppercase; text-decoration: none; font-size: 17px; line-height: 52px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; text-align: center; background-color: #009789;  -webkit-text-size-adjust:none;">
                                                                Visit now
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td width="330"></td>
                                                </tr>
                                                <tr><td colspan="3" height="85"></td></tr>
                                            </tbody>
                                        </table><!-- End Start Section -->				
                                        
                                        
                                        <!-- Footer -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> <!-- End Old wrap -->
                </center> <!-- End Wrapper -->
            </div> <!-- End Mail.ru Wrapper -->
        </body>
        
        </html>`;
        return welcomeEmail;
    } else if (template == "post") {
        console.log("came inside email template");
        const postEmail = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>Hand 2 Hand</title>
        
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        
            <style>
                .ReadMsgBody {width: 100%; background-color: #ffffff;}
                .ExternalClass {width: 100%; background-color: #ffffff;}
        
                        /* Windows Phone Viewport Fix */
                @-ms-viewport { 
                    width: device-width; 
                }
            </style>
        
            <!--[if (gte mso 9)|(IE)]>
                <style type="text/css">
                    table {border-collapse: collapse;}
                    .mso {display:block !important;} 
                </style>
            <![endif]-->
        
        </head>
        <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
            <!-- Mail.ru Wrapper -->
            <div id="mailsub">
                <!-- Wrapper -->
                <center class="wrapper" style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                    <!-- Old wrap -->
                    <div class="webkit">
                        <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <!-- Start Section (1 column) -->
                                        <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331" align="center" style="width: 100%; padding: 0; margin: 0; background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__bg.png?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                                            <tbody >
                                                <tr><td colspan="3" height="20"></td></tr>
                                                <tr>
                                                    <td width="330" style="width: 33%;"></td>
                                                    <!-- Logo -->
                                                    <td width="300" style="width: 30%;" align="center">
                                                        <a target="_blank" border="0" style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                                            HAND2HAND
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="100"></td></tr>
                                                <!-- Main Title -->
                                                <tr>
                                                    <td colspan="3" height="60" align="center">
                                                        <div border="0" style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">HELLO ADMIN!</div>
                                                    </td>
                                                </tr>
                                                <!-- Line 1 -->
                                                <tr>
                                                    <td colspan="3" height="20" valign="bottom" align="center">
                                                        <img src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true" alt="line" border="0" width="464" height="5" style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;" >
                                                    </td>
                                                </tr>
                                                <!-- Meta title -->
                                                <tr>
                                                    <td colspan="3">
                                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="padding: 0; margin: 0; width: 100%;">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                    <td align="center">
                                                                        <div border="0" style="border: none; height: 60px;">
                                                                            <p style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                                                                There is new post added. Please follow the link and review the post
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="160"></td></tr>
                                                <tr>
                                                    <td width="330"></td>
                                                    <!-- Button Start -->
                                                    <td width="300" align="center" height="52">
                                                        <div style="background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__btn.png?raw=true); background-size: 100% 100%; background-position: center center; width: 225px;">
                                                            <a href="`+ angular_admin + `post/post-view/` + body.postId + `" width="160" height="52" border="0" bgcolor="#009789" style="border: none; outline: none; display: block; width:160px; height: 52px; text-transform: uppercase; text-decoration: none; font-size: 17px; line-height: 52px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; text-align: center; background-color: #009789;  -webkit-text-size-adjust:none;">
                                                                Go to Post
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td width="330"></td>
                                                </tr>
                                                <tr><td colspan="3" height="85"></td></tr>
                                            </tbody>
                                        </table><!-- End Start Section -->				
                                        
                                        
                                        <!-- Footer -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> <!-- End Old wrap -->
                </center> <!-- End Wrapper -->
            </div> <!-- End Mail.ru Wrapper -->
        </body>
        
        </html>`;
        return postEmail;
    } else if (template == 'donation') {
        const DonorEmail = `<html lang="en">

        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Hand 2 Hand</title>
        
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
          <style>
            .ReadMsgBody {
              width: 100%;
              background-color: #ffffff;
            }
        
            .ExternalClass {
              width: 100%;
              background-color: #ffffff;
            }
        
            /* Windows Phone Viewport Fix */
            @-ms-viewport {
              width: device-width;
            }
          </style>
        
          <!--[if (gte mso 9)|(IE)]>
                        <style type="text/css">
                            table {border-collapse: collapse;}
                            .mso {display:block !important;} 
                        </style>
                    <![endif]-->
        
        </head>
        
        <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"
          style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
          <!-- Mail.ru Wrapper -->
          <div id="mailsub">
            <!-- Wrapper -->
            <center class="wrapper"
              style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
              <!-- Old wrap -->
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                  style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                  <tbody>
                    <tr>
                      <td align="center">
                        <!-- Start Section (1 column) -->
                        <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331" align="center"
                          style="width: 100%; padding: 0; margin: 0; background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__bg.png?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                          <tbody>
                            <tr>
                              <td colspan="3" height="20"></td>
                            </tr>
                            <tr>
                              <td width="330" style="width: 33%;"></td>
                              <!-- Logo -->
                              <td width="300" style="width: 30%;" align="center">
                                <a target="_blank" border="0"
                                  style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                  HAND2HAND
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3" height="100"></td>
                            </tr>
                            <!-- Main Title -->
                            <tr>
                              <td colspan="3" height="60" align="center">
                                <div border="0"
                                  style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">
                                  HELLO ADMIN!</div>
                              </td>
                            </tr>
                            <!-- Line 1 -->
                            <tr>
                              <td colspan="3" height="20" valign="bottom" align="center">
                                <img
                                  src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true"
                                  alt="line" border="0" width="464" height="5"
                                  style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;">
                              </td>
                            </tr>
                            <!-- Meta title -->
                            <tr>
                              <td colspan="3">
                                <table cellpadding="0" cellspacing="0" border="0" align="center"
                                  style="padding: 0; margin: 0; width: 100%;">
                                  <tbody>
                                    <tr>
                                      <td width="90" style="width: 9%;"></td>
                                      <td align="center">
                                        <div border="0" style="border: none; height: 60px;">
                                          <p
                                            style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                            Your Donation has been requested please find the details below
                                          </p>
                                        </div>
                                      </td>
        
                                      <td width="90" style="width: 9%;"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td width="330"></td>
                              <!-- Button Start -->
        
                              <td width="330"></td>
                            </tr>
                            <tr>
                              <td colspan="3" height="160"></td>
                            </tr>
                            <table cellpadding="10" cellspacing="30">
        
                              <tr>
                                <td style="color:white;margin-left:30px">
                                  Requested By: </td>
                                <td style="color:white;margin-left:30px"> `+ body.requestName + `
                                </td>
        
                              </tr>
                              <tr>
                                <td style="color:white">
                                  Requestor Email: </td>
                                <td style="color:white;margin-left:30px"> `+ body.requestEmail + `
                                </td>
        
                              </tr>
                              <tr>
                                <td style="color:white">
                                  Requestor Phone: </td>
                                <td style="color:white;margin-left:30px"> `+ body.requestPhone + `
                                </td>
        
                              </tr>
                              <tr>
                                <td style="color:white">
                                  Request Details: </td>
                                <td style="color:white;margin-left:30px"> `+ body.requestDetails + `
                                </td>
        
                              </tr>
                            </table>
                            <tr>
                              <td colspan="3" height="85"></td>
                            </tr>
                          </tbody>
                        </table><!-- End Start Section -->
        
        
                        <!-- Footer -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div> <!-- End Old wrap -->
            </center> <!-- End Wrapper -->
          </div> <!-- End Mail.ru Wrapper -->
        </body>
        
        </html>`;
        return DonorEmail;
    } else if (template == 'donationRequest') {
        const requestorEmail = `<html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <title>Hand 2 Hand</title>
        
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        
            <style>
                .ReadMsgBody {width: 100%; background-color: #ffffff;}
                .ExternalClass {width: 100%; background-color: #ffffff;}
        
                        /* Windows Phone Viewport Fix */
                @-ms-viewport { 
                    width: device-width; 
                }
            </style>
        
            <!--[if (gte mso 9)|(IE)]>
                <style type="text/css">
                    table {border-collapse: collapse;}
                    .mso {display:block !important;} 
                </style>
            <![endif]-->
        
        </head>
        <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
            <!-- Mail.ru Wrapper -->
            <div id="mailsub">
                <!-- Wrapper -->
                <center class="wrapper" style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                    <!-- Old wrap -->
                    <div class="webkit">
                        <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <!-- Start Section (1 column) -->
                                        <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331" align="center" style="width: 100%; padding: 0; margin: 0; background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__bg.png?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                                            <tbody >
                                                <tr><td colspan="3" height="20"></td></tr>
                                                <tr>
                                                    <td width="330" style="width: 33%;"></td>
                                                    <!-- Logo -->
                                                    <td width="300" style="width: 30%;" align="center">
                                                        <a target="_blank" border="0" style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                                            HAND2HAND
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="100"></td></tr>
                                                <!-- Main Title -->
                                                <tr>
                                                    <td colspan="3" height="60" align="center">
                                                        <div border="0" style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">HELLO `+ body.name + `!</div>
                                                    </td>
                                                </tr>
                                                <!-- Line 1 -->
                                                <tr>
                                                    <td colspan="3" height="20" valign="bottom" align="center">
                                                        <img src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true" alt="line" border="0" width="464" height="5" style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;" >
                                                    </td>
                                                </tr>
                                                <!-- Meta title -->
                                                <tr>
                                                    <td colspan="3">
                                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="padding: 0; margin: 0; width: 100%;">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                    <td align="center">
                                                                        <div border="0" style="border: none; height: 60px;">
                                                                            <p style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                                                                You Donation request has been accepted by admin and sent for review to the donar. Donar will get back to you soon.
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                    <td width="90" style="width: 9%;"></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="3" height="160"></td></tr>
                                                <tr>
                                                    <td width="330"></td>
                                                    <!-- Button Start -->
                                                    
                                                    <td width="330"></td>
                                                </tr>
                                                <tr><td colspan="3" height="85"></td></tr>
                                            </tbody>
                                        </table><!-- End Start Section -->				
                                        
                                        
                                        <!-- Footer -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> <!-- End Old wrap -->
                </center> <!-- End Wrapper -->
            </div> <!-- End Mail.ru Wrapper -->
        </body>
        
        </html>`;
        return requestorEmail;
    } else if (template == 'newsletter') {
        console.log("body");
        console.log(body);
        return body.body;
    }
}

module.exports = sendEmail;

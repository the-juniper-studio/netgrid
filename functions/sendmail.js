const sgMail = require('@sendgrid/mail');
require('dotenv').config()
const {
  SENDGRID_API_KEY,
  SENDGRID_TO_EMAIL,
  SENDGRID_CC_EMAIL,
  SENDGRID_BCC_EMAIL,
} = process.env

console.log('start')

exports.handler =  async (event, context, callback) => {
  console.log('event', event)
  console.log('event body', event.body)

  let payload = event.queryStringParameters
  console.log('payload', payload)
  const { email, subject } = payload

  sgMail.setApiKey(SENDGRID_API_KEY)

  const body = Object.keys(payload).map((k) => {
    return `${k}: ${payload[k]}`
  }).join("<br><br>");

  //cc: SENDGRID_CC_EMAIL,
  //bcc: SENDGRID_BCC_EMAIL,

  const msg = {
    to: SENDGRID_TO_EMAIL,
    from: email,
    subject: subject ? subject : 'Contact Form Submission',
    html: body
  };

  console.log('msg', msg)

  try{
    await sgMail.send(msg)
    return {
      statusCode: 200,
      body: "Message sent"
    }
  } catch(e){
    return {
      statusCode: e.code,
      body: e.message
    }
  }
};

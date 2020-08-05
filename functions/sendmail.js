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

  console.log('body', body)

  const msg = {
    to: SENDGRID_TO_EMAIL,
    cc: SENDGRID_CC_EMAIL,
    bcc: SENDGRID_BCC_EMAIL,
    from: email,
    subject: subject ? subject : 'Contact Form Submission',
    html: 'hello I am body'
  };

  console.log('msg', msg)

  try {
    await sgMail.send(msg)
    return {
      statusCode: 200,
      body: "Message sent"
    }
  } catch (err) {
    console.log('\n\nERROR SENDING EMAIL: ', err, '\n\n')
    return callback(err.toString(), {
      statusCode: 500,
      body: err.toString(),
      headers: {'Access-Control-Allow-Origin': GATSBY_SITE_URL }
    })
  }
};

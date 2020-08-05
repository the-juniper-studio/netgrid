require('dotenv').config()
const {
  SENDGRID_API_KEY,
  SENDGRID_TO_EMAIL,
  SENDGRID_CC_EMAIL,
  SENDGRID_BCC_EMAIL,
  SENDGRID_SITE_URL
} = process.env

console.log('start')

exports.handler =  async (event, context, callback) => {

  try {
    console.log('🤖Getting Data')
    console.log('event', event)
    if (!event.body || event.body.length === 0) return
    let payload = JSON.parse(event.body)
    console.log('payload', payload)
    let { email, subject } = payload
    console.log('email', email)
    console.log('subject', subject)

    const sgMail = require('@sendgrid/mail');
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

    const sendgrid = await sgMail.send(msg)
    console.log('sendgrid', sendgrid)
    return callback(null, {
      headers: {'Access-Control-Allow-Origin': SENDGRID_SITE_URL },
      statusCode: 200,
      body: JSON.stringify({
        status: 'Message sent',
        recipient: email
      })
    })
  } catch (err) {
    console.log('\n\nERROR SENDING EMAIL: ', err, '\n\n')
    return callback(err.toString(), {
      statusCode: 500,
      body: err.toString(),
      headers: {'Access-Control-Allow-Origin': SENDGRID_SITE_URL }
    })
  }
};

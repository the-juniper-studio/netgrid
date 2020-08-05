const sgMail = require('@sendgrid/mail')
const { SENDGRID_API_KEY, SENDGRID_TO_EMAIL } = process.env

console.log('start')

exports.handler =  async (event, context, callback) => {
  console.log('event body', event.body)
  const payload = JSON.parse(event.body)
  console.log('payload', payload)
  const { email, subject } = payload

  sgMail.setApiKey(SENDGRID_API_KEY)

  const body = Object.keys(payload).map((k) => {
    return `${k}: ${payload[k]}`
  }).join("<br><br>");

  const msg = {
    to: SENDGRID_TO_EMAIL,
    from: email,
    subject: subject ? subject : 'Contact Form Submission',
    html: body,
  };

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

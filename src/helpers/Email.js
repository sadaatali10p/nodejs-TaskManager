const mail = require('@sendgrid/mail')

mail.setApiKey(process.env.SENDGRID_API_KEY)

const send = (model) => {
    
    const msg = {
        to: model.to,
        from: model.from,
        subject: model.subject,
        text: model.body,
        html: model.html
    }
    console.log(msg)
    mail.send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

module.exports = { send }
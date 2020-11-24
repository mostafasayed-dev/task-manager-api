const sgMail = require('@sendgrid/mail')

// const sendgrid_API_Key = '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'

// sgMail.setApiKey(sendgrid_API_Key)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)// use environment variable we set from dev.env file

// sgMail.send({
//     to: 'mostafasayed.fathi@gmail.com',
//     from: 'mostafasayed.fathi@gmail.com',
//     subject: 'Second Email from NodeJS!',
//     text: 'Hello, This is my second email from my NodeJS app.'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'anysystem.eg@gmail.com',
        subject: 'Congratulations!',
        text: `Welcome ${name} to Task Manager App. You can now easily manage your tasks.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'anysystem.eg@gmail.com',
        subject: 'Goodbye!',
        text: `Goodbye ${name}. We will miss you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
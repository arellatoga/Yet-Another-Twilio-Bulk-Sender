const twilio = require('twilio')
const fs = require('fs')

if (process.argv.length == 5) {
    main()
}

function main() {
    var message
    var recipients
    var sender = process.argv[4]
    try {
        message = fs.readFileSync(process.argv[2], 'utf-8')
        recipients = fs.readFileSync(process.argv[3], 'utf-8')
                           .replace(/\s/g,'')
                           .split(',')
    } catch (error) {
        console.log(error)
        return 
    }

    var start = new Date()

    console.log(`Send start ${start}`)
    console.log("---")
    console.log(`Message: ${message}`)
    console.log("---")
    console.log(`Approximate recipient count: ${recipients.length}`)
    console.log("---")

    var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    recipients.forEach(recipient => {
        if (recipient === '') {
            return
        }
        client.messages.create({
                body: message,
                from: sender,
                to: recipient
            }).catch(error => {
                console.log(error)
            });
    })

    var end = new Date()
    console.log(`Send end ${end}`)
    console.log(`Time to finish: ${end - start} ms`)
}


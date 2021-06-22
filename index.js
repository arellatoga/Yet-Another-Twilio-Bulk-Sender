const twilio = require('twilio')
const fs = require('fs')

if (process.argv.length == 5) {
    main()
}

async function main() {
    var message
    var recipients
    var sender = process.argv[4]
    try {
        message = fs.readFileSync(process.argv[2], 'utf-8').trim()
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

    for(var recipient of recipients) {
        if (recipient === '') {
            continue;
        }

        await send(client, recipient, message, sender)
    }

    var end = new Date()
    console.log(`Send end ${end}`)
    console.log(`Time to finish: ${end - start} ms`)
}

async function send(client, recipient, message, sender) {
    try {
        var success = await client.messages.create({
            body: message,
            from: sender,
            to: recipient
        })
        console.log(`Success ${recipient}`)
    } catch (error) {
        console.log(`Unable to send to ${recipient}: ${JSON.stringify(error)}`)
        console.log(error)
    }
}


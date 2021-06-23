const twilio = require('twilio')
const fs = require('fs')

if (process.argv.length == 5) {
    main()
}

async function main() {
    var message
    var recipients
    var senderSid = process.argv[4]
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

    var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    var service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID)

    var numberChunks = []
    var chunkSize = 2

    for (var i = 0; i < recipients.length; i += chunkSize) {
        var chunk = recipients.slice(i, i + chunkSize)
        numberChunks.push(chunk)
    }

    console.log(`Send start ${start}`)
    console.log("---")
    console.log(`Message: ${message}`)
    console.log("---")
    console.log(`Chunk count (number of requests): ${numberChunks.length} `)
    console.log("---")

    for (var numberChunk of numberChunks) {
        const bindings = numberChunk.map(number => {
            return JSON.stringify({ binding_type: 'sms', address: number})
        })

        await send(service, bindings, message)
    }

    var end = new Date()
    console.log(`Send end ${end}`)
    console.log(`Time to finish: ${end - start} ms`)
}

async function send(service, bindings, message) {
    try {
        await service.notifications.create({
            toBinding: bindings,
            body: message
        })
    } catch (error) {
        console.log(error)
    }
}



const formatPhone = (phone, prefix = "84") => prefix + phone.substring(1);

const services = {
    "twilio": () => {
        const client = require('twilio')(process.env.TWILIO_ACCOUNTID, process.env.TWILIO_TOKEN);

        return {
            sendSms: (toPhone, content) => client.messages
                .create({
                    body: content,
                    from: process.env.TWILIO_SENDER,
                    to: formatPhone(toPhone)
                })
                .then(message => {
                    console.log("Send Message successfully!");
                    return Promise.resolve();
                })

        }
    },
    "nexmo": () => {
        const Nexmo = require('nexmo');

        const nexmo = new Nexmo({
            apiKey: process.env.NEXMO_API_KEY,
            apiSecret: process.env.NEXMO_API_SECRET,
        });

        return {
            sendSms: (toPhone, content) => new Promise((res, rej) => {
                return nexmo.message
                    .sendSms(process.env.TWILIO_SENDER, toPhone, content, (err, result) => {
                        console.log("Send Message successfully!");
                        if(err){
                            rej();
                        }else{
                            res();
                        }
                    })
            })

        }
    }
};

const createSmsService = (type) => {

    return services[type]();

};

const twilioSmsService = createSmsService("twilio");
const nexmoSmsService = createSmsService("nexmo");


module.exports = {
    twilioSmsService,
    nexmoSmsService
};

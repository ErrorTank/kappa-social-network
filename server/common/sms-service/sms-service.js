

const formatPhone = (phone, prefix = "+84") => prefix + phone.substring(1);

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
    }
};

const createSmsService = (type) => {

    return services[type]();

};

const twilioSmsService = createSmsService("twilio");


module.exports = {
    twilioSmsService
};

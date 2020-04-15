const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
});

const opts = {
    "type": "unicode"
};

const createSmsService = (options, senderID) => {

    return {
        sendSms: (toPhone, content) => new Promise((resolve, reject) => {
            nexmo.message.sendSms(senderID, "+84" + toPhone.substring(1), content, options, (err, responseData) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if(responseData.messages[0]['status'] === "0") {
                        console.log("Message sent successfully.");
                        resolve();
                    } else {
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        reject();
                    }
                }
            })
        })
    }
};

const smsService = createSmsService(opts, process.env.NEXMO_SMS_SENDER_ID);
smsService.sendSms("0343999482", `Mã xác nhận đăng ký tài khoản của bạn là: dasdsa`)

module.exports = smsService;
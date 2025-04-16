

exports.sendPdfLinkController = async (req, res) => {
    const { mobileNumber, pdfLink, accountSid, authToken, twilioPhoneNumber } = req.body;

    if (!mobileNumber || !pdfLink || !accountSid || !authToken || !twilioPhoneNumber) {
        return res.status(400).json({
            error: 'Mobile number, PDF link, account SID, auth token, and Twilio phone number are required.'
        });
    }

    try {
        // Ensure mobile number is a string and in E.164 format
        const formattedNumber = mobileNumber.toString().startsWith('+91')
            ? mobileNumber.toString()
            : `+91${mobileNumber.toString()}`;

        const twilioClient = require('twilio')(accountSid, authToken);

        const message = await twilioClient.messages.create({
            body: `Here is your PDF link: ${pdfLink}`,
            from: twilioPhoneNumber,
            to: formattedNumber,
        });

        res.status(200).json({
            success: true,
            message: 'PDF link sent successfully!',
            sid: message.sid,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send the PDF link.' });
    }
};






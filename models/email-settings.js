
module.exports = {
	
	host		: process.env.SMTP,
	user 		: process.env.SENDGRID_USERNAME,
        port            : process.env.SMTPPORT,
	password 	: process.env.SENDGRID_PASSWORD,
	sender		: 'Debug007 <'+process.env.EMAIL+'>',
        domain          : process.env.DOMAINNAME,
        baseLink        : 'https://www.debug007.com'
	
}
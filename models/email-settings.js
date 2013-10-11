
module.exports = {
	
	host		: process.env.SMTP,
	user 		: process.env.EMAIL,
	password 	: process.env.EMAILPASSWORD,
	sender		: 'Debug007 <'+process.env.EMAIL+'>',
        baseLink        : 'https://www.debug007.com'
	
}
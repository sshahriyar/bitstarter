
var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
        domain      : ES.domain,
        authentication : 'plain',
	ssl	    : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeResetEmail(account)
	}, callback );
}

EM.loginLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Donation Acknowledgment from Debug007',
		text         : 'Thank you for your donation',
		attachment   : EM.composeLoginEmail(account)
	}, callback );
}

EM.composeLoginEmail = function(o){
        var link = "";
        if (o.password)
            link = ES.baseLink+'/reset-password?e='+o.email+'&p='+o.password;
        else
             link = ES.baseLink+'/login';
        
        var html = "<html><body>";
		html += "Hi "+o.firstName+",<br><br>";
                if (o.amount){
                    html += "Thank you for donating "+o.amount +"$ to Debug007 which will be used as your early membership amount. <br/> <br/>";
                    html += "You can keep track of your donations by logging into Debug007's site. <br/> <br/>";
               }
                if (o.password){
                    html += "We have created an account for you with the username <b>\""+o.email+"\"</b> and a temporary password.";
                    html+=" Please  click below to activate your account by resetting password.<br><br>";
                }else{
                    html += "Your username is: <b>"+o.email+"</b> <br><br>";
                }    
                                
                html += "<a href='"+link+"'>Please click here to log into your account</a><br><br>";
                
		html += " Best regards,<br> Debug007 Team</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}


EM.composeResetEmail = function(o)
{
	var link = ES.baseLink+'/reset-password?e='+o.email+'&p='+o.password;
	var html = "<html><body>";
		html += "Hi "+o.firstName+",<br><br>";
		html += "Your username is your email:: <b>"+o.email+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += " Best regards,<br> Debug007 Team</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}
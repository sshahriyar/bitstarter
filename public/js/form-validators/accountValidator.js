
function AccountValidator(){

// build array maps of the form inputs & control groups //

	this.formFields = [$('#fname-tf'), $('#lname-tf'), $('#user-tf'), $('#pass-tf'), $('#message-tf')];
	this.controlGroups = [$('#fname-cg'),$('#lname-cg'),  $('#user-cg'), $('#pass-cg'),$('#message-cg'),];
        //this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateName = function(s)
	{
		return s.length >= 3;
	}
	
	this.validatePassword = function(s)
	{
	// if user is logged in and hasn't changed his/her password, return ok
		if ($('#userId').val() && s===''){
			return true;
		}	else{
			return s.length >= 6;
		}
	}
	

	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

AccountValidator.prototype.showInvalidEmail = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That username (email) is already in use. \n\
                                            Have you forgotten your password?<a href="https://debug007.com/login"> Click here </a>']);
}



AccountValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	
       if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Please enter your first name properly.');
	}

	if (this.validatePassword(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		e.push('Password should be at least 6 characters');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	
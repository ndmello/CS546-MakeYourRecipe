/*(function ($) {
    


    $( "#register_email" ).focus(function() {
        $("#signup_error").html("");
        $("#signup_error").addClass("hidden");
    });

         $( "#register, #signupInLogin" ).click(function() {
            $("#signup_error").html("");
            $("#signup_error").addClass("hidden");
    });

    $( "#login_passwd , #login_email" ).focus(function() {
        $("#login_error").html("");
        $("#login_error").addClass("hidden");
    });

    $( "#LogIn-In-SignUp, #logon" ).click(function() {
            $("#signup_error").html("");
            $("#signup_error").addClass("hidden");
    });


})(jQuery);*/

// Login page scripts
$(function() {

var errorAlert = $("#error-message-login");
    $('#login-form-link').click(function(e) {
		errorAlert.addClass('hidden');
		$("#login_error").addClass('hidden');
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		errorAlert.addClass('hidden');
		$("#login_error").addClass('hidden');
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});

function extractRegisterForm(name, passwd, confirm_passwd) {
		// first, we check if there are values
		if (name == '' || passwd == '' || confirm_passwd == '') {
			throw "Please fill all the fields.";
			} else if ((passwd.length) < 8) {
			throw "Password should be atleast 8 character in length.";
			} else if (!(passwd).match(confirm_passwd)) {
			throw "Your passwords don't match. Please try again.";
			}

		
	}
$("#register-form").submit(function(event) {
			console.log("Inside validator");
			
			var name = $("#register_email").val();
			var passwd = $("#register_passwd").val();		
			var confirm_passwd = $("#confirm_passwd").val();
			
			var errorAlert = $("#error-message-login");
			
					
			try {
				var numbers = extractRegisterForm(name, passwd, confirm_passwd);
				errorAlert.addClass('hidden');
				$("register-form").submit();

			} catch (error) {
				errorAlert.removeClass('hidden');
				errorAlert.text(error);
				event.preventDefault();
			}
			
});

function extractLoginForm(name, passwd) {
	// first, we check if there are values
	if (name == '' && passwd == '') {
		throw "Please enter a valid username and password.";
		} else if (name == '') {
		throw "Please enter a valid username.";
		} else if (passwd == '') {
		throw "Please enter a valid password";
		} 
	
}

$("#login-form").submit(function(event) {
	console.log("Inside login-form validator");
	
	var name = $("#login_email").val();
	var passwd = $("#login_passwd").val();		
		
	var errorAlert = $("#error-message-login");
	
			
	try {
		var numbers = extractLoginForm(name, passwd);
		errorAlert.addClass('hidden');
		$("login-form").submit();

	} catch (error) {
		errorAlert.removeClass('hidden');
		errorAlert.text(error);
		event.preventDefault();
	}
	
});

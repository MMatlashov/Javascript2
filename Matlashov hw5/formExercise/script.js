"use strict";

(function($){
  $("#myForm").on("click", "input[type='button']", sendForm);
  
  function sendForm(e){
    var username = $("#myForm input[name='username']").val();
    var password = $("#myForm input[name='password']").val();
    var email = $("#myForm input[name='email']").val();
    var gender = $("#myForm input[name='gender']:checked").val();
    var credit_card = $("#myForm input[name='creditcard']").val();
    var bio = $("#myForm textarea[name='bio']").val();
    sendToValidator({ username, password, email, gender, credit_card, bio })
  }
  function sendToValidator(obj){
    $.ajax({
      type: 'POST',                   
      url: 'validator.php',              
      data: obj
    })       
    .done(function(data) {        
      markValidatedFields(JSON.parse(data));
    })
    .fail(function() {            
      console.log('error');
    });
  }
  
  function markValidatedFields(data){
    var error = data.error;
    
    error.Username? markInvalid($("#myForm input[name='username']"), error.Username): markValid($("#myForm input[name='username']"));
    
    error.Password? markInvalid($("#myForm input[name='password']"), error.Password): markValid($("#myForm input[name='password']"));
    
    error.Email? markInvalid($("#myForm input[name='email']"), error.Email): markValid($("#myForm input[name='email']"));
    
    error.Gender? markInvalid($("#myForm input[name='gender']"), error.Gender): markValid($("#myForm input[name='gender']"));
    
    error["Credit Card"]? markInvalid($("#myForm input[name='creditcard']"),  error["Credit Card"]): markValid($("#myForm input[name='creditcard']"));
    
    error.Bio? markInvalid($("#myForm textarea[name='bio']"),  error.Bio): markValid($("#myForm textarea[name='bio']"));
  }
    
  function markValid(selector){
    selector.removeClass("invalid");
    selector.addClass("valid");
    (selector.parent().next()).text("");
  }
  
  function markInvalid(selector, message){
    selector.removeClass("valid");
    selector.addClass("invalid");
    (selector.parent().next()).text(message);
  }
    
})(jQuery)
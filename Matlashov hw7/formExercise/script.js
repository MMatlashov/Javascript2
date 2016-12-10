"use strict";

var myForm = new MyForm("#myForm");

function MyForm(formId){

  (function($){
    
    var completed = 0;
    var FORM_ITEMS_NUM = 7;
    var errorMsg;
    
    $(document).ready(function(){
      $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd"
      });
      $("#progressbar").progressbar();
      $("#dialog").dialog({autoOpen: false, buttons: {
        OK: function(){
          $(this).dialog("close");
        }
      }});
      
      $(formId).on("click", "input[type='button']", sendForm);
    });
    

    function sendForm(e){
      
      //$("form").serialize(); - returns string of names and values.
      
      var username = $("#myForm input[name='username']").val();
      var password = $("#myForm input[name='password']").val();
      var birthdate = $("#myForm input[name='birthdate']").val();
      var email = $("#myForm input[name='email']").val();
      var gender = $("#myForm input[name='gender']:checked").val();
      var credit_card = $("#myForm input[name='creditcard']").val();
      var bio = $("#myForm textarea[name='bio']").val();
      sendToValidator({ username, password, birthdate, email, gender, credit_card, bio })
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
      completed = 0;
      errorMsg = "";

      error.Username? onInvalid($("#myForm input[name='username']"), error.Username): onValid($("#myForm input[name='username']"));

      error.Password? onInvalid($("#myForm input[name='password']"), error.Password): onValid($("#myForm input[name='password']"));
      
      error.Email? onInvalid($("#myForm input[name='email']"), error.Email): onValid($("#myForm input[name='email']"));

      error.Birthdate? onInvalid($("#myForm input[name='birthdate']"), error.Birthdate): onValid($("#myForm input[name='birthdate']"));

      error.Gender? onInvalid($("#myForm input[name='gender']"), error.Gender): onValid($("#myForm input[name='gender']"));

      error["Credit Card"]? onInvalid($("#myForm input[name='creditcard']"),  error["Credit Card"]): onValid($("#myForm input[name='creditcard']"));

      error.Bio? onInvalid($("#myForm textarea[name='bio']"),  error.Bio): onValid($("#myForm textarea[name='bio']"));
      
      $("#progressbar").progressbar("value", Math.round((completed / FORM_ITEMS_NUM) * 100));
      
      $("#dialog").text(errorMsg);
      $("#dialog").dialog("open");
    }

    function onValid(selector){
      completed ++;
      selector.removeClass("invalid");
      selector.addClass("valid");
      (selector.parent().next()).text("");
    }

    function onInvalid(selector, message){
      errorMsg += message + ". ";
      selector.removeClass("valid");
      selector.addClass("invalid");
      (selector.parent().next()).text(message);
    }

  })(jQuery)
}
"use strict";


(function($){

  $(function(){
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:+0",
      dateFormat: "yy-mm-dd"
    });
    $("#progressbar").progressbar();
    $("#dialog").dialog({autoOpen: false, width: 400, buttons: {
      OK: function(){
        $(this).dialog("close");
      }
    }});

    $("#myForm").on("click", "input[type='button']", sendForm);
  });


  function sendForm(e){
    sendToValidator($("form").serialize());
  }
  
  function sendToValidator(data){
    $.ajax({
      type: 'POST',                   
      url: 'validator.php',              
      data: data
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
    var correct = 7;
    var total = 7;
    var errorMsg = "";
    
    $("#myForm *[name]").each(function(index, elm){
      markValid($(this));
    });
    for (var key in error){
      if(error[key]) {
        markInvalid($("#myForm *[name =" + key.toLowerCase() + "]"), error[key]);
        correct--;
        errorMsg += "<p>" + error[key] + ".</p>"; 
      }
    }
    

    $("#progressbar").progressbar("value", Math.round((correct / total) * 100));

    $("#dialog").html(errorMsg);
    $("#dialog").dialog("open");
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
    selector.effect("bounce", {times: 4}, 600);
  }

})(jQuery);
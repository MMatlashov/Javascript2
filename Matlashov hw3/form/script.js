"use strict";

var submitButton = document.getElementById("submitButton");
var phoneInput = document.getElementById("phoneInput");
var mailInput = document.getElementById("mailInput");
var passInput = document.getElementById("passInput");
var GREEN = "#dAf970";
var RED = "#fa7080";

submitButton.addEventListener('click', checkFields);

function checkFields(){
  (phoneInput.value.search(/^\+\d\(\d{3}\)-\d{3}-\d{2}-\d{2}\b/i) != -1)? phoneInput.style.backgroundColor = GREEN : phoneInput.style.backgroundColor = RED;
  
  (mailInput.value.search(/^\w+@\w+\.\w+.?\w*\b/i) != -1)? mailInput.style.backgroundColor = GREEN : mailInput.style.backgroundColor = RED;
  
  (passInput.value.search(/^\d{2}\s?\d{2}\s\d{6}\b/i) != -1)? passInput.style.backgroundColor = GREEN : passInput.style.backgroundColor = RED;
}
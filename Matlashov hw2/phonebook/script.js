"use strict";
new PhoneBook();

function PhoneBook(){
  var phoneLoader = new PhoneLoader();
  document.addEventListener('FileLoaded', function(){
    drawPhoneBook(phoneLoader.getPhones());
  });
  phoneLoader.load("phones.json");
  
  function drawPhoneBook(arr){
    var parentNod = document.getElementById("phonesNod");
    
    var phoneBook = document.createElement('ul');
    phoneBook.className = "phoneBook";
    parentNod.appendChild(phoneBook);
    
    arr.forEach(function(item){
      var li = document.createElement('li');
      li.className = "phoneBookEntry";
      phoneBook.appendChild(li);
  
      li.textContent = item.name + " " + item.surname + " ";
      item.phones.forEach(function(phone){
        li.textContent += phone + ", ";
      });
      
    });
  }
}


function PhoneLoader(){ 
  var self = this;
  var outputArr;
  
  this.load = function(name){
    var xhRequest = new XMLHttpRequest();
    xhRequest.onreadystatechange = function(){
      if (xhRequest.readyState == 4){
        outputArr = JSON.parse(xhRequest.responseText);
        onLoaded();
      }
    }
    xhRequest.open("GET", name, true);
    xhRequest.send();
  }
  
  function onLoaded(){

    document.dispatchEvent(new Event('FileLoaded'));
  }  
  
  this.getPhones = function(){
    return outputArr;
  }
}

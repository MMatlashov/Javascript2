"use strict";
var correctString = '[{blabla:blabla(){}, blabla:blabla},{blabla: blabla(){}, blabla: [blabla, blabla]}]';
var incorrectString1 = '[blabla (bla, bla) blabla {(blabla, blabla} blabla!)]';
var incorrectString2 = 'blabla (bla, bla) blabla {(blabla, blabla} blabla!)]';
var incorrectString3 = '[blabla (bla, bla) blabla {(blabla, blabla} blabla!]';


console.time('bracketsCheck');
console.log (bracketsCheck(correctString));
console.log (bracketsCheck(incorrectString1));
console.log (bracketsCheck(incorrectString2));
console.log (bracketsCheck(incorrectString3));
console.timeEnd('bracketsCheck');


function bracketsCheck(str){
  var storage = [];
  for(var char of str){
    if (char.match(/[({[]/)){
      storage.push(char);
    } else if (char.match(/[)}\]]/)){
      if (storage.length == 0) return false;
      var lastStored = storage.pop();
      if (char == ')' && lastStored != '(' || char == '}' && lastStored != '{' || char == ']' && lastStored != '[') return false;
    }
  }
  return storage.length == 0;
}
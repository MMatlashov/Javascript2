/* Использует три класса:
1) класс Table(аргументы: <Div> родительский_узел), наследует класс Chessboard. Доступные свойства: function moveSelection(аргументы: String куда), function selectFieldCell(аргументы: <Div> куда_кликнули), restorePieceAt(ргументы: <Div> куда_кликнули), <Div> whiteTaken, <Div> blackTaken.
2) класс Chessboard(). Доступные свойства: <div> chessField.
3) класс Piece(аргументы: String цвет, String название, String позиция). */

"use strict";

var divOutput = document.getElementById("output"); //shows id of currently selected cell
var tableNod = document.getElementById("tableNod");  //div containing the whole table
var table = new Table(tableNod);

//register event listeners
document.addEventListener("keydown", onKeyDown);
table.chessField.addEventListener("click", onFieldClicked);
table.whiteTaken.addEventListener("click", onTakenClicked);
table.blackTaken.addEventListener("click", onTakenClicked);
//конец программы =3

//event handlers

function onKeyDown(e){//when any key is pressed, tells selection to move
  switch(e.keyCode){
    case 38: table.moveSelection("up");
    break;
    case 40: table.moveSelection("down");
    break;
    case 37: table.moveSelection("left");
    break;
    case 39: table.moveSelection("right");
    break;
  }
}

function onFieldClicked(e){// when field clicked
  table.selectFieldCell(e.target);
}

function onTakenClicked(e){// when area for taken clicked
  table.restorePieceAt(e.target);
}


//Classes:

function Table(parentnode){ //Draws chessboard with areas for taken figures, controlls selection
  //this.__proto__ = Chessboard.prototype;// - ПОЧЕМУ НЕ РАБОТАЕТ?
  Chessboard.call(this); //extends Chessboard
  var self = this;
  var alphabet = "abcdefgh"; //used for naming chessboard positions
  var currentSelect = "";  //id of currently selected cell
  var myTable = document.createElement("div");
  myTable.className = "myTable";
  parentnode.appendChild(myTable);
  
  drawTable();
  
  this.moveSelection = function(where){  //moves selection around
    if(currentSelect != ""){
      var oldSelect = document.getElementById(currentSelect);
      oldSelect.style.border = "none";
      var newSelect = "";
      switch(where){  //where to move selection
        case "up": {
          newSelect = currentSelect[0];
          if(currentSelect[1] != '8'){
            newSelect += (parseInt(currentSelect[1]) + 1);
          } else newSelect += '1';
        }
        break;
        case "down": {
          newSelect = currentSelect[0];
          if(currentSelect[1] != '1'){
            newSelect += (parseInt(currentSelect[1]) - 1);
          } else newSelect += '8';
        }
        break;
        case "right": {
          if(currentSelect[0] != 'h'){
            newSelect = alphabet[alphabet.indexOf(currentSelect[0]) + 1];
          } else newSelect = 'a';
          newSelect += currentSelect[1];
        }
        break;
        case "left": {
          if(currentSelect[0] != 'a'){
            newSelect = alphabet[alphabet.indexOf(currentSelect[0]) - 1];
          } else newSelect = 'h';
          newSelect += currentSelect[1];
        }
        break;
      }
      currentSelect = newSelect;
      document.getElementById(currentSelect).style.border = "3px solid yellow";
      divOutput.textContent = currentSelect;
    }
  }
  
  this.selectFieldCell = function(target){
    if (target.className.indexOf("cell") !== -1){ //if chessfield cell was clicked
      divOutput.textContent = target.id; //write cell number into a div for output
      if(currentSelect != ""){ //if previous selection exists
        var oldSelect = document.getElementById(currentSelect);
        oldSelect.style.border = "none";
      }
      currentSelect = target.id;
      target.style.border = "3px solid yellow";

      movePiece(currentSelect, "take");//if has a piece, place it to the taken area
    }
  }
  
  this.restorePieceAt = function(target){
    if (target.className.indexOf("cell") !== -1){ //if cell was clicked
      var id = target.id.slice(0, 2);
      movePiece(id, "restore");//if has a piece, restore it from the taken area
    }
  }
  
  function drawTable(){ //draws chesstable and two areas for taken pieces
    //create area for taken pieces (white)
    self.whiteTaken = document.createElement("div");
    self.whiteTaken.className = "takenArea";
    myTable.appendChild(self.whiteTaken);

    //create chessboard 
    self._drawChessBoard(myTable);

    //create area for taken pieces (black)
    self.blackTaken = document.createElement("div");
    self.blackTaken.className = "takenArea";
    myTable.appendChild(self.blackTaken);
    
    fillTable();
  }
    
  function fillTable() {  //fills-in areas with cells
    //fill-in taken areas
    for (var i = 0; i < 8; i++){
      for (var j= 0; j < 2; j++){
        var cell = document.createElement("div");
        cell.className = "cell";
        cell.id = alphabet[i] + (j + 1) + "taken";
        self.whiteTaken.appendChild(cell);
        cell = document.createElement("div");
        cell.className = "cell";
        cell.id = alphabet[i] + (j + 7) + "taken";
        self.blackTaken.appendChild(cell);
      }
    }
  }
  
  function movePiece(pos, action){ //take or restore the piece
    for(var i=0; i < self._chessPieces.length; i++){
      if(self._chessPieces[i]._position == pos){

        if (action == "take" && !self._chessPieces[i]._taken){
          document.getElementById(pos).innerHTML = "";
          document.getElementById(pos+"taken").innerHTML = self._chessPieces[i]._symbol;
          self._chessPieces[i]._taken = true;
        } else if (action == "restore" && self._chessPieces[i]._taken){
          document.getElementById(pos+"taken").innerHTML = "";
          document.getElementById(pos).innerHTML = self._chessPieces[i]._symbol;
          self._chessPieces[i]._taken = false;
        }
        break;
      }
    }
  }
  
};

function Chessboard(){
  var self = this;
  var alphabet = "abcdefgh"; //used for naming chessboard positions
  this._chessPieces = []; //array of chess pieces
  this._drawChessBoard = function(parentnode){
    
    var chessBoard = document.createElement("div");
    chessBoard.className = "chessBoard";
    parentnode.appendChild(chessBoard);
    
    //inside chessBoard make areas for numbers and chessfield itself
    self._fieldNumbers = document.createElement("div");
    self._fieldNumbers.className = "cbElement numbers";
    chessBoard.appendChild(self._fieldNumbers);

    self.chessField = document.createElement("div");
    self.chessField.className = "cbElement chessField";
    chessBoard.appendChild(self.chessField);

    self._fieldLetters = document.createElement("div");
    self._fieldLetters.className = "cbElement letters";
    chessBoard.appendChild(self._fieldLetters);
    fillChessBoard();
    fillLegend();
    
    self._chessPieces = self._getPieces();
    self._placePieces(self._chessPieces);
  }
  
  this._getPieces = function(){
    var arr = [];
    arr.push(new Piece("white", "tower", "a1"));
    arr.push(new Piece("white", "tower", "h1"));
    arr.push(new Piece("white", "knight", "b1"));
    arr.push(new Piece("white", "knight", "g1"));
    arr.push(new Piece("white", "bishop", "c1"));
    arr.push(new Piece("white", "bishop", "f1"));
    arr.push(new Piece("white", "queen", "d1"));
    arr.push(new Piece("white", "king", "e1")); 
    arr.push(new Piece("black", "tower", "a8"));
    arr.push(new Piece("black", "tower", "h8"));
    arr.push(new Piece("black", "knight", "b8"));
    arr.push(new Piece("black", "knight", "g8"));
    arr.push(new Piece("black", "bishop", "c8"));
    arr.push(new Piece("black", "bishop", "f8"));
    arr.push(new Piece("black", "queen", "d8"));
    arr.push(new Piece("black", "king", "e8"));
    for (var i = 0; i < 8; i++){
      arr.push(new Piece("white", "pawn", alphabet[i] + 2));
      arr.push(new Piece("black", "pawn", alphabet[i] + 7));
    }
    return arr;
  }
  
  this._placePieces = function(pieces){//puts pieces on the chessboard
    for(var i = 0; i < pieces.length; i++){
      var cell = document.getElementById(pieces[i]._position);
      cell.innerHTML = pieces[i]._symbol;
    }
  } 
  
  function fillChessBoard(){
    //fill-in chessfield
    for (var i = 0; i < 8; i++){
      for (var j= 0; j < 8; j++){
        var cell = document.createElement("div");
        cell.className = "cell";
        cell.id = alphabet[j]+(8 - i);
        if ((i + j) % 2){
          cell.className += " black";
        } else {
          cell.className += " white"; //put a chess piece symbol
        }
        self.chessField.appendChild(cell);
      } 
    }
  }  
  
  function fillLegend(){
    //fill-in numbers and letters
    for (var i = 0; i < 8; i++){
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = alphabet[i];
      self._fieldLetters.appendChild(cell);

      cell = document.createElement("div");
      cell.className = "cell";
      cell.innerText = 8 - i;
      self._fieldNumbers.appendChild(cell);
    }
  }  
}

function Piece(c, n, p){ //object chesspiece
  this._name = n;
  this._color = c;
  this._position = p;
  this._taken = false;
  this._symbol = getSymbol(this._color, this._name);
  
  function getSymbol(color, name){  //returns chesspiece symbol in utf-8
    switch(name){
      case "pawn": return color == "white"? '&#9817;': '&#9823;';
      break;
      case "tower": return color == "white"? '&#9814;': '&#9820;';
      break;
      case "bishop": return color == "white"? '&#9815;': '&#9821;';
      break;
      case "knight": return color == "white"? '&#9816;': '&#9822;';
      break;
      case "queen": return color == "white"? '&#9813;': '&#9819;';
      break;
      case "king": return color == "white"? '&#9812;': '&#9818;';
      break;
    }
  }
}


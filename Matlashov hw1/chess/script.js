/* Использует три класса:
1) класс ChessSim(аргументы: <Div> родительский_узел), наследует класс Chessboard. 
Доступные свойства: function moveSelection(аргументы: String куда), function selectFieldCell(аргументы: <Div> куда_кликнули), takePiece(аргументы: <Div> куда_кликнули),
restorePieceAt(ргументы: <Div> куда_кликнули), <Div> whiteTaken, <Div> blackTaken.
2) класс Chessboard(). Доступные свойства: <div> chessField.
3) класс Piece(аргументы: String цвет, String название, String позиция). */

"use strict";

var divOutput = document.getElementById("output"); 
var chessSimNod = document.getElementById("chessSimNod");  
var chessSim = new ChessSim(chessSimNod);

document.addEventListener("keydown", onKeyDown);
chessSim.chessField.addEventListener("click", onFieldClicked);
chessSim.whiteTaken.addEventListener("click", onTakenClicked);
chessSim.blackTaken.addEventListener("click", onTakenClicked);

//event handlers
function onKeyDown(e){
  switch(e.keyCode){
    case 38: chessSim.moveSelection("up");
    break;
    case 40: chessSim.moveSelection("down");
    break;
    case 37: chessSim.moveSelection("left");
    break;
    case 39: chessSim.moveSelection("right");
    break;
  }
}

function onFieldClicked(e){
  chessSim.selectFieldCell(e.target);
  chessSim.takePiece(e.target)
}

function onTakenClicked(e){
  chessSim.restorePieceAt(e.target);
}


//Classes:

/* СhessSim used to draw the chessboard by inheriting Chessboard, draw two areas for taken pieces, 
control selected squares and remove taken pieces from the field */
function ChessSim(p){
  Chessboard.call(this); 
  
  var self = this;
  var currentSelect = "";
  createChessSim(p);
  fillChessSim();
  this._fillChessBoard();
  this._fillLegend();
  var chessPieces = self._getPieces();
  this._placePieces(chessPieces);
  
  function createChessSim(parent){ 
    var simContainer = document.createElement("div"); //create div-container
    simContainer.className = "simContainer";
    parent.appendChild(simContainer);
    
    self.whiteTaken = document.createElement("div");  //create area for taken pieces (white)
    self.whiteTaken.className = "takenArea";
    simContainer.appendChild(self.whiteTaken);
    
    self._createChessBoard(simContainer); //create chessboard 
    
    self.blackTaken = document.createElement("div");  //create area for taken pieces (black)
    self.blackTaken.className = "takenArea";
    simContainer.appendChild(self.blackTaken);
  }
    
  function fillChessSim() {  //fills-in areas with squares
    //fill-in taken areas
    for (var i = 0; i < 8; i++){
      for (var j= 0; j < 2; j++){
        var square = document.createElement("div");
        square.className = "cbSquare";
        square.id = self._ALPHABET[i] + (j + 1) + "taken";
        self.whiteTaken.appendChild(square);
        square = document.createElement("div");
        square.className = "cbSquare";
        square.id = self._ALPHABET[i] + (j + 7) + "taken";
        self.blackTaken.appendChild(square);
      }
    }
  }
  
  this.moveSelection = function(where){ 
    if(currentSelect != ""){
      var oldSelect = document.getElementById(currentSelect);
      oldSelect.style.border = "none";
      var newSelect = "";
      switch(where){ 
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
            newSelect = self._ALPHABET[self._ALPHABET.indexOf(currentSelect[0]) + 1];
          } else newSelect = 'a';
          newSelect += currentSelect[1];
        }
        break;
        case "left": {
          if(currentSelect[0] != 'a'){
            newSelect = self._ALPHABET[self._ALPHABET.indexOf(currentSelect[0]) - 1];
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
    if (target.className.indexOf("cbSquare") !== -1){
      divOutput.textContent = target.id;
      if(currentSelect != ""){ 
        var oldSelect = document.getElementById(currentSelect);
        oldSelect.style.border = "none";
      }
      currentSelect = target.id;
      target.style.border = "3px solid yellow";
    }
  }
  
  this.takePiece = function(target){
    movePiece(currentSelect, "take");
  }
  
  this.restorePieceAt = function(target){
    if (target.className.indexOf("cbSquare") !== -1){
      var id = target.id.slice(0, 2);
      movePiece(id, "restore");
    }
  }
  
  function movePiece(pos, action){ //take or restore the piece
    for(var i=0; i < chessPieces.length; i++){
      if(chessPieces[i]._position == pos){
        if (action == "take" && !chessPieces[i]._taken){
          document.getElementById(pos).innerHTML = "";
          document.getElementById(pos + "taken").innerHTML = chessPieces[i]._symbol;
          chessPieces[i]._taken = true;
        } else if (action == "restore" && chessPieces[i]._taken){
          document.getElementById(pos + "taken").innerHTML = "";
          document.getElementById(pos).innerHTML = chessPieces[i]._symbol;
          chessPieces[i]._taken = false;
        }
        break;
      }
    }
  }
}

/* СhessBoard used to draw the chessboard and initialize chess pieces */
function Chessboard(){
  var self = this;
  this._ALPHABET = "abcdefgh";

  this._createChessBoard = function(parent){ 
    var chessBoard = document.createElement("div"); //div-container
    chessBoard.className = "chessBoard";
    parent.appendChild(chessBoard);
    
    self._fieldNumbers = document.createElement("div"); //vertical nubmers for squares itself
    self._fieldNumbers.className = "cbElement numbers";
    chessBoard.appendChild(self._fieldNumbers);
    
    self.chessField = document.createElement("div"); //chessboard
    self.chessField.className = "cbElement chessField";
    chessBoard.appendChild(self.chessField);
   
    self._fieldLetters = document.createElement("div");  //horisontal letters for squares
    self._fieldLetters.className = "cbElement letters";
    chessBoard.appendChild(self._fieldLetters);
  }
  
  this._fillChessBoard = function(){
    for (var i = 0; i < 8; i++){
      for (var j= 0; j < 8; j++){
        var square = document.createElement("div");
        square.className = "cbSquare";
        square.id = self._ALPHABET[j] + (8 - i);
        if ((i + j) % 2){
          square.className += " black";
        } else {
          square.className += " white";
        }
        self.chessField.appendChild(square);
      } 
    }
  }  
  
  this._fillLegend = function (){
    for (var i = 0; i < 8; i++){
      
      var square = document.createElement("div"); //horisontal letters
      square.className = "cbSquare";
      square.innerText = self._ALPHABET[i];
      self._fieldLetters.appendChild(square);
      
      square = document.createElement("div"); //vertical numbers
      square.className = "cbSquare";
      square.innerText = 8 - i;
      self._fieldNumbers.appendChild(square);
    }
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
      arr.push(new Piece("white", "pawn", self._ALPHABET[i] + 2));
      arr.push(new Piece("black", "pawn", self._ALPHABET[i] + 7));
    }
    return arr;
  }
  
  this._placePieces = function(pieces){
    for(var i = 0; i < pieces.length; i++){
      var square = document.getElementById(pieces[i]._position);
      square.innerHTML = pieces[i]._symbol;
    }
  } 
}
  

/* Piece contains information about a chess piece */
function Piece(c, n, p){ 
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


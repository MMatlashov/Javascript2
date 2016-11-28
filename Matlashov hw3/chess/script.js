/*
1) class ChessSim();
2) class Chessboard(DOM_Node parentNode) expends Board; Open methods: getTakenAreaWhite() returns DOM_Node; getTakenAreaBlack() returns DOM_Node; getChessField() returns DOM_Node; takePieceAt(String position); restorePieceAt(String position); placePieces(Piece[] pieces).
3) class Board();
4) class Piece(String color, String name, String position);
5) class FileLoader(); open methods: load(String fileName) dispatches event 'FileLoaded', getPieces() returns Pieces[]; 
*/

"use strict";

var chessSimNod = document.getElementById("chessSimNod");
var chessSim = new ChessSim(chessSimNod);

//Classes:

/* Adds Chessboard to an argument node, adds eventlisteners, loads chesspieces from a file */
function ChessSim(parent){
  var divOutput = document.createElement('div');
  divOutput.id = "output";
  divOutput.textContent = "Выберете клетку";
  parent.appendChild(divOutput);
  var simContainer = document.createElement('div');
  simContainer.className = "simContainer"
  parent.appendChild(simContainer);

  var chessBoard = new Chessboard(simContainer);
  var self = this;
  var parent = parent;
  var currentSelect = "";
  var chessPieces;
  
  addEventListeners();
  loadPieces("chessPieces.json");
  
  //event handlers
  function addEventListeners(){  
    document.addEventListener("keydown", onKeyDown);
    chessBoard.getChessField().addEventListener("click", onFieldClicked);
    chessBoard.getTakenAreaWhite().addEventListener("click", onTakenClicked);
    chessBoard.getTakenAreaBlack().addEventListener("click", onTakenClicked);
  }
  
  function onKeyDown(e){
    switch(e.keyCode){
      case 38: moveSelection("up");
      break;
      case 40: moveSelection("down");
      break;
      case 37: moveSelection("left");
      break;
      case 39: moveSelection("right");
      break;
    }
  }
  
  function onFieldClicked(e){
    selectFieldCell(e.target);
    chessBoard.takePieceAt(e.target);
  }

  function onTakenClicked(e){
    chessBoard.restorePieceAt(e.target);
  }
  
  function moveSelection(where){ 
    if(currentSelect != ""){
      var oldSelect = document.getElementById(currentSelect);
      oldSelect.style.border = "none";
      var newSelect = "";
      switch(where){ 
        case "up": newSelect = currentSelect[0] + ((currentSelect[1] != '8')? parseInt(currentSelect[1]) + 1 : '1');
        break;
        case "down": newSelect = currentSelect[0] + ((currentSelect[1] != '1')? parseInt(currentSelect[1]) - 1: '8');
        break;
        case "right": {
          newSelect = (currentSelect[0] != 'h')? String.fromCharCode(currentSelect.charCodeAt(0) + 1): 'a';
          newSelect += currentSelect[1];
        }
        break;
        case "left": {
          newSelect = (currentSelect[0] != 'a')? String.fromCharCode(currentSelect.charCodeAt(0) - 1): 'h';
          newSelect += currentSelect[1];
        }
        break;
      }
      currentSelect = newSelect;
      document.getElementById(currentSelect).style.border = "3px solid yellow";
      divOutput.textContent = currentSelect;
    }
  }
  
   function selectFieldCell(target){
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
  
  function loadPieces(fileName){
    var chessLoader = new ChessLoader;
    document.addEventListener("FileLoaded", function(e){
      chessPieces = chessLoader.getPieces();
      if (piecesValid(chessPieces)) {
        chessBoard.placePieces(chessPieces);
      } else {
        alert("Loaded chesspieces position file has mistakes");
      } 
    });
    chessLoader.load(fileName);
  }
  
  function piecesValid(pieces){
   
    var whiteKing, blackKing;
    whiteKing = blackKing = 0;
    
    for(var i = 0; i < pieces.length; i++) {
      //check that all positions are in format "a-h + 1-8";
      if(pieces[i].position.search(/\b[a-h][1-8]\b/i) == -1) {
        return false;
      }
      //check that two pieces don't have same position
      for(var j = i + 1; j < pieces.length; j++){
        if (pieces[i].position == pieces[j].position) return false;
      }
      //check that there is exactly one king
      if (pieces[i].name == "king"){
        pieces[i].color == "white"? whiteKing++ : blackKing++;
      }
    };
    
    if (whiteKing != 1 || blackKing != 1) return false;
    return true;
  }
}


/* Draws a chessboard inside an argument node, has methods to place pieces on the field and "take" pieces to special areas */
function Chessboard(parent){
  Board.call(this);
  var self = this;
  var parent = parent;
  var ALPHABET = "abcdefgh"; 
  var chessPieces;
  drawChessBoard();
  var whiteTaken, blackTaken, chessField;
  var blackTakenArray = [];
  var whiteTakenArray = [];
  
  function drawChessBoard(){
    
    whiteTaken = self._createElement("takenArea",  parent); //create area for taken pieces (white)
    
    var fieldAndLegend = self._createElement("fieldAndLegend", parent); //div-container
    var fieldNumbers = self._createElement("cbElement numbers", fieldAndLegend);  //vertical numbers for squares  
    chessField = self._createElement("cbElement chessField", fieldAndLegend); //chessboard itself
    var fieldLetters = self._createElement("cbElement letters", fieldAndLegend);  //horisontal letters for squares
    
    blackTaken = self._createElement("takenArea",  parent);  //create area for taken pieces (black)
    
    //filling areas with squares
    fillTaken();
    fillChessBoard();
    fillLegend(fieldNumbers, fieldLetters);
  }
  
  function fillTaken() { 
    var k = 0;
    self._createBoard(8, 2, whiteTaken, function(i, j, square){
      square.className = "cbSquare";
      square.id = k + "_white";
      k ++;
    });
    k = 0;
    self._createBoard(8, 2, blackTaken, function(i, j, square){
      square.className = "cbSquare";
      square.id = k + "_black";
      k++;
    });
  }
  
  function fillChessBoard(){    
    self._createBoard(8, 8, chessField, function(i, j, square){
      square.className = "cbSquare";
      square.id = ALPHABET[j] + (8 - i);
      if ((i + j) % 2){
        square.className += " black";
      } else {
        square.className += " white";
      }
    });
  }  
  
  function fillLegend(fieldNumbers, fieldLetters){
    self._createBoard(1, 8, fieldNumbers, function(i, j, square){
      square.className = "cbSquare";
      square.innerText = 8 - j;    
    });
      self._createBoard(1, 8, fieldLetters, function(i, j, square){
      square.className = "cbSquare";
      square.innerText = ALPHABET[j];    
    });
  }
  
  this.getTakenAreaWhite = function() {return whiteTaken;}
  
  this.getTakenAreaBlack = function() {return blackTaken;}
  
  this.getChessField = function() {return chessField;}
  
  this.takePieceAt = function(target){
    if (chessPieces && target.className.indexOf("cbSquare") !== -1){
      var pos = target.id.slice(0, 2);
    } else {
      return;
    }
    chessPieces.forEach(function(piece){
      if(piece.position == pos){
        if (!piece.taken){
          document.getElementById(pos).innerHTML = "";
          if (piece.color == "white"){
            whiteTakenArray.push(piece);
            redrawArea("white");
          } else {
            blackTakenArray.push(piece);
            redrawArea("black");
          }
          piece.taken = true;
        } 
        return;
      }
    });
  }
  
  this.restorePieceAt = function(target){
    if (target.className.indexOf("cbSquare") !== -1){
      var pos = (target.id).split('_');
    } else {
      return;
    }
    var arr = (pos[1] == "white")? whiteTakenArray: blackTakenArray;
    if (pos[0]< arr.length){
      var piece = arr.splice(pos[0], 1)[0];
      document.getElementById(piece.position).innerHTML = piece.symbol;
      piece.taken = false;
      redrawArea(piece.color);
    }
  }
  
  function redrawArea(color){
    var arr = (color == "white")? whiteTakenArray: blackTakenArray;
    for (var i = 0; i < 16; i++){
      document.getElementById(i + "_" + color).innerHTML = (i < arr.length)? arr[i].symbol : "";
    }
  }
  
  this.placePieces = function(pieces){
    chessPieces = pieces;
    pieces.forEach(function(piece){
      var square = document.getElementById(piece.position);
      square.innerHTML = piece.symbol;
    });
  } 
}


/* Board creates a board with set dimentions */
function Board(){
  
  this._createElement = function(name, parent){
    var element = document.createElement("div");
    element.className = name;
    parent.appendChild(element);
    return element;
  }
  
  this._createBoard = function(a, b, parent, namingFunc){
    for (var i = 0; i < a; i++){
      for (var j = 0; j < b; j ++){
        var square = document.createElement("div");
        namingFunc(i, j, square);
        parent.appendChild(square);
      }
    }
  }
}


/* Piece contains information about a chess piece */
function Piece(c, n, p){ 
  this.name = n;
  this.color = c;
  this.position = p;
  this.taken = false;
  this.symbol = getSymbol(this.color, this.name);
  
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
  
/* JSNLoader loads JSON file with initial chess pieces positions */
function ChessLoader(){ 
  var self = this;
  var outputArr;
  
  this.load = function(name){
    var xhRequest = new XMLHttpRequest();
    xhRequest.onreadystatechange = function(){
      if (xhRequest.readyState == 4){
        outputArr = JSON.parse(xhRequest.responseText);
        outputArr = jsonToPieces(outputArr);
        onLoaded();
      }
    }
    xhRequest.open("GET", name, true);
    xhRequest.send();
  }
  
  function jsonToPieces(oldArr){
    var newArr = [];
    oldArr.forEach(function(item){
      item.position.forEach(function(pos){
        newArr.push(new Piece(item.color, item.name, pos));
      });
    });
    return newArr;
  }
  
  function onLoaded(){
    document.dispatchEvent(new Event('FileLoaded'));
  }  
  
  this.getPieces = function(){
    return outputArr;
  }
}

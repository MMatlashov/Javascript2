/*
1) class ChessSim();
2) class Chessboard(DOM_Node parentNode) expends Board; Open methods: getTakenAreaWhite() returns DOM_Node; getTakenAreaBlack() returns DOM_Node; getChessField() returns DOM_Node; takePieceAt(String position); restorePieceAt(String position); placePieces(Piece[] pieces).
3) class Board();
4) class Piece(String color, String name, String position);
5) class FileLoader(); open methods: load(String fileName) dispatches event 'FileLoaded', getPieces() returns Pieces[]; 
*/

"use strict";

let chessSimNod = document.getElementById("chessSimNode");
let chessSim = new ChessSim(chessSimNod);

//Classes:

/* Adds Chessboard to an argument node, adds eventlisteners, loads chesspieces from a file */
class ChessSim{
  
  constructor(parent){
    let divOutput = document.createElement('div');
    divOutput.id = "output";
    divOutput.textContent = "Выберете клетку";
    parent.appendChild(divOutput);
    let simContainer = document.createElement('div');
    simContainer.className = "simContainer"
    parent.appendChild(simContainer);

    let chessBoard = new Chessboard(simContainer);
    let self = this;
    let currentSelect = "";
    let chessPieces;

    addEventListeners();
    loadPieces("js/chessPieces.json");
  }
  
  //event handlers
  addEventListeners(){  
    document.addEventListener("keydown", onKeyDown);
    chessBoard.getChessField().addEventListener("click", onFieldClicked);
    chessBoard.getTakenAreaWhite().addEventListener("click", onTakenClicked);
    chessBoard.getTakenAreaBlack().addEventListener("click", onTakenClicked);
  }
  
  onKeyDown(e){
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
  
  onFieldClicked(e){
    selectFieldCell(e.target);
    chessBoard.takePieceAt(e.target);
  }

  onTakenClicked(e){
    chessBoard.restorePieceAt(e.target);
  }
  
  moveSelection(where){ 
    if(currentSelect != ""){
      let oldSelect = document.getElementById(currentSelect);
      oldSelect.style.border = "none";
      let newSelect = "";
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
  
   selectFieldCell(target){
    if (target.className.indexOf("cbSquare") !== -1){
      divOutput.textContent = target.id;
      if(currentSelect != ""){ 
        let oldSelect = document.getElementById(currentSelect);
        oldSelect.style.border = "none";
      }
      currentSelect = target.id;
      target.style.border = "3px solid yellow";
    }
  }
  
  loadPieces(fileName){
    let chessLoader = new ChessLoader;
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
  
  piecesValid(pieces){
   
    let whiteKing, blackKing;
    whiteKing = blackKing = 0;
    
    for(let i = 0; i < pieces.length; i++) {
      //check that all positions are in format "a-h + 1-8";
      if(pieces[i].position.search(/\b[a-h][1-8]\b/i) == -1) {
        return false;
      }
      //check that two pieces don't have same position
      for(let j = i + 1; j < pieces.length; j++){
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
class Chessboard extends Board{
  
  constructor(parent){
    super();
    let self = this;
    let ALPHABET = "abcdefgh"; 
    let chessPieces;
    drawChessBoard(parent);
    let whiteTaken, blackTaken, chessField;
    let blackTakenArray = [];
    let whiteTakenArray = [];
  }
  
  drawChessBoard(parent){
    
    whiteTaken = self._createElement("takenArea",  parent); //create area for taken pieces (white)
    
    let fieldAndLegend = self._createElement("fieldAndLegend", parent); //div-container
    let fieldNumbers = self._createElement("cbElement numbers", fieldAndLegend);  //vertical numbers for squares  
    chessField = self._createElement("cbElement chessField", fieldAndLegend); //chessboard itself
    let fieldLetters = self._createElement("cbElement letters", fieldAndLegend);  //horisontal letters for squares
    
    blackTaken = self._createElement("takenArea",  parent);  //create area for taken pieces (black)
    
    //filling areas with squares
    fillTaken();
    fillChessBoard();
    fillLegend(fieldNumbers, fieldLetters);
  }
  
  fillTaken() { 
    let k = 0;
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
  
  fillChessBoard(){    
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
  
  fillLegend(fieldNumbers, fieldLetters){
    self._createBoard(1, 8, fieldNumbers, function(i, j, square){
      square.className = "cbSquare";
      square.innerText = 8 - j;    
    });
      self._createBoard(1, 8, fieldLetters, function(i, j, square){
      square.className = "cbSquare";
      square.innerText = ALPHABET[j];    
    });
  }
  
  getTakenAreaWhite() {return whiteTaken};
  
  getTakenAreaBlack() {return blackTaken};
  
  getChessField() {return chessField};
  
  takePieceAt(target){
    if (chessPieces && target.className.indexOf("cbSquare") !== -1){
      let pos = target.id.slice(0, 2);
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
  
  restorePieceAt(target){
    if (target.className.indexOf("cbSquare") !== -1){
      let pos = (target.id).split('_');
    } else {
      return;
    }
    let arr = (pos[1] == "white")? whiteTakenArray: blackTakenArray;
    if (pos[0]< arr.length){
      let piece = arr.splice(pos[0], 1)[0];
      document.getElementById(piece.position).innerHTML = piece.symbol;
      piece.taken = false;
      redrawArea(piece.color);
    }
  }
  
  redrawArea(color){
    let arr = (color == "white")? whiteTakenArray: blackTakenArray;
    for (let i = 0; i < 16; i++){
      document.getElementById(i + "_" + color).innerHTML = (i < arr.length)? arr[i].symbol : "";
    }
  }
  
  placePieces(pieces){
    chessPieces = pieces;
    pieces.forEach(function(piece){
      let square = document.getElementById(piece.position);
      square.innerHTML = piece.symbol;
    });
  } 
}


/* Board creates a board with set dimentions */
class Board{
  cunstructor(){}
  
  _createElement(name, parent){
    let element = document.createElement("div");
    element.className = name;
    parent.appendChild(element);
    return element;
  }
  
  _createBoard(a, b, parent, namingFunc){
    for (let i = 0; i < a; i++){
      for (let j = 0; j < b; j ++){
        let square = document.createElement("div");
        namingFunc(i, j, square);
        parent.appendChild(square);
      }
    }
  }
}


/* Piece contains information about a chess piece */
class Piece{
  constructor(c, n, p){ 
    this.name = n;
    this.color = c;
    this.position = p;
    this.taken = false;
    this.symbol = getSymbol(this.color, this.name);
  }
  
  getSymbol(color, name){  //returns chesspiece symbol in utf-8
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
class ChessLoader{ 
  constructor(){
    let self = this;
    let outputArr;
  }
  
  load(name){
    let xhRequest = new XMLHttpRequest();
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
  
  jsonToPieces(oldArr){
    let newArr = [];
    oldArr.forEach(function(item){
      item.position.forEach(function(pos){
        newArr.push(new Piece(item.color, item.name, pos));
      });
    });
    return newArr;
  }
  
  onLoaded(){
    document.dispatchEvent(new Event('FileLoaded'));
  }  
  
  getPieces(){ return outputArr};
}

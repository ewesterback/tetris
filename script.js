console.log('hi')
////////////////////////////////
// Global variables
///////////////////////////////

const gameGrid = document.querySelector('.board-container')
const BODY = document.querySelector('body')
const masterGameArr = new Array(200)

// ///////////////////////////////////
// Functions
// ///////////////////////////////////

// ----------------------------------
// range
// Desc: Creates an array with a beginning, ending, and step value
// ----------------------------------
const range = (begin, end, step) =>
  Array.from({ length: (end - begin) / step + 1 }, (_, i) => begin + i * step)

// ---------------------------------
// setUpPage -may need to deconstruct from function
// Sets up game grid
// I/O: none
// -------------------------------
const setUpPage = () => {
  class ElementFactory {
    createElement(type, props) {
      let el = document.createElement(type)
      for (let key in props) {
        el[key] = props[key]
      }
      return el
    }
  }

  class TetrisSquare extends ElementFactory {
    constructor(numPos) {
      super()
      this.numPos = numPos
    }
    createGridSquare() {
      //console.log('x')
      return this.createElement('div', {
        className: 'grid-square',
        id: `pos${this.numPos}`,
        innerHTML: `<p>${this.numPos}</p>`
      })
    }
  }

  const gridArray = range(0, 199, 1)

  gridArray.forEach((square) => {
    let mySquare = new TetrisSquare(square).createGridSquare()
    gameGrid.appendChild(mySquare)
  })
}
// ----------------------------------
// fillSquare
// Descr: HTML side to color squares
// I/O:
//    input: posArr - array with positions (numeric)  - required
//          colorClass - class to denote color - optional
// ----------------------------------
const fillSquare = (posArr, colorClass = 'filled') => {
  posArr.forEach((pos) => {
    document.getElementById(`pos${pos}`).className = `grid-square ${colorClass}`
  })
}
// ----------------------------------
// clearSquare
// Descr: HTML side to clear squares
// I/O:
//    input: posArr - array with positions (numeric)  - required
// ----------------------------------
const clearSquare = (posArr) => {
  posArr.forEach((pos) => {
    document.getElementById(`pos${pos}`).className = `grid-square`
  })
}

// //////////////////////////////////////
// main code
// //////////////////////////////////
setUpPage()
fillSquare([0, 1, 10, 11])
console.log('bye')

// document.addEventListener('keypress', function(e) {
//   var code = e.which || e.keyCode;
//   if (code == '38') {
//       // Up
//   }
//   else if (code == '40') {
//       // Down
//   }
//   else if (code == '37') {
//      // Left
//   }
//   else if (code == '39') {
//      // Right
//   }
// })

console.log('hi')
////////////////////////////////
// Global variables
///////////////////////////////

const gameGrid = document.querySelector('.board-container')
const BODY = document.querySelector('body')

// ///////////////////////////////
// Functions
// ///////////////////////////////////

// ----------------------------------
// range
// Desc: Creates an array with a beginning, ending, and step value
// ----------------------------------
const range = (begin, end, step) =>
  Array.from({ length: (end - begin) / step + 1 }, (_, i) => begin + i * step)

// ---------------------------------
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

const gridArray = range(1, 200, 1)
console.log(gridArray)

gridArray.forEach((square) => {
  //gameGrid.appendChild(new TetrisSquare(square).createGridSquare())
  let mySquare = new TetrisSquare(square).createGridSquare()
  //console.log(mySquare)
  gameGrid.appendChild(mySquare)
})
// ---------------------------
console.log(gameGrid)

console.log('bye')

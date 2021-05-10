console.log('hi')
////////////////////////////////
// Global variables
///////////////////////////////

const gameGrid = document.querySelector('.board-container')
const BODY = document.querySelector('body')
const masterGameArr = new Array(200)
let currentShapeArr = []

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
    masterGameArr[pos] = 1
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
    masterGameArr[pos] = 0
  })
}
// ------------------------------------
// moveShape
// Desc: Moves the shape based off of the direction (left, right, down)
// ___________________________________
const moveShape = (dir) => {
  let oldPosArr = currentShapeArr
  let newPosArr = []
  switch (dir) {
    case 'down':
      newPosArr = oldPosArr.map((pos) => {
        return pos + 10
      })
      clearSquare(oldPosArr)
      fillSquare(newPosArr)
      currentShapeArr = newPosArr
      console.log(newPosArr)
      console.log(oldPosArr)
      console.log(currentShapeArr)
      console.log('end')
      break
    //make sure to delete this case for final
    case 'up':
      newPosArr = oldPosArr.map((pos) => {
        return pos - 10
      })
      clearSquare(oldPosArr)
      fillSquare(newPosArr)
      currentShapeArr = newPosArr
      console.log(newPosArr)
      console.log(oldPosArr)
      console.log(currentShapeArr)
      console.log('end')
      break
    case 'left':
      newPosArr = oldPosArr.map((pos) => {
        return pos - 1
      })
      clearSquare(oldPosArr)
      fillSquare(newPosArr)
      currentShapeArr = newPosArr
      console.log(newPosArr)
      console.log(oldPosArr)
      console.log(currentShapeArr)
      console.log('end')
      break
    case 'right':
      newPosArr = oldPosArr.map((pos) => {
        return pos + 1
      })
      clearSquare(oldPosArr)
      fillSquare(newPosArr)
      currentShapeArr = newPosArr
      console.log(newPosArr)
      console.log(oldPosArr)
      console.log(currentShapeArr)
      console.log('end')
      break
    default:
      return
  }
}

// -----------------------------------
// newShape
// ----------------------------------
const newShape = () => {
  let newShapeArr = [4, 5, 14, 15]
  currentShapeArr = newShapeArr
  fillSquare(newShapeArr)
  newShapeArr.forEach((pos) => {
    masterGameArr[pos] = 1
  })
}

// //////////////////////////////////////
// main code
// //////////////////////////////////
setUpPage()
newShape()
console.log('bye')

// /////////////////////////////////
// Event Listeners
// /////////////////////////////////
document.addEventListener(
  'keydown',
  function (event) {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }

    switch (event.key) {
      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        // Do something for "down arrow" key press.
        moveShape('down')
        break
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        // Do something for "up arrow" key press.
        moveShape('up')
        break
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        // Do something for "left arrow" key press.
        moveShape('left')
        break
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        // Do something for "right arrow" key press.
        moveShape('right')
        break
      case 'Enter':
        // Do something for "enter" or "return" key press.
        break
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        // Do something for "esc" key press.
        break
      default:
        return // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault()
  },
  true
)

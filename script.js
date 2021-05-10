console.log('hi')
////////////////////////////////
// Global variables
///////////////////////////////

const gameGrid = document.querySelector('.board-container')
const BODY = document.querySelector('body')
const currentShapeObj = {
  curPosition: [],
  curShape: []
}
const masterGameArr = new Array(200)
for (i = 0; i < masterGameArr.length; i++) {
  masterGameArr[i] = 0
}

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
// Descr: HTML and javascript side to clear squares
// I/O:
//    input: posArr - array with positions (numeric)  - required
// ----------------------------------
const clearSquare = (posArr) => {
  posArr.forEach((pos) => {
    document.getElementById(`pos${pos}`).className = `grid-square`
    masterGameArr[pos] = 0
  })
}
const goodToMove = (oldArr, newArr, dir) => {
  console.log('goodToMove')
  if (newArr.some((num) => num > 199)) {
    console.log('greater than 199')
    return false
  }
  let posInMaster = []
  newArr.forEach((pos) => {
    posInMaster.push(masterGameArr[pos])
  })
  if (posInMaster.some((pos) => pos === 1)) {
    console.log('something in way')
    return false
  }
  console.log(`dir: ${dir}`)
  if (dir === 'right' || dir === 'left') {
    let currentRow = oldArr.map((pos) => Math.floor(pos / 10))
    let newRow = newArr.map((pos) => Math.floor(pos / 10))
    for (let i = 0; i < currentRow.length; i++) {
      if (currentRow[i] !== newRow[i]) {
        console.log('at side edge')
        return false
      }
    }
  }

  return true
}
const findNewPos = (oldPosArr, dir) => {
  console.log('findNewPos')
  let newPosArr = []
  switch (dir) {
    case 'down':
      newPosArr = oldPosArr.map((pos) => {
        return pos + 10
      })
      break
    //make sure to delete this case for final
    case 'up':
      newPosArr = oldPosArr.map((pos) => {
        return pos - 10
      })
      break
    case 'left':
      newPosArr = oldPosArr.map((pos) => {
        return pos - 1
      })
      break
    case 'right':
      newPosArr = oldPosArr.map((pos) => {
        return pos + 1
      })
      break
    default:
      return
  }
  return newPosArr
}
//
// ------------------------------------
// moveShape
// Desc: Moves the shape based off of the direction (left, right, down)
// ___________________________________
const moveShape = (dir) => {
  console.log('move shape')
  let oldPosArr = currentShapeObj.curPosition
  let newPosArr = findNewPos(oldPosArr, dir)
  if (goodToMove(oldPosArr, newPosArr, dir)) {
    clearSquare(oldPosArr)
    fillSquare(newPosArr)
    currentShapeObj.curPosition = newPosArr
  }
}

// -----------------------------------
// newShape
// ----------------------------------
const newShape = () => {
  let newPosArr = [4, 5, 14, 15]
  currentShapeObj.curPosition = newPosArr
  fillSquare(newPosArr)
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

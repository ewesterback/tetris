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
let gameActive = false
let gamePaused = true
let score = 0
let myInterval

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
// -----------------------------------
// goodToMove
// Desc: checks if shape can move in the designated direction
// Input: oldArr - required - array of old positions
//        newArr - required - array of position the shap is being moved to
//        dir - required - the direction the shape is trying to be moved
// Output: 1 if able to move to the new position,
//          0 if there is something in the way
//          2 if it reached as far as it can go down
// ------------------------------------
const goodToMove = (oldArr, newArr, dir) => {
  if (newArr.some((num) => num > 199)) {
    return 2
  }
  let posInMaster = []
  newArr.forEach((pos) => {
    posInMaster.push(masterGameArr[pos])
  })
  if (posInMaster.some((pos) => pos === 1)) {
    if (dir === 'down') {
      return 2
    }
    return 0
  }
  if (dir === 'right' || dir === 'left') {
    let currentRow = oldArr.map((pos) => Math.floor(pos / 10))
    let newRow = newArr.map((pos) => Math.floor(pos / 10))
    for (let i = 0; i < currentRow.length; i++) {
      if (currentRow[i] !== newRow[i]) {
        return 0
      }
    }
  }

  return 1
}
// --------------------------------------
// findNewPos
// ------------------------------------
const findNewPos = (oldPosArr, dir) => {
  let newPosArr = []
  switch (dir) {
    case 'down':
      newPosArr = oldPosArr.map((pos) => {
        return pos + 10
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
  let oldPosArr = currentShapeObj.curPosition
  let newPosArr = findNewPos(oldPosArr, dir)
  let canMove = goodToMove(oldPosArr, newPosArr, dir)
  if (canMove === 1) {
    clearSquare(oldPosArr)
    fillSquare(newPosArr)
    currentShapeObj.curPosition = newPosArr
  } else if (canMove === 2) {
    oldPosArr.forEach((pos) => {
      masterGameArr[pos] = 1
    })
    newShape()
  }
}
// -----------------------------------
// reset()
// -----------------------------------
const resetBoard = () => {
  startStopInterval('pause')
  for (i = 0; i < masterGameArr.length; i++) {
    masterGameArr[i] = 0
    document.getElementById(`pos${i}`).className = `grid-square`
  }
  document.querySelector('.header h1').innerText = "Let's play"
  score = 0
  newShape()
  gameActive = true
  gamePaused = false
  document.querySelector('#pause-button').innerText = 'pause'
  startStopInterval('start')
}
// -----------------------------------
// endGame()
// -----------------------------------
const endGame = (incomingShapeArr) => {
  let incomingPosInMaster = []
  incomingShapeArr.forEach((pos) => {
    incomingPosInMaster.push(masterGameArr[pos])
  })
  if (incomingPosInMaster.some((pos) => pos === 1)) {
    startStopInterval('pause')
    document.querySelector('.header h1').innerText = 'Game Over'
    gameActive = false
    return true
  } else {
    return false
  }
}
// -----------------------------------
// newShape
// ----------------------------------
const newShape = () => {
  checkRow()
  let randomNum = Math.floor(Math.random() * 7)
  let starterShape = shapeMatrix[randomNum]
  let newPosArr = []
  for (let i = 0; i < starterShape[0].length; i++) {
    if (starterShape[0][i] === 1) {
      newPosArr.push(starterShape[0][i] + i + 3)
    }
  }
  if (starterShape.length > 1) {
    for (let i = 0; i < starterShape[1].length; i++) {
      if (starterShape[1][i] === 1) {
        newPosArr.push(starterShape[1][i] + i + 13)
      }
    }
  }

  if (endGame(newPosArr) === false) {
    currentShapeObj.curPosition = newPosArr
    currentShapeObj.curShape = starterShape
    fillSquare(newPosArr)
  }
}
// ---------------------------------
//  create shape matrix
// --------------------------------
const createShapeMatrix = () => {
  const square = [
    [1, 1],
    [1, 1]
  ]
  const rightL = [
    [0, 0, 1],
    [1, 1, 1]
  ]
  const leftL = [
    [1, 0, 0],
    [1, 1, 1]
  ]
  const tshape = [
    [0, 1, 0],
    [1, 1, 1]
  ]
  const zig = [
    [1, 1, 0],
    [0, 1, 1]
  ]
  const zag = [
    [0, 1, 1],
    [1, 1, 0]
  ]
  const pole = [[1, 1, 1, 1]]
  return [square, rightL, leftL, tshape, zig, zag, pole]
}
// ---------
// checkRow
// --------
const checkRow = () => {
  let rowCheckCounter = 0
  for (let i = 0; i < masterGameArr.length; i++) {
    if (i % 10 === 0) {
      rowCheckCounter = 0
    }
    if (masterGameArr[i] === 1) {
      rowCheckCounter++
    }
    if (rowCheckCounter === 10) {
      let rowClearedNum = Math.floor(i / 10)
      let rowStartingNum = rowClearedNum * 10
      score += 1000
      document.querySelector('.score p').innerText = `${score}`
      masterGameArr.splice(rowStartingNum, 10)
      masterGameArr.unshift(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
      for (let i = 0; i < masterGameArr.length; i++) {
        if (masterGameArr[i] === 1) {
          document.getElementById(`pos${i}`).className = `grid-square filled`
        } else {
          document.getElementById(`pos${i}`).className = `grid-square`
        }
      }
    }
  }
}
// -------------------------------
// rotateShape
// ------------------------------
const rotateShape = () => {
  let curShape = currentShapeObj.curShape
  let newShape = []
  for (let j = curShape[0].length - 1; j >= 0; j--) {
    let row = []
    for (let i = 0; i < curShape.length; i++) {
      row.push(curShape[i][j])
    }
    newShape.push(row)
  }
  let newPosArr = centerMass(currentShapeObj.curPosition, newShape)
  if (newPosArr.length > 3) {
    clearSquare(currentShapeObj.curPosition)
    fillSquare(newPosArr)
    currentShapeObj.curPosition = newPosArr
    currentShapeObj.curShape = newShape
  }
}
// ----------------------
// centerMass
// -------------------
const centerMass = (oldPosArr, newShape) => {
  let startNum = 54 //54 since it's in the middle.  This will be centered in centerMass
  let newStartPosArr = []
  let newPos = 0
  for (let i = 0; i < newShape.length; i++) {
    for (let j = 0; j < newShape[i].length; j++) {
      if (newShape[i][j] === 1) {
        newPos = newShape[i][j] + j + startNum + i * 10
        newStartPosArr.push(newPos)
      }
    }
  }
  //change position # to x and y coords
  let oldPosArrX = oldPosArr.map((pos) => {
    return pos % 10
  })
  let oldPosArrY = oldPosArr.map((pos) => {
    return Math.floor(pos / 10)
  })
  let newPosArrX = newStartPosArr.map((pos) => {
    return pos % 10
  })
  let newPosArrY = newStartPosArr.map((pos) => {
    return Math.floor(pos / 10)
  })
  //find the center of mass for old and new arrays
  let oldxi = Math.floor(
    oldPosArrX.reduce((acc, pos) => {
      return acc + pos
    }, 0) / 4
  )
  let oldyi = Math.floor(
    oldPosArrY.reduce((acc, pos) => {
      return acc + pos
    }, 0) / 4
  )
  let newxi = Math.floor(
    newPosArrX.reduce((acc, pos) => {
      return acc + pos
    }, 0) / 4
  )
  let newyi = Math.floor(
    newPosArrY.reduce((acc, pos) => {
      return acc + pos
    }, 0) / 4
  )
  //match the center of mass of the newPos with the old one
  for (let i = 0; i < newPosArrX.length; i++) {
    newPosArrX[i] = newPosArrX[i] + oldxi - newxi
    newPosArrY[i] = newPosArrY[i] + oldyi - newyi
  }
  //accounts for edges and nudges to one side or the other
  while (newPosArrX.some((pos) => pos < 0)) {
    newPosArrX = newPosArrX.map((val) => val + 1)
  }
  while (newPosArrX.some((pos) => pos > 9)) {
    newPosArrX = newPosArrX.map((val) => val - 1)
  }
  while (newPosArrY.some((pos) => pos < 0)) {
    newPosArrY = newPosArrY.map((val) => val + 1)
  }
  while (newPosArrY.some((pos) => pos > 19)) {
    newPosArrY = newPosArrY.map((val) => val - 1)
  }
  // account for elements in the way
  // If another square is in the way,
  // won't rotate.  For future, should build in some nudging
  let posInMaster = []
  let newZippedArr = zipper(newPosArrX, newPosArrY)
  newZippedArr.forEach((pos) => {
    posInMaster.push(masterGameArr[pos])
  })
  if (posInMaster.some((pos) => pos === 1)) {
    return []
  }

  return newZippedArr
}
// --------------------------
// zipper
// -------------------------
const zipper = (xArr, yArr) => {
  newZipped = []
  for (i = 0; i < xArr.length; i++) {
    newZipped.push(parseInt(`${yArr[i]}${xArr[i]}`))
  }
  return newZipped
}
// --------------------------
// alwaysDown
// -------------------------
function alwaysDown() {
  let oldPosArr = currentShapeObj.curPosition
  let newPosArr = findNewPos(oldPosArr, 'down')
  let canMove = goodToMove(oldPosArr, newPosArr, 'down')
  if (canMove === 1) {
    clearSquare(oldPosArr)
    fillSquare(newPosArr)
    currentShapeObj.curPosition = newPosArr
  } else if (canMove === 2) {
    oldPosArr.forEach((pos) => {
      masterGameArr[pos] = 1
    })
    newShape()
  }
}
const startStopInterval = (action) => {
  if (action === 'pause') {
    clearInterval(myInterval)
  } else if (action === 'start') {
    myInterval = setInterval(alwaysDown, 1000)
  }
}

// //////////////////////////////////////
// main code
// //////////////////////////////////
setUpPage()
const shapeMatrix = createShapeMatrix()
newShape()
gameActive = true
//let myInterval = setInterval(alwaysDown, 1000)

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
        if (gamePaused === false) {
          moveShape('down')
        }
        break
      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        // Do something for "up arrow" key press.
        if (gamePaused === false) {
          rotateShape()
        }
        break
      case 'Left': // IE/Edge specific value
      case 'ArrowLeft':
        // Do something for "left arrow" key press.
        if (gamePaused === false) {
          moveShape('left')
        }
        break
      case 'Right': // IE/Edge specific value
      case 'ArrowRight':
        // Do something for "right arrow" key press.
        if (gamePaused === false) {
          moveShape('right')
        }
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
document.querySelector('#pause-button').onclick = function () {
  if (gamePaused === false) {
    //clearInterval(myInterval)
    startStopInterval('pause')
    gamePaused = true
    document.querySelector('.header h1').innerText = 'Game paused'
    document.querySelector('#pause-button').innerText = 'play'
  } else {
    gamePaused = false
    document.querySelector('.header h1').innerText = "Let's play"
    document.querySelector('#pause-button').innerText = 'pause'
    //myInterval = setInterval(alwaysDown, 1000)
    startStopInterval('start')
  }
}
document.querySelector('#reset-button').onclick = function () {
  resetBoard()
}

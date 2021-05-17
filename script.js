console.log('hi')
////////////////////////////////
// Global variables
///////////////////////////////

const gameGrid = document.querySelector('.board-container')
const BODY = document.querySelector('body')
const upnextGrid = document.querySelector('.upnext-grid')
const overlay = document.querySelector('.overlay')
console.log(overlay)
const instructionsEl = document.querySelector('.instructions')
const upnextGroupEl = document.querySelector('.upnext-group')
const darkModeLabel = document.querySelector('.settings p')
const scoreEle = document.querySelector('.score p')
console.log(upnextGroupEl)
//const gridSquareEl = document.querySelectorAll('.grid-square')
//const upnextSquareEl = document.querySelectorAll('.upnext-square')
const currentShapeObj = {
  curPosition: [],
  curShape: [],
  curShapeName: ''
}
const masterGameArr = new Array(200)
for (i = 0; i < masterGameArr.length; i++) {
  masterGameArr[i] = 0
}
let gameActive = true
let gamePaused = true
let darkMode = false
let score = 0
let myInterval
let upNextArray = []
const nextShapeObj1 = {
  shape: [],
  shapeName: ''
}
const nextShapeObj2 = {
  shape: [],
  shapeName: ''
}
const nextShapeObj3 = {
  shape: [],
  shapeName: ''
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
  const gridArray = range(0, 199, 1)
  let className = 'grid-square'
  gridArray.forEach((square) => {
    let id = `pos${square}`
    let mySquare = new TetrisSquare(className, id).createGridSquare()
    gameGrid.appendChild(mySquare)
  })
  let nextClassName = 'upnext-square'
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 4; i++) {
      let nextId = `next${j}${i}`
      let mySquare = new TetrisSquare(nextClassName, nextId).createGridSquare()
      upnextGrid.appendChild(mySquare)
    }
  }
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
    fillSquare(newPosArr, currentShapeObj.curShapeName)
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
  scoreEle.innerText = `${score}`
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
// ------------------------------------
//
// -------------------------------------
const createUpNext = () => {
  let randomNum
  let nextShape
  let nextShapeName
  if (upNextArray.length < 3) {
    for (let i = 1; i <= 3; i++) {
      randomNum = Math.floor(Math.random() * 7)
      nextShape = shapeMatrix[randomNum]
      nextShapeName = shapeNameMatrix[randomNum]
      upNextArray.push([nextShape, nextShapeName])
    }
    randomNum = Math.floor(Math.random() * 7)
    currentShapeObj.curShape = shapeMatrix[randomNum]
    currentShapeObj.curShapeName = shapeNameMatrix[randomNum]
  } else {
    let newShapeArry = upNextArray.shift()
    currentShapeObj.curShape = newShapeArry[0]
    currentShapeObj.curShapeName = newShapeArry[1]
    randomNum = Math.floor(Math.random() * 7)
    nextShape = shapeMatrix[randomNum]
    nextShapeName = shapeNameMatrix[randomNum]
    upNextArray.push([nextShape, nextShapeName])
  }
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 4; i++) {
      let nextId = `next${j}${i}`
      document.getElementById(nextId).className = `upnext-square`
    }
  }
  let startingRow = 0
  for (let i = 0; i < upNextArray.length; i++) {
    let newDisplayShapeArry = upNextArray[i][0]
    let colorClass = upNextArray[i][1]
    console.log(`${colorClass} and ${startingRow}`)
    for (let x = 0; x < newDisplayShapeArry[0].length; x++) {
      if (newDisplayShapeArry[0][x] === 1) {
        let newID = `next${startingRow}${x}`
        document.getElementById(newID).className = `upnext-square ${colorClass}`
      }
    }
    if (newDisplayShapeArry.length > 1) {
      for (let x = 0; x < newDisplayShapeArry[1].length; x++) {
        if (newDisplayShapeArry[1][x] === 1) {
          let newID = `next${startingRow + 1}${x}`
          document.getElementById(
            newID
          ).className = `upnext-square ${colorClass}`
        }
      }
    }
    startingRow += 3
  }
}
// -----------------------------------
// newShape
// ----------------------------------
const newShape = () => {
  if (gameActive === false) {
    return
  }
  checkRow()
  createUpNext()
  let starterShape = currentShapeObj.curShape
  let starterShapeName = currentShapeObj.curShapeName
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
    fillSquare(newPosArr, starterShapeName)
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
      // identify row that was cleared
      let rowClearedNum = Math.floor(i / 10)
      let rowStartingNum = rowClearedNum * 10
      // increase score
      score += 1000
      scoreEle.innerText = `${score}`
      // update the master game array to remove row
      masterGameArr.splice(rowStartingNum, 10)
      masterGameArr.unshift(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
      // -----update html-----
      // remove row
      for (let i = rowStartingNum; i < rowStartingNum + 10; i++) {
        document.getElementById(`pos${i}`).remove()
      }
      // shift ids
      let newIDNum = rowStartingNum + 9
      for (let i = rowStartingNum - 1; i >= 0; i--) {
        let elToChange = document.getElementById(`pos${i}`)
        elToChange.id = `pos${newIDNum}`
        newIDNum--
      }
      //create new row on top
      let className = 'grid-square'
      for (let i = 9; i >= 0; i--) {
        let id = `pos${i}`
        let mySquare = new TetrisSquare(className, id).createGridSquare()
        gameGrid.insertBefore(mySquare, gameGrid.childNodes[0])
      }
      let updatedGridSquareEl = document.querySelectorAll('.grid-square')
      if (darkMode === true) {
        for (let ele = 0; ele < updatedGridSquareEl.length; ele++) {
          updatedGridSquareEl[ele].style.border = '1px solid #1e3547'
        }
      } else {
        for (let ele = 0; ele < updatedGridSquareEl.length; ele++) {
          updatedGridSquareEl[ele].style.border = '1px solid #e8f2d8'
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
  //rotates shape by flipping columns and rows
  // still in 1s and 0s
  for (let j = curShape[0].length - 1; j >= 0; j--) {
    let row = []
    for (let i = 0; i < curShape.length; i++) {
      row.push(curShape[i][j])
    }
    newShape.push(row)
  }
  // center mass takes 1s and 0s and transisitons it to a positional array
  let newPosArr = centerMass(currentShapeObj.curPosition, newShape)
  if (newPosArr.length > 3) {
    clearSquare(currentShapeObj.curPosition)
    fillSquare(newPosArr, currentShapeObj.curShapeName)
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
  // takes 1s and 0s and translates to positional array in middle of board
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
  // takes x and y arrays and zips into position array
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
// takes x and y array and zips them into positional arrays
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
// moves shape down
// referenced in startStopInterval to move shape down every second
// -------------------------
function alwaysDown() {
  let oldPosArr = currentShapeObj.curPosition
  let newPosArr = findNewPos(oldPosArr, 'down')
  let canMove = goodToMove(oldPosArr, newPosArr, 'down')
  if (canMove === 1) {
    clearSquare(oldPosArr)
    fillSquare(newPosArr, currentShapeObj.curShapeName)
    currentShapeObj.curPosition = newPosArr
  } else if (canMove === 2) {
    oldPosArr.forEach((pos) => {
      masterGameArr[pos] = 1
    })
    newShape()
  }
}
// ---------------------------
// startStopInterval
// takes a string and either stops or starts the interval
// put in a seperate function to ensure that only one interval
// is going at a time
// ---------------------------
const startStopInterval = (action) => {
  if (action === 'pause') {
    clearInterval(myInterval)
  } else if (action === 'start') {
    myInterval = setInterval(alwaysDown, 1000)
  }
}
const changeToDarkMode = () => {
  BODY.style.backgroundImage = "url('darkmodeGPback.png')"
  console.log(`darkmode ${darkmodeCounter}`)
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  instructionsEl.style.backgroundColor = 'black'
  instructionsEl.style.color = 'white'
  upnextGroupEl.style.backgroundColor = 'black'
  upnextGroupEl.style.color = 'white'
  upnextGrid.style.backgroundColor = 'black'
  for (let ele = 0; ele < upnextSquareEl.length; ele++) {
    upnextSquareEl[ele].style.border = '1px solid black'
  }
  gameGrid.style.backgroundColor = 'black'
  gameGrid.style.border = '1px solid white'
  darkModeLabel.style.color = 'white'
  scoreEle.style.backgroundColor = 'black'
  let updatedGridSquareEl = document.querySelectorAll('.grid-square')
  for (let ele = 0; ele < updatedGridSquareEl.length; ele++) {
    updatedGridSquareEl[ele].style.border = '1px solid #1e3547'
  }
}
const changeToLightMode = () => {
  BODY.style.backgroundImage = "url('gamepageBackground.png')"
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
  instructionsEl.style.backgroundColor = 'white'
  instructionsEl.style.color = 'black'
  upnextGroupEl.style.backgroundColor = 'white'
  upnextGroupEl.style.color = 'black'
  upnextGrid.style.backgroundColor = 'white'
  for (let ele = 0; ele < upnextSquareEl.length; ele++) {
    upnextSquareEl[ele].style.border = '1px solid white'
  }
  gameGrid.style.backgroundColor = 'white'
  gameGrid.style.border = '1px solid black'
  darkModeLabel.style.color = 'black'
  scoreEle.style.backgroundColor = 'white'
  let updatedGridSquareEl = document.querySelectorAll('.grid-square')
  for (let ele = 0; ele < updatedGridSquareEl.length; ele++) {
    updatedGridSquareEl[ele].style.border = '1px solid #e8f2d8'
  }
}

// //////////////////////////////////////
// //////////////////////////////////////
// main code
// ////////////////////////////////////
// //////////////////////////////////////
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
  constructor(className, id) {
    super()
    this.className = className
    this.id = id
  }
  createGridSquare() {
    return this.createElement('div', {
      className: this.className,
      id: this.id,
      innerHTML: `<p></p>`
    })
  }
}
setUpPage()
const gridSquareEl = document.querySelectorAll('.grid-square')
const upnextSquareEl = document.querySelectorAll('.upnext-square')
console.log(gridSquareEl)
const shapeMatrix = createShapeMatrix()
const shapeNameMatrix = [
  'square',
  'rightL',
  'leftL',
  'tshape',
  'zig',
  'zag',
  'pole'
]
newShape()
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
  if (gamePaused === false && gameActive === true) {
    //clearInterval(myInterval)
    startStopInterval('pause')
    gamePaused = true
    document.querySelector('.header h1').innerText = 'Game paused'
    document.querySelector('#pause-button').innerText = 'play'
  } else if (gamePaused === true && gameActive === true) {
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
let darkmodeCounter = 0
// document.getElementById('darkmode').addEventListener('click', () => {
//   console.log(darkmodeCounter)
//   darkmodeCounter++
//   //console.log('ay')
// })
document.getElementById('darkmode').addEventListener('click', () => {
  if (darkmodeCounter % 2 === 0) {
    if (darkmodeCounter % 4 === 0) {
      darkMode = true
      changeToDarkMode()
      console.log('in darkmode if')
    } else {
      console.log('inlightmode if')
      darkMode = false
      changeToLightMode()
    }
  }
  console.log(darkmodeCounter)
  darkmodeCounter++
  //console.log('ay')
})

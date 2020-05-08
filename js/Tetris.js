import Block from "./BlocksClass.js"
// import Swal from 'sweetalert2'

// <gets the main canvas and give it a context
const canvas = document.querySelector("#myCanvas");
const context = canvas.getContext("2d");
// gets the main canvas and give it a context>

// <this canvas has the principal function of displaying the next block that is going to be displayed
const canvas2 = document.querySelector("#myCanvas2");
const context2 = canvas2.getContext("2d");
// this canvas has the principal function of displaying the next block that is going to be displayed>

// <this canvas shows the block that is being held 
const canvas3 = document.querySelector("#myCanvas3");
const context3 = canvas3.getContext("2d");
// this canvas shows the block that is being held >

// <this canvas exists so that the player can be aware of his points,  current level  and the highest score 
const canvas4 = document.querySelector("#myCanvas4");
const context4 = canvas4.getContext("2d");
// this canvas exists so that the player can be aware of his points,  current level  and the highest score>

//add to the window this 2 events  
window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);

// <all the canvas  width and height 
let H = canvas.height
let W = canvas.width

let W2 = canvas2.width
let H2 = canvas2.height

let W3 = canvas3.width
let H3 = canvas3.height

let W4 = canvas4.width
let H4 = canvas4.height
// all the canvas  width and height>

let proceed = true // variable that controls if the game is over or not, obs : it is over when "proceed ==false" 

// player focus 
let points = 0 // Player points 
let level = 1 //current level
let velocity = 80 // Actually this is the  the "time" that the block takes to move in the y axis 
let heightScore = 0 //the highest score  

//  if there is already a highest scored in the system it fetches that score
if (JSON.parse(localStorage.getItem("hightScore"))) {
    heightScore = JSON.parse(localStorage.getItem("hightScore"))
}

// held block type
let held = 0 // Saves the number that represents the type of the block that is being held 
let comingFromHeld = false //informs the system that the blocks that is going to be displayed was held up 

// Initial variables
let keys = [] //?This array saves the list of keys that have ben press 
export let takenSquares = [] //?this array  saves all the positions that have been taken 
let displayOBlock = [] //this array saves the info related to the block that is being displayed
let canDisplay = true // informs the system if the next block can be displayed or not 

let random = 0 //variable that saves the number that represents the block that is being displayed(1-10 [1-zBlock, 2 -sBlock, 3-LBlock(inverted), 4-LBlock , 5-TBlock, 6-OBlock,7-IBlock])  
let random2 = 0 //variable that saves the number that represents the next block that is going to be displayed(1-10 [1-zBlock, 2 -sBlock, 3-LBlock(inverted), 4-LBlock , 5-TBlock, 6-OBlock,7-IBlock]) 

canvasStyle()
myTetris()

/**
 * This function builds the canvas backGround (it also serves to clear the canvas)
 */
function canvasStyle() {
    let size = 30

    context.fillStyle = '#1c1c1c';
    context.fillRect(0, 0, W, H);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 20; j++) {
            context.lineWidth = .8;
            context.strokeStyle = '#f3f3f3f3';
            context.strokeRect(i * size, j * size, size, size);
        }
    }
}

/**
 * function that stylizes the canvas that shows the held block
 */
function holdCanvasStyle() {
    context3.fillStyle = "black";
    context3.fillRect(0, 0, W3, H3);

    context3.fillStyle = "#323232";
    context3.fillRect(0, 0, W3, 30);

    context3.fillStyle = "#FEFEFA";
    context3.textAlign = 'center';

    context3.font = '15px sans-serif';
    context3.fillText("HELD", W3 / 2, 20);
}

/**
 * function that stylizes the canvas that shows next block that is going to be displayed 
 */
function nextCanvasStyle() {
    context2.fillStyle = "black";
    context2.fillRect(0, 0, W2, H2);

    context2.fillStyle = "#323232";
    context2.fillRect(0, 0, W2, 30);

    context2.fillStyle = "#FEFEFA";
    context2.textAlign = 'center';

    context2.font = '15px sans-serif';
    context2.fillText("NEXT BLOCK", W2 / 2, 20);
}

/**
 * function that stylized the canvas that shows next block that is going to be displayed 
 */
function playerCanvasStyle() {
    context4.fillStyle = "black"
    context4.fillRect(0, 0, W4, H4);

    context4.fillStyle = "#323232";
    context4.fillRect(0, 0, W4, 30);

    context4.fillStyle = "#FEFEFA";
    context4.textAlign = 'center';

    context4.font = '15px sans-serif';
    context4.fillText("SCORE", W4 / 2, 20);

    // POINTS DISPLAY
    context4.font = '25px sans-serif';
    context4.fillText(points, W4 / 2, 60);

    // -----------------
    context4.fillStyle = "#323232";
    context4.fillRect(0, 70, W4, 30);

    context4.fillStyle = "#FEFEFA";
    context4.textAlign = 'center';

    // -----------------
    context4.font = '15px sans-serif';
    context4.fillText("LEVEL", W4 / 2, 90);

    context4.font = '25px sans-serif';
    context4.fillText(level, W4 / 2, 130);

    context4.fillStyle = "#323232";
    context4.fillRect(0, 140, W4, 30);

    context4.fillStyle = "#FEFEFA";
    context4.textAlign = 'center';

    context4.font = '15px sans-serif';
    context4.fillText("HIGHEST SCORE", W4 / 2, 160);


    context4.font = '25px sans-serif';
    context4.fillText(heightScore, W4 / 2, 200);

}
/**
 * this is the main function function that controls the progress of the game
 */

function myTetris() {
    canvasStyle()
    isRowCompleted()
    fillTaken()
    levelAndVelocityByPoints()

    if (canDisplay) {
        displayOBlock = []
        if (random2 == 0) {
            random = Math.floor(Math.random() * 7) + 1; // returns a random integer from 1 to 7
        } else if (comingFromHeld == false) {
            random = random2
            points += 10
        }

        if (comingFromHeld == false) {
            random2 = Math.floor(Math.random() * 7) + 1; // returns a random integer from 1 to 7

        } else {
            comingFromHeld = false
        }
        displayOBlock.push(new Block(takenSquares, random, W, H, context, velocity)) // it is here that the block that is being displayed is going to be created an all the functions that are related to that block
    }
    playerCanvasStyle()
    printNextBlock()
    printHeldBlock()

    for (const block of displayOBlock) {
        block.setKeys(keys)
        block.display()
        canDisplay = block.returnArrival()
        takenSquares = block.returnTakenSquares()
        // points += block.returnExtraPoints()
    }

    didLose()

    if (proceed == false) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)"
        context.fillRect(0, 0, W, H);

        context.fillStyle = "#323232";
        context.fillRect(0, H / 2 - 200 / 2, W, 200);

        context.fillStyle = "#FEFEFA";
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.font = '40px sans-serif';
        context.fillText("GAME OVER", W / 2, H / 2);

        if (JSON.parse(localStorage.getItem("hightScore"))) {
            if (JSON.parse(localStorage.getItem("hightScore")) < points) {
                localStorage.setItem(
                    "hightScore",
                    JSON.stringify(points)
                );
                context.font = '15px sans-serif';
                context.fillText("NEW HIGHEST SCORE", W / 2, (H / 2) + 40);
            }
        } else {
            localStorage.setItem(
                "hightScore",
                JSON.stringify(points)
            );
        }
    } else {
        requestAnimationFrame(myTetris)
    }
}

function ArrowReleased(e) {
    keys[e.keyCode] = false;
    for (const block of displayOBlock) {
        block.keys = keys
    }
}

function ArrowPressed(e) {
    keys[e.keyCode] = true;

    hold()
    for (const block of displayOBlock) {
        block.keys = keys
    }
}

/**
 * this functions shows the user the next BLOCK that is going to fall , by printing it 
 */
function printNextBlock() {
    nextCanvasStyle()
    let saveY = 0
    let saveX = 0
    let x = 0
    let y = 0
    let size = 30
    let color = ""

    if (random2 == 1) {
        color = "#E71D36"
        x = 30
        y = 30
    } else if (random2 == 2) {
        color = "#2EC4B6"
        x = 60
        y = 30
    } else if (random2 == 3) {
        color = "#FF9F1C"
        x = 30
        y = 60
    } else if (random2 == 4) {
        color = "#388659"
        x = 30
        y = 60
    } else if (random2 == 5) {
        color = "#2E86AB"
        x = 30
        y = 60
    } else if (random2 == 6) {
        color = "#FF4E00"
        y = 30
        x = 30
    } else if (random2 == 7) {
        y = 30
        color = "#05B2DC"
    }

    for (let i = 0; i < 4; i++) {
        context2.fillStyle = color
        context2.strokeStyle = '#f3f3f3f3';
        context2.fillRect(x + size, y + size, size, size);
        context2.strokeRect(x + size, y + size, size, size);

        if (random2 == 1) {
            if (i == 0) {
                saveX = x
                x = x - size
            }
            if (i == 1) {
                x = saveX
                y = y + size
            }
            if (i == 2) {
                x = x + size
            }
            if (i == 3) {
                y = saveY
            }
        } else if (random2 == 2) {
            if (i == 0) {
                saveX = x
                x += size
            }
            if (i == 1) {
                x = saveX
                y += size //increment y so that the second line of squares will be created
            }
            if (i == 2) {
                x = x - size
            }
            if (i == 3) {
                y = saveY
            }
        } else if (random2 == 3) {
            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y
                saveX = x
                x = x - size
            }
            if (i == 1) {
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 2) {
                y = saveY
                x = saveX
                x = x + size
            }
        } else if (random2 == 4) {
            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y //saves the first y value to help on the draw of the next object
                saveX = x
                x = x + size
            }
            if (i == 1) {
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 2) {
                y = saveY
                x = saveX
                x = x - size
            }
        } else if (random2 == 5) {

            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y //saves the first y value to help on the draw of the next object
                saveX = x
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 1) {
                x = saveX
                y = saveY
                x = x + size
            }
            if (i == 2) {
                x = saveX
                x = x - size
            }
        } else if (random2 == 6) {

            if (i == 0) {
                saveX = x

            }
            x = x + size
            if (i == 1) {
                saveY = y //saves the first y value to help on the draw of the next object
                y = y + size //increment y so that the second line of squares will be created
                x = saveX //gives back the initial value of x 
            }
        } else if (random2 == 7) {
            x = x + size
        }
    }
}

/**
 * function that is focused on saving a peace (block) for future use and also releasing the saved peace  
 */
function hold() {
    if (keys[67] == true) {
        displayOBlock = []
        canDisplay = true

        if (held == 0) {
            held = random
            points -= 10
        } else {
            random = held
            held = 0
            comingFromHeld = true
        }
        keys[67] = false
    }
}

/**
 * this functions shows the user the HELD BLOCK 
 */
function printHeldBlock() {
    holdCanvasStyle()
    let saveY = 0
    let saveX = 0
    let x = 0
    let y = 0
    let size = 30
    let color = ""

    if (held == 1) {
        color = "#E71D36"
        x = 30
        y = 30
    } else if (held == 2) {
        color = "#2EC4B6"
        x = 60
        y = 30
    } else if (held == 3) {
        color = "#FF9F1C"
        x = 30
        y = 60
    } else if (held == 4) {
        color = "#388659"
        x = 30
        y = 60
    } else if (held == 5) {
        color = "#2E86AB"
        x = 30
        y = 60
    } else if (held == 6) {
        color = "#FF4E00"
        y = 30
        x = 30
    } else if (held == 7) {
        y = 30
        color = "#05B2DC"
    }

    for (let i = 0; i < 4; i++) {
        if (held != 0) {
            context3.fillStyle = color
            context3.strokeStyle = '#f3f3f3f3';
            context3.fillRect(x + size, y + size, size, size);
            context3.strokeRect(x + size, y + size, size, size);
        }

        if (held == 1) {
            if (i == 0) {
                saveX = x
                x = x - size
            }
            if (i == 1) {
                x = saveX
                y = y + size
            }
            if (i == 2) {
                x = x + size
            }
            if (i == 3) {
                y = saveY
            }
        } else if (held == 2) {
            if (i == 0) {
                saveX = x
                x += size
            }
            if (i == 1) {
                x = saveX
                y += size //increment y so that the second line of squares will be created
            }
            if (i == 2) {
                x = x - size
            }
            if (i == 3) {
                y = saveY
            }
        } else if (held == 3) {
            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y
                saveX = x
                x = x - size
            }
            if (i == 1) {
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 2) {
                y = saveY
                x = saveX
                x = x + size
            }
        } else if (held == 4) {
            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y //saves the first y value to help on the draw of the next object
                saveX = x
                x = x + size
            }
            if (i == 1) {
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 2) {
                y = saveY
                x = saveX
                x = x - size
            }
        } else if (held == 5) {
            if (i == 0) {
                //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                saveY = y //saves the first y value to help on the draw of the next object
                saveX = x
                y = y - size //increment y so that the second line of squares will be created
                x = x
            }
            if (i == 1) {
                x = saveX
                y = saveY
                x = x + size
            }
            if (i == 2) {
                x = saveX
                x = x - size
            }
        } else if (held == 6) {
            if (i == 0) {
                saveX = x

            }
            x = x + size
            if (i == 1) {
                saveY = y //saves the first y value to help on the draw of the next object
                y = y + size //increment y so that the second line of squares will be created
                x = saveX //gives back the initial value of x 
            }
        } else if (held == 7) {
            x = x + size
        }
    }
}

/**
 * this function paints all the already taken squares
 */
function fillTaken() {
    if (takenSquares.length > 0) {
        for (const taken of takenSquares) {
            context.fillStyle = taken.color;
            context.strokeStyle = taken.strokeColor;
            context.fillRect(taken.x, taken.y, taken.size, taken.size);
            context.strokeRect(taken.x, taken.y, taken.size, taken.size);
        }
    }
}

// ********************* Functions focused in deleted a completed row *******************************

/**
 * function that confirms all the rows that has been completed
 */
function isRowCompleted() {
    let count = 0
    let completed = []
    let takenIn = false
    if (takenSquares.length > 1) {
        for (let i = 0; i < takenSquares.length; i++) {
            count = 0
            takenIn = false
            for (let j = 0; j < takenSquares.length; j++) {
                if (takenSquares[i].y === takenSquares[j].y) {
                    count++
                }
                if (count == 10) {
                    for (let s = 0; s < completed.length; s++) {
                        if (completed[s] == takenSquares[i].y) {
                            takenIn = true
                        }
                    }

                    if (takenIn == false) {
                        completed.push(takenSquares[i].y)
                    }
                }
            }
        }

        if (completed.length != 0) {
            clearRow(completed)
        }
    }
}

/**
 * Function that delete a row based on the y value 
 * @param {Array} completed saves all the y values here the row is already completed so it can be deleted
 * *completed
 */
function clearRow(completed) {
    completed.sort()
    for (const position of completed) {
        takenSquares = takenSquares.filter(
            square => square.y !== position
        )
    }
    fallDown(completed)
}

/**
 * function that makes the blokes that are on top of a row that is being deleted "fall down"
 * @param {Array} completed saves all the y values here the row is already completed so it can be deleted
 */
function fallDown(completed) {
    for (let i = 0; i < completed.length; i++) {
        points += 100
        for (const taken of takenSquares) {
            if (taken.y < completed[i]) {
                taken.y += taken.size
            }
        }
    }

}

// ***************************************************************************************************************************************

/**
 * function that confirms if the user has lost the game
 */
function didLose() {
    let size = 30
    for (const taken of takenSquares) {
        if (taken.y == size) {
            proceed = false
        }
    }
}

/**
 * function that defines de level  and the time that the block takes to move in Y axes ("velocity" )  based on the number of points that the user has 
 */
function levelAndVelocityByPoints() {
    if (points <= 1000) {
        velocity = 80
        level = 1
    } else if (points > 1000 && points <= 2000) {
        velocity = 70
        level = 2
    } else if (points > 2000 && points <= 3000) {
        velocity = 60
        level = 3
    } else if (points > 3000 && points <= 4000) {
        velocity = 50
        level = 4
    } else if (points > 4000 && points <= 5000) {
        velocity = 40
        level = 5
    } else if (points > 5000 && points <= 6000) {
        velocity = 30
        level = 6
    } else if (points > 6000 && points <= 7000) {
        velocity = 20
        level = 7
    } else if (points > 7000) {
        velocity = 10
        level = 10
    }
}
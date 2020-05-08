import SavedSquare from "./SavedClass.js"

// 1 - Z 
// 2 -S \
// 3- L(wrong)
// 4- L (right)
// 5-T 

export default class Block {
    constructor(takenSquares, blockType, W, H, context, velocity = 80) {
        this.keys = [] // This array saves the list of keys that have been pressed
        this.size = 30 // Square dimensions
        this.x = 0
        this.y = 0
        this.start = true // This variable sees if its the first time that the block appears 
        this.saveX = 0; // This saves the initial value of  x during the creation of a form of the respective Block
        this.saveY = 0 // This saves the initial value of y during the creation of a form of the respective Block
        this.TimeIncreY = 0 // This works as a timer, when this timer == to the velocity of the block, it will have an increment in Y axes  
        this.arrival = false // Tels the system that the block has arrived
        this.velocity = velocity // Velocity when the blocks are going down
        this.canSave = 0 // This variable confirms if the system can save/ or not the block in the taken blocks list

        // *<group of blocks that have been taken
        this.takenSquares = takenSquares
        // *group of blocks that have been taken>

        // * <canvas Width  and heigh
        this.W = W
        this.H = H
        // *canvas Width and height >

        // *<canvas context
        this.context = context
        // *canvas context>

        // *<Block type
        this.blockType = blockType
        // *Block type>

        // *<display formate
        this.form = 1 //tels to the system the object format that is being displayed, it can be from 1 to 4 forms of display  
        this.formChangeObstacle = false // confirms to the system if the block can be changed his format or not
        // *display formate>

        // *<style
        this.color = "#05B2DC"
        this.strokeColor = "#f3f3f3f3"
        // *style>

        // *<displayPositions
        this.displayedPositions = [] //Saves all the Xs and Ys of the object that is being displayed 
        //*displayPositions>

        // *<limits
        this.objRight = false // confirms if the displayed object  has an obstacle at his right
        this.objLeft = false // confirms if the displayed object  has an obstacle at his left
        this.contactUnderY = false //confirms if the block that is being displayed has found an obstacle under him
        // *limits>
    }

    display() {
        this.myKeys()
        this.defineColor()
        if (this.start == true) {
            this.firstShow()
            this.start = false
        } else {
            this.saveX = this.x //this is the initial value of x in the display  
            this.x = this.x
            this.saveY = this.y
        }
        this.updateFormation()
        this.draw()
        this.updatePosition()
    }

    /**
     * this function focus on the block type that is being displayed to define its color
     * *completed
     */
    defineColor() {
        if (this.blockType == 1) {
            this.color = "#E71D36"
            // 
        } else if (this.blockType == 2) {
            this.color = "#2EC4B6"
        } else if (this.blockType == 3) {
            this.color = "#FF9F1C"
        } else if (this.blockType == 4) {
            this.color = "#388659"
        } else if (this.blockType == 5) {
            this.color = "#2E86AB"
        } else if (this.blockType == 6) {
            this.color = "#FF4E00"
        } else {
            this.color = "#05B2DC"
        }
    }

    /**
     * this function confirms the keys that are pressed and activate a functionality  
     */
    myKeys() {
        // * confirms if there is an object right and if the right key is pressed to move the displayed peace right   
        if (this.keys[39] == true && this.objRight == false) {
            this.x = this.x + this.size
            this.keys[39] = false
        }
        // * confirms if there is an object left and if the left key is pressed to move the displayed peace left
        if (this.keys[37] == true && this.objLeft == false) {
            this.x = this.x - this.size
            this.keys[37] = false
        }
        // * confirms if there a possibility to change an obj form and if the up arrow key is pressed to change the displayed peace formate 
        if (this.keys[38] == true && this.formChangeObstacle == false && this.blockType != 6) {
            if (this.blockType != 7) {
                if (this.form == 1) {
                    this.form = 2
                } else if (this.form == 2) {
                    this.form = 3
                } else if (this.form == 3) {
                    this.form = 4
                } else {
                    this.form = 1
                }
            } else {
                if (this.form == 1) {
                    this.form = 2
                } else if (this.form == 2) {
                    this.form = 3
                } else {
                    this.form = 1
                }
            }
            this.keys[38] = false
        }

        //*confirms if the peace can be moved faster in the Y axes (it goes faster if there is no objects under and if the user press the down arrow  key)
        if (this.keys[40] == true && this.contactUnderY == false) {
            this.y += this.size
            this.keys[40] = false
        }
        //*confirms if the peace can "seat" faster in the Y axes (it "seats"  the peace  if there is no objects under and if the user press the down arrow  key)
        if (this.keys[40] == true && this.contactUnderY == true) {
            this.canSave = 10
        }
    }

    // ***********this group of functions construct and fallen object based on the object type an the form of the object***********
    // first form
    composeBlock1() {
        this.contactUnderY = false
        this.objRight = false
        this.objLeft = false

        for (let i = 0; i < 4; i++) {
            if (i == 0 && this.blockType != 6) {
                this.confTransition2(this.x - this.size, this.y)
            }
            // !This part of the code saves the last displayed positions 
            this.displayedPositions.push(this.x - this.size)
            this.displayedPositions.push(this.y)

            if (!this.objRight) {
                this.objRight = this.canMoveXRight(this.x - this.size, this.y)
            }

            if (!this.objLeft) {
                this.objLeft = this.canMoveXLeft(this.x - this.size, this.y)
            }

            if (!this.contactUnderY) {
                this.contactUnderY = this.yAxesContact(this.x, this.y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveX = this.x
                    this.x = this.x - this.size
                }

                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                }

                if (i == 2) {
                    this.x = this.x + this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    this.saveX = this.x
                    this.x += this.size
                }
                if (i == 1) {
                    this.x = this.saveX
                    this.y += this.size //increment y so that the second line of squares will be created
                }
                if (i == 2) {
                    this.x = this.x - this.size
                }
                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y
                    this.saveX = this.x
                    this.x = this.x - this.size
                }
                if (i == 1) {
                    this.y = this.y - this.size
                    this.x = this.x
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.x = this.x + this.size
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y
                    this.saveX = this.x
                    this.x = this.x + this.size
                }

                if (i == 1) {
                    this.y = this.y - this.size
                    this.x = this.x
                }

                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.x = this.x - this.size
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y - this.size //increment y so that the second line of squares will be created
                    this.x = this.x
                }

                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.saveY
                    this.x = this.x + this.size
                }

                if (i == 2) {
                    this.x = this.saveX
                    this.x = this.x - this.size
                }
            }

            if (this.blockType == 6) {
                this.x = this.x + this.size
                if (i == 1) {
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                    this.x = this.saveX //gives back the initial value of x 
                }

                if (i == 3) {
                    // !It will only enter here if the last  square of the block has been created
                    this.y = this.saveY
                }
            }

            if (this.blockType == 7) {
                this.x = this.x + this.size
            }
        }
    }

    //  Second Form
    composeBlock2() {
        this.contactUnderY = false
        this.objRight = false
        this.objLeft = false
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.confTransition3(this.x - this.size, this.y)
            }

            // !This part of the code saves the last displayed positions 
            this.displayedPositions.push(this.x - this.size)
            this.displayedPositions.push(this.y)

            if (!this.objRight) {
                this.objRight = this.canMoveXRight(this.x - this.size, this.y)
            }

            if (!this.objLeft) {
                this.objLeft = this.canMoveXLeft(this.x - this.size, this.y)
            }

            if (!this.contactUnderY) {
                this.contactUnderY = this.yAxesContact(this.x, this.y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y - this.size
                    this.x = this.x
                }

                if (i == 1) {
                    this.y = this.saveY
                    this.x -= this.size
                }
                if (i == 2) {
                    this.y += this.size
                }

                if (i == 3) {
                    this.x = this.saveX
                    this.y = this.saveY
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y + this.size
                    this.x = this.x
                }

                if (i == 1) {
                    this.y = this.saveY
                    this.x -= this.size
                }

                if (i == 2) {
                    this.y -= this.size
                }

                if (i == 3) {
                    this.x = this.saveX
                    this.y = this.saveY
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y - this.size
                    this.x = this.x
                }

                if (i == 1) {
                    this.x += this.size
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y + this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y + this.size
                    this.x = this.x
                }

                if (i == 1) {
                    this.x += this.size
                    // this.y = this.y + this.size
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y - this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.x = this.x + this.size
                }

                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.y + this.size

                }

                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y - this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 7) {
                if (i == 0) {
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                    this.y
                } else if (i == 1 || i == 2) {
                    this.y = this.y + this.size
                }
                if (i == 3) {
                    this.y = this.saveY
                    this.x = this.saveX
                }
            }
        }
    }

    // third Form 
    composeBlock3() {
        this.contactUnderY = false
        this.objRight = false
        this.objLeft = false
        for (let i = 0; i < 4; i++) {
            if (i == 0 && this.blockType != 7) {
                this.confTransition4(this.x - this.size, this.y)
            } else if (i == 0 && this.blockType == 7) {
                this.confTransition1(this.x - this.size, this.y)
            }

            // !This part of the code saves the last displayed positions 
            this.displayedPositions.push(this.x - this.size)
            this.displayedPositions.push(this.y)

            if (!this.objRight) {
                this.objRight = this.canMoveXRight(this.x - this.size, this.y)
            }
            if (!this.objLeft) {
                this.objLeft = this.canMoveXLeft(this.x - this.size, this.y)
            }

            if (!this.contactUnderY) {
                this.contactUnderY = this.yAxesContact(this.x, this.y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    // this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.x = this.x - this.size
                }
                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.y + this.size //increment y so that the second line of squares will be created

                }
                if (i == 2) {
                    this.x = this.x + this.size
                }
                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    this.saveX = this.x
                    this.x += this.size
                }
                if (i == 1) {
                    this.x = this.saveX
                    this.y += this.size //increment y so that the second line of squares will be created
                }
                if (i == 2) {
                    this.x = this.x - this.size
                }
                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.x = this.x + this.size
                }
                if (i == 1) {
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                    this.x = this.x
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.x = this.x - this.size
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.x = this.x - this.size
                }
                if (i == 1) {
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                    this.x = this.x
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.x = this.x + this.size
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y + this.size //increment y so that the second line of squares will be created
                }

                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.saveY
                    this.x = this.x + this.size
                }
                if (i == 2) {
                    this.x = this.saveX
                    this.x = this.x - this.size
                }
            }

            if (this.blockType == 7) {
                this.x = this.x - this.size
            }
        }
    }

    //  fourth Form
    composeBlock4() {
        this.contactUnderY = false
        this.objRight = false
        this.objLeft = false
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.confTransition1(this.x - this.size, this.y)
            }

            // !This part of the code saves the last displayed positions 
            this.displayedPositions.push(this.x - this.size)
            this.displayedPositions.push(this.y)

            if (!this.objRight) {
                this.objRight = this.canMoveXRight(this.x - this.size, this.y)
            }
            if (!this.objLeft) {
                this.objLeft = this.canMoveXLeft(this.x - this.size, this.y)
            }

            if (!this.contactUnderY) {
                this.contactUnderY = this.yAxesContact(this.x, this.y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y - this.size

                    this.x = this.x
                }

                if (i == 1) {
                    this.y = this.saveY
                    this.x -= this.size
                }
                if (i == 2) {
                    this.y += this.size
                }

                if (i == 3) {
                    this.x = this.saveX
                    this.y = this.saveY
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y
                    this.saveX = this.x
                    this.y = this.y + this.size
                    this.x = this.x
                }

                if (i == 1) {
                    this.y = this.saveY
                    this.x -= this.size
                }

                if (i == 2) {

                    this.y -= this.size
                }

                if (i == 3) {
                    this.x = this.saveX
                    this.y = this.saveY
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    this.saveY = this.y //saves the first y value to help on the draw of the next object
                    this.saveX = this.x
                    this.y = this.y + this.size

                    this.x = this.x
                }

                if (i == 1) {
                    this.x -= this.size
                }
                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y - this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    this.saveY = this.y
                    this.saveX = this.x
                    this.y = this.y - this.size

                    this.x = this.x
                }

                if (i == 1) {
                    this.x -= this.size
                }

                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y + this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    this.saveY = this.y
                    this.saveX = this.x
                    this.x = this.x - this.size
                }

                if (i == 1) {
                    this.x = this.saveX
                    this.y = this.y + this.size
                }

                if (i == 2) {
                    this.y = this.saveY
                    this.x = this.saveX
                    this.y = this.y - this.size
                }

                if (i == 3) {
                    this.y = this.saveY
                }
            }
        }
    }
    // ***************************************************************************************************************************

    // ***********this group of functions recreated an "hologram" / "representation" of the future form of and peace and looks for obstruction that can happen in the system if the user wants to change the form of an object that is falling and send an alert to the system to deny future transformation***********
    confTransition1(X, Y) {
        this.formChangeObstacle = false
        let saveY = 0
        let saveX = 0
        for (let i = 0; i < 4; i++) {
            if (!this.formChangeObstacle) {
                this.formChangeObstacle = this.obstruction(X, Y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM AS REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    // this.saveY = this.y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X -= this.size
                }

                if (i == 1) {
                    X = saveX
                    Y = Y + this.size //increment y so that the second line of squares will be created

                }

                if (i == 2) {
                    X += this.size
                }

                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {

                    saveX = X
                    X += this.size
                }

                if (i == 1) {
                    X = saveX
                    Y = Y + this.size

                }

                if (i == 2) {
                    X -= this.size
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y
                    saveX = X
                    X = X - this.size
                }
                if (i == 1) {
                    Y = Y - this.size //increment y so that the second line of squares will be created
                    X = X
                }
                if (i == 2) {
                    Y = saveY
                    X = saveX
                    X = X + this.size
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X = X + this.size
                }

                if (i == 1) {
                    Y = Y - this.size //increment y so that the second line of squares will be created
                    X = X
                }

                if (i == 2) {
                    Y = saveY
                    X = saveX
                    X = X - this.size
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y - this.size //increment y so that the second line of squares will be created
                    X = X
                }

                if (i == 1) {
                    X = saveX
                    Y = saveY
                    X = X + this.size
                }
                if (i == 2) {
                    X = saveX
                    X = X - this.size
                }
            }

            if (this.blockType == 7) {
                X = X + this.size
            }
        }
    }

    confTransition2(X, Y) {
        this.formChangeObstacle = false
        let saveY = 0
        let saveX = 0
        for (let i = 0; i < 4; i++) {
            if (!this.formChangeObstacle) {
                this.formChangeObstacle = this.obstruction(X, Y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y -= this.size
                    X = X
                }

                if (i == 1) {
                    Y = saveY
                    X -= this.size
                    // this.y = this.y + this.size
                }

                if (i == 2) {
                    // this.y = this.saveY
                    Y += this.size
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y += this.size
                    X = X
                }

                if (i == 1) {
                    Y = saveY
                    X -= this.size
                }

                if (i == 2) {
                    Y -= this.size
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y - this.size
                    X = X
                }

                if (i == 1) {
                    X += this.size
                    // this.y = this.y + this.size
                }

                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y + this.size
                }

                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 4) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y + this.size
                    X = X
                }

                if (i == 1) {
                    X += this.size
                }

                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y - this.size
                }

                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATA TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X = X + this.size
                }
                if (i == 1) {
                    X = this.saveX
                    Y = Y + this.size
                }

                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y - this.size
                }

                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 7) {
                if (i == 0) {
                    saveY = Y //saves the first y value to help on the draw of the next object
                    Y = Y + this.size //increment y so that the second line of squares will be created 

                } else if (i == 1 || i == 2) {
                    Y = Y + this.size //increment y so that the second line of squares will be created   
                }
            }
        }
    }

    confTransition3(X, Y) {
        this.formChangeObstacle = false
        let saveY = 0
        let saveX = 0
        for (let i = 0; i < 4; i++) {
            if (!this.formChangeObstacle) {
                this.formChangeObstacle = this.obstruction(X, Y, this.size)
            }

            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    // this.saveY = this.y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X -= this.size
                }

                if (i == 1) {
                    X = saveX
                    Y = Y + this.size //increment y so that the second line of squares will be created

                }

                if (i == 2) {
                    X += this.size
                }
            }

            if (this.blockType == 2) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    // this.saveY = this.y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X += this.size
                }

                if (i == 1) {
                    X = saveX
                    Y = Y + this.size //increment y so that the second line of squares will be created
                }

                if (i == 2) {
                    X -= this.size
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X = X + this.size
                }
                if (i == 1) {
                    Y = Y - this.size //increment y so that the second line of squares will be created
                    X = X
                }
                if (i == 2) {
                    Y = saveY
                    X = saveX
                    X = X - this.size
                }
            }

            if (this.blockType == 4) {

                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X = X - this.size
                }
                if (i == 1) {
                    Y = Y + this.size //increment y so that the second line of squares will be created
                    X = X
                }
                if (i == 2) {
                    Y = saveY
                    X = saveX
                    X = X + this.size
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y + this.size //increment y so that the second line of squares will be created
                    X = X
                }

                if (i == 1) {
                    X = saveX
                    Y = saveY
                    X = X + this.size
                }
                if (i == 2) {
                    X = saveX
                    X = X - this.size
                }
            }

            if (this.blockType == 7) {
                X = X - this.size
            }
        }
    }

    confTransition4(X, Y) {
        this.formChangeObstacle = false
        let saveY = 0
        let saveX = 0
        for (let i = 0; i < 4; i++) {
            if (!this.formChangeObstacle) {
                this.formChangeObstacle = this.obstruction(X, Y, this.size)
            }
            if (this.blockType == 1) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y
                    saveX = X
                    Y -= this.size
                    X = X
                }

                if (i == 1) {
                    Y = saveY
                    X -= this.size
                }

                if (i == 2) {
                    Y += this.size
                }
            }

            if (this.blockType == 2) {

                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y += this.size
                    X = X
                }

                if (i == 1) {
                    Y = saveY
                    X -= this.size
                }

                if (i == 2) {
                    Y -= this.size
                }
            }

            if (this.blockType == 3) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y - this.size
                    X = X
                }
                if (i == 1) {
                    X -= this.size
                }
                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y + this.size
                }
                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 4) {

                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATAS TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    Y = Y - this.size
                    X = X
                }
                if (i == 1) {
                    X -= this.size
                }
                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y + this.size
                }
                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 5) {
                if (i == 0) {
                    //! YOU HAVE TO SAVE THE CENTER DATA TO USE THEM US REFERENCE IN THE DEVELOPMENT OF THE OTHER PARTS OF THE CANVAS 
                    saveY = Y //saves the first y value to help on the draw of the next object
                    saveX = X
                    X = X - this.size
                }

                if (i == 1) {
                    X = this.saveX
                    Y = Y + this.size
                }

                if (i == 2) {
                    Y = saveY
                    X = saveX
                    Y = Y - this.size
                }
                if (i == 3) {
                    Y = saveY
                }
            }

            if (this.blockType == 6) {}
        }
    }
    // ****************************************************************************************************************************************************************************************************************************************************************************************************************


    // *<updates de  position of the block that is been display
    updatePosition() {
        this.x = this.saveX
        if (this.contactUnderY != true) {
            //! this part of the code increment the "y" 130
            if (this.TimeIncreY == this.velocity) {
                this.y = this.y + this.size
                this.TimeIncreY = 0
            } else {
                this.TimeIncreY++
            }
        }

        // !this part will analyze if the object has found the bottom of the canvas and if the  object can yet be saved in group of  blocks that has been taken
        if (this.contactUnderY == true && this.canSave == 10) {
            for (let i = 0; i < this.displayedPositions.length; i++) {
                if (i % 2 == 0) {
                    this.savePositionFill(this.displayedPositions[i], this.displayedPositions[i + 1], this.color, this.strokeColor)
                }
            }
            this.arrival = true
        } else if (this.contactUnderY == true && this.canSave != 10) {
            this.canSave++
            this.displayedPositions = []
        } else {
            this.displayedPositions = []
        }
    }
    // *updates de  position of the block that is been display

    // *<updates block formation
    updateFormation() {
        if (this.form == 1) {
            this.composeBlock1()
        } else if (this.form == 2) {
            this.composeBlock2()
        } else if (this.form == 3) {
            this.composeBlock3()
        } else if (this.form == 4) {
            this.composeBlock4()
        }
    }

    // *updates block formation>
    /**
     * function that draws the blocks
     * *completed
     */
    draw() {
        for (let i = 0; i < this.displayedPositions.length; i++) {
            if (i % 2 == 0) {
                this.drawBlock(this.displayedPositions[i] + this.size, this.size, this.displayedPositions[i + 1], this.color, this.strokeColor)
            }
        }
    }

    /**
     * function that formate the variables in the start of the display of the block
     * *completed
     */
    firstShow() {
        //*At the start the o block will appear at the middle of the canvas
        if (this.blockType == 1 || this.blockType == 2 || this.blockType == 6) {
            this.x = this.W / 2 //this is the initial value of x in the display    
        }
        
        if (this.blockType == 3 || this.blockType == 4 || this.blockType == 5) {

            this.x = this.W / 2 + this.size //this is the initial value of x in the display 
        }

        if (this.blockType == 7) {
            this.x = this.W / 2 - this.size
        }
        this.y += this.size
        this.saveX = this.x
    }

    /**
     * function that gets the keys pressed by the players and set them in the class  
     * *completed
     */
    setKeys(keys) {
        this.keys = keys
    }

    /**
     * function that informs the system if the block that is being displayed has arrived 
     */
    returnArrival() {
        if (this.arrival == false) {
            return false
        } else {
            return true
        }
    }

    /**
     *Function that saves all the filled positions and their specific color  
     * @param {number} x This is the position that has been taken (x)  
     * @param {number} y This is the position that has been taken(y)
     * @param {string} color this is the color of the block that has been taken  
     * @param {string} strokeColor  color of the border of the block 
     * *completed
     */
    savePositionFill(x, y, color, strokeColor = `#000000`) {
        this.takenSquares.push(new SavedSquare(x, y, color, strokeColor))
    }

    /**
     * function that  draws the current block
     * * *completed
     */
    drawBlock(x, size, y, color, strokeColor) {
        this.context.fillStyle = color;
        this.context.strokeStyle = strokeColor;
        this.context.fillRect(x - size, y, size, size);
        this.context.strokeRect(x - size, y, size, size);
    }

    /**
     * This functions controls if there has been an contact with a block that is under the respective block that is been displayed or that the block has found the bottom
     * *completed
     */
    yAxesContact(x, y, size) {
        if (this.takenSquares.length > 0) {
            for (const taken of this.takenSquares) {
                if ((y + size) == taken.y && taken.x == x - size) {
                    return true
                }
            }
        }
        if ((y + size) == this.H) {
            return true
        }
        return false
    }

    //**Function that controls if "there is" objects in the left and the right of the displayed object**
    /**
     * Function that controls objects in the left side of the object that is been displayed
     * @param {Number} X the x value of the object that is been displayed 
     */
    canMoveXLeft(X, Y) {
        for (const taken of this.takenSquares) {
            if (taken.x == X - taken.size && Y == taken.y) {
                return true
            }
        }
        if (X == 0) {
            return true
        }
        return false
    }

    /**
     * Function that controls objects in the right side of the object that is been displayed
     * @param {Number} X the x value of the object that is been displayed 
     */
    canMoveXRight(X, Y) {
        for (const taken of this.takenSquares) {
            if (taken.x == X + taken.size && Y == taken.y) {
                return true
            }
        }
        if (X == (this.W - 30)) {
            return true
        }
        return false
    }

    /**
     * this function sees if the projection the possible change that may be made to the object and looks for possible  disturbance  that could happen in the trajectory
     * @param {number} X X position of the projection of the possible change
     * @param {number} Y y position of the projection of the possible change
     * @param {number} size size of the squares 
     */
    obstruction(X, Y, size) {
        for (const taken of this.takenSquares) {
            if (taken.x == X && Y == taken.y) {
                return true
            }
        }
        if ((X) < 0) {
            return true
        } else if ((X + size) > this.W || Y < 0) {
            return true
        } else if (Y > this.H) {
            return true
        }
        return false
    }

    /**
     * returns all the squares that has been taken updated or not
     */
    returnTakenSquares() {
        return this.takenSquares
    }
}
/*----- constants -----*/
const board = [];

/*----- app's state (variables) -----*/
let rows = 10;
let cols = 10;
let mineCount = 8;

let mineLocation = []; //notated by row vs column array ie: [5-1], [4-3]
let gameOver = false; //prevent further action once gameOver is true
let tilesClicked = 0;
let flagEnabled = false;

/*----- cached element references -----*/



/*----- event listeners -----*/



/*----- functions -----*/
window.onload = function () { //window.onload works when the full page loads. document.onload works when DOM is ready, but can be before browser is ready
    startGame ();
}

function startGame() {
    document.getElementById("mine-count").textContent = mineCount;                  //HTML changes from 0 -> mineCount set above
    document.getElementById("flag-button").addEventListener("click", setFlag);      //event listener for flag button
    setMines();                                                                     //invoke set mines

    for (let x = 0; x < rows; x++) {                                                //for loop that adds arrays until it reaches rows count
        let row = [];
        for (let y = 0; y < cols; y++) {                                            //for loop that adds arrays until it reaches cols count
            const tile = document.createElement("div");                             //creates tile div
            tile.id = x.toString() + "-" + y.toString();                            //"x","y" tile.id assigned to each div
            tile.addEventListener("click", clickTile);                              //event listener for click and tile function
            document.getElementById("board").append(tile);                          //add tile to board array
            row.push(tile);                                                         //add tile to end of
        }
        board.push(row);                                                            //add rows along the board
    }
}

// click function
function setFlag () {                                                               //changes flag to lgray vs dgray based on if its enabled.
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile () {                                                             //if game is over or tile is clicked, return
    if(gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    let tile = this;                                                                //if flag enabled, put flag if theres no flag and vice versa
    if (flagEnabled) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (mineLocation.includes(tile.id)) {                                           //if the mine location has the tile.id you clicked, change text to loss conditions and reveal mines
        document.getElementById("end-result").innerText = "Game Over";
        document.getElementById("mine-count").innerText = "😔";
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0". "0"]                         
    let x = parseInt(coords[0]);     // turn ^ into integers
    let y = parseInt(coords[1]);
    checkMine(x, y);
}

//random mine generation


function setMines () {          //can be used to test. otherwise use mineLeft=mineCount
    mineLocation.push("1-1");
    mineLocation.push("2-2");
    mineLocation.push("3-3");
    mineLocation.push("4-4");
    mineLocation.push("5-5");
    mineLocation.push("6-6");
    mineLocation.push("7-7");
    mineLocation.push("8-8");

    // let mineLeft = mineCount;
    // while (mineLeft > 0) {                          //when more than 0 mine left 
    //     let x = Math.floor(Math.random() * rows)    //generate random x
    //     let y = Math.floor(Math.random() * cols)    //generate random y
    //     let id = x.toString() + "-" + y.toString(); //turn x,y into string

    //     if (!mineLocation.includes(id)) {           //if mine location does not include id
    //         mineLocation.push (id)                  //add id to array of mine location
    //         mineLeft -= 1;                          
    //     }
    // }
}

//check mines, starting at 0, adding based on x, y coordinates
function checkMine (x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= cols) {    //no mines created if not within board (10x10)
        return;
    }
    if (board[x][y].classList.contains("tile-clicked")) {   //if tile is clicked, do none of the below
        return;
    }

    board[x][y].classList.add("tile-clicked");       //if tile is checked, add tile-clicked class.
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(x-1, y-1);   //top left, up = x-1, y translates +-1
    minesFound += checkTile(x-1, y);     //top
    minesFound += checkTile(x-1, y+1);   //top right

    minesFound += checkTile(x, y-1);      //left, x same plane, y translates +-1
    minesFound += checkTile(x, y+1);      //right

    minesFound += checkTile(x+1, y-1);   //bottom left, down = x+1, y translates +-1
    minesFound += checkTile(x+1, y);     //bottom
    minesFound += checkTile(x+1, y+1);   //bottom right

    if (minesFound > 0) {                   //if a mine is found
        board[x][y].innerText = minesFound  //change text based off minesFound + the "x#" class.
        board[x][y].classList.add("m" + minesFound.toString());
    }
    else {
        checkMine(x-1, y-1);
        checkMine(x-1, y);
        checkMine(x-1, y+1);

        checkMine(x, y-1);
        checkMine(x, y+1);

        checkMine(x+1, y-1);
        checkMine(x+1, y);
        checkMine(x+1, y+1);
    }

    if (tilesClicked == rows * cols - mineCount) {
        document.getElementById("mine-count").innerText = "😊"
        document.getElementById("end-result").innerText = "You Win!";
        gameOver = true;
    }
}

//check tile if its on board and give a value for above function.
function checkTile (x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= cols) { // if x/y is NEGATIVE (<0) or if x/y greater than rows/cols, don't do anything
        return 0;
    }
    if (mineLocation.includes(x.toString() + "-" + y.toString())) {
        return 1;
    }
    return 0;
}

function revealMines() {
    for (let x = 0; x < rows; x++) {       //scours whole board
        for (let y = 0; y < cols; y++) {
            let tile = board[x][y]         // let tile = x,y of board
            if (mineLocation.includes(tile.id)) {  
                tile.innerText = "💣"       //if mine location includes tile.id, change text to bomb, make background red.
                tile.style.backgroundColor = "red"
            }
        }
    }    
}

//check win
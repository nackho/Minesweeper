/*----- constants -----*/
const board = [];
let rows = 10;
let cols = 10;

let mineCount = 8;
let mineLocation = []; //notated by row vs column array ie: [5-1], [4-3]
let mine = "💣" ;

alive = true;
let tilesClicked = 0;

let gameOver = false; //prevent further action once gameOver is true


/*----- app's state (variables) -----*/



/*----- cached element references -----*/



/*----- event listeners -----*/



/*----- functions -----*/
window.onload = function () { //window.onload works when the full page loads. document.onload works when DOM is ready, but can be before browser is ready
    startGame ();
}

function startGame() {
    document.getElementById("mine-count").textContent = mineCount;

    for (let x = 0; x < rows; x++) {
        let row = [];
        for (let y = 0; y < cols; y++) {
            let tile = document.createElement("div");
            tile.id = x.toString() + "-" + y.toString();
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

document.getElementById("board").addEventListener("click", function(e) {
    if (gameOver) { return }
    click(board);
  });


setGameID();
RenderBoard(CreateBoard());


function setGameID() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameid = urlParams.get('gameid');
    const button = document.querySelector('#gameid') as HTMLButtonElement;
    if(button && gameid) 
        button.innerText = gameid;
}

function CreateBoard(): GameBoard {
    let board: GameBoard = {places:[], connections:[]};
    for(let y = 0; y < 7; y++) {
        board.places.push([]);
        for(let x = 0; x < 7; x++) {
            board.places[y].push({name: x.toString() + " " + y.toString(), color: "#ff0000"});
        }
    }
    return board;
}

function RenderBoard(board: GameBoard) {
    const canvasEl = document.querySelector('#board') as HTMLCanvasElement;
    if(!canvasEl) return;
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    const ctx = canvasEl.getContext('2d');
    if(!ctx) return;
    const p = 10; // padding

    // Canvas Size
    const canvasW = canvasEl.width;
    const canvasH = canvasEl.height;

    // Rect Size With Padding
    const rectWp = (canvasW - 8*p)/7;
    const rectHp = (canvasH - 8*p)/7;

    for(let y = 0; y < 7; y++) {
        if(!board.places[y]) continue;
        for(let x = 0; x < 7; x++) {
            if(!board.places[y][x]) continue;
            const X = p*(x+1)+rectWp*x;
            const Y = p*(y+1)+rectHp*y;
            ctx.strokeStyle = board.places[y][x].color;
            ctx.strokeRect(X, Y, rectWp, rectHp);
            ctx.font = "2rem Arial";
            const tSize = ctx.measureText(board.places[y][x].name);
            const tW = tSize.actualBoundingBoxRight - tSize.actualBoundingBoxLeft;
            const tH = tSize.actualBoundingBoxAscent - tSize.actualBoundingBoxDescent;
            ctx.fillText(board.places[y][x].name, X+rectWp/2-tW/2, Y+rectHp/2+tH/2);
        }
    }
}

type Place = {
    name: string,
    color: string,
}

type PathSlot = {
    x: number,
    y: number,
    side: "Top" | "Right" | "Bottom" | "Left"
}

type Connection = {
    oneway: boolean,
    from: PathSlot,
    to: PathSlot
}

type GameBoard = {
    places: Place[][],
    connections: Connection[][][]
}




setGameID();
const board = CreateBoard();
RenderBoard(board);

window.onresize = (event) => {
    RenderBoard(board);
}


function setGameID() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameid = urlParams.get('gameid');
    const button = document.querySelector('#gameid') as HTMLButtonElement;
    if (button && gameid)
        button.innerText = gameid;
}

function CreateBoard(): GameBoard {
    let board: GameBoard = { places: GenerateEmptyPlaces(), connections: GenerateEmptyConnections() };
    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
            board.places[y][x] = { name: x.toString() + " " + y.toString(), color: "#ff0000" };
            if (x < 6)
                board.connections[y][x].push({ from: "Right", to: { x: x + 1, y: y, side: "Left" } })
            if (y < 6)
                board.connections[y][x].push({ from: "Bottom", to: { x: x, y: y + 1, side: "Top" } })
        }
    }
    return board;
}

function RenderBoard(board: GameBoard) {
    const canvasEl = document.querySelector('#board') as HTMLCanvasElement;
    if (!canvasEl) return;
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    ctx.reset();

    const p = 32; // padding

    // Canvas Size
    const canvasW = canvasEl.width;
    const canvasH = canvasEl.height;

    // Rect Size With Padding
    const rectWp = (canvasW - 8 * p) / 7;
    const rectHp = (canvasH - 8 * p) / 7;

    for (let y = 0; y < 7; y++) {
        if (!board.places[y]) continue;
        for (let x = 0; x < 7; x++) {
            if (!board.places[y][x]) continue;
            // Coords of the Rects
            const X = p * (x + 1) + rectWp * x;
            const Y = p * (y + 1) + rectHp * y;

            // Drawing rectangles
            ctx.strokeStyle = board.places[y][x].color;
            ctx.strokeRect(X, Y, rectWp, rectHp);

            // Getting size of text
            ctx.font = "2rem Arial";
            const tSize = ctx.measureText(board.places[y][x].name);
            const tW = tSize.actualBoundingBoxRight - tSize.actualBoundingBoxLeft;
            const tH = tSize.actualBoundingBoxAscent - tSize.actualBoundingBoxDescent;

            //Drawing text
            ctx.fillText(board.places[y][x].name, X + rectWp / 2 - tW / 2, Y + rectHp / 2 + tH / 2);

            if (!board.connections[y][x]) continue;
            ctx.strokeStyle = "Black";
            for (let i = 0; i < board.connections[y][x].length; i++) {
                const con = board.connections[y][x][i];
                const from = GetRectPoint(rectWp, rectHp, X, Y, con.from);
                const toReal = { x: p * (con.to.x + 1) + rectWp * con.to.x, y: p * (con.to.y + 1) + rectHp * con.to.y };
                const to = GetRectPoint(rectWp, rectHp, toReal.x, toReal.y, con.to.side);
                ctx.beginPath()
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }
        }
    }
}

function GetRectPoint(rectW: number, rectH: number, x: number, y: number, side: Side): { x: number, y: number } {
    switch (side) {
        case "Top":
            return { x: x + rectW / 2, y: y };
        case "Right":
            return { x: x + rectW, y: y + rectH / 2 };
        case "Bottom":
            return { x: x + rectW / 2, y: y + rectH };
        case "Left":
            return { x: x, y: y + rectH / 2 };
    }
}

function GenerateEmptyPlaces(): Place[][] {
    let place: Place[][] = [];
    for (let i = 0; i < 7; i++) {
        place[i] = [];
    }
    return place;
}

function GenerateEmptyConnections(): Connection[][][] {
    let con: Connection[][][] = [];
    for (let i = 0; i < 7; i++) {
        con[i] = [];
        for (let j = 0; j < 7; j++) {
            con[i][j] = [];
        }
    }
    return con;
}

type Side = "Top" | "Right" | "Bottom" | "Left";

interface Place {
    name: string,
    color: string,
}

interface PathSlot {
    x: number,
    y: number,
    side: Side
}

interface Connection {
    oneway?: boolean,
    diagonal?: boolean,
    from: Side,
    to: PathSlot
}

interface GameBoard {
    places: Place[][],
    connections: Connection[][][]
}


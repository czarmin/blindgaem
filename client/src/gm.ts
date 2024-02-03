HandleToolbars();
StyleButtons();

const board: GameBoard = { places: GenerateEmptyPlaces(), connections: GenerateEmptyConnections() };

let selected: Place = "Empty";
let ghost = { x: -1, y: -1 }

RenderBoard(board);

window.onmousedown = (event) => {
    const canv = document.querySelector('#board') as HTMLCanvasElement;
    if (!canv) return;
    const rect = canv.getBoundingClientRect();
    const pos = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    if (pos.x > 0 && pos.y > 0 && pos.x < rect.width && pos.y < rect.height) {
        const roundingX = rect.width / 7;
        const roundingY = rect.height / 7;;
        PlacePiece(Math.floor(pos.x / roundingX), Math.floor(pos.y / roundingY))
    }
}

window.onmousemove = (event) => {
    const canv = document.querySelector('#board') as HTMLCanvasElement;
    if (!canv) return;
    const rect = canv.getBoundingClientRect();
    const pos = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    if (pos.x > 0 && pos.y > 0 && pos.x < rect.width && pos.y < rect.height) {
        const roundingX = rect.width / 7;
        const roundingY = rect.height / 7;
        ghost.x = Math.floor(pos.x / roundingX);
        ghost.y = Math.floor(pos.y / roundingY);
    } else {
        ghost.x = -1;
        ghost.y = -1;
    }
        RenderBoard(board);
}

// @ts-ignore
window.onresize = (event) => {
    RenderBoard(board);
}


function HandleToolbars() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameid = urlParams.get('gameid');
    const button = document.querySelector('#gameid') as HTMLButtonElement;
    if (button && gameid)
        button.innerText = gameid;

    const infobox = document.querySelector("#infobox") as HTMLDivElement;
    const toolbar = document.querySelector('#toolbar') as HTMLDivElement;
    toolbar.style.setProperty("width", window.getComputedStyle(infobox).getPropertyValue("width"));
}

function PlacePiece(x: number, y: number) {
    if (!board.places[y][x] || board.places[y][x] == "None" || board.places[y][x] != selected) {
        board.places[y][x] = selected;
    } else {
        board.places[y][x] = "None";
    }
}

function CreateBoard(): GameBoard {
    let board: GameBoard = { places: GenerateEmptyPlaces(), connections: GenerateEmptyConnections() };

    // Randomly place all rooms
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            const rand = Math.random();
            if (rand < .6)
                board.places[j][i] = "Empty";
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

    const pX = 36; // padding
    const pY = 24;

    // Canvas Size
    const canvasW = canvasEl.width;
    const canvasH = canvasEl.height;

    // Rect Size With Padding
    const rectWp = (canvasW - 8 * pX) / 7;
    const rectHp = (canvasH - 8 * pY) / 7;

    if (ghost.x != -1)
        DrawPlace(ctx, ghost.x, ghost.y, rectWp, rectHp, pX, pY, selected, true);

    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(y == 0 || x == 0 || x == 7 || y == 7)
                ctx.fillStyle = "#64748b50"
            else
                ctx.fillStyle = "#64748b";
            ctx.beginPath();
            const X = pX * (x +.5) + rectWp * x;
            const Y = pY * (y +.5) + rectHp * y;
            ctx.arc(X, Y, 2, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    for (let y = 0; y < 7; y++) {
        if (!board.places[y]) continue;
        for (let x = 0; x < 7; x++) {
            if (!board.places[y][x]) continue;
            if (board.places[y][x] == "None") continue;
            // Coords of the Rects

            if(x != ghost.x || y != ghost.y || selected == board.places[y][x])
                DrawPlace(ctx, x, y, rectWp, rectHp, pX, pY, board.places[y][x], false);

            if (!board.connections[y][x]) continue;
            ctx.strokeStyle = "Black";

            const X = pX * (x + 1) + rectWp * x;
            const Y = pY * (y + 1) + rectHp * y;
            for (let i = 0; i < board.connections[y][x].length; i++) {
                const con = board.connections[y][x][i];
                const from = GetRectPoint(rectWp, rectHp, X, Y, con.from);
                const toReal = { x: pX * (con.to.x + 1) + rectWp * con.to.x, y: pY * (con.to.y + 1) + rectHp * con.to.y };
                const to = GetRectPoint(rectWp, rectHp, toReal.x, toReal.y, con.to.side);
                ctx.beginPath()
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }
        }
    }
}

function DrawPlace(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, paddingX: number, paddingY: number, place: Place, gray: boolean) {
    if (place == "None") return;
    const X = paddingX * (x + 1) + width * x;
    const Y = paddingY * (y + 1) + height * y;

    // Drawing rectangles
    if(!gray)
        ctx.strokeStyle = GetColorByPlace(place);
    else
        ctx.strokeStyle = "Gray";
    ctx.strokeRect(X, Y, width, height);

    // Getting size of text
    ctx.font = "1rem Sans-Serif";
    if(!gray)
        ctx.fillStyle = "White"
    else
        ctx.fillStyle = "Gray";

    //Drawing text
    const splitted = place.split(' ')
    for(let i = 0; i < splitted.length; i++) {
        const text = splitted[i];
        const tSize = ctx.measureText(text);
        const tW = tSize.actualBoundingBoxRight - tSize.actualBoundingBoxLeft;
        const tH = tSize.actualBoundingBoxAscent - tSize.actualBoundingBoxDescent;
        ctx.fillText(text, X + width / 2 - tW / 2, Y + height / 2 + tH / 2 + i*(tH+4) - (splitted.length-1)*tH/2);
    }
}

function GetColorByPlace(place: Place): string {
    if (place == "None") return ""
    switch (place) {
        case "Start":
            return "#ffcc00"
        case "Teleport":
            return "#996600"
        case "Shop":
            return "#0066ff"
        case "Flamingo":
            return "#ff00ff"
        case "Shadow Realm":
            return "#660066"
        case "Good":
            return "#66ff66"
        case "Bad":
            return "#ff3300"
        case "Versus":
            return "#800000"
        case "Combat":
            return "#ff9900"
        case "Empty":
            return "#ffffff"
    }
}

function Remap(low1: number, high1: number, low2: number, high2: number, value: number): number {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
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

function StyleButtons() {
    const buttons = document.querySelectorAll('.room') as NodeListOf<HTMLButtonElement>;
    buttons.forEach((butt) => {
        butt.addEventListener("click", (event) => {
            selected = (event.target as HTMLButtonElement).innerText as Place;
        })
        butt.style.border = "1px solid";
        butt.style.borderColor = GetColorByPlace(butt.innerText as Place)
    })
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

type Place = "Start" | "Teleport" | "Shop" | "Flamingo" | "Shadow Realm" | "Good" | "Bad" | "Versus" | "Combat" | "Empty" | "None";
type Side = "Top" | "Right" | "Bottom" | "Left";

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


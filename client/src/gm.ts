
setGameID();
GenerateScaffold();
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
    for(let i = 0; i < 7; i++) {
        board.places.push([]);
        for(let j = 0; j < 7; j++) {
            board.places[i].push({name: i.toString() + " " + j.toString(), color: "#ff0000"});
        }
    }
    return board;
}

function GenerateScaffold() {
    const boardEl = document.querySelector('#board') as HTMLDivElement;
    if(!boardEl) return;
    for(let y = 0; y < 7; y++) {
        const row = document.createElement('tr')
        row.className = y.toString();
        for(let x = 0; x < 7; x++) {
            const col = document.createElement('td');
            col.className = `p${x}_${y}`
            row.append(col);
        }
        boardEl.append(row);
    }
}

function RenderBoard(board: GameBoard) {
    for(let x = 0; x < 7; x++) {
        if(!board.places[x]) continue;
        for(let y = 0; y < 7; y++) {
            if(!board.places[x][y]) continue;

            const parent = document.querySelector(`.p${x}_${y}`)
            const el = document.createElement('div')
            el.className = "thing";
            el.innerText = board.places[y][x].name;
            el.style.setProperty("border-color", board.places[y][x].color);
            parent?.append(el);
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


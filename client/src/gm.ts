import { GenerateEmptyConnections, GenerateEmptyPlaces, PlaceConnection, PlacePiece, startPos } from "./board";
import { DrawPlace, GetColorByPlace, HandleToolbars, RectData, RenderBoard } from "./gui";
import { GetRectPoint, IsPointNearLine } from "./mymath";


// Global Variables
export const board: GameBoard = { places: GenerateEmptyPlaces(), connections: GenerateEmptyConnections() };
let selected: Tools = "Empty";
let ghost = { x: -1, y: -1 }
export let mp: Vec2 = { x: 0, y: 0 }
// Init
HandleToolbars();
HandleButtons();
RenderBoard(board, ghost, selected)

// Events
window.onmousedown = (event) => {
    const canv = RectData.canvasEl;
    if (!canv) return;
    const rect = canv.getBoundingClientRect();
    const pos = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    if (pos.x > 0 && pos.y > 0 && pos.x < rect.width && pos.y < rect.height) {
        const roundingX = rect.width / 7;
        const roundingY = rect.height / 7;;
        let largebreak = false;
        for (let y = 0; y < 7; y++) {
            if (largebreak) break;
            for (let x = 0; x < 7; x++) {
                if (largebreak) break;
                const X = RectData.pX * (x + 1) + RectData.rectWp * x;
                const Y = RectData.pY * (y + 1) + RectData.rectHp * y;
                for (let i = 0; i < board.connections[y][x].length; i++) {
                    if (largebreak) break;
                    const con = board.connections[y][x][i];
                    const from = GetRectPoint(RectData.rectWp, RectData.rectHp, X, Y, con.from);
                    const toReal = { x: RectData.pX * (con.to.x + 1) + RectData.rectWp * con.to.x, y: RectData.pY * (con.to.y + 1) + RectData.rectHp * con.to.y };
                    const to = GetRectPoint(RectData.rectWp, RectData.rectHp, toReal.x, toReal.y, con.to.side);
                    if (IsPointNearLine(from, to, mp) < 5) {
                        if (!con.oneway) {
                            const contra = board.connections[con.to.y][con.to.x].find((val) => {
                                if (val.to.x == x && val.to.y == y) return true;
                                else false;
                            })
                            if (contra) {
                                const index = board.connections[con.to.y][con.to.x].indexOf(contra);
                                if (index > -1)
                                    board.connections[con.to.y][con.to.x].splice(index, 1);
                            }
                        }
                        board.connections[y][x].splice(i, 1);
                        largebreak = true;
                    }
                }
            }
        }
        if (!largebreak)
            if (selected != "One-Way" && selected != "Two-Way")
                PlacePiece(Math.floor(pos.x / roundingX), Math.floor(pos.y / roundingY), selected)
            else
                PlaceConnection(pos.x, pos.y, rect.width, rect.height, selected);

        RenderBoard(board, ghost, selected);
    }
    if (selected == board.places[ghost.y][ghost.x] && RectData.ghostEl)
        RectData.ghostEl.style.display = "none";
}

window.onmousemove = (event) => {
    const canv = RectData.canvasEl;
    if (!canv) return;
    const rect = canv.getBoundingClientRect();
    const pos = { x: event.pageX - rect.x, y: event.pageY - rect.y };
    if (pos.x > 0 && pos.y > 0 && pos.x < rect.width && pos.y < rect.height) {
        const roundingX = rect.width / 7;
        const roundingY = rect.height / 7;
        ghost.x = Math.floor(pos.x / roundingX);
        ghost.y = Math.floor(pos.y / roundingY);
        mp.x = pos.x;
        mp.y = pos.y;
        if (RectData.ghostEl && ghost.x != -1 && selected != "One-Way" && selected != "Two-Way") {
            const X = RectData.pX * (ghost.x + 1) + RectData.rectWp * ghost.x;
            const Y = RectData.pY * (ghost.y + 1) + RectData.rectHp * ghost.y;
            RectData.ghostEl.style.display = "flex";
            RectData.ghostEl.style.left = X + rect.x + "px";
            RectData.ghostEl.style.top = Y + rect.y + "px";
            const hel = RectData.ghostEl.querySelector('h1')
            if (hel)
                hel.innerText = selected;
        }
        if (selected == board.places[ghost.y][ghost.x] && RectData.ghostEl)
            RectData.ghostEl.style.display = "none";
    } else {
        if (RectData.ghostEl)
            RectData.ghostEl.style.display = "none";
        ghost.x = -1;
        ghost.y = -1;
    }
    RenderBoard(board, ghost, selected);
}

// @ts-ignore
window.onresize = (event) => {
    RenderBoard(board, ghost, selected);
}
export function HandleButtons() {
    const buttons = document.querySelectorAll('.room') as NodeListOf<HTMLButtonElement>;
    buttons.forEach((butt) => {
        butt.addEventListener("click", (event) => {
            selected = (event.target as HTMLButtonElement).innerText as Place;
            startPos.x = -1;
        })
        butt.style.borderColor = GetColorByPlace(butt.innerText as Place)
    })
    const arrows = document.querySelectorAll('.arrowBt') as NodeListOf<HTMLButtonElement>;
    arrows.forEach((butt) => {
        butt.addEventListener("click", (event) => {
            selected = (event.target as HTMLButtonElement).innerText as "One-Way" | "Two-Way"
        })
    })
}


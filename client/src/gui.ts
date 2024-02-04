import { mp } from "./gm";
import { GetRectPoint, IsPointNearLine } from "./mymath";

export const RectData: {
    pX: number,
    pY: number,
    rectWp: number,
    rectHp: number,
    ctx?: CanvasRenderingContext2D,
    canvasEl?: HTMLCanvasElement,
    ghostEl?: HTMLDivElement,
    hasStart: boolean,
} = {pX: 0, pY: 0, rectWp: 0, rectHp: 0, hasStart: false}

export function HandleToolbars() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameid = urlParams.get('gameid');
    const button = document.querySelector('#gameid') as HTMLButtonElement;
    if (button && gameid)
        button.innerText = gameid;

    const infobox = document.querySelector("#infobox") as HTMLDivElement;
    const toolbar = document.querySelector('#toolbar') as HTMLDivElement;
    toolbar.style.setProperty("width", window.getComputedStyle(infobox).getPropertyValue("width"));
}

export function RenderBoard(board: GameBoard, ghost: Vec2, selected: Tools) {

    if (!RectData || !RectData.rectWp) {
        RectData.canvasEl = document.querySelector('#board') as HTMLCanvasElement;
        if(!RectData.canvasEl) return;
        RectData.canvasEl.width = RectData.canvasEl.clientWidth;
        RectData.canvasEl.height = RectData.canvasEl.clientHeight;
        if(!(RectData.canvasEl.getContext('2d') as CanvasRenderingContext2D)) return;
        RectData.ctx = RectData.canvasEl.getContext('2d') as CanvasRenderingContext2D;
        
        RectData.ghostEl = document.querySelector('#ghost') as HTMLDivElement;
        if(!RectData.ghostEl) return;

        RectData.pX = 36;
        RectData.pY = 24;
        // Canvas Size
        const canvasW = RectData.canvasEl.width;
        const canvasH = RectData.canvasEl.height;

        RectData.rectWp = (canvasW - 8 * RectData.pX)/7;
        RectData.rectHp = (canvasH - 8 * RectData.pY)/7;
        RectData.ghostEl.style.width = `${RectData.rectWp}px`;
        RectData.ghostEl.style.height = `${RectData.rectHp}px`;
    }

    if(!RectData.ctx) return;
    ResetCanvas(RectData.ctx);

    for (let y = 0; y < 7; y++) {
        if (!board.places[y]) continue;
        for (let x = 0; x < 7; x++) {
            if (!board.places[y][x]) continue;
            if (board.places[y][x] == "None") continue;
            // Coords of the Rects

            if (!(x == ghost.x && y == ghost.y && selected != board.places[y][x] && selected != "Two-Way" && selected != "One-Way"))
                DrawPlace(RectData.ctx, x, y, RectData.rectWp, RectData.rectHp, RectData.pX, RectData.pY, board.places[y][x], false);

            const X = RectData.pX * (x + 1) + RectData.rectWp * x;
            const Y = RectData.pY * (y + 1) + RectData.rectHp * y;
            for (let i = 0; i < board.connections[y][x].length; i++) {
                const con = board.connections[y][x][i];
                const from = GetRectPoint(RectData.rectWp, RectData.rectHp, X, Y, con.from);
                const toReal = { x: RectData.pX * (con.to.x + 1) + RectData.rectWp * con.to.x, y: RectData.pY * (con.to.y + 1) + RectData.rectHp * con.to.y };
                const to = GetRectPoint(RectData.rectWp, RectData.rectHp, toReal.x, toReal.y, con.to.side);
                if (IsPointNearLine(from, to, mp) < 5)
                    RectData.ctx.strokeStyle = "Yellow"
                else
                    RectData.ctx.strokeStyle = "White"
                RectData.ctx.lineWidth = 2;
                RectData.ctx.beginPath()
                if (!con.oneway) {
                    RectData.ctx.moveTo(from.x, from.y);
                    RectData.ctx.lineTo(to.x, to.y);
                } else
                    canvas_arrow(RectData.ctx, from.x, from.y, to.x, to.y);
                RectData.ctx.stroke();
            }
        }
    }
}

function ResetCanvas(ctx: CanvasRenderingContext2D) {
    ctx.reset();

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (y == 0 || x == 0 || x == 7 || y == 7)
                ctx.fillStyle = "#64748b50"
            else
                ctx.fillStyle = "#64748b";
            ctx.beginPath();
            const X = RectData.pX * (x + .5) + RectData.rectWp * x;
            const Y = RectData.pY * (y + .5) + RectData.rectHp * y;
            ctx.arc(X, Y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function canvas_arrow(ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

export function DrawPlace(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, paddingX: number, paddingY: number, place: Place, gray: boolean) {
    if (place == "None") return;
    const X = paddingX * (x + 1) + width * x;
    const Y = paddingY * (y + 1) + height * y;

    // Drawing rectangles
    if (!gray)
        ctx.strokeStyle = GetColorByPlace(place);
    else
        ctx.strokeStyle = "Gray";
    ctx.strokeRect(X, Y, width, height);

    // Getting size of text
    ctx.font = "1rem Sans-Serif";
    if (!gray)
        ctx.fillStyle = "White"
    else
        ctx.fillStyle = "Gray";

    //Drawing text
    const splitted = place.split(' ')
    for (let i = 0; i < splitted.length; i++) {
        const text = splitted[i];
        const tSize = ctx.measureText(text);
        const tW = tSize.actualBoundingBoxRight - tSize.actualBoundingBoxLeft;
        const tH = tSize.actualBoundingBoxAscent - tSize.actualBoundingBoxDescent;
        ctx.fillText(text, X + width / 2 - tW / 2, Y + height / 2 + tH / 2 + i * (tH + 4) - (splitted.length - 1) * tH / 2);
    }
}

export function GetColorByPlace(place: Place): string {
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


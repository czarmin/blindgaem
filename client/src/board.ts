import { board } from './gm'
import { RectData } from './gui';
import { GetRectPoint, convToBoard, sqdistance } from './mymath';

export let startPos: Vec2 = { x: -1, y: -1 }
export function PlaceConnection(x: number, y: number, width: number, height: number, selected: Tools) {
    const bp = convToBoard(x, y, width, height);
    if (startPos.x == -1) {
        startPos = { x: bp.x, y: bp.y }
    } else {
        if(startPos.x == bp.x && startPos.y == bp.y) {startPos.x = -1; return;}
        const diagonal = startPos.x != bp.x && startPos.y != bp.y;
        const oneway = selected == "One-Way";

        for(let i = 0; i < board.connections[startPos.y][startPos.x].length; i++) {
            const con = board.connections[startPos.y][startPos.x][i];
            if(con.to.x == bp.x && con.to.y == bp.y) {
                board.connections[startPos.y][startPos.x].splice(i, 1);
                break;
            }
        }
        for(let i = 0; i < board.connections[bp.y][bp.x].length; i++) {
            const con = board.connections[bp.y][bp.x][i];
            if(con.to.x == startPos.x && con.to.y == startPos.y) {
                board.connections[bp.y][bp.x].splice(i, 1);
                break;
            }
        }


        let mindist: {s1: Side, s2: Side, dist: number} = { s1: "Top", s2: "Bottom", dist: 1000000000 }
        const w = width / 7;
        const h = height / 7;
        const firstToReal = {x: startPos.x*w, y: startPos.y*h}
        const secondToReal = {x: bp.x*w, y: bp.y*h}
        const sides: Side[] = ["Top", "Right", "Left", "Bottom"];
        const sideOfFirst = [GetRectPoint(w, h, secondToReal.x, secondToReal.y, "Top"), GetRectPoint(w, h, secondToReal.x, secondToReal.y, "Right"), 
            GetRectPoint(w, h, secondToReal.x, secondToReal.y, "Left"), GetRectPoint(w, h, secondToReal.x, secondToReal.y, "Bottom")];
        const sideOfSecond = [GetRectPoint(w, h, firstToReal.x, firstToReal.y, "Top"), GetRectPoint(w, h, firstToReal.x, firstToReal.y, "Right"), 
            GetRectPoint(w, h, firstToReal.x, firstToReal.y, "Left"), GetRectPoint(w, h, firstToReal.x, firstToReal.y, "Bottom")];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const dist = sqdistance(sideOfFirst[i].x, sideOfFirst[i].y, sideOfSecond[j].x, sideOfSecond[j].y);
                if(dist < mindist.dist) {
                    mindist.dist = dist;
                    mindist.s1 = sides[j]
                    mindist.s2 = sides[i]
                }
            }
        }

        board.connections[startPos.y][startPos.x].push({ oneway, diagonal, from: mindist.s1, to: {x: bp.x, y: bp.y, side: mindist.s2} });
        if (!oneway)
            board.connections[bp.y][bp.x].push({ diagonal, from: mindist.s2, to: {x: startPos.x, y: startPos.y, side: mindist.s1} })
        startPos.x = -1;
    }
}

export function PlacePiece(x: number, y: number, selected: Tools) {
    if ((!board.places[y][x] || board.places[y][x] == "None" || board.places[y][x] != selected) && selected != "One-Way" && selected != "Two-Way") {
        if(selected == "Start" && RectData.hasStart)
            board.places[y][x] = "Bad" as Place;
        else {
            if(selected == "Start")
                RectData.hasStart = true;
            else
                RectData.hasStart = false;
            board.places[y][x] = selected as Place;
        }
    } else {
        if(board.places[y][x] == "Start") RectData.hasStart = false;
        board.places[y][x] = "None";
    }
}

// function CreateBoard(): GameBoard {}

export function GenerateEmptyPlaces(): Place[][] {
    let place: Place[][] = [];
    for (let i = 0; i < 7; i++) {
        place[i] = [];
    }
    return place;
}

export function GenerateEmptyConnections(): Connection[][][] {
    let con: Connection[][][] = [];
    for (let i = 0; i < 7; i++) {
        con[i] = [];
        for (let j = 0; j < 7; j++) {
            con[i][j] = [];
        }
    }
    return con;
}

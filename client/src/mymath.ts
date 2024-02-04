export function Remap(low1: number, high1: number, low2: number, high2: number, value: number): number {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

export function GetRectPoint(rectW: number, rectH: number, x: number, y: number, side: Side): { x: number, y: number } {
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

export function IsPointNearLine(start: Vec2, end: Vec2, point: Vec2): number {
    const A = sqdistance(start.x, start.y, point.x, point.y);
    const B = sqdistance(end.x, end.y, point.x, point.y);
    const C = sqdistance(start.x, start.y, end.x, end.y);
    if(B> A+C)
        return Math.sqrt(A);
    else if(A > B + C)
        return Math.sqrt(B);
    else {
        const a = Math.sqrt(A);
        const b = Math.sqrt(B);
        const c = Math.sqrt(C);
        const s = (a+b+c)/2;
        return 2/c * Math.sqrt(s*(s-a)*(s-b)*(s-c))
    }
}

export const convToBoard = (x: number, y: number, width: number, height: number) => { return { x: Math.floor(x / (width / 7)), y: Math.floor(y / (height / 7)) } }
export const sqdistance = (x: number, y: number, x2: number, y2: number) => Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2);
export const distance = (x: number, y: number, x2: number, y2: number) => Math.sqrt(sqdistance(x,y,x2,y2));

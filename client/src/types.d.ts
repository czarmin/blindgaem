export { };

declare global {
    type Place = "Start" | "Teleport" | "Shop" | "Flamingo" | "Shadow Realm" | "Good" | "Bad" | "Versus" | "Combat" | "Empty" | "None";
    type Side = "Top" | "Right" | "Bottom" | "Left";
    type Tools = Place | "One-Way" | "Two-Way";

    interface Vec2 {
        x: number,
        y: number
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
}

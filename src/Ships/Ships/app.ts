class App {
    context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
    }

    start() {
        this.drawStage();
    }

    private drawStage(): void {
        var ctx = this.context;
        ctx.fillStyle = "#FF0000";
        ctx.lineWidth = 1;
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 400);
        ctx.stroke();
    }

}

class Board {
    fields: Array<Array<State>>;
    ships: Array<Ship>;
    constructor() {
        this.fields = [this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn(),
            this.createEmptyColumn()];
    }

    private createEmptyColumn(): Array<State> {
        return [State.Empty, State.Empty, State.Empty, State.Empty, State.Empty, State.Empty, State.Empty, State.Empty, State.Empty, State.Empty];
    }
}

class Ship {
    length: number;
    x: number;
    y: number;
    orientation: Orientation;

    private board: Board;

    constructor(board: Board, x:number,y:number,orientation: Orientation) {
        this.board = board;
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.putOnBoard();
    }

    private putOnBoard() {
        this.board.fields[this.x][this.y] = State.Sail;
    }

    get sunk() : boolean {

        var anyOk: boolean = false;

        if (this.orientation == Orientation.Horizontal) {
            for (var i = this.x; i <= this.x + this.length; i++) {
                if (this.board.fields[this.y][i] == State.Sail) {
                    anyOk = true;
                    break;
                }
            }
        }
        else {
            for (var i = this.y; i <= this.y + this.length; i++) {
                if (this.board.fields[i][this.x] == State.Sail) {
                    anyOk = true;
                    break;
                }
            }
        }

        return !anyOk;
    }

    private getCoordinates(): Array<Coordinate>{
        var coordinates: Array<Coordinate> = [];
        if (this.orientation == Orientation.Horizontal) {
            for (var i = this.x; i <= this.x + this.length; i++) {
                coordinates.push(new Coordinate(i, this.y));
            }
        }
        else {
            for (var i = this.y; i <= this.y + this.length; i++) {
                coordinates.push(new Coordinate(this.x, i));
            }
        }

        return coordinates;
    }
}

enum Orientation {
    Horizontal,
    Vertical
}

class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

window.onload = () => {
    var app = new App(<HTMLCanvasElement>document.getElementById("display"));
    app.start();
};
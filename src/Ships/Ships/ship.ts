class Ship {
    length: number;
    x: number;
    y: number;
    orientation: Orientation;

    private board: Board;

    constructor(board: Board, x: number, y: number, length: number, orientation: Orientation) {
        this.board = board;
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.length = length;
        this.putOnBoard();
    }

    public changeOrientation(orientation: Orientation) : void
    {
        this.orientation = orientation;

        if (this.orientation == Orientation.Horizontal) {
            if (this.x + this.length >= 9) {
                this.x -= this.length;
            }
        }
        else {
            if (this.y + this.length >= 9) {
                this.y -= this.length;
            }
        }
    }

    public removeFromBoard() {
        var coords = this.getCoordinates();
        for (var i = 0; i < coords.length; i++) {
            var cord = coords[i];
            this.board.fields[cord.x][cord.y].clearSailCell();
        }
    }

    public move(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public isPointInside(x: number, y: number): boolean {
        var h = 40;
        var l = h * (this.length + 1);
        var cell = this.board.fields[this.x][this.y];
        return this.orientation == Orientation.Horizontal ? (x >= cell.x && x <= cell.x + l && y >= cell.y && y <= cell.y + h) :
            (x >= cell.x && x <= cell.x + h && y >= cell.y && y <= cell.y + l);
    }

    public putOnBoard() {
        var coords = this.getCoordinates();
        for (var i = 0; i < coords.length; i++) {
            var cord = coords[i];
            this.board.fields[cord.x][cord.y].setSailCell();
        }
    }

    get sunk(): boolean {
        var allOk: boolean = true;
        var coords = this.getCoordinates();

        for (var i = 0; i < coords.length; i++) {
            var elem = coords[i];
            if (this.board.fields[elem.x][elem.y].isSailCell && this.board.fields[elem.x][elem.y].state != State.Hit) {
                allOk = false;
                break;
            }
        }

        return allOk;
    }

    private getCoordinates(): Array<Coordinate> {
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
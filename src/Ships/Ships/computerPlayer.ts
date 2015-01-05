class ComputerPlayer {
    playerBoard: Board;
    hitQueue: Array<Coordinate>;
    positions: Direction[];
    lastPosition: Direction;
    orientation: Orientation;
    posChecked: number;
    constructor(playerBoard: Board) {
        this.playerBoard = playerBoard;
        this.hitQueue = new Array<Coordinate>();
        this.positions = [Direction.Left, Direction.Right, Direction.Top, Direction.Down];
    }

    public tryShot() {
        var coordinates = this.getCoordinates();
        if (this.posChecked > 1) {
            this.hitQueue.pop();
            this.posChecked = 0;
        }

        if (this.positions.length == 0) {
            this.positions = [Direction.Left, Direction.Right, Direction.Top, Direction.Down];
            if (this.hitQueue.length > 0) {
                this.hitQueue.pop();
            }
        }

        if (this.hitQueue.length == 0) {
            this.lastPosition = null;
            this.orientation = null;
            var position = Common.random(0, coordinates.length - 1);
            var elem = coordinates[position];
            var target = this.playerBoard.fields[elem.x][elem.y].shot();
            if (target) {
                this.hitQueue.push(elem);
            }
        }
        else {
            if (this.lastPosition != null) {
                var hit = this.hit(this.hitQueue[this.hitQueue.length -1], this.lastPosition);
                this.posChecked++;
                if (!hit) {
                    this.tryShot();
                }
            }
            else {
                var hit = this.tryPossibleHits();

                if (!hit) {
                    this.tryShot();
                }
            }
        }
    }

    private tryPossibleHits(): boolean {
        var coordinates = new Array<Coordinate>();
        var elem = this.hitQueue[this.hitQueue.length - 1];
        while (this.positions.length > 0) {
            var index = Common.random(0, this.positions.length);
            var position = this.positions[index];
            var hit = this.hit(elem, this.positions[index]);

            if (hit) {
                return true;
            }

            this.positions.splice(index, 1);
        }

        return false;
    }


    private hit(elem: Coordinate, position: Direction): boolean {
        var coordinate = this.setPosition(elem, position);
        if (this.playerBoard.fields[coordinate.x][coordinate.y].state == State.Empty) {
            var target = this.playerBoard.fields[coordinate.x][coordinate.y].shot();

            if (target) {
                this.posChecked = 0;
                this.positions = [Direction.Left, Direction.Right, Direction.Top, Direction.Down];
                this.hitQueue.push(coordinate);
                this.lastPosition = position;
                this.orientation = this.lastPosition == Direction.Top || this.lastPosition == Direction.Down ? Orientation.Vertical : Orientation.Horizontal;
            }
            else {
                if (this.lastPosition != null) {
                    if (this.orientation == Orientation.Vertical) {
                        this.lastPosition = this.lastPosition == Direction.Top ? Direction.Down : Direction.Top;
                    }
                    else {
                        this.lastPosition = this.lastPosition == Direction.Left ? Direction.Right : Direction.Left;
                    }
                }
            }

            return true;
        }

        return false;
    }

    private setPosition(lastHit: Coordinate, pos: Direction): Coordinate {
        var coord = new Coordinate(lastHit.x, lastHit.y);
        switch (pos) {
            case Direction.Top:
                if (coord.y < 9) {
                    coord.y += 1;
                }

                break;
            case Direction.Left:
                if (coord.x > 0) {
                    coord.x -= 1;
                }

                break;
            case Direction.Down:
                if (coord.y > 0) {
                    coord.y -= 1;
                }

                break;
            case Direction.Right:
                if (coord.x < 9) {
                    coord.x += 1;
                } 

                break;
        }

        return coord;
    }

    private getCoordinates(): Array<Coordinate> {
        var coordinates = new Array<Coordinate>();

        for (var i = 0; i < this.playerBoard.fields.length; i++) {
            for (var j = 0; j < this.playerBoard.fields[i].length; j++) {
                if (this.playerBoard.fields[i][j].state == State.Empty && this.checkNeighbours(i,j)) {
                    coordinates.push(new Coordinate(i, j));
                }
            }
        }

        return coordinates;
    }

    private checkNeighbours(i: number, j: number): boolean {

        if (i < 9 && this.playerBoard.fields[i + 1][j].state == State.Hit) {

            if (j > 0 && this.playerBoard.fields[i + 1][j - 1].state == State.Hit) {
                return false;
            }

            if (j < 9 && this.playerBoard.fields[i + 1][j + 1].state == State.Hit) {
                return false;
            }
        }

        if (i > 0 && this.playerBoard.fields[i - 1][j].state == State.Hit) {
            if (j > 0 && this.playerBoard.fields[i - 1][j - 1].state == State.Hit) {
                return false;
            }

            if (j < 9 && this.playerBoard.fields[i - 1][j + 1].state == State.Hit) {
                return false;
            }
        }

        if (j < 9 && this.playerBoard.fields[i][j + 1].state == State.Hit) {
            if (i < 9 && this.playerBoard.fields[i + 1][j + 1].state == State.Hit) {
                return false;
            }

            if (i > 0 && this.playerBoard.fields[i - 1][j + 1].state == State.Hit) {
                return false;
            }
        }

        if (j > 0 && this.playerBoard.fields[i][j - 1].state == State.Hit){
            if (i < 9 && this.playerBoard.fields[i + 1][j - 1].state == State.Hit) {
                return false;
            }

            if (i > 0 && this.playerBoard.fields[i - 1][j - 1].state == State.Hit) {
                return false;
            }
        }

        return true;
    }
} 

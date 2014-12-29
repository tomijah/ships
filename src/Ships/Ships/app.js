var App = (function () {
    function App(canvas) {
        this.context = canvas.getContext('2d');
    }
    App.prototype.start = function () {
        this.drawStage();
    };

    App.prototype.drawStage = function () {
        var ctx = this.context;
        ctx.fillStyle = "#FF0000";
        ctx.lineWidth = 1;
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 400);
        ctx.stroke();
    };
    return App;
})();

var Board = (function () {
    function Board() {
        this.fields = [
            this.createEmptyColumn(),
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
    Board.prototype.createEmptyColumn = function () {
        return [1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */, 1 /* Empty */];
    };
    return Board;
})();

var Ship = (function () {
    function Ship(board, x, y, orientation) {
        this.board = board;
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.putOnBoard();
    }
    Ship.prototype.putOnBoard = function () {
        this.board.fields[this.x][this.y] = 4 /* Sail */;
    };

    Object.defineProperty(Ship.prototype, "sunk", {
        get: function () {
            var anyOk = false;

            if (this.orientation == 0 /* Horizontal */) {
                for (var i = this.x; i <= this.x + this.length; i++) {
                    if (this.board.fields[this.y][i] == 4 /* Sail */) {
                        anyOk = true;
                        break;
                    }
                }
            } else {
                for (var i = this.y; i <= this.y + this.length; i++) {
                    if (this.board.fields[i][this.x] == 4 /* Sail */) {
                        anyOk = true;
                        break;
                    }
                }
            }

            return !anyOk;
        },
        enumerable: true,
        configurable: true
    });

    Ship.prototype.getCoordinates = function () {
        var coordinates = [];
        if (this.orientation == 0 /* Horizontal */) {
            for (var i = this.x; i <= this.x + this.length; i++) {
                coordinates.push(new Coordinate(i, this.y));
            }
        } else {
            for (var i = this.y; i <= this.y + this.length; i++) {
                coordinates.push(new Coordinate(this.x, i));
            }
        }

        return coordinates;
    };
    return Ship;
})();

var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation || (Orientation = {}));

var Coordinate = (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coordinate;
})();

window.onload = function () {
    var app = new App(document.getElementById("display"));
    app.start();
};
//# sourceMappingURL=app.js.map

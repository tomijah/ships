var Ship = (function () {
    function Ship(board, x, y, length, orientation) {
        this.board = board;
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.length = length;
        this.putOnBoard();
    }
    Ship.prototype.changeOrientation = function (orientation) {
        this.orientation = orientation;

        if (this.orientation == 0 /* Horizontal */) {
            if (this.x + this.length >= 9) {
                this.x -= this.length;
            }
        } else {
            if (this.y + this.length >= 9) {
                this.y -= this.length;
            }
        }
    };

    Ship.prototype.removeFromBoard = function () {
        var coords = this.getCoordinates();
        for (var i = 0; i < coords.length; i++) {
            var cord = coords[i];
            this.board.fields[cord.x][cord.y].clearSailCell();
        }
    };

    Ship.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Ship.prototype.isPointInside = function (x, y) {
        var h = 40;
        var l = h * (this.length + 1);
        var cell = this.board.fields[this.x][this.y];
        return this.orientation == 0 /* Horizontal */ ? (x >= cell.x && x <= cell.x + l && y >= cell.y && y <= cell.y + h) : (x >= cell.x && x <= cell.x + h && y >= cell.y && y <= cell.y + l);
    };

    Ship.prototype.putOnBoard = function () {
        var coords = this.getCoordinates();
        for (var i = 0; i < coords.length; i++) {
            var cord = coords[i];
            this.board.fields[cord.x][cord.y].setSailCell();
        }
    };

    Object.defineProperty(Ship.prototype, "sunk", {
        get: function () {
            var allOk = true;
            var coords = this.getCoordinates();

            for (var i = 0; i < coords.length; i++) {
                var elem = coords[i];
                if (this.board.fields[elem.x][elem.y].isSailCell && this.board.fields[elem.x][elem.y].state != 2 /* Hit */) {
                    allOk = false;
                    break;
                }
            }

            return allOk;
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
//# sourceMappingURL=ship.js.map

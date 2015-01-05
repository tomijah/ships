var Board = (function () {
    function Board(ctx) {
        this.ctx = ctx;
        this.fields = new Array();
        for (var i = 0; i < 10; i++) {
            this.fields[i] = new Array();
            var x = i * 40;

            for (var j = 0; j < 10; j++) {
                var y = j * 40;
                this.fields[i][j] = new Cell(x, y, ctx);
            }
        }

        this.initializeShips();
    }
    Board.prototype.redrawBoard = function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                this.fields[i][j].redraw();
            }
        }
    };

    Object.defineProperty(Board.prototype, "allSunk", {
        get: function () {
            for (var i = 0; i < this.ships.length; i++) {
                if (!this.ships[i].sunk) {
                    return false;
                }
            }

            return true;
        },
        enumerable: true,
        configurable: true
    });

    Board.prototype.setDifferentPosition = function (ship) {
        var positions = this.getAllPositions();

        var found = false;
        while (!found) {
            var index = this.randomPosition(positions);
            var position = positions[index];
            if (!this.fields[position.x][position.y].isSailCell && this.allowedNeighbours(position.x, position.y) && this.allowedLength(position.x, position.y, ship.length, ship.orientation)) {
                ship.move(position.x, position.y);
                found = true;
            } else {
                console.log(positions.length);
                positions.splice(index, 1);
            }
        }
    };

    Board.prototype.initializeShips = function () {
        this.ships = new Array();
        var positions = this.getAllPositions();
        var lengths = [4, 3, 3, 2, 2, 1, 1];
        var iterator = 0;
        while (iterator < 7) {
            var orientation = this.randomOrientation();

            var result = this.getCorrectPosition(positions, lengths[iterator], orientation);
            if (result) {
                iterator++;
            }
        }
    };

    Board.prototype.getCorrectPosition = function (positions, length, orientation) {
        var index = this.randomPosition(positions);
        var position = positions[index];
        if (!this.fields[position.x][position.y].isSailCell && this.allowedNeighbours(position.x, position.y) && this.allowedLength(position.x, position.y, length, orientation)) {
            this.ships.push(new Ship(this, position.x, position.y, length, orientation));
            return true;
        } else {
            positions.splice(index, 1);
            return false;
        }
    };

    Board.prototype.randomPosition = function (positions) {
        var x = Common.random(0, positions.length - 1);

        return x;
    };

    Board.prototype.getAllPositions = function () {
        var coordinates = new Array();
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (!this.fields[i][j].isSailCell) {
                    coordinates.push(new Coordinate(i, j));
                }
            }
        }

        return coordinates;
    };

    Board.prototype.allowedLength = function (posx, posy, length, orientation) {
        if (orientation == 0 /* Horizontal */) {
            if (posx + length > 9) {
                return false;
            }

            for (var i = posx; i <= posx + length; i++) {
                if (this.fields[i][posy].isSailCell || !this.allowedNeighbours(i, posy)) {
                    return false;
                }
            }
        } else {
            if (posy + length > 9) {
                return false;
            }

            for (var i = posy; i <= posy + length; i++) {
                if (this.fields[posx][i].isSailCell || !this.allowedNeighbours(posx, i)) {
                    return false;
                }
            }
        }

        return true;
    };

    Board.prototype.allowedNeighbours = function (i, j) {
        if (i > 0) {
            if (this.fields[i - 1][j].isSailCell) {
                return false;
            }
        }

        if (i < 9) {
            if (this.fields[i + 1][j].isSailCell) {
                return false;
            }
        }

        if (j > 0) {
            if (this.fields[i][j - 1].isSailCell) {
                return false;
            }
        }

        if (j < 9) {
            if (this.fields[i][j + 1].isSailCell) {
                return false;
            }
        }

        return true;
    };

    Board.prototype.randomOrientation = function () {
        return Common.random(0, 1) == 0 ? 0 /* Horizontal */ : 1 /* Vertical */;
    };

    Board.prototype.drawShips = function () {
        var h = 40;
        for (var i = 0; i < this.ships.length; i++) {
            var ship = this.ships[i];
            if (ship.x < 0) {
                ship.x = 0;
            }

            if (ship.y < 0) {
                ship.y = 0;
            }

            var cell = this.fields[ship.x][ship.y];
            var l = ship.length + 1;
            if (ship.orientation == 0 /* Horizontal */) {
                this.roundRect(cell.x, cell.y, h * l, h, 5, true, true);
            } else {
                this.roundRect(cell.x, cell.y, h, h * l, 5, true, true);
            }
        }
    };

    Board.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        if (stroke) {
            this.ctx.stroke();
        }
        if (fill) {
            this.ctx.fill();
        }
        this.ctx.restore();
    };
    return Board;
})();
//# sourceMappingURL=board.js.map

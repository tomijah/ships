var ComputerPlayer = (function () {
    function ComputerPlayer(playerBoard) {
        this.playerBoard = playerBoard;
        this.hitQueue = new Array();
        this.positions = [3 /* Left */, 4 /* Right */, 1 /* Top */, 2 /* Down */];
    }
    ComputerPlayer.prototype.tryShot = function () {
        var coordinates = this.getCoordinates();
        if (this.posChecked > 1) {
            this.hitQueue.pop();
            this.posChecked = 0;
        }

        if (this.positions.length == 0) {
            this.positions = [3 /* Left */, 4 /* Right */, 1 /* Top */, 2 /* Down */];
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
        } else {
            if (this.lastPosition != null) {
                var hit = this.hit(this.hitQueue[this.hitQueue.length - 1], this.lastPosition);
                this.posChecked++;
                if (!hit) {
                    this.tryShot();
                }
            } else {
                var hit = this.tryPossibleHits();

                if (!hit) {
                    this.tryShot();
                }
            }
        }
    };

    ComputerPlayer.prototype.tryPossibleHits = function () {
        var coordinates = new Array();
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
    };

    ComputerPlayer.prototype.hit = function (elem, position) {
        var coordinate = this.setPosition(elem, position);
        if (this.playerBoard.fields[coordinate.x][coordinate.y].state == 1 /* Empty */) {
            var target = this.playerBoard.fields[coordinate.x][coordinate.y].shot();

            if (target) {
                this.posChecked = 0;
                this.positions = [3 /* Left */, 4 /* Right */, 1 /* Top */, 2 /* Down */];
                this.hitQueue.push(coordinate);
                this.lastPosition = position;
                this.orientation = this.lastPosition == 1 /* Top */ || this.lastPosition == 2 /* Down */ ? 1 /* Vertical */ : 0 /* Horizontal */;
            } else {
                if (this.lastPosition != null) {
                    if (this.orientation == 1 /* Vertical */) {
                        this.lastPosition = this.lastPosition == 1 /* Top */ ? 2 /* Down */ : 1 /* Top */;
                    } else {
                        this.lastPosition = this.lastPosition == 3 /* Left */ ? 4 /* Right */ : 3 /* Left */;
                    }
                }
            }

            return true;
        }

        return false;
    };

    ComputerPlayer.prototype.setPosition = function (lastHit, pos) {
        var coord = new Coordinate(lastHit.x, lastHit.y);
        switch (pos) {
            case 1 /* Top */:
                if (coord.y < 9) {
                    coord.y += 1;
                }

                break;
            case 3 /* Left */:
                if (coord.x > 0) {
                    coord.x -= 1;
                }

                break;
            case 2 /* Down */:
                if (coord.y > 0) {
                    coord.y -= 1;
                }

                break;
            case 4 /* Right */:
                if (coord.x < 9) {
                    coord.x += 1;
                }

                break;
        }

        return coord;
    };

    ComputerPlayer.prototype.getCoordinates = function () {
        var coordinates = new Array();

        for (var i = 0; i < this.playerBoard.fields.length; i++) {
            for (var j = 0; j < this.playerBoard.fields[i].length; j++) {
                if (this.playerBoard.fields[i][j].state == 1 /* Empty */ && this.checkNeighbours(i, j)) {
                    coordinates.push(new Coordinate(i, j));
                }
            }
        }

        return coordinates;
    };

    ComputerPlayer.prototype.checkNeighbours = function (i, j) {
        if (i < 9 && this.playerBoard.fields[i + 1][j].state == 2 /* Hit */) {
            if (j > 0 && this.playerBoard.fields[i + 1][j - 1].state == 2 /* Hit */) {
                return false;
            }

            if (j < 9 && this.playerBoard.fields[i + 1][j + 1].state == 2 /* Hit */) {
                return false;
            }
        }

        if (i > 0 && this.playerBoard.fields[i - 1][j].state == 2 /* Hit */) {
            if (j > 0 && this.playerBoard.fields[i - 1][j - 1].state == 2 /* Hit */) {
                return false;
            }

            if (j < 9 && this.playerBoard.fields[i - 1][j + 1].state == 2 /* Hit */) {
                return false;
            }
        }

        if (j < 9 && this.playerBoard.fields[i][j + 1].state == 2 /* Hit */) {
            if (i < 9 && this.playerBoard.fields[i + 1][j + 1].state == 2 /* Hit */) {
                return false;
            }

            if (i > 0 && this.playerBoard.fields[i - 1][j + 1].state == 2 /* Hit */) {
                return false;
            }
        }

        if (j > 0 && this.playerBoard.fields[i][j - 1].state == 2 /* Hit */) {
            if (i < 9 && this.playerBoard.fields[i + 1][j - 1].state == 2 /* Hit */) {
                return false;
            }

            if (i > 0 && this.playerBoard.fields[i - 1][j - 1].state == 2 /* Hit */) {
                return false;
            }
        }

        return true;
    };
    return ComputerPlayer;
})();
//# sourceMappingURL=computerPlayer.js.map

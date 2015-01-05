var App = (function () {
    function App(computerCanvas, playerCanvas) {
        var _this = this;
        this.computerCanvas = computerCanvas;
        this.computerContext = computerCanvas.getContext('2d');
        this.playerCanvas = playerCanvas;
        this.playerContext = playerCanvas.getContext('2d');
        this.width = 400;
        this.height = 400;
        this.activePlayer = true;
        document.addEventListener('mousemove', function (e) {
            _this.highlightCell(e);
        });
        document.addEventListener('click', function (e) {
            _this.handleClick(e);
        });

        document.addEventListener('dblclick', function (e) {
            _this.changeShipOrientation(e);
        });

        this.playerCanvas.addEventListener('mouseup', function (e) {
            _this.dropShip();
        });
        this.playerCanvas.addEventListener('mousedown', function (e) {
            _this.dragShip(e);
        });
    }
    App.prototype.start = function () {
        this.computerBoard = new Board(this.computerContext);
        this.playerBoard = new Board(this.playerContext);
        this.computerPlayer = new ComputerPlayer(this.playerBoard);

        this.redrawShips();
    };

    App.prototype.changeShipOrientation = function (e) {
        if (!this.gameStarted) {
            var offsetX = this.playerCanvas.offsetLeft;
            var offsetY = this.playerCanvas.offsetTop;
            var mouseX = (e.clientX - offsetX);
            var mouseY = (e.clientY - offsetY);

            for (var i = 0; i < this.playerBoard.ships.length; i++) {
                var ship = this.playerBoard.ships[i];
                if (this.playerBoard.ships[i].isPointInside(mouseX, mouseY)) {
                    ship.removeFromBoard();
                    var orientation = ship.orientation == 0 /* Horizontal */ ? 1 /* Vertical */ : 0 /* Horizontal */;
                    ship.changeOrientation(orientation);

                    if (!this.playerBoard.allowedLength(ship.x, ship.y, ship.length, ship.orientation)) {
                        this.playerBoard.setDifferentPosition(ship);
                    }

                    ship.putOnBoard();

                    this.redrawShips();
                }
            }
        }
    };

    App.prototype.highlightCell = function (e) {
        var offsetX = this.computerCanvas.offsetLeft;
        var offsetY = this.computerCanvas.offsetTop;

        var mouseX = (e.clientX - offsetX);
        var mouseY = (e.clientY - offsetY);
        if (mouseX < this.computerCanvas.width + offsetX) {
            this.computerContext.clearRect(0, 0, this.computerCanvas.width, this.computerCanvas.height);

            for (var i = 0; i < this.computerBoard.fields.length; i++) {
                for (var j = 0; j < this.computerBoard.fields[i].length; j++) {
                    if (this.computerBoard.fields[i][j].isPointInside(mouseX, mouseY)) {
                        this.computerBoard.fields[i][j].highlight();
                    } else {
                        this.computerBoard.fields[i][j].redraw();
                    }
                }
            }
        }
    };

    App.prototype.handleClick = function (e) {
        if (this.activePlayer) {
            this.activePlayer = false;
            var offsetX = this.computerCanvas.offsetLeft;
            var offsetY = this.computerCanvas.offsetTop;

            var mouseX = (e.clientX - offsetX);
            var mouseY = (e.clientY - offsetY);
            var hit = false;
            this.computerContext.clearRect(0, 0, this.computerContext.canvas.width, this.computerContext.canvas.height);
            for (var i = 0; i < this.computerBoard.fields.length; i++) {
                for (var j = 0; j < this.computerBoard.fields[i].length; j++) {
                    if (this.computerBoard.fields[i][j].isPointInside(mouseX, mouseY)) {
                        if (this.computerBoard.fields[i][j].state == 1 /* Empty */) {
                            this.computerBoard.fields[i][j].shot();
                            hit = true;
                            break;
                        }

                        this.gameStarted = true;
                    } else {
                        this.computerBoard.fields[i][j].redraw();
                    }
                }
            }

            if (hit) {
                this.computerPlayer.tryShot();
                this.redrawShips();
                if (this.computerBoard.allSunk) {
                    if (!alert("congratulations you won!")) {
                        window.location.reload();
                    }
                }

                if (this.playerBoard.allSunk) {
                    if (!alert("Sorry, you lose...")) {
                        window.location.reload();
                    }
                }
            }
            this.activePlayer = true;
        }
    };

    App.prototype.handleMove = function (e) {
        if (this.dragged) {
            var offsetX = this.playerCanvas.offsetLeft;
            var offsetY = this.playerCanvas.offsetTop;
            var mouseX = (e.clientX - offsetX);
            var mouseY = (e.clientY - offsetY);
            for (var i = 0; i < this.playerBoard.fields.length; i++) {
                for (var j = 0; j < this.playerBoard.fields[i].length; j++) {
                    if (this.playerBoard.fields[i][j].isPointInside(mouseX, mouseY)) {
                        var x = i;
                        var y = j;
                        if (this.draggedShip.orientation == 0 /* Horizontal */) {
                            x -= this.offset;
                        } else {
                            y -= this.offset;
                        }

                        this.draggedShip.move(x, y);
                        this.redrawShips();
                    }
                }
            }
        }
    };

    App.prototype.dropShip = function () {
        if (this.dragged) {
            if (!this.playerBoard.allowedNeighbours(this.draggedShip.x, this.draggedShip.y) || !this.playerBoard.allowedLength(this.draggedShip.x, this.draggedShip.y, this.draggedShip.length, this.draggedShip.orientation)) {
                this.draggedShip.x = this.initialDragPosX;
                this.draggedShip.y = this.initialDragPosY;
                this.redrawShips();
            }
            this.draggedShip.putOnBoard();
            this.dragged = false;
            this.playerCanvas.onmousemove = null;
        }
    };

    App.prototype.dragShip = function (e) {
        var _this = this;
        var offsetX = this.playerCanvas.offsetLeft;
        var offsetY = this.playerCanvas.offsetTop;
        var mouseX = (e.clientX - offsetX);
        var mouseY = (e.clientY - offsetY);
        if (!this.gameStarted) {
            for (var i = 0; i < this.playerBoard.ships.length; i++) {
                if (this.playerBoard.ships[i].isPointInside(mouseX, mouseY)) {
                    this.dragged = true;
                    this.draggedShip = this.playerBoard.ships[i];
                    this.initialDragPosX = this.draggedShip.x;
                    this.initialDragPosY = this.draggedShip.y;
                    this.draggedShip.removeFromBoard();

                    this.offset = Math.floor((this.draggedShip.length + 1) / 2);

                    this.playerCanvas.onmousemove = function (e) {
                        _this.handleMove(e);
                    };
                }
            }
        }
    };

    App.prototype.redrawShips = function () {
        this.playerContext.clearRect(0, 0, this.playerCanvas.width, this.playerCanvas.height);
        this.playerBoard.redrawBoard();
        this.playerBoard.drawShips();
    };
    return App;
})();

window.onload = function () {
    var app = new App(document.getElementById("computer"), document.getElementById("player"));
    app.start();
};
//# sourceMappingURL=app.js.map

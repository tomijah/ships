var Cell = (function () {
    function Cell(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.ctx = ctx;
        var strokewidth = 1;
        this.state = 1 /* Empty */;
        this.redraw();
        return (this);
    }
    Cell.prototype.setSailCell = function () {
        this.isSailCell = true;
    };

    Cell.prototype.clearSailCell = function () {
        this.isSailCell = false;
    };

    Cell.prototype.shot = function () {
        if (this.isSailCell) {
            this.state = 2 /* Hit */;
        } else {
            this.state = 3 /* Miss */;
        }

        //this.redraw();
        return this.isSailCell;
    };

    Cell.prototype.redraw = function () {
        switch (this.state) {
            case 1 /* Empty */:
                this.draw(false, "gray");
                break;
            case 2 /* Hit */:
                this.draw(true, "green");
                break;
            case 3 /* Miss */:
                this.draw(true, "black");
                break;
            case 5 /* Sunk */:
                break;
        }
    };

    Cell.prototype.changeState = function (state) {
        this.state = state;
    };

    Cell.prototype.highlight = function () {
        this.draw(true, "darkgray");
        return (this);
    };

    Cell.prototype.isPointInside = function (x, y) {
        return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
    };

    Cell.prototype.draw = function (opacity, fillStyle) {
        this.ctx.save();
        if (opacity) {
            this.ctx.globalAlpha = 0.8;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = "skyblue";
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    };
    return Cell;
})();
//# sourceMappingURL=cell.js.map

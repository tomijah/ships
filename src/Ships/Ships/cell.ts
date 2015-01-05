class Cell {
    x: number;
    y: number;

    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    state: State;
    isSailCell: boolean;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.ctx = ctx;
        var strokewidth = 1;
        this.state = State.Empty;
        this.redraw();
        return (this);
    }

    public setSailCell() {
        this.isSailCell = true;
    }

    public clearSailCell() {
        this.isSailCell = false;
    }

    public shot(): boolean {
        if (this.isSailCell) {
            this.state = State.Hit;
        }
        else {
            this.state = State.Miss;
        }

        //this.redraw();
        return this.isSailCell;
    }

    public redraw() {
        switch (this.state) {
            case State.Empty:
                this.draw(false, "gray");
                break;
            case State.Hit:
                this.draw(true, "green");
                break;
            case State.Miss:
                this.draw(true, "black");
                break;
            case State.Sunk:
                break;
        }
    }

    public changeState(state: State) {
        this.state = state;
    }

    public highlight() {
        this.draw(true, "darkgray");
        return (this);
    }

    public isPointInside(x: number, y: number): boolean {
        return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
    }

    private draw(opacity: boolean, fillStyle: string): void {
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
    }
}
 
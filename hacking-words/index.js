const canvas = document.getElementById('root');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class HackingWords {
    constructor(canvas, props) {
        this.canvas = canvas;
        this.fontSize = props?.fontSize || 20;
        this.speed = props?.speed || 20;
        this.ctx = canvas.getContext('2d');
        this.init();
    }

    init() {
        // draw background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // manager lines
        const lineCnt = Math.floor(this.canvas.width / this.fontSize);
        this.positions = new Array(lineCnt).fill(0);

    }

    getRandomWord() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return characters.at(Math.floor(Math.random() * characters.length));
    }

    _drawWord(text, x, y, fontSize) {
        this.ctx.font = `${fontSize}px Roboto`;
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = '#0f0';
        this.ctx.fillText(text, x, y);
    }

    _drawLine() {
        this._drawMask(3/ Math.floor(this.canvas.height / this.fontSize)); // adjust the opacity to make it comfortable
        this.positions.forEach((yIdx, xIdx) => {
            this._drawWord(this.getRandomWord(), this.fontSize * xIdx, this.fontSize * yIdx, this.fontSize);
        })
        const maxLine = Math.ceil(this.canvas.height / this.fontSize);
        this.positions = this.positions.map((pos) => {
            if (pos >= maxLine) {
                // randomly reset the position
                return Math.random() > 0.99 ? 0 : pos + 1;
            } else {
                return pos + 1;
            }
        })
    }

    _drawMask(opacity) {
        this.ctx.fillStyle = `rgba(0, 0 ,0, ${opacity})`;
        this.ctx.fillRect(0, 0 , this.canvas.width, this.canvas.height)
    }


    start() {
        setInterval(() => {
            this._drawLine();
        }, 1000 / this.speed)

    }

}

const obj = new HackingWords(canvas, {fontSize: 20, speed: 30});
obj.start()


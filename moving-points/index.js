const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Point {
    constructor(props) {
        this.canvas = props.canvas;
        this.x = props.x;
        this.y = props.y;
        this.r = 5;
    }
    draw() {
        const ctx = this.canvas.getContext('2d');
        this.circle = new Path2D();
        ctx.fillStyle = '#FFF';
        this.circle.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill(this.circle);
    }
    getCircle() {
        return this.circle;
    }
}

class MovablePoint extends Point {
    constructor(props) {
        super(props);
        this.direction = props.direction || this.createDirection();
        this.visible = false;
        this.freeze = false;
    }

    createDirection() {
        const xRand = Math.random();
        const yRand = Math.random();
        return {
            x: xRand < 0.333 ? -1 :
                xRand < 0.666 ? 0 : 1,
            y: yRand < 0.333 ? -1 :
                yRand < 0.666 ? 0 : 1

        }
    }
    move() {
        if (this.freeze) return;
        if (this.x - this.r <= 0) {
            this.direction.x = 1;
        }
        if (this.x + this.r >= this.canvas.width) {
            this.direction.x = -1;
        }
        if (this.y - this.r <= 0) {
            this.direction.y = 1;
        }
        if (this.y + this.r >= this.canvas.height) {
            this.direction.y = -1;
        }
        this.x += this.direction.x;
        this.y += this.direction.y;
    }

    moveTo(x, y ) {
        this.x = x;
        this.y = y;
    }
    setFreeze(bool) {
        this.freeze = bool;
    }
}

class DraggablePoint extends MovablePoint {
    constructor(props) {
        super(props);
        this.isDragging = false;
        this.focused = false;
    }

    focus() {
        this.focused = true;
        const circle = this.getCircle();
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#46d5f5';
        ctx.fill(circle);
    }
    blur() {
        this.focused = false;
        const circle = this.getCircle();
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#FFF';
        ctx.fill(circle);
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        this.circle = new Path2D();
        ctx.fillStyle = this.focused ? '#46d5f5' : '#FFF';
        this.circle.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill(this.circle);
    }
}

class Graph {
    constructor(canvas, count, threshold, speed) {
        this.count = count;
        this.canvas = canvas;
        this.threshold = threshold;
        this.speed = speed;
        this.timer = null;
        this.isDragging = false;
        this.init();
    }

    init() {
        //create points
        this.points = this.createPoints();
        // setup listeners
        this._setupMouseMoveListener();
        this._setupMouseDownListener();
        this._setupMouseUpListener();
    }

    createPoints() {
        return new Array(this.count).fill('').map((index) => {
            return new DraggablePoint({canvas: this.canvas, x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height});
        })
    }

    calculateDistance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    drawLine(a, b, opacity) {
        const ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
        ctx.stroke();
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i];
            for (let j = 0; j < this.points.length; j++) {
                const p2 = this.points[j];
                if (!p2.visible) p2.draw();
                const dis = this.calculateDistance(p1, p2);
                if (dis <= this.threshold) {
                    this.drawLine(p1, p2, 1 - dis / this.threshold);
                }
            }
        }
    }

    move() {
        if (this.speed) {
            this.timer = setInterval(() => {
                this.points.forEach((point) => {
                    point.move({
                        x: Math.random() > 0.5 ? 1 : -1,
                        y: Math.random() > 0.5 ? 1 : -1,
                    })
                });
                this.draw();

            }, 1000 / this.speed)
        }
    }

    stop() {
        clearInterval(this.timer);
    }

    _setupMouseMoveListener() {
        this.canvas.addEventListener('mousemove', (e) => {
            const point = this._getPoint(e.offsetX, e.offsetY);
            // dragging behavior has higher priority than others;
            if (this.isDragging) {
                if (this._focusedPoint.x !== e.offsetX && this._focusedPoint.y !== e.offsetY) {
                    this._focusedPoint.moveTo(e.offsetX, e.offsetY);
                    this.draw();
                }
            } else if (point) {
                this._frozenPoint = point;
                document.body.style.cursor = 'pointer';
                point.setFreeze(true);
            } else {
                document.body.style.cursor = '';
                if (this._frozenPoint) this._frozenPoint.setFreeze(false);
            }
        });
    }

    _setupMouseDownListener() {
        this.canvas.addEventListener('mousedown', (e) => {
            const point = this._getPoint(e.offsetX, e.offsetY);
            if (point) {
                this.isDragging = true;
                this._focusedPoint = point;
                point.focus();
            }
        });
    }

    _setupMouseUpListener() {
        this.canvas.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            this._focusedPoint.blur();
            this._focusedPoint = null;
        });
    }
    _getPoint(x, y) {
        for (let point of this.points) {
            const ctx = this.canvas.getContext('2d');
            if (ctx.isPointInPath(point.getCircle(), x, y)) {
                return point;
            }
        }
        return null;
    }
}

const graph = new Graph(canvas, 100, 400, 30);
graph.draw();
graph.move();


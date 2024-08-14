const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;
const CELL_ROWS = 200;
const CELL_COLS = 200;

const f_PAR = 0.055;
const k_PAR = 0.062;
const R_A = 1.0;
const R_B = 0.5;
const DT = 1.0;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillStyle = "#303030";
ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

class Cell {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    add(that) {
        return new Cell (
            this.a + this.a,
            this.b + that.b
        );
    }
    scalarMul(factor) {
        return new Cell (
            this.a*factor,
            this.b*factor
        );
    }
    sub (that) {
        return new Cell (
            this.a - that.a,
            this.b - that.b,
        );
    }
}

class State {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = new Array(rows);
        for (let i=0; i<this.rows; i++) {
            this.grid[i] = new Array(cols);
            for (let j=0; j<this.cols; j++) {
                this.grid[i][j] = new Cell(0,0);
            }
        }
    }
    draw() {
        let cell_width = CANVAS_WIDTH/this.rows;
        let cell_height = CANVAS_HEIGHT/this.cols;
        for(let i=0; i<this.rows; i++) {
            for (let j=0; j<this.cols; j++) {
                ctx.fillStyle = `rgba(
                ${state.grid[i][j].a*255}, 
                ${state.grid[i][j].a*255}, 
                ${state.grid[i][j].a*255}, 
                1)`;
                ctx.beginPath();
                ctx.fillRect(j*cell_width, i*cell_height, cell_width, cell_height);
            }
        }
    }

    update() {
        let a_n = 0;
        let b_n = 0;
        let a_1 = 0;
        let b_1 = 0;
        let newState = new State(CELL_ROWS, CELL_COLS);
        for (let i=1; i<this.rows-1; i++) {
            for (let j=1; j< this.cols-1; j++) {
                a_n = this.grid[i][j].a;
                b_n = this.grid[i][j].b;
                a_1 =  a_n + DT*(
                    R_A*this.laplace(i,j).a 
                    - a_n*b_n*b_n 
                    + f_PAR*(1 - a_n)
                );
                b_1 =  b_n + DT*(
                    R_B*this.laplace(i,j).b 
                    + a_n*b_n*b_n 
                    - (f_PAR + k_PAR)*b_n
                );
                if (a_1 >= 1) {
                    this.grid[i][j].a = 1;
                } else if (a_1 < 0) {
                    this.grid[i][j].a = 0;
                } else {
                    this.grid[i][j].a = a_1;
                }

                if (b_1 >= 1) {
                    this.grid[i][j].b = 1;
                } else if (b_1 < 0) {
                    this.grid[i][j].b = 0;
                } else {
                    this.grid[i][j].b = b_1;
                }
            }
        }
        return newState;
    }

    laplace(i,j) {
        let cell_width = CANVAS_WIDTH/this.rows;
        let cell_height = CANVAS_HEIGHT/this.cols;
        let dudx = this.grid[i][j+1] 
            .sub(this.grid[i][j].scalarMul(2)) 
            .add(this.grid[i][j-1])
            .scalarMul(1/(cell_width**2));
        let dudy = this.grid[i+1][j] 
            .sub(this.grid[i][j].scalarMul(2)) 
            .add(this.grid[i-1][j])
            .scalarMul(1/(cell_height**2));
        return dudx.add(dudy);
    }
}

let state = new State(CELL_ROWS, CELL_COLS);

// for (let i=10; i<20; i++) {
//     for (let j=10; j<20; j++) {
//         state.grid[i][j].a = 1;
//     }
// }

// for (let i=0; i<CELL_ROWS; i++) {
//     for (let j=0; j<CELL_COLS; j++) {
//         state.grid[i][j].a = 0.5 + 0.02*Math.random();
//         state.grid[i][j].b = 1 - state.grid[i][j].a;
//     }
// }

for (let i=0; i<CELL_ROWS; i++) {
    for (let j=0; j<CELL_COLS; j++) {
        if ( i >= 100 && i<=115 && j >= 100 && j <= 115) {
            state.grid[i][j].a = 0.0;
            state.grid[i][j].b = 1.0;
        } else {
            state.grid[i][j].a = 1.0;
            state.grid[i][j].b = 0.0;
        }
    }
}

state.draw();

let newState = new State(CELL_ROWS, CELL_COLS);
let time = 0;

function loop() {
    newState = state.update();
    ctx.reset();
    newState.draw();
    state = newState;
    // setInterval(loop, 100)
    ctx.fillStyle = "red";
    ctx.font = "20px monospace"
    ctx.fillText(`t = ${time}`,20,20);
    time++;
};

    // loop();

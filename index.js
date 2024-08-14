const FEED = 0.055;
const KILL = 0.062;
const R_A = 1.0;
const R_B = 0.5;
const DT = 1.0;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = 200;
canvas.height = 200;

ctx.fillStyle = "#303030";
ctx.fillRect(0,0,canvas.width,canvas.height);

let old = [];
let next = [];

for (var x = 0; x < canvas.width; x++) {
    old[x] = [];
    next[x] = [];
    for (var y = 0; y < canvas.height; y++) {
      old[x][y] = {
        a: 1,
        b: 0
      };
    }
}

for(let x=100; x<110; x++) {
    for(let y=100; y<110; y++) {
        old[x][y].b = 1.0;
    }
}
next = old;

function update() {
    for (var x = 1; x < canvas.width - 1; x++) {
        for (var y = 1; y < canvas.height - 1; y++) {
          var a = old[x][y].a;
          var b = old[x][y].b;
          let aa;
          let bb;
           aa= a +
            (R_A * laplaceA(x, y)) -
            (a * b * b) +
            (FEED * (1 - a));
           bb= b +
            (R_B * laplaceB(x, y)) +
            (a * b * b) -
            ((KILL + FEED) * b);
            
            next[x][y].a = Math.max(0,Math.min(aa,1));
            next[x][y].b = Math.max(0,Math.min(bb,1));
        }
      }
}

function laplaceA(x,y) {
    return (-1*old[x][y].a
         + 0.2*old[x-1][y].a
         + 0.2*old[x+1][y].a
         + 0.2*old[x][y-1].a
         + 0.2*old[x][y+1].a
         + 0.05*old[x-1][y-1].a
         + 0.05*old[x-1][y+1].a
         + 0.05*old[x+1][y-1].a
         + 0.05*old[x+1][y+1].a
    );
}
function laplaceB(x,y) {
    return (-1*old[x][y].b
         + 0.2*old[x-1][y].b
         + 0.2*old[x+1][y].b
         + 0.2*old[x][y-1].b
         + 0.2*old[x][y+1].b
         + 0.05*old[x-1][y-1].b
         + 0.05*old[x-1][y+1].b
         + 0.05*old[x+1][y-1].b
         + 0.05*old[x+1][y+1].b
    );
}

function loop() {
    ctx.reset();
    update();
    old = next;
    for (var x = 1; x < canvas.width - 1; x++) {
        for (var y = 1; y < canvas.height - 1; y++) {
            let a = old[x][y].a;
            let b = old[x][y].b;
            let diff = Math.max(0,Math.min(a-b,1));
            ctx.fillStyle = `rgba(
            ${Math.floor(diff*255)}, 
            ${Math.floor(diff*255)}, 
            ${Math.floor(diff*255)}, 
            1)`;
            ctx.beginPath();
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    if (!pause) {
        window.requestAnimationFrame(loop);
    }

    
}

let pause = true;
canvas.addEventListener("click", e => {
    if(pause === false) {
        pause = true;
    } else if (pause === true) {
        pause = false;
        window.requestAnimationFrame(loop);
    }
    console.log(pause);
});



const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'purple';
const squareLength = 400;
const minX = 100;
const minY = 100;
const maxX = minX + squareLength;
const maxY = minY + squareLength
ctx.fillRect(minX, minY, squareLength, squareLength);


var delta = 0;

var bufferMap = {};
function updateScreen() {
    for (key in Object.keys(bufferMap)) {
        for (let i = 0; i < 3; i++) {
            if (bufferMap[key].length > 0) {
                const [x,y] = bufferMap[key].shift();
                ctx.fillStyle = 'black';
                ctx.fillRect(x,y,3,3);
            }
        }
    }
}

function getShiftBiasedTowardsLastMove(skew, shift) {
    const randomNumber = Math.random()
    const moves = [-1,0,1]
    if (randomNumber < 0.2) {
        return skew
    } else if (randomNumber < 0.6 + Math.random()/4 - 0.3) {
        return shift
    } else {
        return moves[Math.floor(Math.random()*3)]
    }
}

function climb(x,y) {
    let newX = x;
    let shift = 0;
    for (let j = y+1; j >= minY; j--) {
        shift = getShiftBiasedTowardsLastMove(shift)
        newX += shift
        pixelBuffer.push([newX, j])
    }
}

class Trail {
    constructor(x, y, condition, skew, sign=1) {
        this.x = x;
        this.y = y;
        this.sign = sign;
        this.skew = skew;
        this.shift = 0;
        this.isInBoundsCondition = condition
    }
    heightUpdate() {
        this.y += this.sign;
    }
    xUpdate(){
        this.shift = getShiftBiasedTowardsLastMove(this.skew, this.shift);
        this.x += this.shift
    }
    getCoord(){
        return [this.x, this.y]
    }
    isInBounds(){
        // console.log(this.y)
        return this.isInBoundsCondition(this.y)
    }
}

var clicks = 0;
function shatterfall(x,y, clicks) {
    const trails = [
        new Trail(x,y,(y) => y < maxY,-1), // waterfall
        new Trail(x,y,(y) => y < maxY, 1),
        new Trail(x,y,(y) => y  >= minY, -1, -1), // climb
        new Trail(x,y,(y) => y  >= minY, 1, -1)
    ];
    bufferMap[clicks] = [];
    let outOfBoundsCount = 0;
    while (outOfBoundsCount < trails.length){
        outOfBoundsCount = 0;
        for (const trail of trails) {
            if (!trail.isInBounds()) {
                outOfBoundsCount += 1;
                continue;
            }
            trail.xUpdate();
            trail.heightUpdate();
            bufferMap[clicks].push(trail.getCoord())
        }
    }
    console.log('left!')
}

function shatter() {
    // console.log('test')
    const x = event.clientX;
    const y = event.clientY;
    /*
    select random 2 on top
    select random 2 on bottom
    */
    // pixelBuffer.push([x,y])
    // climb(x,y)
    shatterfall(x,y, clicks)
    clicks +=1;

    // ctx.fillStyle = 'pink'
    // ctx.fillRect(100+delta, 100+delta*2, 2,2)
    // delta += 10;
}


/*
how to do a random walk with bias towards moving towards the wall?

my intutition
there's eight squares around center
choose a random one of those ... 
    if its on the bottom have it choose random bottom three to continue
    if its on the top choose one of random top three directions to continue
    with bias towards the middle option

    iterate through square from click point

*/

setInterval(updateScreen, 0)
document.addEventListener('click', shatter)
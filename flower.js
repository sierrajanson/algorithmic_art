const canvas = document.getElementById('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')


class Petal {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
    constructor(ctx, x, y, longRadius,size, angle) {
        this.x = x
        this.y = y
        this.longRadius = longRadius
        this.size = size
        this.ctx = ctx
        this.angle = angle
    }
    draw(){
        this.ctx.beginPath();
        this.ctx.ellipse(this.x, this.y, 30, this.longRadius, this.angle, 0, 2 * Math.PI);
        this.ctx.fill()
        }
}

class Flower {
    constructor(centerX, centerY, size, rows, mainColor) {
        this.centerX = centerX
        this.centerY = centerY
        this.size = size
        this.rows = rows
        this.mainColor = mainColor

        // creating petals
        let baseRadius = rows*20; // radius of each flower row
        // draw flower rows from outside in
        for (let row = 0; row < rows; row++) {
            const phase = row % 2 == 0 ? 0 : Math.PI/8 // alternates petal position per row
            // drawFlowerRow(centerX, centerY, baseRadius*size, phase, randomColorSampler(mainColor))

            // phase, color, longRadius differs between rows
            // angle, position differs between petal
            // how can we store petals + rows optimally to just update the position?
            let longRadius = baseRadius*size
            ctx.fillStyle = randomColorSampler(mainColor)
            // for (let angle = delta; angle < 2*Math.PI+delta; angle += Math.PI/4) {
            for (let angle = 2*Math.PI+delta+phase; angle >= delta; angle -= (Math.PI/4)) {
                const x = centerX + Math.cos(angle + Math.PI/2)*longRadius;
                const y = centerY + Math.sin(angle + Math.PI/2)*longRadius;

                const petal = new Petal(ctx, x,y,longRadius, 5, angle)
                petal.draw(angle == delta)
            }

            baseRadius -= 20
        }
    }
}
function drawFlowerRow(centerX,centerY, longRadius, phase, color){
    ctx.fillStyle = color
    // for (let angle = delta; angle < 2*Math.PI+delta; angle += Math.PI/4) {
    for (let angle = 2*Math.PI+delta+phase; angle >= delta; angle -= (Math.PI/4)) {
        const x = centerX + Math.cos(angle + Math.PI/2)*longRadius;
        const y = centerY + Math.sin(angle + Math.PI/2)*longRadius;

        const petal = new Petal(ctx, x,y,longRadius, 5, angle)
        petal.draw(angle == delta)
    }
}

var delta = 0;

function randomColorSampler(colorList) {
    const [red,green,blue] = colorList
    const max = Math.max(red, green, blue) // map 0 -> max to 0 to 255
    const multiplier = 255/max;
    p = Math.random() * 0.8 + 0.2;
    return `rgb(${red*p* multiplier}, ${green*p* multiplier}, ${blue*p* multiplier})`
}

function drawFlower(centerX, centerY, size, rows,mainColor) {
    let baseRadius = rows*20; // radius of each flower row
    // draw flower rows from outside in
    for (let row = 0; row < rows; row++) {
        const phase = row % 2 == 0 ? 0 : Math.PI/8 // alternates petal position per row
        drawFlowerRow(centerX, centerY, baseRadius*size, phase, randomColorSampler(mainColor))
        baseRadius -= 20
    }
}

f = new Flower(200, 200,1, 5,[200,100,150])
// problem every frame a new random generator is called
// we want to keep same random flower colors constant
// need to separate flower creation from moving the positions

const NUM_FLOWERS = 10;
const flowersInfo = [];
const startPoints =[
    [Math.random()*200+200, Math.random()*200],
    [Math.random()*200+canvas.width*0.6, Math.random()*200],
    [Math.random()*200+canvas.width*0.6, Math.random()*200+canvas.height*0.6],
    [Math.random()*200+200, Math.random()*200+canvas.height*0.6]

];
for (let flower = 0; flower < NUM_FLOWERS; flower+=1) {
    const flowerInfo = {
        'x': startPoints[flower%4][0] + Math.random()*50*flower - 50,//Math.random()*canvas.width*0.6 + canvas.width*0.2, 
        'y': startPoints[flower%4][1] + Math.random()*50*flower - 50,//Math.random()*canvas.height*0.6 + canvas.height*0.2, 
        'size':Math.random()*1.2 + 0.4, 
        'rows':Math.floor(Math.random()*5+3), 
        'color':[Math.random()*255+20, Math.random()*255+20, Math.random()*255+20]
    }
    flowersInfo.push(flowerInfo)
}
function drawFlowers() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    // drawFlower(200, 200,1, 3,[200,100,150])
    // drawFlower(600, 200,0.5, 4,[100,150,250])
    // drawFlower(400, 500,0.7, 5,[200,100,150])
    for (let flower = 0; flower < NUM_FLOWERS; flower+=1) [
        drawFlower(flowersInfo[flower]['x'], flowersInfo[flower]['y'], flowersInfo[flower]['size'],  flowersInfo[flower]['rows'], flowersInfo[flower]['color'])
    ]
    delta += 0.1
}

setInterval(drawFlowers, 50)

/**
 * https://www.youtube.com/watch?v=afdHgwn1XCY&list=WL&index=63&t=0s
 * 
 * png to base64 converter
 * https://onlinepngtools.com/convert-png-to-base64
 * 
 */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

//mouse features and listeners
let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener("mousemove",
    function(event){
        mouse.x = event.x + canvas.clientLeft/2;
        mouse.y = event.y + canvas.clientTop/2;
    }
);

function drawImage(){
    let imageWidth = png.width;
    let imageHeight = png.height;

    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    class Particle{
        constructor(x,y,color,size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = size,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random()*10)+2;
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;

            //lets see if the particles are close enough to the mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx/distance;
            let forceDirectionY = dy/distance;

            //max distance, past this point the force on the particle is 0
            const maxDistance = 100;
            let force = (maxDistance - distance)/maxDistance;
            if(force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6);
            let directionY = (forceDirectionY * force * this.density * 0.6);

            if(distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            }else{
                if(this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                }
                if(this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
                
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for(let y=0, y2=data.height; y<y2; y++){
            for(let x=0, x2=data.width; x<x2; x++){
                if(data.data[(y * 4 * data.width) + (x * 4) + 3] > 128){
                    let positionX = x;
                    let positionY = y;
                    let r_val = data.data[(y * 4 * data.width) + (x * 4)];
                    let g_val = data.data[(y * 4 * data.width) + (x * 4) + 1];
                    let b_val = data.data[(y * 4 * data.width) + (x * 4) + 2];
                    let color = `rgb(${r_val},${g_val},${b_val})`;
                    particleArray.push(new Particle(positionX * 4, positionY * 4, color,2));
                }
            }

        }
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0,0,innerWidth,innerHeight);

        for(let i=0; i <particleArray.length;i++){
            particleArray[i].update();
        }
    }
    init();
    animate();
    window.addEventListener("resize",
    function(event){
        canvas.width = this.innerWidth;
        canvas.height = this.innerHeight;
        init();
    });
}

const png = new Image();
png.src = "data:image/png;base64,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";

window.addEventListener("load", (event)=>{
    console.log("window has loaded");
    ctx.drawImage(png,0,0);
    drawImage();
});
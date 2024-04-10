const skeletSrc = "anim/skeleton_full.png"

// create a canvas
const canvas = document.createElement('canvas');
canvas.style.backgroundColor = 'black';
canvas.style.transform = 'scale(4)';
canvas.width = 200;
canvas.height = 200;
tileWidth = 16;
tileHeight = 16;

// get the context
const ctx = canvas.getContext('2d');

// create an image
const img = new Image();
img.src = skeletSrc;

img.onload = () => {
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(img, 0, 0, 16, 16, 100, 100, 16, 16);
}

document.body.appendChild(canvas);

const position = { x: 100, y: 100 };

const frames = {
    runRight: [
        {
            x: 0,
            y: 32,
        },
        {
            x: 16,
            y: 32,
        },
        {
            x: 32,
            y: 32,
        },
        {
            x: 48,
            y: 32,
        },
    ],
    runLeft: [
        {
            x: 0,
            y: 48,
        },
        {
            x: 16,
            y: 48,
        },
        {
            x: 32,
            y: 48,
        },
        {
            x: 48,
            y: 48,
        },
    ],
    idleRight: [
        {
            x: 0,
            y: 0,
        },
        {
            x: 16,
            y: 0,
        },
        {
            x: 32,
            y: 0,
        },
        {
            x: 48,
            y: 0,
        },
    ],
    idleLeft: [
        {
            x: 0,
            y: 16,
        },
        {
            x: 16,
            y: 16,
        },
        {
            x: 32,
            y: 16,
        },
        {
            x: 48,
            y: 16,
        },
    ],
}

let lastdir = 'right';
let animation = 'idleRight';
stopIdle = false;
const move = (dir) => {
    const maxPosX = position.x + 16; // one tile width
    const maxPosY = position.y + 16; // one tile height
    const minPosX = position.x - 16; // one tile width
    const minPosY = position.y - 16; // one tile height
    let frame = 0;
    let refreshes = 0;
    stopIdle = true;
    const animateRight = () => {
        animation = 'runRight'
        const animationFrames = frames[animation];
        position.x += 1;
        refreshes++;
        console.log(refreshes)
        if (refreshes % 4 === 0) {
            frame++;
            if (frame > 3) {
                frame = 0;
            }
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, animationFrames[frame].x, animationFrames[frame].y, 16, 16, position.x, position.y, 16, 16);

        if (position.x < maxPosX) {
            requestAnimationFrame(animateRight);
        }
        else {
            stopIdle = false;
            idle();
        }
    };
    const animateLeft = () => {
        animation = 'runLeft'
        const animationFrames = frames[animation];
        position.x -= 1;
        refreshes++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, animationFrames[frame].x, animationFrames[frame].y, 16, 16, position.x, position.y, 16, 16);
        console.log(refreshes)


        if (refreshes % 4 === 0) {
            frame++;
            if (frame > 3) {
                frame = 0;
            }
        }
        if (position.x > minPosX) {
            requestAnimationFrame(animateLeft);
        }
        else {
            stopIdle = false;
            idle();
        }
    };
    const animateUp = () => {
        if (lastdir === 'right') animation = 'runRight';
        else animation = 'runLeft';
        const animationFrames = frames[animation];

        position.y -= 1;
        refreshes++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, animationFrames[frame].x, animationFrames[frame].y, 16, 16, position.x, position.y, 16, 16);
        console.log(refreshes)

        if (refreshes % 4 === 0) {
            frame++;
            if (frame > 3) {
                frame = 0;
            }
        }
        if (position.y > minPosY) {
            requestAnimationFrame(animateUp);
        }
        else {
            stopIdle = false;
            idle();
        }
    }
    const animateDown = () => {

        if (lastdir === 'right') animation = 'runRight';
        else animation = 'runLeft';
        const animationFrames = frames[animation];
        position.y += 1;
        refreshes++; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, animationFrames[frame].x, animationFrames[frame].y, 16, 16, position.x, position.y, 16, 16);
        console.log(refreshes)

        if (refreshes % 4 === 0) {
            frame++;
            if (frame > 3) {
                frame = 0;
            }
        }
        if (position.y < maxPosY) {
            requestAnimationFrame(animateDown);
        }
        else {
            stopIdle = false;
            idle();
        }
    }

    switch (dir) {
        case 'right':
            animateRight();
            lastdir = 'right';

            break;
        case 'left':
            animateLeft();
            lastdir = 'left';
            break;
        case 'up':
            animateUp();
            break;
        case 'down':
            animateDown();
            break;
    }

    if (lastdir === 'right') {
        animation = 'idleRight';
    }
    else {
        animation = 'idleLeft';
    }
}

const idle = () => {
    // animate idle state
    if (lastdir === 'right') {
        animation = 'idleRight';
    }
    else {
        animation = 'idleLeft';
    }

    const animationFrames = frames[animation];

    let frame = 0;

    const animate = () => {
        if (stopIdle) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, animationFrames[frame].x, animationFrames[frame].y, 16, 16, position.x, position.y, 16, 16);
        frame++;
        console.log("drawinIdle")
        if (frame > 3) {
            frame = 0;
        }
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / 8);
    }

    animate();
}

window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowRight') {
        move("right");
    }
    if (e.key === 'ArrowLeft') {
        move("left");
    }
    if (e.key === 'ArrowUp') {
        move("up");
    }
    if (e.key === 'ArrowDown') {
        move("down");
    }
});

idle();
    
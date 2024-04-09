class Sprite {
  constructor({ position, imageSrc, frameRate = 1, frameBuffer = 5, ctx }) {
    this.ctx = ctx
    this.position = position;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width / this.frameRate;
      this.height = this.image.height;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrame = 0;
  }

  draw() {
    if (!this.image) return;

    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.width,
      height: this.height,
    };

    this.ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrame++;

    if (this.elapsedFrame % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}

export default Sprite;
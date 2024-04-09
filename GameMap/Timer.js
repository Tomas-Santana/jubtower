class Timer {
  #lastTime;
  #actualTime;
  constructor() {
    this.#lastTime = 0;
  }

  loop(wnd) {
    this.wnd = wnd;
    const loop = (time) => {
      this.#actualTime = (time - this.#lastTime) / 1000;
      this.#lastTime = time;
      // console.log(this.deltaTime)
      this.wnd.requestAnimationFrame(loop);
    };
    loop(0);
  }

  get deltaTime() {
    return this.#actualTime;
  }
}

export default new Timer(window);

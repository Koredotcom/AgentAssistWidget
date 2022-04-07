
export default class Timeout {

    timerId;
    start;
    remaining;
    callback;

    pause = () => {
        window.clearTimeout(this.timerId);
        this.remaining -= Date.now() - this.start;
    }

    resume = () => {
        this.start = Date.now();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(this.callback, this.remaining);
    }

    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;

        this.resume();
    }
}

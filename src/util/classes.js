export class Delayer {
    constructor() {
        this.delayed = [];
    }
    delay(callback, { priority }) {
        this.delayed.push([priority, callback]);
        let j = this.delayed.length - 1;
        while (j >= 1 && this.delayed[j - 1][0] > this.delayed[j][0]) {
            let temp = this.delayed[j - 1];
            this.delayed[j - 1] = this.delayed[j];
            this.delayed[j] = temp;
            j--;
        }
    }
    force() {
        for (let item of this.delayed) {
            item[1]();
        }
        this.delayed = [];
    }
}
//# sourceMappingURL=classes.js.map
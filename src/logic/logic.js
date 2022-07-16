export default class Logic {

    constructor() {
        this.player = null;
        this.reset();
    }

    reset() {
        this.goalReached = false;
        this.numbersCollected = new Set();
        this.numbersCollected.add(1);
        this.goalNumbers = new Set();
        for (let i = 1; i <= 6; ++i) {
            this.goalNumbers.add(i);
        }
    }

    setPlayer(player) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    setGoalReached(value) {
        this.goalReached = value;
        console.log(value ? "goal reached" : "goal left");
        if (value && !this.isFinished()) {
            console.log("still missing numbers");
        }
    }

    addNumber(number) {
        this.numbersCollected.add(n);
    }

    hasAllNumbers() {
        for (const n of this.goalNumbers) {
            if (!this.numbersCollected.has(n)) {
                return false;
            }
        }
        return true;
    }

    isFinished() {
        return this.goalReached && this.hasAllNumbers();
    }
}
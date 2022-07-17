export default class Logic {

    constructor() {
        this.player = null;
        this.settings = null;
        this.reset();
    }

    reset() {
        this.goalReached = false;
        this.numbersCollected = new Set();
        this.goalNumbers = new Set();

        if (this.settings !== null) {
            this.settings.startNumbers.forEach(n => {
                this.numbersCollected.add(n);
            });
            this.settings.goalNumbers.forEach(n => {
                this.goalNumbers.add(n);
            });
        }
    }

    initSettings(settings) {
        this.settings = settings;
        this.reset();
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
        if (value && !this.isOver()) {
            console.log("still missing numbers");
        }
    }

    addNumber(n) {
        this.numbersCollected.add(n);
        console.log("number " + n + " has been added to the dice");
    }

    hasAllNumbers() {
        for (const n of this.goalNumbers) {
            if (!this.numbersCollected.has(n)) {
                return false;
            }
        }
        return true;
    }

    isOver() {
        return this.goalReached && this.hasAllNumbers();
    }
}
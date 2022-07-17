import CONSTRAINTS from "./enums/constraints";
import REAL_DICE from "./enums/real-dice";

export default class Logic {

    constructor() {
        this.player = null;
        this.dice = null;
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
            this.constraints = this.settings.constraints;
        }
    }

    init(settings, player) {
        this.settings = settings;
        this.reset();
        this.setPlayer(player);
    }

    setPlayer(player) {
        this.player = player;
        this.dice = player.getComponent("Dice");
        let i = 0;
        this.numbersCollected.forEach(n=> {
            this.dice.addNumber(n, i++ == this.numbersCollected.size-1);
        });
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

    canAddNumber(direction, number) {
        return this.dice.goalNumberFromDirection(direction) === number;
    }

    addNumber(direction, number) {
        if (this.canAddNumber(direction, number)) {
            return this.addNumberDirect(number);
        }
        return false;
    }

    addNumberDirect(number) {
        console.log("number " + number + " wan be added");
        this.numbersCollected.add(number);
        this.dice.addNumber(number);
        return true;
    }

    hasAllNumbers() {
        for (const n of this.goalNumbers) {
            if (!this.numbersCollected.has(n)) {
                return false;
            }
        }
        return true;
    }

    diceFaceHasNumber(index, number) {
        return this.dice.getFaceNumber(index) === number;
    }

    testConstraint(constraint) {
        switch(constraint) {
            case CONSTRAINTS.LIKE_REAL_DICE: {
                return Object.entries(REAL_DICE[0]).every(([i, v]) => {
                    return this.diceFaceHasNumber(i, v)
                });
            }
        }
    }

    testAllConstraints() {
        return this.constraints.every(c => this.testConstraint(c));
    }

    isOver() {
        return this.goalReached && this.hasAllNumbers() && this.testAllConstraints();
    }
}
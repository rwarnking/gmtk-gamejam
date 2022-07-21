import GAME from "./globals";
import CONSTRAINTS from "../logic/enums/constraints";

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
        this.numbersCollected.forEach(n=> this.dice.addNumberOnly(n));
        this.dice.updateTextures();
    }

    getPlayer() {
        return this.player;
    }

    setGoalReached(value) {
        this.goalReached = value;
        console.log(value ? "goal reached" : "goal left");
        if (value && !this.isOver()) {
            GAME.audio().playEffect("FAIL");
            console.log("still missing numbers");
        }
    }

    canAddNumber(number) {
        if (this.constraints.includes(CONSTRAINTS.LIKE_REAL_DICE)) {
            if (this.dice.moreThanOneBottomOption()) {
                return this.dice.canAddNumber(number, true) &&
                    this.dice.getBottomOptions().includes(number);
            }
            return this.dice.canAddNumber(number, true);
        }
        return this.dice.canAddNumber(number);
    }

    addNumber(number) {
        if (this.canAddNumber(number)) {
            return this.addNumberDirect(number);
        }
        return false;
    }

    addNumberDirect(number) {
        console.log("number " + number + " was added");
        this.numbersCollected.add(number);
        this.dice.addNumber(number);
        GAME.audio().playEffect("COLLECT");
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

    testConstraint(constraint) {
        switch(constraint) {
            default: return true;
        }
    }

    testAllConstraints() {
        return this.constraints.every(c => this.testConstraint(c));
    }

    isOver() {
        return this.goalReached && this.hasAllNumbers() && this.testAllConstraints();
    }
}
function Sounds() {
    const self = this;

    this.select = new Audio('sounds/select.mp3');
    this.unselect = new Audio('sounds/unselect.wav');
    this.pair = new Audio('sounds/success.wav');


    this.playSelect = function() {
        self.select.currentTime = 0;
        self.select.play();
    }

    this.playUnselect = function() {
        self.unselect.currentTime = 0;
        self.unselect.play();
    }

    this.playPair = function() {
        self.pair.currentTime = 0;
        self.pair.play();
    }
}
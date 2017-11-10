function Interface(context) {
    let self = this;
    
    this.context = context;
    
    this.widgets = [];
    this.clickables = [];

    this.draw = function() {
        self.widgets.forEach((widget) => { widget.draw(self.context); })
    }

    this.reactClick = function(x, y) {
        self.clickables.forEach((widget) => { widget.reactClick(x, y); });
    }

    this.addButton = function(button) {
        self.widgets.push(button);
        self.clickables.push(button);
    }

    this.addWidget = function(widget) {
        self.widgets.push(widget);
    }
}

function Button(box, label, onClick) {
    const self = this;

    this.box = box;
    this.label = label;
    this.onClick = onClick;
    this.gradient = null;
    

    this.reactClick = function(x, y) {
        if (x >= self.box.x && x <= self.box.x + self.box.width && y >= self.box.y && y <= self.box.y + self.box.height) {
            self.onClick();
        }
    }

    this.draw = function(context) {
        if (!self.gradient) {
            self.gradient = context.createLinearGradient(0, 0, 1200, 800);
            self.gradient.addColorStop(0, '#E0BA7E');
            self.gradient.addColorStop(1, 'white');
        }

        context.beginPath();

        // Draw button back
        context.strokeStyle = '#DBA852';
        context.fillStyle = self.gradient;
        context.rect(self.box.x, self.box.y, self.box.width, self.box.height);
        context.fill();
        context.stroke();

        // Draw button text
        context.fillStyle = '#DBA852';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = '40px Comic Sans MS';
        context.fillText(self.label, self.box.x + self.box.width / 2, self.box.y + self.box.height / 2 + 4);
    }
}

function Box(box, color, alpha) {
    const self = this;

    this.box = box;
    this.color = color;
    this.alpha = alpha;

    this.draw = function(context) {
        context.fillStyle = self.color;
        context.globalAlpha = self.alpha;
        context.fillRect(self.box.x, self.box.y, self.box.width, self.box.height);
        context.globalAlpha = 1.0;
    }
}

function Text(pos, text, font) {
    const self = this;

    this.pos = pos;
    this.text = text;
    this.font = font;

    this.draw = function(context) {
        // Draw button text
        context.strokeStyle = 'black';
        context.fillStyle = '#DBA852';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = self.font;
        context.fillText(self.text, self.pos.x, self.pos.y);
    }
}

function DynamicText(pos, font, textQuery) {
    const self = this;

    this.pos = pos;
    this.font = font;
    this.textQuery = textQuery;

    this.draw = function(context) {
        // Draw button text
        context.strokeStyle = 'black';
        context.fillStyle = '#DBA852';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = self.font;
        context.fillText(self.textQuery(), self.pos.x, self.pos.y);
    }
}
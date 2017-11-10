const raw_layout = "..#.#.#.#.#.#.#.#.#.#.#.#....\n.............................\n......#.#.#.#.#.#.#.#........\n.............................\n....#.#.#.#.#.#.#.#.#.#......\n.............................\n..#.#.#.#.#.#.#.#.#.#.#.#....\n#.........................#.#\n..#.#.#.#.#.#.#.#.#.#.#.#....\n.............................\n....#.#.#.#.#.#.#.#.#.#......\n.............................\n......#.#.#.#.#.#.#.#........\n.............................\n..#.#.#.#.#.#.#.#.#.#.#.#....|.............................\n.............................\n........#.#.#.#.#.#..........\n.............................\n........#.#.#.#.#.#..........\n.............................\n........#.#.#.#.#.#..........\n.............................\n........#.#.#.#.#.#..........\n.............................\n........#.#.#.#.#.#..........\n.............................\n........#.#.#.#.#.#..........\n.............................\n.............................|.............................\n.............................\n.............................\n.............................\n..........#.#.#.#............\n.............................\n..........#.#.#.#............\n.............................\n..........#.#.#.#............\n.............................\n..........#.#.#.#............\n.............................\n.............................\n.............................\n.............................|.............................\n.............................\n.............................\n.............................\n.............................\n.............................\n............#.#..............\n.............................\n............#.#..............\n.............................\n.............................\n.............................\n.............................\n.............................\n.............................|.............................\n.............................\n.............................\n.............................\n.............................\n.............................\n.............................\n.............#...............\n.............................\n.............................\n.............................\n.............................\n.............................\n.............................\n.............................";

function parseLayout() {
    var layout = [];

    let layer_width = null;
    let layer_height = null;

    var layers = raw_layout.split("|");
    for (let layer_i = 0; layer_i < layers.length; layer_i++) {
        let layer_holder = [];
        let layer = layers[layer_i];

        // Get lines from layer
        let lines = layer.split("\n");

        // Ensure all layers are the same height
        if (!layer_height) {
            // Determine correct layer height from first layer
            layer_height = lines.length;
        } else {
            // Ensure other layers are the same height
            if (layer_height !== lines.length) {
                console.error('Error parsing data, unmatching layer heights');
                return null;
            }
        }

        // Iterate through lines
        for (let line_i = 0; line_i < lines.length; line_i++) {
            let line_holder = [];
            let line = lines[line_i];

            // Ensure all rows are the same width
            if (!layer_width) {
                //Determine correct layer width from first row
                layer_width = line.length;
            } else {
                // Ensure other rows are the same width
                if (layer_width !== line.length) {
                    console.error('Error parsing data, unmatching layer widths');
                    return null;
                }
            }

            // Process a line
            for (let letter_i = 0; letter_i < line.length; letter_i++) {
                if (line[letter_i] === "#") {
                    line_holder.push(1);
                } else if (line[letter_i] === "."){
                    line_holder.push(0);
                }
                else {
                    console.log('Illegal symbol: ' + line[letter_i]);
                }
            }

            layer_holder.push(line_holder);
        }

        layout.push(layer_holder);
    }

    let info = analyzeLayout(layout);
    info.layer_width = layer_width;
    info.layer_height = layer_height;

    return {info: info, data: layout};
}

function analyzeLayout(layout) {
    let left = null;
    let right = null;
    let top = null;
    let bottom = null;

    let tiles_needed = 0;
    for (let layer_i = 0; layer_i < layout.length; layer_i++) {
        let layer = layout[layer_i];

        // Go through rows of layer
        for (let row_i = 0; row_i < layer.length; row_i++) {
            let row = layer[row_i];

            // Go through values in row
            for (let value_i = 0; value_i < row.length; value_i++) {
                let value = row[value_i];
                
                if (value === 1) {
                    tiles_needed++;

                    // Set top
                    if (!top || top > row_i) {
                        top = row_i;
                    }

                    // Set bottom
                    if (!bottom || bottom < row_i) {
                        bottom = row_i;
                    }

                    // Set left
                    if (!left || left > value_i) {
                        left = value_i;
                    }

                    // Set right
                    if (!right || right < value_i) {
                        right = value_i;
                    }
                }
            }
        }
    }

    return { 
        tiles_needed: tiles_needed,
        left: left,
        right: right,
        top: top,
        bottom: bottom
    };
}
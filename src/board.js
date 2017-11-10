function Board() {
    const self = this;

    // Variables
    this.layers = [];

    // General size data
    this.layer_count = null;
    this.layer_width = null;
    this.layer_height = null;

    this.available_tiles = [];
    this.available_moves = null;

    this.tiles_left = 0;

    // Constructs a board with a deck of tiles and a layout plan
    this.init = function(deck, layout) {
        console.log('  Initializing board\n');

        // Remember layer width and height
        self.layer_count = layout.data.length;
        self.layer_height = layout.info.layer_height;
        self.layer_width  = layout.info.layer_width;

        // Make sure deck is correctly sized for the layout
        if (layout.info.tiles_needed !== deck.tile_list.length) {
            console.log('Layout requires ' + required_tiles + ', deck has ' + deck.tile_list.length + ' tiles.');
            return;
        }

        // Reset layers array size
        self.layers.length = 0;

        // Read data from layout
        for (let l_i = 0; l_i < self.layer_count; l_i++) {
            // Initialize holder for layer data
            let layer_holder = [];

            for (let r_i = 0; r_i < self.layer_height; r_i++) {
                // Initialize holder for row data
                let row_holder = [];
                
                for (let v_i = 0; v_i < self.layer_width; v_i++) {
                    if (layout.data[l_i][r_i][v_i] === 1) { 
                        // Fetch tile fro deck
                        let tile = deck.popTile();
                        tile.pos = [l_i, r_i, v_i]; // Add pos to tile

                        // push tile to correct position
                        row_holder.push(tile); 
                    }
                    else { 
                        row_holder.push(null);
                    }
                }

                // Push data from temporary holder to temporary layer holder
                layer_holder.push(row_holder);
            }

            // Push data from temporary layer holder to more permanent layers holder
            self.layers.push(layer_holder);
        }

        // Update initial availability
        self.updateTileAvailability();
    }

    // Getter for tiles
    this.getTile = function(layer, j, i) {
        if (layer >= 0 && i >= 0 && j >= 0 && layer < self.layers.length && i < self.layer_width && j < self.layer_height) {
            return self.layers[layer][j][i];
        }
        return null;
    }
    this.getTileWithArray = function(collection) {
        return self.getTile(collection[0], collection[1], collection[2]);
    }

    // Setter for tiles
    this.setTile = function(l_i, r_i, v_i, value) {
        if (l_i >= 0 && r_i >= 0 && v_i >= 0 && l_i < self.layer_count && r_i < self.layer_height && v_i < self.layer_width) {
            self.layers[l_i][r_i][v_i] = value;
        }
        else {
            console.log('Tried to assign out of bounds: [<' + l_i + '>, <' + r_i + '>, <' + v_i + '>]');
        }
    }

    // Remove tile
    this.removeTile = function(l_i, r_i, v_i, updateAvailability) {
        self.setTile(l_i, r_i, v_i, null);

        if (updateAvailability) {
            self.updateTileAvailability();
        }
    }

    this.removeTileWithArray = function(collection, updateAvailability) {
        this.removeTile(collection[0], collection[1], collection[2], updateAvailability);
    }

    this.isTileOpen = function(tile) {
        // Check sides
        let left_tile  = self.getTile(tile.pos[0], tile.pos[1] - 1, tile.pos[2] - 2) ||
                         self.getTile(tile.pos[0], tile.pos[1]    , tile.pos[2] - 2) || 
                         self.getTile(tile.pos[0], tile.pos[1] + 1, tile.pos[2] - 2);
        
        let right_tile  = self.getTile(tile.pos[0], tile.pos[1] - 1, tile.pos[2] + 2) ||
                          self.getTile(tile.pos[0], tile.pos[1]    , tile.pos[2] + 2) || 
                          self.getTile(tile.pos[0], tile.pos[1] + 1, tile.pos[2] + 2);

        let same_layer = left_tile && right_tile;

        // Check above
        let upper_layer = false;
        for (let i_offset = -1; i_offset <= 1; i_offset++) {
            for (let j_offset = -1; j_offset <= 1; j_offset++) {
                if (self.getTile(tile.pos[0] + 1, tile.pos[1] + j_offset, tile.pos[2] + i_offset)) {
                    upper_layer = true;
                }
            }
        }

        // Save neighbours
        tile.neighbours = {
            left: left_tile,
            right: right_tile,
            above: upper_layer
        };

        // Return combined result
        return !same_layer && !upper_layer;
    }

    // Highlight now available tiles
    this.updateTileAvailability = function() {
        self.tiles_left = 0;
        self.available_tiles.length = 0;

        self.forEachTile((tile, l_i, r_i, v_i) => {
            if (self.isTileOpen(tile)) { 
                tile.available = true;  
                
                // Push tile to collection
                self.available_tiles.push(tile);
            }
            else { 
                tile.available = false; 
            }

            self.tiles_left++;

            return false;
        });

        // Find available moves
        self.available_moves = 0;
        for (let i = 0; i < self.available_tiles.length - 1; i++) {
            for (let j = i + 1; j < self.available_tiles.length; j++) {
                if (i !== j && self.available_tiles[i].matches(self.available_tiles[j])) {
                    self.available_moves++;
                };
            }
        }

        console.log('Tiles left     : ' + self.tiles_left);
        console.log('Available moves: ' + self.available_moves);
    }

    this.forEachTile = function(operation, top_down=false) {
        if (!top_down) {
            for (let l_i = 0; l_i < self.layer_count; l_i++) {
                for (let r_i = 0; r_i < self.layer_height; r_i++) {
                    for (let v_i = 0; v_i < self.layer_width; v_i++) {
                        if (self.layers[l_i][r_i][v_i] && operation(self.layers[l_i][r_i][v_i], l_i, r_i, v_i)) { return; }
                    }
                }
            }
        } else {
            for (let l_i = self.layer_count - 1; l_i >= 0; l_i--) {
                for (let r_i = 0; r_i < self.layer_height; r_i++) {
                    for (let v_i = 0; v_i < self.layer_width; v_i++) {
                        if (self.layers[l_i][r_i][v_i] && operation(self.layers[l_i][r_i][v_i], l_i, r_i, v_i)) { return; }
                    }
                }
            }
        }
    }
    
    this.forEachTileInDrawOrder = function(operation) {
        for (let l_i = 0; l_i <self.layer_count; l_i++) {
            for (let v_i = self.layer_width - 1; v_i >= 0; v_i--) {
                for (let r_i = 0; r_i < self.layer_height; r_i++) {
                    if (self.layers[l_i][r_i][v_i] && operation(self.layers[l_i][r_i][v_i], l_i, r_i, v_i)) { return;}
                }
            }
        }
    }
}
const SELECTION_SIZE = 16;

function Game(drawer, sounds, animation_manager) {
    const self = this;
    this.board = new Board();

    this.drawer = drawer;
    this.sounds = sounds;
    this.animation_manager = animation_manager;

    this.selection = null;

    this.score = null;
    this.no_more_moves = null;
    this.no_more_tiles = null;

    this.init = function(deck, layout) {
        self.animation_manager.clear();

        self.score = 0;
        self.no_more_moves = false;
        self.no_more_tiles = false;

        self.selection = null;

        // Calculate global offset from layout
        self.drawer.calculateGlobalOffset(layout.info);

        // Initialize a board with the provided deck and layout
        self.board.init(deck, layout);
    }

    this.draw = function() {
        // Draw tiles
        self.board.forEachTileInDrawOrder((tile, l_i, r_i, v_i) => {
            if (self.selection && boardPositionsMatch(self.selection.pos, [l_i, r_i, v_i])) {
                let b_box = self.drawer.getBoundingBox(l_i, r_i, v_i, SELECTION_SIZE);
                self.drawer.drawTile(tile, b_box);
            } else {
                let b_box = self.drawer.getBoundingBox(l_i, r_i, v_i);
                self.drawer.drawTile(tile, b_box);
            }
                
            return false;
        });
    }
    
    this.reactClick = function(x, y) {
        self.board.forEachTile((tile, l_i, r_i, v_i) => {
            if (!tile.available) {
                return false;
            }

            if (pointInBox(x, y, self.drawer.getBoundingBox(l_i, r_i, v_i))) {
                self.tileClicked(tile);
                return true;
            }

            return false;
        }, true);
    }

    this.tileClicked = function(future_selection) {
        if (!self.selection) {
            // No tiles selected
            self.selectTile(future_selection);
        }
        else if (boardPositionsMatch(self.selection.pos, future_selection.pos)) {
            // Selected tile that was already selected
            console.log('Selecting previously selected tile');
            self.unselectTile();
        }
        else {
            // Another tile previously selected
            console.log('Selecting another tile');

            // Check if the new selected tile is the same as previous
            if (self.selection.matches(future_selection)) {
                // Matching tile, remove both
                self.selectPair(self.selection, future_selection);   
            } 
            else {
                // Old and future tile did not match, select the future tile
                self.selectTile(future_selection);
            }
        }
    }

    this.unselectTile = function() {
        // Play funny sound
        self.sounds.playUnselect();

        console.log('Unselecting tile: ' + self.selection);
        self.selection = null;
    }

    this.selectTile = function(future_tile) {
        // Play funny sound
        self.sounds.playSelect();

        console.log('Selecting tile: ' + future_tile.pos);
        self.selection = future_tile; 
    }

    this.selectPair = function(old_selection, future_selection) {
        // Play funny sound
        self.sounds.playPair();
        console.log('Removing matching symbols\n'); 

        // Remove tiles from board
        this.board.removeTileWithArray(old_selection.pos   , false);
        this.board.removeTileWithArray(future_selection.pos, true );

         // Update game status
        if (self.board.available_moves === 0) { self.no_more_moves = true; }
        if (self.board.tiles_left      === 0) { self.no_more_tiles = true; }  

         // Animate tile removals
        if (!self.no_more_moves) {
            self.animateTileRemoval(old_selection   , 20);
            self.animateTileRemoval(future_selection, 20);
        }

        self.score +=    old_selection.pos[0] + 1;
        self.score += future_selection.pos[0] + 1;

        self.selection = null;
    }

    this.animateTileRemoval = function(tile, refreshes) {
        let canvas_pos = self.drawer.getPositionWithArray(tile.pos);
        
        let end_point = {x: 600, y:canvas_pos.y};
        if (tile.neighbours) {
            if (tile.neighbours.left) {
                end_point.x = 1300;
            } else if (tile.neighbours.right) {
                end_point.x = -100;
            } else {
                if (tile.pos[2] > self.board.layer_width / 2) {
                    end_point.x = 1300;
                } else {
                    end_point.x = -100;
                }
            }
        }

        let curwe = new BezierCurwe([
            canvas_pos, 
            {x: (canvas_pos.x + end_point.x) / 2, y: canvas_pos.y},
            end_point]);
        
        // Animate tile removal
        let new_animation = new Animation(tile, curwe, refreshes);

        // Register new animation with manager
        animation_manager.addAnimation(new_animation);
    }
}

function pointInBox(x, y, box) {
    return x >= box[0] && x <= box[0] + box[2] && y >= box[1] && y <= box[1] + box[3];
}

function boardPositionsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
const TILE_BACK = [8, 10];
const TILE_PAD = 4;
const INDEX_OFFSET = {x:7, y:7};

function Drawer(canvas, context, bg, tileset, tile_size, actual_size, canvas_size) {
    const self = this;

    this.canvas = canvas;
    this.context = context;
    this.bg = bg;
    this.tileset = tileset;

    this.tile_size = tile_size;
    this.actual_size = actual_size;
    this.canvas_size = canvas_size;

    this.global_offset = {x:0, y:0};

    this.clear = function() {
        self.context.clearRect(0, 0, self.canvas.width, canvas.height);
        self.context.drawImage(self.bg, 0, 0, self.canvas.width, self.canvas.height);
    }

    this.drawTile = function(tile, bounding_box) {  
        if (tile.available) {
            // Draw tile background
            self.context.drawImage(self.tileset,
                self.tile_size.width * TILE_BACK[0], self.tile_size.height * TILE_BACK[1], self.tile_size.width, self.tile_size.height,
                bounding_box[0], bounding_box[1], bounding_box[2], bounding_box[3]);

            // Draw tile symbol
            self.context.drawImage(self.tileset,
                self.tile_size.width * tile.x, self.tile_size.height * tile.y, self.tile_size.width, self.tile_size.height,
                bounding_box[0], bounding_box[1], bounding_box[2], bounding_box[3]);
        } else {
            // Draw tile background
            self.context.drawImage(self.tileset,
                self.tile_size.width * TILE_BACK[0], self.tile_size.height * (TILE_BACK[1] - 1), self.tile_size.width, self.tile_size.height,
                bounding_box[0], bounding_box[1], bounding_box[2], bounding_box[3]);

            // Draw tile symbol
            self.context.drawImage(self.tileset,
                self.tile_size.width * tile.x, self.tile_size.height * (tile.y - 1), self.tile_size.width, self.tile_size.height,
                bounding_box[0], bounding_box[1], bounding_box[2], bounding_box[3]);
        }
    }

    this.getPosition = function(layer, j, i) {
        return {
            x: i * (self.actual_size.width  / 2 - TILE_PAD) + layer * INDEX_OFFSET.x + self.global_offset.x,
            y: j * (self.actual_size.height / 2 - TILE_PAD) - layer * INDEX_OFFSET.y + self.global_offset.y
        };
    }
    this.getPositionWithArray = function(collection) {
        return self.getPosition(collection[0], collection[1], collection[2]);
    }

    this.getBoundingBoxBasic = function(pos) {
        return [pos.x, pos.y, self.actual_size.width, self.actual_size.height];
    }

    this.getBoundingBox = function(layer, j, i, size_mod=0, offset={x: 0, y: 0}) {
        return [
            i * (self.actual_size.width  / 2 - TILE_PAD)            + layer * INDEX_OFFSET.x + offset.x + self.global_offset.x,
            j * (self.actual_size.height / 2 - TILE_PAD) - size_mod - layer * INDEX_OFFSET.y + offset.y + self.global_offset.y,
            self.actual_size.width  + size_mod,
            self.actual_size.height + size_mod
        ]
    }
    
    this.calculateGlobalOffset = function(layout_info) {
        let width  = layout_info.right  - layout_info.left;
        let height = layout_info.bottom - layout_info.top;

        self.global_offset.x = (-width  / 2 - layout_info.left) * (self.actual_size.width  / 2 - TILE_PAD) + self.canvas_size.width  / 2;
        self.global_offset.y = (-height / 2 - layout_info.top ) * (self.actual_size.height / 2 - TILE_PAD) + self.canvas_size.height / 2;
    };
}
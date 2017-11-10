function AnimationManager(drawer) {
    const self = this;

    this.drawer = drawer;
    this.anims = [];


    this.clear = function() {
        self.anims.length = 0;
    }

    this.addAnimation = function(anim) {
        if (anim) {
            self.anims.push(anim);
        } else {
            console.log('Received undefined animation');
        }
    }

    this.refresh = function() {
        for (let i = self.anims.length - 1; i >= 0; i--) {
            let done = self.anims[i].draw(self.drawer);

            if (done) {
                self.anims.splice(i, 1);
            }
        }
    }
}

function Animation(drawable, bezier_curwe, refreshes, next=null) {
    var self = this;

    this.drawable = drawable;
    this.bezier_curwe = bezier_curwe;
    
    this.original_refreshes = refreshes;
    this.refreshes = refreshes;

    this.draw = function(drawer) {
        if (self.refreshes <= 0) {
            // Call after animation function if one is defined
            if (self.next) {
                self.next();
            }

            // Return false so animation manager knows to destroy this
            return true;
        }
        else {
            // Reduce number of refreshes by one
            self.refreshes -= 1;
            
            // Draw drawable to the correct position
            self.drawable.draw(drawer, self.bezier_curwe.getPoint(self.refreshes / self.original_refreshes));

            // Still processing animation, no need to destroy
            return false;
        }
       
    }
}
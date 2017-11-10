function BezierCurwe(points) {
    if (points.length != 3) {
        console.log('Cannot initialize this bezier implementation without 3 points');
    } else {
        const self = this;

        this.s = points[0];
        this.m = points[1];
        this.e = points[2];

        this.getPoint = function(t) {
            let x = self.s.x * Bez1(t) + self.m.x * Bez2(t) + self.e.x * Bez3(t);
            let y = self.s.y * Bez1(t) + self.m.y * Bez2(t) + self.e.y * Bez3(t);
            return {x: x, y: y};
        }
    }
}

function Bez1(t) {
    return t * t;
}
function Bez2(t) {
    return 2 * t * (1 - t);
}
function Bez3(t) {
    return (1 - t) * (1 - t);
}
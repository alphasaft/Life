import { Vector } from "./base";
import { Force } from "./force";
export class PhysicalSystem {
    constructor(objects) {
        this.objects = objects;
    }
    update(timelapse) {
        let forces = this.objects.map((o) => o.generateForces()).flat();
        let globalForce = new Force(point => forces.map(f => f.expression(point)).reduce((a, b) => a.add(b), Vector.zero));
        this.objects.forEach(it => it.update(globalForce, timelapse));
    }
    drawOn(space) {
        this.objects.forEach((it) => {
            it.drawOn(space);
        });
    }
}
//# sourceMappingURL=system.js.map
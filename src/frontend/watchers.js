import { Ref } from "./dynamic";
export function getKeywatcher(element, key) {
    let watcher = new Ref(false);
    $(document)
        .on("keydown", function (e) { if (e.key === key)
        watcher.set(true); })
        .on("keyup", function (e) { if (e.key === key)
        watcher.set(false); });
    return watcher;
}
//# sourceMappingURL=watchers.js.map
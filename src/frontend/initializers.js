export function initSpeedbar(speedBar, percentageDisplayer, valueMapper) {
    const width = speedBar.clientWidth;
    const leftX = speedBar.offsetLeft;
    $(speedBar).on("mousemove", e => {
        let value = (e.screenX - leftX) / width * speedBar.max;
        speedBar.value = value;
        percentageDisplayer.textContent = valueMapper(value);
    });
}
export function initResetButton(button, mainloopRef, mainloopProvider) {
    $(button).on("click", _ => {
        mainloopRef.get().stop();
        mainloopRef.set(mainloopProvider());
        mainloopRef.get().run();
    });
}
//# sourceMappingURL=initializers.js.map
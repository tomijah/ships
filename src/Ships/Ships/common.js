var Common = (function () {
    function Common() {
    }
    Common.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return Common;
})();
//# sourceMappingURL=common.js.map

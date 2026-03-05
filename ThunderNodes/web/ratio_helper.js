import { app } from "/scripts/app.js";

app.registerExtension({
    name: "MyNodes.RatioHelper",
    async beforeRegisterNodeDef(nodeType, nodeData) {
        if (nodeData.name === "RatioLatentNode") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);

                const ratioWidget = this.widgets.find(w => w.name === "ratio");
                const widthWidget = this.widgets.find(w => w.name === "width");
                const heightWidget = this.widgets.find(w => w.name === "height");
                const orientWidget = this.widgets.find(w => w.name === "orientation");

                // Internal state to track which dimension was modified last
                this.lastModified = "width";

                const applyRatio = (source) => {
                    if (ratioWidget.value === "Manual") return;

                    let [rW, rH] = ratioWidget.value.split(':').map(Number);
                    if (orientWidget.value === "Portrait") [rW, rH] = [rH, rW];
                    const ratio = rW / rH;

                    if (source === "width") {
                        // User changed Width -> Update Height
                        heightWidget.value = Math.round((widthWidget.value / ratio) / 8) * 8;
                    } else {
                        // User changed Height or Ratio -> Update Width
                        widthWidget.value = Math.round((heightWidget.value * ratio) / 8) * 8;
                    }
                };

                // Trigger when Width changes
                widthWidget.callback = () => {
                    this.lastModified = "width";
                    applyRatio("width");
                };

                // Trigger when Height changes
                heightWidget.callback = () => {
                    this.lastModified = "height";
                    applyRatio("height");
                };

                // Trigger when Ratio or Orientation changes
                ratioWidget.callback = () => applyRatio(this.lastModified);
                orientWidget.callback = () => applyRatio(this.lastModified);
            };
        }
    }
});
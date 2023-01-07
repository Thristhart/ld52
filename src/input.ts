import { gameWorker } from "~/gameWorkerWrapper";
import { canvas } from "~/render/loop";

function onClick() {
    gameWorker.onClick();
}

canvas.addEventListener("click", onClick);

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        canvas.removeEventListener("click", onClick);
    });
}

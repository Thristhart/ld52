import "shepherd.js/dist/css/shepherd.css";
import "~/input";
import { setupListeners } from "~/input";
import "~/style.css";
import { startMusicForSeason } from "./bgMusic";
import { Season } from "./models/season";
import { startLoop } from "./render/renderLoop";

import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";
import Shepherd from "shepherd.js";
import { gameWorker } from "./gameWorkerWrapper";

Sentry.init({
    dsn: "https://7f0991112fe64ae6a3536fc109c8c1d5@o4504471170842624.ingest.sentry.io/4504471173857280",
    integrations: [new BrowserTracing()],

    tracesSampleRate: 1.0,
});

setupListeners();
startLoop();

const tour = new Shepherd.Tour({
    useModalOverlay: true,
});
tour.addStep({
    text: "Enemies will spawn at the top of the screen...",
    attachTo: {
        element: "#spawnElement",
        on: "bottom-start",
    },
    buttons: [
        {
            text: "Next",
            action: tour.next,
        },
    ],
});
tour.addStep({
    text: "...and make their way to attack your house at the bottom.",
    attachTo: {
        element: "#destinationElement",
        on: "top-start",
    },
    buttons: [
        {
            text: "Next",
            action: tour.next,
        },
    ],
});
tour.addStep({
    text: "Purchase plants to protect your home...",
    attachTo: {
        element: "#towerlist",
        on: "left",
    },
    buttons: [
        {
            text: "Next",
            action: tour.next,
        },
    ],
});
tour.addStep({
    text: "...and survive through the winter!",
    attachTo: {
        element: "#seasonbar",
        on: "top",
    },
    buttons: [
        {
            text: "Next",
            action: tour.next,
        },
    ],
});
tour.addStep({
    text: "Enemies will avoid paths with too many plants, so harvest your plants and replant them strategically.",
    buttons: [
        {
            text: "Next",
            action: tour.next,
        },
    ],
});

function beginGame() {
    startMusicForSeason(Season.Spring);
    gameWorker.setup();
    localStorage.setItem("hasCompletedTutorial", "true");
}
tour.once("complete", beginGame);
if (localStorage.getItem("hasCompletedTutorial")) {
    beginGame();
} else {
    tour.start();
}

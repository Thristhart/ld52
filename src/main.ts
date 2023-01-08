import "~/input";
import { setupListeners } from "~/input";
import "~/style.css";
import { startMusicForSeason } from "./bgMusic";
import { Season } from "./models/season";
import { startLoop } from "./render/renderLoop";

import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
    dsn: "https://7f0991112fe64ae6a3536fc109c8c1d5@o4504471170842624.ingest.sentry.io/4504471173857280",
    integrations: [new BrowserTracing()],

    tracesSampleRate: 1.0,
});

setupListeners();
startLoop();
startMusicForSeason(Season.Spring);

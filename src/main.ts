import "~/input";
import { setupListeners } from "~/input";
import "~/style.css";
import { startMusicForSeason } from "./bgMusic";
import { Season } from "./models/season";
import { startLoop } from "./render/renderLoop";

setupListeners();
startLoop();
startMusicForSeason(Season.Spring);

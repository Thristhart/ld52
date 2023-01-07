import "~/input";
import { setupListeners } from "~/input";
import "~/style.css";
import { startLoop } from "./render/renderLoop";

setupListeners();
startLoop();

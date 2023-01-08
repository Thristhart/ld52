import { Howl } from "howler";
import BGMFallPath from "./assets/music/BGMfall.mp3";
import BGMSpringPath from "./assets/music/BGMspring.mp3";
import BGMSummerPath from "./assets/music/BGMsummer.mp3";
import { Season } from "./models/season";

let currentBGMusic: Howl;

let BGMSpring = new Howl({ src: BGMSpringPath, volume: 0.03 });
let BGMSummer = new Howl({ src: BGMSummerPath, volume: 0.03 });
let BGMFall = new Howl({ src: BGMFallPath, volume: 0.03 });

export function startMusicForSeason(season: Season) {
    switch (season) {
        case Season.Spring:
            stopCurrentMusic();
            startMusic(BGMSpring);
            break;
        case Season.Summer:
            stopCurrentMusic();
            startMusic(BGMSummer);
            break;
        case Season.Fall:
            stopCurrentMusic();
            startMusic(BGMFall);
            break;
        case Season.Winter:
            stopCurrentMusic();
            startMusic(BGMSpring); // TODO: make this Winter.
            break;
    }
}

function startMusic(track: Howl) {
    let currentBGMusic = track;
    currentBGMusic.play();
}

function stopCurrentMusic() {
    if (currentBGMusic !== undefined) currentBGMusic.stop();
}

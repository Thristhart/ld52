import { Howl } from "howler";
import BGMFallPath from "./assets/music/BGMfall.mp3";
import BGMSpringPath from "./assets/music/BGMspring.mp3";
import BGMSummerPath from "./assets/music/BGMsummer.mp3";
import BGMWinterPath from "./assets/music/BGMwinter.mp3";
import FailurePath from "./assets/music/failure.mp3";
import VictoryPath from "./assets/music/winure.mp3";
import { Season } from "./models/season";

let currentBGMusic: Howl;

let BGMSpring = new Howl({ src: BGMSpringPath, volume: 0.03 });
BGMSpring.loop(true);
let BGMSummer = new Howl({ src: BGMSummerPath, volume: 0.03 });
BGMSummer.loop(true);
let BGMFall = new Howl({ src: BGMFallPath, volume: 0.03 });
BGMFall.loop(true);
let BGMWinter = new Howl({ src: BGMWinterPath, volume: 0.03 });
BGMWinter.loop(true);
let Failure = new Howl({ src: FailurePath, volume: 0.03 });
let Victory = new Howl({ src: VictoryPath, volume: 0.03 });

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
            startMusic(BGMWinter);
            break;
    }
}

export function startFailureMusic() {
    if (currentBGMusic != Failure) {
        stopCurrentMusic();
        startMusic(Failure);
    }
}

export function startVictoryMusic() {
    if (currentBGMusic != Victory) {
        stopCurrentMusic();
        startMusic(Victory);
    }
}

function startMusic(track: Howl) {
    currentBGMusic = track;
    currentBGMusic.play();
}

function stopCurrentMusic() {
    if (currentBGMusic !== undefined) currentBGMusic.stop();
}

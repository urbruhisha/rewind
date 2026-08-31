const audioPlayer = new Audio();

let currentSong = null;
let currentCardButton = null;
let repeatOne = false;
let shuffleOn = false;

const playerToggle = document.querySelector(".player-toggle");
const playerCover = document.querySelector(".player-cover img");
const playerTitle = document.querySelector(".player-song-title");
const playerArtist = document.querySelector(".player-song-artist");
const playerDuration = document.querySelector(".player-duration");

const progressBar = document.querySelector(".player-progress-bar");
const currentTimeDisplay = document.querySelector(".player-current-time");
const volumeSlider = document.querySelector(".volume-slider");

const previousButton = document.querySelector(".player-previous");
const nextButton = document.querySelector(".player-next");
const repeatButton = document.querySelector(".player-repeat");
const shuffleButton = document.querySelector(".player-shuffle");

const nowSpinning = document.querySelector(".now-spinning");
const nowSpinningCover = document.querySelector("#now-spinning-cover");
const nowSpinningTitle = document.querySelector("#now-spinning-title");
const nowSpinningArtist = document.querySelector("#now-spinning-artist");
const nowSpinningGenre = document.querySelector("#now-spinning-genre");
const nowSpinningStatus = document.querySelector("#now-spinning-status");
const nowSpinningCurrentTime = document.querySelector("#now-spinning-current-time");
const nowSpinningDuration = document.querySelector("#now-spinning-duration");
const nowSpinningProgressFill = document.querySelector("#now-spinning-progress-fill");

const favoritesVinyl =document.querySelector(".favorites-vinyl");
const favoritesVinylCover = document.querySelector("#favorites-vinyl-cover");
const favoritesVinylPlaceholder = document.querySelector(".favorites-vinyl-placeholder");
const favoritesNowTitle = document.querySelector("#favorites-now-title");
const favoritesNowArtist = document.querySelector("#favorites-now-artist");

/* =========================
   Song Card Play Buttons
========================= */

document.addEventListener("click", (event) => {
    const button =
        event.target.closest(".song-play-button");

    if (!button) {
        return;
    }

const songCard =
    button.closest(
        ".song-card, .favorite-track-row"
    );

    if (!songCard) {
        return;
    }

    const songId =
        songCard.dataset.songId;

    const song =
        songs.find(
            (item) => item.id === songId
        );

    if (!song) {
        return;
    }


    /* Check where playback came from */

    const playedFromMixtape =
        Boolean(
            songCard.closest("#mixtape-song-grid")
        );

    const isNewSong =
        currentSong?.id !== song.id;


    playSong(song, button);


    /* Count real mixtape playback */

    if (
        playedFromMixtape &&
        isNewSong &&
        typeof recordActiveMixtapePlay === "function"
    ) {
        recordActiveMixtapePlay();
    }
});
/* =========================
   Play Song
========================= */

function playSong(song, cardButton) {
    const isSameSong = currentSong?.id === song.id;

    if (isSameSong && !audioPlayer.paused) {
        pauseSong();
        return;
    }

    if (!isSameSong) {
        if (currentCardButton) {
            currentCardButton.textContent = "▶";
        }

        resetProgress();

        audioPlayer.src = song.audio;

        currentSong = song;
        currentCardButton = cardButton;

        updatePlayerInfo(song);
    }

    audioPlayer.play();

    updatePlayButtons(true);

    addToRecentlyPlayed(song);
}


/* =========================
   Pause Song
========================= */

function pauseSong() {
    audioPlayer.pause();

    updatePlayButtons(false);
}


/* =========================
   Play Button States
========================= */

function updatePlayButtons(isPlaying) {
    if (currentCardButton) {
        currentCardButton.textContent =
            isPlaying ? "❚❚" : "▶";
    }

    playerToggle.textContent =
        isPlaying ? "❚❚" : "▶";


    /* Now Spinning State */

    if (nowSpinning) {
        nowSpinning.classList.toggle(
            "is-playing",
            isPlaying
        );
    }

    if (nowSpinningStatus) {
        nowSpinningStatus.textContent =
            isPlaying ? "PLAYING" : "PAUSED";
    }
/* Favorites Vinyl State */

if (favoritesVinyl) {
    favoritesVinyl.classList.toggle(
        "is-playing",
        isPlaying
    );
}

}

/* =========================
   Player Song Information
========================= */

function updatePlayerInfo(song) {
    /* Bottom Player */

    playerCover.src = song.cover;
    playerCover.alt =
        `${song.title} by ${song.artist}`;

    playerTitle.textContent =
        song.title;

    playerArtist.textContent =
        song.artist;

    playerToggle.setAttribute(
        "aria-label",
        `Play ${song.title} by ${song.artist}`
    );


    /* Now Spinning */

    if (nowSpinningCover) {
        nowSpinningCover.src =
            song.cover;

        nowSpinningCover.alt =
            `${song.title} by ${song.artist}`;
    }

    if (nowSpinningTitle) {
        nowSpinningTitle.textContent =
            song.title;
    }

    if (nowSpinningArtist) {
        nowSpinningArtist.textContent =
            song.artist;
    }

    if (nowSpinningGenre) {
        nowSpinningGenre.textContent =
            song.genre || "Unknown";
    }


    /* Favorites Vinyl */

    if (favoritesVinylCover) {
        favoritesVinylCover.src =
            song.cover;

        favoritesVinylCover.alt =
            `${song.title} cover`;

        favoritesVinylCover.hidden =
            false;
    }

    if (favoritesVinylPlaceholder) {
        favoritesVinylPlaceholder.hidden =
            true;
    }

    if (favoritesNowTitle) {
        favoritesNowTitle.textContent =
            song.title;
    }

    if (favoritesNowArtist) {
        favoritesNowArtist.textContent =
            song.artist;
    }
}

/* =========================
   Bottom Play / Pause
========================= */

playerToggle.addEventListener("click", () => {
    if (!currentSong) {
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();

        updatePlayButtons(true);
    } else {
        pauseSong();
    }
});


/* =========================
   Progress Bar
========================= */

audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) {
        return;
    }

    const progress =
        (
            audioPlayer.currentTime /
            audioPlayer.duration
        ) * 100;

    progressBar.value = progress;

    progressBar.style.setProperty(
        "--fill",
        `${progress}%`
    );

    currentTimeDisplay.textContent =
        formatTime(audioPlayer.currentTime);
    
    if (nowSpinningProgressFill) {
    nowSpinningProgressFill.style.width =
        `${progress}%`;
}

if (nowSpinningCurrentTime) {
    nowSpinningCurrentTime.textContent =
        formatTime(audioPlayer.currentTime);
}
});


/* =========================
   Seek Through Song
========================= */

progressBar.addEventListener("input", () => {
    if (!audioPlayer.duration) {
        return;
    }

    const newTime =
        (progressBar.value / 100) *
        audioPlayer.duration;

    audioPlayer.currentTime = newTime;
});


/* =========================
   Real Song Duration
========================= */

audioPlayer.addEventListener(
    "loadedmetadata",
    () => {
        const formattedDuration =
            formatTime(audioPlayer.duration);

        playerDuration.textContent =
            formattedDuration;

        if (nowSpinningDuration) {
            nowSpinningDuration.textContent =
                formattedDuration;
        }
    }
);

/* =========================
   Format Time
========================= */

function formatTime(seconds) {
    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

/* =========================
   Load Recent Track Durations
========================= */

function loadRecentTrackDurations() {
    const durationDisplays =
        document.querySelectorAll(
            "[data-duration-song]"
        );

    durationDisplays.forEach((display) => {
        const songId =
            display.dataset.durationSong;

        const song =
            songs.find(
                (item) => item.id === songId
            );

        if (!song) {
            return;
        }

        const durationAudio =
            new Audio();

        durationAudio.preload =
            "metadata";

        durationAudio.src =
            song.audio;

        durationAudio.addEventListener(
            "loadedmetadata",
            () => {
                display.textContent =
                    formatTime(
                        durationAudio.duration
                    );
            },
            {
                once: true
            }
        );
    });
}
/* =========================
   Reset Progress
========================= */

function resetProgress() {
    progressBar.value = 0;

    progressBar.style.setProperty(
        "--fill",
        "0%"
    );

    currentTimeDisplay.textContent =
        "0:00";


    if (nowSpinningProgressFill) {
        nowSpinningProgressFill.style.width =
            "0%";
    }

    if (nowSpinningCurrentTime) {
        nowSpinningCurrentTime.textContent =
            "0:00";
    }

    if (nowSpinningDuration) {
        nowSpinningDuration.textContent =
            "0:00";
    }
}

/* =========================
   Find Song Card Button
========================= */

function getSongCardButton(song) {
    const songItem =
        document.querySelector(
            `.song-card[data-song-id="${song.id}"],
             .recent-track-row[data-song-id="${song.id}"],
             .favorite-track-row[data-song-id="${song.id}"]`
        );

    return (
        songItem?.querySelector(
            ".song-play-button"
        ) || null
    );
}
/* =========================
   Get Random Song
========================= */

function getRandomSong() {
    if (songs.length <= 1) {
        return songs[0];
    }

    let randomSong;

    do {
        const randomIndex =
            Math.floor(Math.random() * songs.length);

        randomSong = songs[randomIndex];
    } while (randomSong.id === currentSong.id);

    return randomSong;
}
        
function playNextSong() {
    if (!currentSong) {
        return;
    }

    let nextSong;

    if (shuffleOn) {
        nextSong = getRandomSong();
    } else {
        const currentIndex = songs.findIndex(
            (song) => song.id === currentSong.id
        );

        const nextIndex =
            (currentIndex + 1) % songs.length;

        nextSong = songs[nextIndex];
    }

    const nextCardButton =
        getSongCardButton(nextSong);

    playSong(nextSong, nextCardButton);
}




/* =========================
   Previous Song
========================= */

previousButton.addEventListener("click", () => {
    if (!currentSong) {
        return;
    }

    const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
    );

    const previousIndex =
        (
            currentIndex -
            1 +
            songs.length
        ) % songs.length;

    const previousSong =
        songs[previousIndex];

    const previousCardButton =
        getSongCardButton(previousSong);

    playSong(
        previousSong,
        previousCardButton
    );
});


/* =========================
   Next Song
========================= */

nextButton.addEventListener("click", () => {
    playNextSong();
});

/* =========================
   Auto Play Next Song
========================= */

audioPlayer.addEventListener("ended", () => {
    playNextSong();
});


/* =========================
   Repeat One
========================= */

repeatButton.addEventListener("click", () => {
    repeatOne = !repeatOne;

    audioPlayer.loop = repeatOne;

    repeatButton.classList.toggle(
        "active",
        repeatOne
    );

    repeatButton.setAttribute(
        "aria-pressed",
        repeatOne
    );
});

/* =========================
   Shuffle
========================= */

shuffleButton.addEventListener("click", () => {
    shuffleOn = !shuffleOn;

    shuffleButton.classList.toggle(
        "active",
        shuffleOn
    );

    shuffleButton.setAttribute(
        "aria-pressed",
        shuffleOn
    );
});


/* =========================
   Volume
========================= */

const savedPlayerVolume =
    localStorage.getItem("rewind-default-volume");

const startingPlayerVolume =
    savedPlayerVolume !== null
        ? Number(savedPlayerVolume)
        : Number(volumeSlider.value);

volumeSlider.value =
    startingPlayerVolume;

audioPlayer.volume =
    startingPlayerVolume / 100;

volumeSlider.style.setProperty(
    "--fill",
    `${startingPlayerVolume}%`
);


volumeSlider.addEventListener("input", () => {
    const volume =
        Number(volumeSlider.value);

    audioPlayer.volume =
        volume / 100;

    volumeSlider.style.setProperty(
        "--fill",
        `${volume}%`
    );

    localStorage.setItem(
        "rewind-default-volume",
        volume
    );

    if (defaultVolumeSetting) {
        defaultVolumeSetting.value =
            volume;

        defaultVolumeSetting.style.setProperty(
            "--fill",
            `${volume}%`
        );
    }

    if (defaultVolumeValue) {
        defaultVolumeValue.textContent =
            `${volume}%`;
    }
});


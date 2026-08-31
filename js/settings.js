/* =========================
   Collection Stats
========================= */

const defaultVolumeSetting =
    document.querySelector("#default-volume-setting");

const defaultVolumeValue =
    document.querySelector("#default-volume-value");

const settingsTrackCount =
    document.querySelector("#settings-track-count");

const settingsFavoriteCount =
    document.querySelector("#settings-favorite-count");

const settingsMixtapeCount =
    document.querySelector("#settings-mixtape-count");

const settingsUploadCount =
    document.querySelector("#settings-upload-count");


const reduceMotionSetting =
    document.querySelector("#reduce-motion-setting");

const savedReduceMotion =
    localStorage.getItem("rewind-reduce-motion");

const reduceMotionOn =
    savedReduceMotion === "true";

reduceMotionSetting.checked =
    reduceMotionOn;

document.body.classList.toggle(
    "reduce-motion",
    reduceMotionOn
);

reduceMotionSetting.addEventListener(
    "change",
    () => {
        const enabled =
            reduceMotionSetting.checked;

        document.body.classList.toggle(
            "reduce-motion",
            enabled
        );

        localStorage.setItem(
            "rewind-reduce-motion",
            enabled
        );
    }
);

/* =========================
  Clear Uploaded Music
========================= */

const clearUploadedMusicButton =
    document.querySelector(
        ".clear-uploaded-music-button"
    );

const clearUploadsModal =
    document.querySelector(
        "#clear-uploads-modal"
    );

const clearUploadsClose =
    document.querySelector(
        ".clear-uploads-close"
    );

const clearUploadsCancel =
    document.querySelector(
        ".clear-uploads-cancel"
    );

const confirmClearUploads =
    document.querySelector(
        ".confirm-clear-uploads"
    );

function openClearUploadsModal() {
    clearUploadsModal.hidden = false;
}

function closeClearUploadsModal() {
    clearUploadsModal.hidden = true;
}

clearUploadedMusicButton.addEventListener(
    "click",
    openClearUploadsModal
);

clearUploadsClose.addEventListener(
    "click",
    closeClearUploadsModal
);

clearUploadsCancel.addEventListener(
    "click",
    closeClearUploadsModal
);

clearUploadsModal.addEventListener(
    "click",
    (event) => {
        if (event.target === clearUploadsModal) {
            closeClearUploadsModal();
        }
    }
);

confirmClearUploads.addEventListener(
    "click",
    async () => {

        const uploadedSongIds =
            songs
                .filter((song) =>
                    song.id.startsWith("upload-")
                )
                .map((song) => song.id);

        if (uploadedSongIds.length === 0) {
            closeClearUploadsModal();
            return;
        }


        /* Delete uploaded files from IndexedDB */

        await clearAllUploadedSongs();


        /* Remove uploaded songs from main songs array */

        for (let i = songs.length - 1; i >= 0; i--) {
            if (
                uploadedSongIds.includes(
                    songs[i].id
                )
            ) {
                songs.splice(i, 1);
            }
        }


        /* Clean Favorites */

        const favorites =
            getFavorites();

        const cleanedFavorites =
            favorites.filter(
                (songId) =>
                    !uploadedSongIds.includes(songId)
            );

        saveFavorites(cleanedFavorites);


        /* Clean Mixtapes */

        const mixtapes =
            getMixtapes();

        const cleanedMixtapes =
            mixtapes.map((mixtape) => ({
                ...mixtape,

                songs: mixtape.songs.filter(
                    (songId) =>
                        !uploadedSongIds.includes(
                            songId
                        )
                )
            }));

        saveMixtapes(cleanedMixtapes);


        /* Clean Recently Rewound */

        if (
            typeof recentlyPlayed !== "undefined"
        ) {
            recentlyPlayed =
                recentlyPlayed.filter(
                    (song) =>
                        !uploadedSongIds.includes(
                            song.id
                        )
                );
        }


        /* Refresh REWIND */

        refreshSongViews();

        if (
        typeof loadRecentlyPlayed ===
        "function"
        ) {
        loadRecentlyPlayed();
        }
        
        if (
    typeof activeMixtapeId !== "undefined" &&
    activeMixtapeId &&
    typeof openMixtape === "function"
) {
    openMixtape(activeMixtapeId);
}

        if (
            typeof renderMixtapes ===
            "function"
        ) {
            renderMixtapes();
        }

        updateCollectionStats();

        closeClearUploadsModal();


        /* Success toast */

        if (typeof showToast === "function") {
            showToast(
                "UPLOADED MUSIC CLEARED",
                "Your built-in REWIND tracks are still here."
            );
        }
    }
);
/* =========================
   Collect Stats
========================= */

function updateCollectionStats() {
    /* All tracks */
    const totalTracks =
        songs.length;


    /* Favorites */
    const favorites =
        getFavorites();

    const totalFavorites =
        favorites.length;


    /* Mixtapes */
    const mixtapes =
        getMixtapes();

    const totalMixtapes =
        mixtapes.length;


    /* Uploaded tracks */
    const uploadedTracks =
        songs.filter((song) =>
            song.id.startsWith("upload-")
        );

    const totalUploads =
        uploadedTracks.length;


    /* Show numbers */
    settingsTrackCount.textContent =
        totalTracks;

    settingsFavoriteCount.textContent =
        totalFavorites;

    settingsMixtapeCount.textContent =
        totalMixtapes;

    settingsUploadCount.textContent =
        totalUploads;
}
/* =========================
   Load Saved Volume
========================= */

const savedVolume =
    localStorage.getItem("rewind-default-volume");

const startingVolume =
    savedVolume !== null
        ? Number(savedVolume)
        : 80;


/* =========================
   Apply Starting Volume
========================= */

defaultVolumeSetting.value =
    startingVolume;

defaultVolumeValue.textContent =
    `${startingVolume}%`;

defaultVolumeSetting.style.setProperty(
    "--fill",
    `${startingVolume}%`
);


/* =========================
   Theme Setting
========================= */

const themeOptions =
    document.querySelectorAll(".theme-option");

const savedTheme =
    localStorage.getItem("rewind-theme") ||
    "rewind";


function applyTheme(theme) {
    document.body.classList.remove(
        "theme-cream",
        "theme-matcha"
    );

    if (theme === "cream") {
        document.body.classList.add(
            "theme-cream"
        );
    }

    if (theme === "matcha") {
        document.body.classList.add(
            "theme-matcha"
        );
    }

    themeOptions.forEach((option) => {
        const isActive =
            option.dataset.theme === theme;

        option.classList.toggle(
            "active",
            isActive
        );

        option.setAttribute(
            "aria-pressed",
            isActive
        );
    });

    localStorage.setItem(
        "rewind-theme",
        theme
    );
}


themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const theme =
            option.dataset.theme;

        applyTheme(theme);
    });
});


applyTheme(savedTheme);

/* =========================
   Update Setting
========================= */

defaultVolumeSetting.addEventListener(
    "input",
    () => {
        const volume =
            Number(defaultVolumeSetting.value);

        defaultVolumeValue.textContent =
            `${volume}%`;

        defaultVolumeSetting.style.setProperty(
            "--fill",
            `${volume}%`
        );

        localStorage.setItem(
            "rewind-default-volume",
            volume
        );

        /* Update bottom player immediately */
        audioPlayer.volume =
            volume / 100;

        volumeSlider.value =
            volume;

        volumeSlider.style.setProperty(
            "--fill",
            `${volume}%`
        );
    }
);

updateCollectionStats();
/* =========================
   Selectors
========================= */

const createMixtapeButton =
    document.querySelector(".create-mixtape-button");

const mixtapeModal =
    document.querySelector("#mixtape-modal");

const mixtapeModalClose =
    document.querySelector(".modal-close");

const mixtapeModalCancel =
    document.querySelector(".modal-cancel");

const mixtapeNameInput =
    document.querySelector("#mixtape-name");

const mixtapeForm =
    document.querySelector("#mixtape-form");

const mixtapeGrid =
    document.querySelector("#mixtape-grid");

const mixtapeEmpty =
    document.querySelector("#mixtape-empty");

const mixtapeDetail =
    document.querySelector("#mixtape-detail");

const mixtapeDetailTitle =
    document.querySelector("#mixtape-detail-title");

const mixtapeDetailCount =
    document.querySelector("#mixtape-detail-count");

const mixtapeBackButton =
    document.querySelector(".mixtape-back-button");

const mixtapeSongGrid =
    document.querySelector("#mixtape-song-grid");

const mixtapeDetailEmpty =
    document.querySelector("#mixtape-detail-empty");

const addTracksButton =
    document.querySelector(".add-tracks-button");

const addTracksModal =
    document.querySelector("#add-tracks-modal");

const addTracksClose =
    document.querySelector(".add-tracks-close");

const addTracksCancel =
    document.querySelector(".add-tracks-cancel");

const addSelectedTracksButton =
    document.querySelector(".add-selected-tracks");

const trackPicker =
    document.querySelector("#track-picker");

const trackPickerSearch =
    document.querySelector("#track-picker-search");

const renameMixtapeButton =
    document.querySelector(".rename-mixtape-button");

const renameMixtapeModal =
    document.querySelector("#rename-mixtape-modal");

const renameMixtapeForm =
    document.querySelector("#rename-mixtape-form");

const renameMixtapeInput =
    document.querySelector("#rename-mixtape-name");

const renameMixtapeClose =
    document.querySelector(".rename-mixtape-close");

const renameMixtapeCancel =
    document.querySelector(".rename-mixtape-cancel");

const deleteMixtapeButton =
    document.querySelector(".delete-mixtape-button");

const deleteMixtapeModal =
    document.querySelector("#delete-mixtape-modal");

const deleteMixtapeClose =
    document.querySelector(".delete-mixtape-close");

const deleteMixtapeCancel =
    document.querySelector(".delete-mixtape-cancel");

const confirmDeleteMixtape =
    document.querySelector(".confirm-delete-mixtape");

const deleteMixtapeName =
    document.querySelector("#delete-mixtape-name");

const mixtapeMoodInput =
    document.querySelector("#mixtape-mood");

const heavyRotationSection =
    document.querySelector(
        "#heavy-rotation-section"
    );

const heavyRotationGrid =
    document.querySelector(
        "#heavy-rotation-grid"
    );

const moodButtons =
    document.querySelectorAll(".mood-card");

/* =========================
   Mixtape Customizer
========================= */

const mixtapePreviewCassette =
    document.querySelector(
        "#mixtape-preview-cassette"
    );

const mixtapePreviewTitle =
    document.querySelector(
        "#mixtape-preview-title"
    );

const mixtapePreviewMood =
    document.querySelector(
        "#mixtape-preview-mood"
    );

const mixtapePreviewType =
    document.querySelector(
        "#mixtape-preview-type"
    );

const mixtapePreviewSticker =
    document.querySelector(
        "#mixtape-preview-sticker"
    );


const cassetteShellInputs =
    document.querySelectorAll(
        'input[name="cassette-shell"]'
    );

const cassetteLabelInputs =
    document.querySelectorAll(
        'input[name="cassette-label"]'
    );

const cassetteAccentInputs =
    document.querySelectorAll(
        'input[name="cassette-accent"]'
    );

const cassetteTypeInputs =
    document.querySelectorAll(
        'input[name="cassette-type"]'
    );

const cassetteStickerInputs =
    document.querySelectorAll(
        'input[name="cassette-sticker"]'
    );

/* =========================
   Reset Preview Classes
========================= */

function removePreviewClasses(prefix) {
    const classes =
        [...mixtapePreviewCassette.classList];

    classes.forEach((className) => {
        if (className.startsWith(prefix)) {
            mixtapePreviewCassette.classList.remove(
                className
            );
        }
    });
}

mixtapeNameInput.addEventListener(
    "input",
    () => {
        const name =
            mixtapeNameInput.value.trim();

        mixtapePreviewTitle.textContent =
            name || "UNTITLED TAPE";
    }
);

mixtapeMoodInput.addEventListener(
    "change",
    () => {
        const mood =
            mixtapeMoodInput.value;

        mixtapePreviewMood.textContent =
            mood
                ? mood
                    .replace("-", " ")
                    .toUpperCase()
                : "NO MOOD";
    }
);

cassetteShellInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                removePreviewClasses(
                    "custom-shell-"
                );

                mixtapePreviewCassette
                    .classList.add(
                        `custom-shell-${input.value}`
                    );
            }
        );
    }
);

cassetteLabelInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                removePreviewClasses(
                    "custom-label-"
                );

                mixtapePreviewCassette
                    .classList.add(
                        `custom-label-${input.value}`
                    );
            }
        );
    }
);

cassetteAccentInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                removePreviewClasses(
                    "custom-accent-"
                );

                mixtapePreviewCassette
                    .classList.add(
                        `custom-accent-${input.value}`
                    );
            }
        );
    }
);

cassetteTypeInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                const type =
                    input.value;

                mixtapePreviewType.textContent =
                    `TYPE ${type} • NORMAL POSITION • 60`;
            }
        );
    }
);

const stickerSymbols = {
    heart: "♡",
    star: "★",
    moon: "☾",
    flower: "✿",
    bolt: "⚡"
};


cassetteStickerInputs.forEach(
    (input) => {
        input.addEventListener(
            "change",
            () => {
                const sticker =
                    input.value;

                if (sticker === "none") {
                    mixtapePreviewSticker.hidden =
                        true;

                    mixtapePreviewSticker.textContent =
                        "";

                    return;
                }


                mixtapePreviewSticker.textContent =
                    stickerSymbols[sticker] || "";

                mixtapePreviewSticker.hidden =
                    false;
            }
        );
    }
);
/* =========================
   State
========================= */

let activeMixtapeId = null;
let activeMoodFilter = "all";


/* =========================
   Create Mixtape Modal
========================= */

function openMixtapeModal() {
    mixtapeModal.hidden = false;

    /* Reset the form first */

    mixtapeForm.reset();


    /* Reset preview text */

    mixtapePreviewTitle.textContent =
        "UNTITLED TAPE";

    mixtapePreviewMood.textContent =
        "NO MOOD";

    mixtapePreviewType.textContent =
        "TYPE I • NORMAL POSITION • 60";

    mixtapePreviewSticker.textContent =
        "";

    mixtapePreviewSticker.hidden =
        true;


    /* Remove previous customization */

    removePreviewClasses(
        "custom-shell-"
    );

    removePreviewClasses(
        "custom-label-"
    );

    removePreviewClasses(
        "custom-accent-"
    );


    /* Apply defaults */

    mixtapePreviewCassette.classList.add(
        "custom-shell-charcoal",
        "custom-label-cream",
        "custom-accent-blue"
    );


    mixtapeNameInput.focus();
}


function closeMixtapeModal() {
    mixtapeModal.hidden = true;

    mixtapeForm.reset();


    /* Reset preview text */

    mixtapePreviewTitle.textContent =
        "UNTITLED TAPE";

    mixtapePreviewMood.textContent =
        "NO MOOD";

    mixtapePreviewType.textContent =
        "TYPE I • NORMAL POSITION • 60";

    mixtapePreviewSticker.textContent =
        "";

    mixtapePreviewSticker.hidden =
        true;


    /* Reset custom cassette classes */

    removePreviewClasses(
        "custom-shell-"
    );

    removePreviewClasses(
        "custom-label-"
    );

    removePreviewClasses(
        "custom-accent-"
    );


    /* Default cassette appearance */

    mixtapePreviewCassette.classList.add(
        "custom-shell-charcoal",
        "custom-label-cream",
        "custom-accent-blue"
    );
}


/* =========================
   Mixtape Modal Events
========================= */

createMixtapeButton.addEventListener(
    "click",
    openMixtapeModal
);


mixtapeModalClose.addEventListener(
    "click",
    closeMixtapeModal
);


mixtapeModalCancel.addEventListener(
    "click",
    closeMixtapeModal
);


mixtapeModal.addEventListener(
    "click",
    (event) => {
        if (event.target === mixtapeModal) {
            closeMixtapeModal();
        }
    }
);
/* =========================
   Get Mixtapes
========================= */

function getMixtapes() {
    const savedMixtapes =
        localStorage.getItem("rewind-mixtapes");

    return savedMixtapes
        ? JSON.parse(savedMixtapes)
        : [];
}


/* =========================
   Save Mixtapes
========================= */

function saveMixtapes(mixtapes) {
    localStorage.setItem(
        "rewind-mixtapes",
        JSON.stringify(mixtapes)
    );
}


/* =========================
   Create Mixtape
========================= */

function createMixtape(
    name,
    mood,
    cassette
) {
    const mixtapes = getMixtapes();

    const newMixtape = {
        id: `mixtape-${Date.now()}`,

        name: name,
        mood: mood,

        cassette: {
            shell: cassette.shell,
            label: cassette.label,
            accent: cassette.accent,
            type: cassette.type,
            sticker: cassette.sticker
        },

        songs: [],

        playCount: 0,
        createdAt: Date.now(),
        lastPlayedAt: null
    };

    mixtapes.push(newMixtape);

    saveMixtapes(mixtapes);

    renderMixtapes();
}
function createMixtapeCard(mixtape) {
    const trackCount =
        mixtape.songs.length;


    /* =========================
       Cassette Customization
    ========================= */

    const cassette =
        mixtape.cassette || {};


    const shell =
        cassette.shell || "charcoal";

    const label =
        cassette.label || "cream";

    const accent =
        cassette.accent || "blue";

    const type =
        cassette.type || "I";

    const sticker =
        cassette.sticker || "none";


    const stickerSymbols = {
        heart: "♡",
        star: "★",
        moon: "☾",
        flower: "✿",
        bolt: "⚡"
    };


    const stickerSymbol =
        sticker !== "none"
            ? stickerSymbols[sticker] || ""
            : "";


    return `
        <article
            class="mixtape-card"
            data-mixtape-id="${mixtape.id}"
        >

            <div
                class="
                    cassette
                    custom-shell-${shell}
                    custom-label-${label}
                    custom-accent-${accent}
                "
            >

                <div class="cassette-top">

                    <span class="cassette-side">
                        A
                    </span>

                    <span class="cassette-brand">
                        REWIND
                    </span>

                </div>


                <div class="cassette-label">

                    <p class="cassette-title">
                        ${mixtape.name}
                    </p>

                    <span class="cassette-line"></span>


                    ${
                        stickerSymbol
                            ? `
                                <span
                                    class="mixtape-card-sticker"
                                    aria-hidden="true"
                                >
                                    ${stickerSymbol}
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="cassette-window">

                    <span
                        class="cassette-reel reel-left"
                    ></span>

                    <div class="cassette-tape-line"></div>

                    <span
                        class="cassette-reel reel-right"
                    ></span>

                </div>


                <div class="cassette-bottom">

                    <div class="cassette-bottom-plate">

                        <span
                            class="cassette-bottom-hole"
                        ></span>


                        <div class="cassette-bottom-center">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>


                        <span
                            class="cassette-bottom-hole"
                        ></span>


                        <span class="mixtape-card-type">
                            TYPE ${type} • 60
                        </span>

                    </div>

                </div>

            </div>


            <div class="mixtape-card-info">

                <h3>
                    ${mixtape.name}
                </h3>

                <p>
                    ${trackCount}
                    ${trackCount === 1 ? "track" : "tracks"}

                    ${
                        mixtape.mood
                            ? `• ${mixtape.mood.replace("-", " ")}`
                            : ""
                    }
                </p>

            </div>

        </article>
    `;
}

/* =========================
   Heavy Rotation
========================= */

function renderHeavyRotation() {
    const mixtapes =
        getMixtapes();

    const heavyRotation =
        mixtapes
            .filter(
                (mixtape) =>
                    (mixtape.playCount || 0) > 0
            )
            .sort((a, b) => {
                return (
                    (b.playCount || 0) -
                    (a.playCount || 0)
                );
            })
            .slice(0, 4);


    if (heavyRotation.length === 0) {
        heavyRotationSection.hidden = true;
        heavyRotationGrid.innerHTML = "";

        return;
    }


    heavyRotationSection.hidden = false;

    heavyRotationGrid.innerHTML =
        heavyRotation
            .map(createMixtapeCard)
            .join("");
}

/* =========================
   Render Mixtapes
========================= */

function renderMixtapes() {
    const mixtapes = getMixtapes();

    const recentMixtapes =
        [...mixtapes].sort((a, b) => {
            return (
                (b.createdAt || 0) -
                (a.createdAt || 0)
            );
        });


    const filteredMixtapes =
        activeMoodFilter === "all"
            ? recentMixtapes
            : recentMixtapes.filter(
                (mixtape) =>
                    mixtape.mood === activeMoodFilter
            );


    mixtapeGrid.innerHTML =
        filteredMixtapes
            .map(createMixtapeCard)
            .join("");


    mixtapeEmpty.hidden =
        filteredMixtapes.length > 0;


    renderHeavyRotation();
}

/* =========================
   Browse by Mood
========================= */

moodButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            activeMoodFilter =
                button.dataset.mood;


            moodButtons.forEach(
                (moodButton) => {
                    moodButton.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add("active");


            renderMixtapes();
        }
    );

});
/* =========================
   Mixtape Form
========================= */

mixtapeForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();


        const shell =
            document.querySelector(
                'input[name="cassette-shell"]:checked'
            )?.value || "charcoal";


        const label =
            document.querySelector(
                'input[name="cassette-label"]:checked'
            )?.value || "cream";


        const accent =
            document.querySelector(
                'input[name="cassette-accent"]:checked'
            )?.value || "blue";


        const type =
            document.querySelector(
                'input[name="cassette-type"]:checked'
            )?.value || "I";


        const sticker =
            document.querySelector(
                'input[name="cassette-sticker"]:checked'
            )?.value || "none";


        const mixtapeName =
            mixtapeNameInput.value.trim();


        const mixtapeMood =
            mixtapeMoodInput.value;


        if (!mixtapeName) {
            return;
        }


        createMixtape(
            mixtapeName,
            mixtapeMood,
            {
                shell,
                label,
                accent,
                type,
                sticker
            }
        );


        closeMixtapeModal();
    }
);

/* =========================
   Open Mixtape Detail
========================= */

function openMixtape(mixtapeId) {
    const mixtapes = getMixtapes();

    const mixtape = mixtapes.find(
        (item) => item.id === mixtapeId
    );

    if (!mixtape) {
        return;
    }

    activeMixtapeId = mixtapeId;

    mixtapeGrid.hidden = true;
    mixtapeEmpty.hidden = true;
    mixtapeDetail.hidden = false;

    mixtapeDetailTitle.textContent =
        mixtape.name;

    const trackCount =
        mixtape.songs.length;

    mixtapeDetailCount.textContent =
        `${trackCount} ${trackCount === 1 ? "track" : "tracks"}`;

    const mixtapeSongs =
        mixtape.songs
            .map((songId) => {
                return songs.find(
                    (song) => song.id === songId
                );
            })
            .filter(Boolean);

    mixtapeSongGrid.innerHTML =
        mixtapeSongs
            .map(createSongCard)
            .join("");

    if (typeof syncFavoriteButtons === "function") {
        syncFavoriteButtons();
    }

    mixtapeDetailEmpty.hidden =
        mixtapeSongs.length > 0;
}


/* =========================
   Open Mixtape Card
========================= */

mixtapeGrid.addEventListener(
    "click",
    (event) => {
        const card =
            event.target.closest(".mixtape-card");

        if (!card) {
            return;
        }

        const mixtapeId =
            card.dataset.mixtapeId;

        openMixtape(mixtapeId);
    }
);

heavyRotationGrid.addEventListener(
    "click",
    (event) => {
        const card =
            event.target.closest(".mixtape-card");

        if (!card) {
            return;
        }

        const mixtapeId =
            card.dataset.mixtapeId;

        openMixtape(mixtapeId);
    }
);

/* =========================
   Back to Mixtapes
========================= */

mixtapeBackButton.addEventListener(
    "click",
    () => {
        mixtapeDetail.hidden = true;

        activeMixtapeId = null;

        renderMixtapes();

        mixtapeGrid.hidden = false;
    }
);


/* =========================
   Track Picker
========================= */

function renderTrackPicker(songList = songs) {
    const mixtapes = getMixtapes();

    const activeMixtape = mixtapes.find(
        (item) => item.id === activeMixtapeId
    );

    if (!activeMixtape) {
        return;
    }

    trackPicker.innerHTML =
        songList
            .map((song) => {
                const alreadyAdded =
                    activeMixtape.songs.includes(song.id);

                return `
                    <label class="track-picker-item">

                        <input
                            type="checkbox"
                            value="${song.id}"
                            ${alreadyAdded ? "checked" : ""}
                        >

                        <img
                            src="${song.cover}"
                            alt=""
                        >

                        <span class="track-picker-info">

                            <strong>
                                ${song.title}
                            </strong>

                            <span>
                                ${song.artist}
                            </span>

                        </span>

                    </label>
                `;
            })
            .join("");
}


/* =========================
   Track Picker Search
========================= */

trackPickerSearch.addEventListener(
    "input",
    () => {
        const searchTerm =
            trackPickerSearch.value
                .trim()
                .toLowerCase();

        const filteredSongs =
            songs.filter((song) => {
                const title =
                    song.title.toLowerCase();

                const artist =
                    song.artist.toLowerCase();

                return (
                    title.includes(searchTerm) ||
                    artist.includes(searchTerm)
                );
            });

        renderTrackPicker(filteredSongs);
    }
);


/* =========================
   Add Tracks Modal
========================= */

function openAddTracksModal() {
    if (!activeMixtapeId) {
        return;
    }

    trackPickerSearch.value = "";

    renderTrackPicker();

    addTracksModal.hidden = false;
}


function closeAddTracksModal() {
    addTracksModal.hidden = true;
}


addTracksButton.addEventListener(
    "click",
    openAddTracksModal
);


addTracksClose.addEventListener(
    "click",
    closeAddTracksModal
);


addTracksCancel.addEventListener(
    "click",
    closeAddTracksModal
);


addTracksModal.addEventListener(
    "click",
    (event) => {
        if (event.target === addTracksModal) {
            closeAddTracksModal();
        }
    }
);


/* =========================
   Save Selected Tracks
========================= */

addSelectedTracksButton.addEventListener(
    "click",
    () => {
        const selectedInputs =
            trackPicker.querySelectorAll(
                'input[type="checkbox"]:checked'
            );

        const selectedSongIds =
            Array.from(selectedInputs)
                .map((input) => input.value);

        const mixtapes =
            getMixtapes();

        const mixtapeIndex =
            mixtapes.findIndex(
                (item) => item.id === activeMixtapeId
            );

        if (mixtapeIndex === -1) {
            return;
        }

        mixtapes[mixtapeIndex].songs =
            selectedSongIds;

        saveMixtapes(mixtapes);

        closeAddTracksModal();

        openMixtape(activeMixtapeId);

        renderMixtapes();

        if (
            typeof updateCollectionStats === "function"
        ) {
            updateCollectionStats();
        }
    }
);
/* =========================
   Rename Modal
========================= */

function openRenameMixtapeModal() {
    const mixtapes = getMixtapes();

    const mixtape = mixtapes.find(
        (item) => item.id === activeMixtapeId
    );

    if (!mixtape) {
        return;
    }

    renameMixtapeInput.value = mixtape.name;

    renameMixtapeModal.hidden = false;

    renameMixtapeInput.focus();
    renameMixtapeInput.select();
}


function closeRenameMixtapeModal() {
    renameMixtapeModal.hidden = true;
}

renameMixtapeButton.addEventListener(
    "click",
    openRenameMixtapeModal
);


renameMixtapeClose.addEventListener(
    "click",
    closeRenameMixtapeModal
);


renameMixtapeCancel.addEventListener(
    "click",
    closeRenameMixtapeModal
);


renameMixtapeModal.addEventListener(
    "click",
    (event) => {
        if (event.target === renameMixtapeModal) {
            closeRenameMixtapeModal();
        }
    }
);

renameMixtapeForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const newName =
            renameMixtapeInput.value.trim();

        if (!newName) {
            return;
        }

        const mixtapes = getMixtapes();

        const mixtapeIndex =
            mixtapes.findIndex(
                (item) => item.id === activeMixtapeId
            );

        if (mixtapeIndex === -1) {
            return;
        }

        mixtapes[mixtapeIndex].name =
            newName;

        saveMixtapes(mixtapes);

        closeRenameMixtapeModal();
        
        renderMixtapes();

        openMixtape(activeMixtapeId);
    }
);

/* =========================
   Delete Mixtape
========================= */

function openDeleteMixtapeModal() {
    if (!activeMixtapeId) {
        return;
    }

    const mixtapes = getMixtapes();

    const mixtape = mixtapes.find(
        (item) => item.id === activeMixtapeId
    );

    if (!mixtape) {
        return;
    }

    deleteMixtapeName.textContent =
        `"${mixtape.name}"`;

    deleteMixtapeModal.hidden = false;
}


function closeDeleteMixtapeModal() {
    deleteMixtapeModal.hidden = true;
}


function deleteActiveMixtape() {
    if (!activeMixtapeId) {
        return;
    }

    let mixtapes = getMixtapes();

    mixtapes = mixtapes.filter(
        (mixtape) =>
            mixtape.id !== activeMixtapeId
    );

    saveMixtapes(mixtapes);

    activeMixtapeId = null;

    closeDeleteMixtapeModal();

    mixtapeDetail.hidden = true;

    renderMixtapes();

    mixtapeGrid.hidden = false;
}

deleteMixtapeButton.addEventListener(
    "click",
    openDeleteMixtapeModal
);

confirmDeleteMixtape.addEventListener(
    "click",
    deleteActiveMixtape
);


deleteMixtapeClose.addEventListener(
    "click",
    closeDeleteMixtapeModal
);


deleteMixtapeCancel.addEventListener(
    "click",
    closeDeleteMixtapeModal
);


deleteMixtapeModal.addEventListener(
    "click",
    (event) => {
        if (event.target === deleteMixtapeModal) {
            closeDeleteMixtapeModal();
        }
    }
);

/* =========================
   Record Mixtape Play
========================= */

function recordActiveMixtapePlay() {
    if (!activeMixtapeId) {
        return;
    }

    const mixtapes =
        getMixtapes();

    const mixtapeIndex =
        mixtapes.findIndex(
            (mixtape) =>
                mixtape.id === activeMixtapeId
        );

    if (mixtapeIndex === -1) {
        return;
    }

    mixtapes[mixtapeIndex].playCount =
        (mixtapes[mixtapeIndex].playCount || 0) + 1;

    mixtapes[mixtapeIndex].lastPlayedAt =
        Date.now();

    saveMixtapes(mixtapes);

    renderHeavyRotation();
}
/* =========================
   Initial Render
========================= */

renderMixtapes();
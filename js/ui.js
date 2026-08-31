const recentlyRewoundGrid = document.querySelector(
    "#recently-rewound-grid"
);

const libraryGrid = document.querySelector(
    "#library-grid"
);

const favoritesGrid = document.querySelector(
    "#favorites-grid"
);

const favoritesEmpty = document.querySelector(
    "#favorites-empty"
);

const libraryPageGrid = document.querySelector(
    "#library-page-grid"
);

const homeLibrarySearch =
    document.querySelector("#library-search");

/* =========================
   Library Controls
========================= */

const librarySearch =
    document.querySelector("#library-page-search");

const libraryFilters =
    document.querySelectorAll(".library-filter");

const librarySort =
    document.querySelector("#library-sort");

const libraryTrackCount =
    document.querySelector("#library-track-count");


let activeLibraryGenre = "all";

let librarySearchTerm = "";

let librarySortMode = "recent";

/* =========================
   search
========================= */

function renderHomeLibrary(songList = songs) {
    libraryGrid.innerHTML =
        songList
            .map(createSongCard)
            .join("");


    if (
        typeof syncFavoriteButtons ===
        "function"
    ) {
        syncFavoriteButtons();
    }
}
/* =========================
   Create Song Card
========================= */

function createSongCard(song) {
    return `
        <article
            class="song-card"
            data-song-id="${song.id}"
        >

            <div class="song-cover">

                <img
                    src="${song.cover}"
                    alt="Album cover for ${song.title} by ${song.artist}"
                >

                <button
                    class="song-play-button"
                    type="button"
                    aria-label="Play ${song.title} by ${song.artist}"
                >
                    ▶
                </button>

            </div>


            <div class="song-card-info">

                <div class="song-card-heading">

                    <div>
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                    </div>


                    <div class="song-card-actions">

                        ${
                            song.id.startsWith("upload-")
                                ? `
                                    <div class="song-manage">

                                        <button
                                            class="song-menu-button"
                                            type="button"
                                            aria-label="Manage ${song.title} by ${song.artist}"
                                            aria-expanded="false"
                                        >
                                            •••
                                        </button>

                                        <div
                                            class="song-manage-menu"
                                            hidden
                                        >

                                            <button
                                                class="edit-track-option"
                                                type="button"
                                            >
                                                Edit Track
                                            </button>

                                            <button
                                                class="delete-track-option"
                                                type="button"
                                            >
                                                Delete Track
                                            </button>

                                        </div>

                                    </div>
                                `
                                : ""
                        }


                        <button
                            class="favorite-button"
                            type="button"
                            aria-label="Add ${song.title} by ${song.artist} to favorites"
                            aria-pressed="false"
                        >
                            ♡
                        </button>

                    </div>

                </div>


                <p class="song-meta">
                    ${song.genre}
                </p>

            </div>

        </article>
    `;
}

/* =========================
   Create Library Page Card
========================= */

function createLibraryPageCard(song, index) {
    const trackNumber =
        String(index + 1).padStart(2, "0");

    return `
        <article
    class="song-card library-song-card"
    data-song-id="${song.id}"
>

            <div class="library-song-cover">

                <img
                    src="${song.cover}"
                    alt="Album cover for ${song.title} by ${song.artist}"
                >


                <span class="library-track-number">
                    ${trackNumber}
                </span>


                <button
                    class="song-play-button library-song-play"
                    type="button"
                    aria-label="Play ${song.title} by ${song.artist}"
                >
                    ▶
                </button>

            </div>


            <div class="library-song-info">

                <div class="library-song-heading">

                    <div class="library-song-text">

                        <h3>
                            ${song.title}
                        </h3>

                        <p>
                            ${song.artist}
                        </p>

                    </div>


                    <button
                        class="favorite-button library-favorite-button"
                        type="button"
                        aria-label="Add ${song.title} by ${song.artist} to favorites"
                        aria-pressed="false"
                    >
                        ♡
                    </button>

                </div>


                <div class="library-song-meta">

                    <span class="library-genre-tag">
                        ${song.genre || "Unknown"}
                    </span>

                    <span
                        class="library-song-duration"
                        data-duration-song="${song.id}"
                    >
                        --:--
                    </span>

                </div>


                <div class="library-song-footer">

                    <span>
                        REWIND • TYPE ${trackNumber}
                    </span>


                    ${
                        song.id.startsWith("upload-")
                            ? `
                                <div class="song-manage">

                                    <button
                                        class="song-menu-button"
                                        type="button"
                                        aria-label="Manage ${song.title} by ${song.artist}"
                                        aria-expanded="false"
                                    >
                                        •••
                                    </button>

                                    <div
                                        class="song-manage-menu"
                                        hidden
                                    >

                                        <button
                                            class="edit-track-option"
                                            type="button"
                                        >
                                            Edit Track
                                        </button>

                                        <button
                                            class="delete-track-option"
                                            type="button"
                                        >
                                            Delete Track
                                        </button>

                                    </div>

                                </div>
                            `
                            : `
                                <span class="library-built-in-mark">
                                    •••
                                </span>
                            `
                    }

                </div>

            </div>

        </article>
    `;
}

/* =========================
   Create Recently Rewound Row
========================= */

function createRecentlyRewoundRow(song) {
    return `
<article
    class="song-card recent-track-row"
    data-song-id="${song.id}"
>

            <div class="recent-track-cover">
                <img
                    src="${song.cover}"
                    alt="Album cover for ${song.title} by ${song.artist}"
                >

            </div>


            <div class="recent-track-info">

                <h3>
                    ${song.title}
                </h3>

                <p>
                    ${song.artist}
                    <span aria-hidden="true">·</span>
                    ${song.genre}
                </p>

            </div>


<div class="recent-track-actions">

    <span
        class="recent-track-duration"
        data-duration-song="${song.id}"
    >
        --:--
    </span>


    <button
        class="favorite-button"
        type="button"
        aria-label="Add ${song.title} by ${song.artist} to favorites"
        aria-pressed="false"
    >
        ♡
    </button>


    <button
        class="song-play-button recent-track-play"
        type="button"
        aria-label="Play ${song.title} by ${song.artist}"
    >
        ▶
    </button>

</div>

        </article>
    `;
}

/* =========================
   Render Full Library
========================= */

function renderLibrary() {
    renderHomeLibrary();
}
if (
    typeof loadLibraryTrackDurations ===
    "function"
) {
    loadLibraryTrackDurations();
}

homeLibrarySearch.addEventListener(
    "input",
    () => {
        const searchTerm =
            homeLibrarySearch.value
                .trim()
                .toLowerCase();


        const filteredSongs =
            songs.filter((song) => {

                const title =
                    song.title.toLowerCase();

                const artist =
                    song.artist.toLowerCase();

                const genre =
                    String(
                        song.genre || ""
                    ).toLowerCase();


                return (
                    title.includes(searchTerm) ||
                    artist.includes(searchTerm) ||
                    genre.includes(searchTerm)
                );
            });


        renderHomeLibrary(
            filteredSongs
        );
    }
);

/* =========================
   Load Recently Played
========================= */

function loadRecentlyPlayed() {
    const savedIds =
        JSON.parse(
            localStorage.getItem(
                "rewind-recently-played"
            )
        ) || [];

    recentlyPlayed =
        savedIds
            .map((songId) =>
                songs.find(
                    (song) =>
                        song.id === songId
                )
            )
            .filter(Boolean);

    renderRecentlyPlayed();
}

/* =========================
   Add Recently Played Song
========================= */

function addToRecentlyPlayed(song) {
    recentlyPlayed =
        recentlyPlayed.filter(
            (item) => item.id !== song.id
        );

    recentlyPlayed.unshift(song);

    recentlyPlayed =
        recentlyPlayed.slice(0,6);

    localStorage.setItem(
        "rewind-recently-played",
        JSON.stringify(
            recentlyPlayed.map(
                (item) => item.id
            )
        )
    );

    renderRecentlyPlayed();
}


/* =========================
   Render Recently Rewound
========================= */

function renderRecentlyPlayed() {
    const recentSongs =
        recentlyPlayed.slice(0,6);

    recentlyRewoundGrid.innerHTML =
        recentSongs
            .map(createRecentlyRewoundRow)
            .join("");

    if (typeof syncFavoriteButtons === "function") {
        syncFavoriteButtons();
    }
    
    if (
    typeof loadRecentTrackDurations ===
    "function"
) {
    loadRecentTrackDurations();
}
}

/* =========================
   Render Favorites
========================= */

function renderFavorites() {
    const favoriteIds = getFavorites();

    const favoriteSongs = songs.filter(
        (song) => favoriteIds.includes(song.id)
    );

const favoritesCount =
    document.querySelector("#favorites-count");

if (favoritesCount) {
    const count =
        favoriteSongs.length;

    favoritesCount.textContent =
        `${count} ${count === 1 ? "Track" : "Tracks"}`;
}

    favoritesGrid.innerHTML =
        favoriteSongs
            .map((song, index) => {
                return `
                    <article
                        class="favorite-track-row"
                        data-song-id="${song.id}"
                    >

                        <span class="favorite-track-number">
    ${String(index + 1).padStart(2, "0")}
</span>

<div class="favorite-track-panel">

    <img
        class="favorite-track-cover"
        src="${song.cover}"
        alt="${song.title} cover"
    >

    <div class="favorite-track-info">
        <h3>
            ${song.title}
        </h3>

        <p>
            ${song.artist}
        </p>
    </div>

    <span class="favorite-track-genre">
        ${song.genre || ""}
    </span>

    <button
        class="favorite-button is-favorite"
        type="button"
        aria-label="Remove ${song.title} from favorites"
        aria-pressed="true"
    >
        ♥
    </button>

    <button
        class="song-play-button favorite-track-play"
        type="button"
        aria-label="Play ${song.title}"
    >
        ▶
    </button>

</div>

                    </article>
                `;
            })
            .join("");

    favoritesEmpty.hidden =
        favoriteSongs.length > 0;

    if (typeof syncFavoriteButtons === "function") {
        syncFavoriteButtons();
    }
}

/* =========================
   Load Library Durations
========================= */

function loadLibraryTrackDurations() {
    const durationElements =
        document.querySelectorAll(
            ".library-song-duration"
        );


    durationElements.forEach(
        (durationElement) => {

            const songId =
                durationElement.dataset.durationSong;

            const song =
                songs.find(
                    (item) =>
                        item.id === songId
                );


            if (!song || !song.audio) {
                return;
            }


            const audio =
                new Audio(song.audio);


            audio.addEventListener(
                "loadedmetadata",
                () => {

                    if (
                        !Number.isFinite(
                            audio.duration
                        )
                    ) {
                        return;
                    }


                    const minutes =
                        Math.floor(
                            audio.duration / 60
                        );


                    const seconds =
                        Math.floor(
                            audio.duration % 60
                        )
                        .toString()
                        .padStart(2, "0");


                    durationElement.textContent =
                        `${minutes}:${seconds}`;
                }
            );

        }
    );
}

/* =========================
   Above render ig
========================= */
function normalizeGenre(genre) {
    return String(genre || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function getFilteredLibrarySongs() {
    let filteredSongs =
        songs.map((song, originalIndex) => {
            return {
                song,
                originalIndex
            };
        });


    /* =========================
       Search
    ========================= */

    if (librarySearchTerm) {
        filteredSongs =
            filteredSongs.filter(
                ({ song }) => {
                    const title =
                        song.title.toLowerCase();

                    const artist =
                        song.artist.toLowerCase();

                    return (
                        title.includes(
                            librarySearchTerm
                        ) ||
                        artist.includes(
                            librarySearchTerm
                        )
                    );
                }
            );
    }


    /* =========================
       Genre
    ========================= */

    if (activeLibraryGenre !== "all") {

        filteredSongs =
            filteredSongs.filter(
                ({ song }) => {

                    const songGenre =
                        normalizeGenre(
                            song.genre
                        );


                    /* Other */

                    if (
                        activeLibraryGenre ===
                        "other"
                    ) {
                        const knownGenres = [
                            "r&b",
                            "pop",
                            "hip-hop",
                            "rock",
                            "indie"
                        ];

                        return !knownGenres.includes(
                            songGenre
                        );
                    }


                    return (
                        songGenre ===
                        activeLibraryGenre
                    );
                }
            );
    }


    /* =========================
       Sort
    ========================= */

    if (librarySortMode === "title") {

        filteredSongs.sort(
            (a, b) =>
                a.song.title.localeCompare(
                    b.song.title
                )
        );

    } else if (
        librarySortMode === "artist"
    ) {

        filteredSongs.sort(
            (a, b) =>
                a.song.artist.localeCompare(
                    b.song.artist
                )
        );

    } else {

        /*
         * Recent keeps the newest items
         * toward the front while preserving
         * our original song order.
         */

        filteredSongs.sort(
            (a, b) =>
                b.originalIndex -
                a.originalIndex
        );
    }


    return filteredSongs;
}
/* =========================
   Render Library Page
========================= */
function renderLibraryPage() {
    const filteredSongs =
        getFilteredLibrarySongs();


    libraryPageGrid.innerHTML =
        filteredSongs
            .map(
                ({ song, originalIndex }) =>
                    createLibraryPageCard(
                        song,
                        originalIndex
                    )
            )
            .join("");


    /* Track Count */

    if (libraryTrackCount) {
        const visibleCount =
            filteredSongs.length;

        const totalCount =
            songs.length;


        if (visibleCount === totalCount) {

            libraryTrackCount.textContent =
                `${totalCount} ${
                    totalCount === 1
                        ? "track"
                        : "tracks"
                } in your collection`;

        } else {

            libraryTrackCount.textContent =
                `${visibleCount} of ${totalCount} tracks`;

        }
    }


    if (
        typeof syncFavoriteButtons ===
        "function"
    ) {
        syncFavoriteButtons();
    }
}


librarySearch.addEventListener(
    "input",
    () => {
        librarySearchTerm =
            librarySearch.value
                .trim()
                .toLowerCase();

        renderLibraryPage();
    }
);

libraryFilters.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                libraryFilters.forEach(
                    (filterButton) => {
                        filterButton.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                activeLibraryGenre =
                    normalizeGenre(
                        button.dataset.genre
                    );


                renderLibraryPage();
            }
        );

    }
);

librarySort.addEventListener(
    "change",
    () => {
        librarySortMode =
            librarySort.value;

        renderLibraryPage();
    }
);
/* =========================
   Close Song Manage Menus
========================= */

function closeSongManageMenus() {
    document
        .querySelectorAll(".song-manage-menu")
        .forEach((menu) => {
            menu.hidden = true;
        });

    document
        .querySelectorAll(".song-menu-button")
        .forEach((button) => {
            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });
}


/* =========================
   Song Manage Menu
========================= */

document.addEventListener("click", (event) => {
    const menuButton =
        event.target.closest(".song-menu-button");

    const manageMenu =
        event.target.closest(".song-manage-menu");


    /* Clicked ••• */
    if (menuButton) {
        const songManage =
            menuButton.closest(".song-manage");

        const menu =
            songManage.querySelector(
                ".song-manage-menu"
            );

        const wasOpen =
            !menu.hidden;

        closeSongManageMenus();

        if (!wasOpen) {
            menu.hidden = false;

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        return;
    }


    /* Clicked inside Edit/Delete menu */
    if (manageMenu) {
        return;
    }


    /* Clicked somewhere else */
    closeSongManageMenus();
});


/* =========================
   Initial Render
========================= */

renderLibrary();
renderFavorites();
renderLibraryPage();
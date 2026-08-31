/* =========================
   Add to Collection
========================= */

const uploadForm =
    document.querySelector("#upload-form");

const songTitleInput =
    document.querySelector("#song-title");

const songArtistInput =
    document.querySelector("#song-artist");

const songGenreInput =
    document.querySelector("#song-genre");

const songCoverInput =
    document.querySelector("#song-cover");

const songAudioInput =
    document.querySelector("#song-audio");

const editTrackModal =
    document.querySelector("#edit-track-modal");

const editTrackForm =
    document.querySelector("#edit-track-form");

const editTrackTitleInput =
    document.querySelector("#edit-song-title");

const editTrackArtistInput =
    document.querySelector("#edit-song-artist");

const editTrackGenreInput =
    document.querySelector("#edit-song-genre");

const editTrackCoverInput =
    document.querySelector("#edit-song-cover");

const editTrackAudioInput =
    document.querySelector("#edit-song-audio");

const editTrackClose =
    document.querySelector(".edit-track-close");

const editTrackCancel =
    document.querySelector(".edit-track-cancel");

let editingSongId = null;

const deleteTrackModal =
    document.querySelector("#delete-track-modal");

const deleteTrackClose =
    document.querySelector(".delete-track-close");

const deleteTrackCancel =
    document.querySelector(".delete-track-cancel");

const confirmDeleteTrack =
    document.querySelector(".confirm-delete-track");

const deleteTrackName =
    document.querySelector("#delete-track-name");

let deletingSongId = null;

const duplicateTrackModal =
    document.querySelector("#duplicate-track-modal");

const duplicateTrackName =
    document.querySelector("#duplicate-track-name");

const duplicateTrackClose =
    document.querySelector(".duplicate-track-close");

const duplicateTrackOk =
    document.querySelector(".duplicate-track-ok");

const rewindToast =
    document.querySelector("#rewind-toast");

const toastTitle =
    document.querySelector("#toast-title");

const toastMessage =
    document.querySelector("#toast-message");

let toastTimer = null;

/* =========================
   Upload Live Preview
========================= */

const previewSongTitle =
    document.querySelector("#preview-song-title");

const previewSongArtist =
    document.querySelector("#preview-song-artist");

const previewSongGenre =
    document.querySelector("#preview-song-genre");

const previewCoverImage =
    document.querySelector("#preview-cover-image");

const previewCoverPlaceholder =
    document.querySelector("#preview-cover-placeholder");

const coverFileName =
    document.querySelector("#cover-file-name");

const audioFileName =
    document.querySelector("#audio-file-name");

let previewCoverUrl = null;

const previewAudioDuration =
    document.querySelector("#preview-audio-duration");

const previewMetaDivider =
    document.querySelector("#preview-meta-divider");

/* =========================
   Helper 
========================= */


function updateTrackPreview() {
    const title =
        songTitleInput.value.trim();

    const artist =
        songArtistInput.value.trim();

    const genre =
        songGenreInput.value.trim();


    previewSongTitle.textContent =
        title || "Untitled Track";


    previewSongArtist.textContent =
        artist || "Unknown Artist";


    previewSongGenre.textContent =
        genre || "REWIND";
}

songTitleInput.addEventListener(
    "input",
    updateTrackPreview
);


songArtistInput.addEventListener(
    "input",
    updateTrackPreview
);


songGenreInput.addEventListener(
    "input",
    updateTrackPreview
);

songCoverInput.addEventListener(
    "change",
    () => {
        const coverFile =
            songCoverInput.files[0];


        if (!coverFile) {
            return;
        }


        if (previewCoverUrl) {
            URL.revokeObjectURL(
                previewCoverUrl
            );
        }


        previewCoverUrl =
            URL.createObjectURL(
                coverFile
            );


        previewCoverImage.src =
            previewCoverUrl;

        previewCoverImage.alt =
            `Preview cover for ${
                songTitleInput.value.trim() ||
                "new track"
            }`;


        previewCoverImage.hidden = false;

        previewCoverPlaceholder.hidden = true;


        coverFileName.textContent =
            coverFile.name;
    }
);

songAudioInput.addEventListener(
    "change",
    () => {
        const audioFile =
            songAudioInput.files[0];

        if (!audioFile) {
            return;
        }


        audioFileName.textContent =
            audioFile.name;


        const audioUrl =
            URL.createObjectURL(audioFile);

        const previewAudio =
            new Audio(audioUrl);


        previewAudio.addEventListener(
            "loadedmetadata",
            () => {
                const minutes =
                    Math.floor(
                        previewAudio.duration / 60
                    );

                const seconds =
                    Math.floor(
                        previewAudio.duration % 60
                    )
                    .toString()
                    .padStart(2, "0");


                previewAudioDuration.textContent =
                    `${minutes}:${seconds}`;

                previewAudioDuration.hidden =
                    false;

                previewMetaDivider.hidden =
                    false;


                URL.revokeObjectURL(
                    audioUrl
                );
            }
        );
    }
);

uploadForm.addEventListener(
    "reset",
    () => {

        /*
         * Wait until the browser has actually
         * cleared the form values first.
         */

        setTimeout(() => {

            updateTrackPreview();


            previewCoverImage.src = "";
            previewCoverImage.alt = "";
            previewCoverImage.hidden = true;

            previewCoverPlaceholder.hidden = false;


            coverFileName.textContent =
                "JPG / PNG • Square recommended";

            audioFileName.textContent =
                "MP3 / WAV • Max 50MB";
                
            previewAudioDuration.textContent =
                "--:--";

            previewAudioDuration.hidden =
                true;

            previewMetaDivider.hidden =
                true;


            if (previewCoverUrl) {
                URL.revokeObjectURL(
                    previewCoverUrl
                );

                previewCoverUrl = null;
            }

        }, 0);
    }
);
/* =========================
   Open REWIND Database
========================= */

function openRewindDatabase() {
    return new Promise((resolve, reject) => {
        const request =
            indexedDB.open("rewind-database", 1);

        request.onupgradeneeded = () => {
            const database = request.result;

            if (
                !database.objectStoreNames.contains(
                    "uploaded-songs"
                )
            ) {
                database.createObjectStore(
                    "uploaded-songs",
                    {
                        keyPath: "id"
                    }
                );
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


/* =========================
   Save Uploaded Song
========================= */

async function saveUploadedSong(song) {
    const database =
        await openRewindDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                "uploaded-songs",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "uploaded-songs"
            );

        store.put(song);

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}

/* =========================
   Remove Song From Favorites
========================= */

function removeSongFromFavorites(songId) {
    const favorites = getFavorites();

    const updatedFavorites =
        favorites.filter(
            (id) => id !== songId
        );

    saveFavorites(updatedFavorites);
}


/* =========================
   Remove Song From Mixtapes
========================= */

function removeSongFromMixtapes(songId) {
    const mixtapes = getMixtapes();

    const updatedMixtapes =
        mixtapes.map((mixtape) => {
            return {
                ...mixtape,

                songs: mixtape.songs.filter(
                    (id) => id !== songId
                )
            };
        });

    saveMixtapes(updatedMixtapes);
}

/* =========================
   Get Uploaded Songs
========================= */

async function getUploadedSongs() {
    const database =
        await openRewindDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                "uploaded-songs",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "uploaded-songs"
            );

        const request =
            store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/* =========================
   Delete Song
========================= */

async function deleteUploadedSong(songId) {
    const database =
        await openRewindDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                "uploaded-songs",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "uploaded-songs"
            );

        store.delete(songId);

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}

document.addEventListener(
    "click",
    (event) => {
        const deleteButton =
            event.target.closest(".delete-track-option");

        if (!deleteButton) {
            return;
        }

        const songCard =
            deleteButton.closest(".song-card");

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

        deletingSongId = songId;

        deleteTrackName.textContent =
            `"${song.title}"`;

        deleteTrackModal.hidden = false;
    }
);

function closeDeleteTrackModal() {
    deleteTrackModal.hidden = true;
    deletingSongId = null;
}


deleteTrackClose.addEventListener(
    "click",
    closeDeleteTrackModal
);


deleteTrackCancel.addEventListener(
    "click",
    closeDeleteTrackModal
);


deleteTrackModal.addEventListener(
    "click",
    (event) => {
        if (event.target === deleteTrackModal) {
            closeDeleteTrackModal();
        }
    }
);

confirmDeleteTrack.addEventListener(
    "click",
    async () => {
        if (!deletingSongId) {
            return;
        }

        const songId = deletingSongId;

        await deleteUploadedSong(songId);

        removeSongFromFavorites(songId);
        removeSongFromMixtapes(songId);

        const songIndex =
            songs.findIndex(
                (song) => song.id === songId
            );

        if (songIndex !== -1) {
            songs.splice(songIndex, 1);
        }

        closeDeleteTrackModal();

        refreshSongViews();
        
        if (typeof renderMixtapes === "function") {
        renderMixtapes();
        }

        if (
            typeof renderRecentlyPlayed ===
            "function"
        ) {
            recentlyPlayed =
                recentlyPlayed.filter(
                    (song) =>
                        song.id !== songId
                );

            renderRecentlyPlayed();
        }
    }
);

/* =========================
   Clear All Uploaded Songs
========================= */

async function clearAllUploadedSongs() {
    const database =
        await openRewindDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                "uploaded-songs",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "uploaded-songs"
            );

        store.clear();

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}
/* =========================
   Make Song Usable
========================= */

function prepareUploadedSong(savedSong) {
    return {
        id: savedSong.id,
        title: savedSong.title,
        artist: savedSong.artist,
        genre: savedSong.genre,

        cover: URL.createObjectURL(
            savedSong.coverFile
        ),

        audio: URL.createObjectURL(
            savedSong.audioFile
        )
    };
}


/* =========================
   Refresh Song Displays
========================= */

function refreshSongViews() {
    if (typeof renderLibrary === "function") {
        renderLibrary();
    }

    if (typeof renderLibraryPage === "function") {
        renderLibraryPage();
    }

    if (typeof renderFavorites === "function") {
        renderFavorites();
    }

    if (
        typeof updateCollectionStats === "function"
    ) {
        updateCollectionStats();
    }
}

/* =========================
   Upload Form
========================= */

uploadForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const title =
            songTitleInput.value.trim();

        const artist =
            songArtistInput.value.trim();

        const duplicateSong = songs.find((song) => {
            return (
                song.title.toLowerCase() ===
                    title.toLowerCase() &&
                song.artist.toLowerCase() ===
                    artist.toLowerCase()
            );
        });

        if (duplicateSong) {
    duplicateTrackName.textContent =
        `"${duplicateSong.title}" by ${duplicateSong.artist}`;

    duplicateTrackModal.hidden = false;

    return;
}

        const genre =
            songGenreInput.value.trim() ||
            "Unknown";

        const coverFile =
            songCoverInput.files[0];

        const audioFile =
            songAudioInput.files[0];

        if (
            !title ||
            !artist ||
            !coverFile ||
            !audioFile
        ) {
            return;
        }

        const id =
            `upload-${Date.now()}`;

        const savedSong = {
            id,
            title,
            artist,
            genre,
            coverFile,
            audioFile
        };

        await saveUploadedSong(savedSong);

        const usableSong =
            prepareUploadedSong(savedSong);

        songs.push(usableSong);

        refreshSongViews();

        uploadForm.reset();

showToast(
    "TRACK ADDED TO REWIND",
    `"${usableSong.title}" is now in your collection.`
);

console.log(
    "Added to REWIND:",
    usableSong
);
    }
);
/* =========================
   Edit Track
========================= */
async function getUploadedSong(songId) {
    const database =
        await openRewindDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            database.transaction(
                "uploaded-songs",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "uploaded-songs"
            );

        const request =
            store.get(songId);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

document.addEventListener(
    "click",
    async (event) => {
        const editButton =
            event.target.closest(".edit-track-option");

        if (!editButton) {
            return;
        }

        const songCard =
            editButton.closest(".song-card");

        if (!songCard) {
            return;
        }

        const songId =
            songCard.dataset.songId;

        const savedSong =
            await getUploadedSong(songId);

        if (!savedSong) {
            return;
        }

        editingSongId = songId;

        editTrackTitleInput.value =
            savedSong.title;

        editTrackArtistInput.value =
            savedSong.artist;

        editTrackGenreInput.value =
            savedSong.genre || "";

        editTrackCoverInput.value = "";
        editTrackAudioInput.value = "";

        editTrackModal.hidden = false;

        editTrackTitleInput.focus();
    }
);


function closeEditTrackModal() {
    editTrackModal.hidden = true;

    editingSongId = null;

    editTrackForm.reset();
}


editTrackClose.addEventListener(
    "click",
    closeEditTrackModal
);


editTrackCancel.addEventListener(
    "click",
    closeEditTrackModal
);


editTrackModal.addEventListener(
    "click",
    (event) => {
        if (event.target === editTrackModal) {
            closeEditTrackModal();
        }
    }
);

editTrackForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        if (!editingSongId) {
            return;
        }

        const savedSong =
            await getUploadedSong(editingSongId);

        if (!savedSong) {
            return;
        }

        const newCoverFile =
            editTrackCoverInput.files[0];

        const newAudioFile =
            editTrackAudioInput.files[0];

        const updatedSong = {
            ...savedSong,

            title:
                editTrackTitleInput.value.trim(),

            artist:
                editTrackArtistInput.value.trim(),

            genre:
                editTrackGenreInput.value.trim() ||
                "Unknown",

            coverFile:
                newCoverFile ||
                savedSong.coverFile,

            audioFile:
                newAudioFile ||
                savedSong.audioFile
        };

        await saveUploadedSong(updatedSong);


        /* Update the song in our current songs array */

        const songIndex =
            songs.findIndex(
                (song) =>
                    song.id === editingSongId
            );

        if (songIndex !== -1) {
            songs[songIndex] =
                prepareUploadedSong(updatedSong);
        }


        closeEditTrackModal();

        refreshSongViews();


        /* Refresh recently played too */

        if (
            typeof renderRecentlyPlayed ===
            "function"
        ) {
            renderRecentlyPlayed();
        }
    }
);

/* =========================
   Helper Functions
========================= */

function closeDuplicateTrackModal() {
    duplicateTrackModal.hidden = true;
}


duplicateTrackClose.addEventListener(
    "click",
    closeDuplicateTrackModal
);


duplicateTrackOk.addEventListener(
    "click",
    closeDuplicateTrackModal
);


duplicateTrackModal.addEventListener(
    "click",
    (event) => {
        if (event.target === duplicateTrackModal) {
            closeDuplicateTrackModal();
        }
    }
);

function showToast(title, message) {
    clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    rewindToast.hidden = false;

    requestAnimationFrame(() => {
        rewindToast.classList.add(
            "toast-visible"
        );
    });

    toastTimer = setTimeout(() => {
        rewindToast.classList.remove(
            "toast-visible"
        );

        setTimeout(() => {
            rewindToast.hidden = true;
        }, 250);
    }, 3000);
}
/* =========================
   Load Saved Uploads
========================= */

async function loadUploadedSongs() {
    const savedSongs =
        await getUploadedSongs();

    savedSongs.forEach((savedSong) => {
        const alreadyLoaded =
            songs.some(
                (song) =>
                    song.id === savedSong.id
            );

        if (alreadyLoaded) {
            return;
        }

        songs.push(
            prepareUploadedSong(savedSong)
        );
    });

    refreshSongViews();
    
    if (
    typeof loadRecentlyPlayed === "function"
) {
    loadRecentlyPlayed();
}
    
    if (
    typeof updateCollectionStats ===
    "function"
) {
    updateCollectionStats();
}
    
}


loadUploadedSongs();

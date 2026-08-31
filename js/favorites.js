/* =========================
   Favorites
========================= */

function getFavorites() {
    const savedFavorites =
        localStorage.getItem("rewind-favorites");

    return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
}


function saveFavorites(favorites) {
    localStorage.setItem(
        "rewind-favorites",
        JSON.stringify(favorites)
    );
}


/* =========================
   Check Favorite
========================= */

function isFavorite(songId) {
    const favorites = getFavorites();

    return favorites.includes(songId);
}


/* =========================
   Toggle Favorite
========================= */

function toggleFavorite(songId) {
    let favorites = getFavorites();

    if (favorites.includes(songId)) {
        favorites = favorites.filter(
            (id) => id !== songId
        );
    } else {
        favorites.push(songId);
    }

saveFavorites(favorites);

syncFavoriteButtons();

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
   Update Every Heart
========================= */

function syncFavoriteButtons() {
    const favoriteButtons =
        document.querySelectorAll(".favorite-button");

    favoriteButtons.forEach((button) => {
        const songContainer =
            button.closest(
                ".song-card, .recent-track-row, .favorite-track-row"
            );

        if (!songContainer) {
            return;
        }

        const songId =
            songContainer.dataset.songId;

        const favorited =
            isFavorite(songId);

        button.textContent =
            favorited ? "♥" : "♡";

        button.classList.toggle(
            "is-favorite",
            favorited
        );

        button.setAttribute(
            "aria-pressed",
            favorited
        );

        const song = songs.find(
            (item) => item.id === songId
        );

        if (song) {
            button.setAttribute(
                "aria-label",
                favorited
                    ? `Remove ${song.title} by ${song.artist} from favorites`
                    : `Add ${song.title} by ${song.artist} to favorites`
            );
        }
    });
}
/* =========================
   Favorite Button Clicks
========================= */

document.addEventListener("click", (event) => {
    const favoriteButton =
        event.target.closest(".favorite-button");

    if (!favoriteButton) {
        return;
    }

    const songContainer =
        favoriteButton.closest(
".song-card, .recent-track-row, .favorite-track-row"
        );

    if (!songContainer) {
        return;
    }

    const songId =
        songContainer.dataset.songId;

    toggleFavorite(songId);
});

/* =========================
   Initial Favorite State
========================= */

syncFavoriteButtons();
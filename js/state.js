
const STORAGE_KEY = "ketabnama-state-v1";

function getDefaultState() {
    return {
        favorites: [],
        library: [],
        user: null,
        readingSettings: {
            fontSize: "medium",
            theme: "light"
        }
    };
}

function getValidBookIds(ids) {
    if (!Array.isArray(ids)) {
        return [];
    }

    const validIds = [];

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        const exists = window.bookCatalog.some(function(book) {
            return book.id === id;
        });

        if (exists && !validIds.includes(id)) {
            validIds.push(id);
        }
    }

    return validIds;
}

function loadState() {
    const initialState = getDefaultState();

    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData === null) {
            return initialState;
        }

        const saved = JSON.parse(savedData);

        if (!saved || typeof saved !== "object" ||
            Array.isArray(saved)) {
            return initialState;
        }

        initialState.favorites = getValidBookIds(saved.favorites);
        initialState.library = getValidBookIds(saved.library);

        if (saved.user &&
            typeof saved.user.name === "string" &&
            saved.user.name.trim() !== "") {

            initialState.user = {
                name: saved.user.name.trim()
            };
        }

        const settings = saved.readingSettings;

        if (settings && typeof settings === "object") {
            if (["small", "medium", "large"].includes(settings.fontSize)) {
                initialState.readingSettings.fontSize = settings.fontSize;
            }

            if (["light", "dark"].includes(settings.theme)) {
                initialState.readingSettings.theme = settings.theme;
            }
        }

    } catch (error) {
        console.warn("خطا در خواندن اطلاعات ذخیره‌شده:", error);
    }

    return initialState;
}

const state = loadState();

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.warn("خطا در ذخیره اطلاعات:", error);
        return false;
    }
}

function toggleFavorite(bookId) {
    const exists = window.bookCatalog.some(function(book) {
        return book.id === bookId;
    });

    if (!exists) {
        return false;
    }

    const index = state.favorites.indexOf(bookId);

    if (index === -1) {
        state.favorites.push(bookId);
    } else {
        state.favorites.splice(index, 1);
    }

    saveState();
    return true;
}

function addToLibrary(bookId) {
    const bookExists = window.bookCatalog.some(function(book) {
        return book.id === bookId;
    });

    if (!bookExists) {
        return false;
    }

    if (state.library.includes(bookId)) {
        return true;
    }

    state.library.push(bookId);

    if (!saveState()) {
        state.library.pop();
        return false;
    }

    return true;
}




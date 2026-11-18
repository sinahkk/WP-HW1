
const SESSION_KEY = "ketabnama-session-v1";
const GUEST_KEY = "ketabnama-guest-v1";
const ACCOUNT_PREFIX = "ketabnama-account-v1-";

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

    for (const id of ids) {
        const exists = window.bookCatalog.some(function(book) {
            return book.id === id;
        });

        if (exists && !validIds.includes(id)) {
            validIds.push(id);
        }
    }

    return validIds;
}

function getStoredState(key) {
    const initialState = getDefaultState();

    try {
        const savedData = localStorage.getItem(key);

        if (!savedData) {
            return initialState;
        }

        const saved = JSON.parse(savedData);

        if (!saved || typeof saved !== "object" ||
            Array.isArray(saved)) {
            return initialState;
        }

        initialState.favorites = getValidBookIds(saved.favorites);
        initialState.library = getValidBookIds(saved.library);

        const settings = saved.readingSettings;

        if (settings && typeof settings === "object" &&
            !Array.isArray(settings)) {

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

function getSavedUser() {
    try {
        const savedData = localStorage.getItem(SESSION_KEY);

        if (!savedData) {
            return null;
        }

        const user = JSON.parse(savedData);

        if (user &&
            typeof user.id === "string" &&
            /^account-[a-f0-9]{16}$/.test(user.id) &&
            typeof user.name === "string" &&
            user.name.trim() !== "") {

            return {
                id: user.id,
                name: user.name.trim()
            };
        }
    } catch (error) {
        console.warn("خطا در خواندن حساب کاربری:", error);
    }

    return null;
}

function loadState() {
    const user = getSavedUser();

    const key = user
        ? ACCOUNT_PREFIX + user.id
        : GUEST_KEY;

    const savedState = getStoredState(key);
    savedState.user = user;

    return savedState;
}

const state = loadState();

function saveState() {
    const key = state.user
        ? ACCOUNT_PREFIX + state.user.id
        : GUEST_KEY;

    const data = {
        favorites: state.favorites,
        library: state.library,
        readingSettings: state.readingSettings
    };

    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn("خطا در ذخیره اطلاعات:", error);
        return false;
    }
}

function createAccountId(phone) {
    let first = 2166136261;
    let second = 5381;

    for (let i = 0; i < phone.length; i++) {
        const code = phone.charCodeAt(i);

        first = Math.imul(first ^ code, 16777619) >>> 0;
        second = (Math.imul(second, 33) ^ code) >>> 0;
    }

    return "account-" +
        first.toString(16).padStart(8, "0") +
        second.toString(16).padStart(8, "0");
}

function loginUser(name, phone) {
    if (typeof name !== "string" ||
        typeof phone !== "string") {
        return false;
    }

    const displayName = name.trim();

    if (displayName === "" || !/^09[0-9]{9}$/.test(phone)) {
        return false;
    }

    const user = {
        id: createAccountId(phone),
        name: displayName
    };

    const userState = getStoredState(ACCOUNT_PREFIX + user.id);

    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (error) {
        console.warn("خطا در ورود به حساب:", error);
        return false;
    }

    state.user = user;
    state.favorites = userState.favorites;
    state.library = userState.library;
    state.readingSettings = userState.readingSettings;

    return true;
}

function logoutUser() {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (error) {
        console.warn("خطا در خروج از حساب:", error);
        return false;
    }

    const guestState = getStoredState(GUEST_KEY);

    state.user = null;
    state.favorites = guestState.favorites;
    state.library = guestState.library;
    state.readingSettings = guestState.readingSettings;

    return true;
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

    if (!saveState()) {
        if (index === -1) {
            state.favorites.pop();
        } else {
            state.favorites.splice(index, 0, bookId);
        }

        return false;
    }

    return true;
}

function addToLibrary(bookId) {
    if (!state.user) {
        return false;
    }

    const exists = window.bookCatalog.some(function(book) {
        return book.id === bookId;
    });

    if (!exists) {
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


const allBooks = window.bookCatalog;
const app = document.getElementById("app");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categoryNav = document.getElementById("category-nav");
const favoriteCount = document.getElementById("favorite-count");
const params = new URLSearchParams(window.location.search);

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createLink(text, href, className) {
    const link = createElement("a", className, text);
    link.href = href;
    return link;
}

function listUrl(options = {}) {
    const query = new URLSearchParams({ view: "list", ...options });
    return "index.html?" + query.toString();
}

function bookUrl(id) {
    return "index.html?view=book&id=" + encodeURIComponent(id);
}

function updateFavoriteCount() {
    favoriteCount.textContent =
        state.favorites.length.toLocaleString("fa-IR");
}


function updateFavoriteButton(button) {
    const bookId = button.dataset.bookId;
    const isFavorite = state.favorites.includes(bookId);

    button.textContent = isFavorite
        ? "♥ حذف از علاقه‌مندی‌ها"
        : "♡ افزودن به علاقه‌مندی‌ها";

    button.classList.toggle("active", isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
}

function createFavoriteButton(book) {
    const button = createElement("button", "favorite-btn");
    button.type = "button";
    button.dataset.bookId = book.id;

    updateFavoriteButton(button);

    button.addEventListener("click", function() {
        if (!toggleFavorite(book.id)) {
            return;
        }

        updateFavoriteCount();

        if (params.get("view") === "library") {
            renderPage();
        } else {
            const buttons = app.querySelectorAll(".favorite-btn");

            for (const item of buttons) {
                updateFavoriteButton(item);
            }
        }
    });

    return button;
}

function setBookCover(image, book) {
    image.onerror = function() {
        image.onerror = null;
        image.src = book.fallbackCover;
    };

    image.src = book.cover;
}

function createBookCard(book) {
    const card = createElement("article", "book-card");

    const coverLink = createLink(
        "",
        bookUrl(book.id),
        "book-cover-link"
    );

    const cover = createElement("img", "book-cover");
    setBookCover(cover, book);
    cover.alt = "جلد کتاب " + book.title;
    cover.loading = "lazy";
    coverLink.appendChild(cover);

    const content = createElement("div", "book-content");
    const category = createElement(
        "span",
        "book-category",
        book.category
    );

    const title = createElement("h3", "book-title");
    title.appendChild(createLink(book.title, bookUrl(book.id)));

    const author = createElement(
        "p",
        "book-author",
        book.author
    );

    const footer = createElement("div", "book-footer");

    const priceText = book.price === 0
        ? "رایگان"
        : book.price.toLocaleString("fa-IR") + " تومان";

    const price = createElement(
        "span",
        "book-price",
        priceText
    );

    const rating = createElement(
        "span",
        "book-rating",
        "★ " + book.rating.toLocaleString("fa-IR")
    );

    footer.append(price, rating);

    content.append(
        category,
        title,
        author,
        createFavoriteButton(book),
        footer
    );

    if (book.price === 0) {
        const freeBadge = createElement("span", "free-book-badge", "رایگان");
        card.appendChild(freeBadge);
    }

    card.append(coverLink, content);
    return card;
}

function createBookGrid(books) {
    const grid = createElement("div", "catalog-grid");

    for (const book of books) {
        grid.appendChild(createBookCard(book));
    }

    return grid;
}

function getBooksBySection(section) {
    if (section === "recommended") {
        return [...allBooks].sort((a, b) => b.rating - a.rating);
    }

    if (section === "recent") {
        return [...allBooks].reverse();
    }

    if (section === "free") {
        return allBooks.filter(book => book.price === 0);
    }

    return [...allBooks];
}

function createSectionHeading(title, description, href, controls) {
    const heading = createElement("div", "section-heading");
    const texts = createElement("div");

    texts.append(
        createElement("h2", "", title),
        createElement("p", "", description)
    );

    const actions = createElement("div", "section-actions");

    if (href) {
        actions.appendChild(
            createLink("مشاهده همه", href, "see-all")
        );
    }

    if (controls) {
        actions.appendChild(controls);
    }

    heading.append(texts, actions);
    return heading;
}

function renderCategories() {
    const section = createElement("section");
    const grid = createElement("div", "category-grid");

    const categories = [
        ...new Set(allBooks.map(book => book.category))
    ];

    for (const category of categories) {
        const count = allBooks.filter(
            book => book.category === category
        ).length;

        const tile = createLink(
            category,
            listUrl({ category }),
            "category-tile"
        );

        tile.appendChild(
            createElement(
                "span",
                "",
                count.toLocaleString("fa-IR") + " کتاب"
            )
        );

        grid.appendChild(tile);
    }

    section.append(
        createSectionHeading(
            "دسته‌بندی‌ها",
            "موضوع مورد علاقه خود را انتخاب کنید",
            listUrl()
        ),
        grid
    );

    app.appendChild(section);
}

function renderBanner() {
    const slides = [
        {
            title: "هر صفحه، آغاز یک ماجرا",
            kicker: "به دنیای کتاب‌نما خوش آمدید",
            description: "از داستان‌های ماندگار جهان لذت ببرید و کتاب بعدی خود را پیدا کنید.",
            color: "green",
            href: listUrl(),
            ids: [
                "pride-prejudice",
                "sherlock-holmes",
                "alice-wonderland"
            ]
        },
        {
            title: "رازها در انتظار کشف شدن هستند",
            kicker: "ماجراجویی و داستان‌های معمایی",
            description: "همراه با شخصیت‌های فراموش‌نشدنی، سرنخ‌ها را دنبال کنید.",
            color: "blue",
            href: listUrl({
                category: "معمایی و ماجراجویی"
            }),
            ids: [
                "sherlock-holmes",
                "treasure-island",
                "around-world"
            ]
        },
        {
            title: "مطالعه را رایگان شروع کنید",
            kicker: "کتاب‌های رایگان",
            description: "چند اثر کلاسیک را بدون پرداخت هزینه به کتابخانه خود اضافه کنید.",
            color: "purple",
            href: listUrl({ section: "free" }),
            ids: [
                "alice-wonderland",
                "time-machine",
                "pride-prejudice"
            ]
        }
    ];

    const banner = createElement("section", "hero");
    banner.setAttribute("aria-label", "بنر معرفی کتاب‌ها");
    banner.setAttribute("aria-live", "polite");

    const text = createElement("div", "hero-text");
    const art = createElement("div", "hero-art");
    const controls = createElement("div", "hero-controls");

    const previous = createElement("button", "", "❯");
    const next = createElement("button", "", "❮");
    const counter = createElement("span", "hero-counter");

    previous.type = "button";
    next.type = "button";

    previous.setAttribute("aria-label", "بنر قبلی");
    next.setAttribute("aria-label", "بنر بعدی");

    let currentSlide = 0;

    function showSlide() {
        const slide = slides[currentSlide];

        banner.className = "hero " + slide.color;

        text.replaceChildren(
            createElement("span", "hero-kicker", slide.kicker),
            createElement("h1", "", slide.title),
            createElement("p", "", slide.description),
            createLink(
                "مشاهده کتاب‌ها",
                slide.href,
                "hero-action"
            )
        );

        art.replaceChildren();

        for (const id of slide.ids) {
            const book = allBooks.find(item => item.id === id);

            if (book) {
                const image = createElement("img");
                setBookCover(image, book);
                image.alt = "جلد کتاب " + book.title;
                art.appendChild(image);
            }
        }

        counter.textContent =
            (currentSlide + 1).toLocaleString("fa-IR") +
            " / " +
            slides.length.toLocaleString("fa-IR");
    }

    previous.addEventListener("click", function () {
        currentSlide =
            (currentSlide - 1 + slides.length) % slides.length;

        showSlide();
    });

    next.addEventListener("click", function () {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide();
    });

    controls.append(previous, counter, next);
    banner.append(text, art, controls);

    app.appendChild(banner);
    showSlide();
}

function renderBookRow(title, description, sectionName) {
    const books = getBooksBySection(sectionName);
    const section = createElement("section");

    const controls = createElement(
        "div",
        "carousel-controls"
    );

    const previous = createElement("button", "", "❯");
    const next = createElement("button", "", "❮");
    const rail = createElement("div", "book-carousel");

    previous.type = "button";
    next.type = "button";

    previous.setAttribute(
        "aria-label",
        "کتاب‌های قبلی در " + title
    );

    next.setAttribute(
        "aria-label",
        "کتاب‌های بعدی در " + title
    );

    rail.tabIndex = 0;
    rail.setAttribute("aria-label", title);

    for (const book of books) {
        rail.appendChild(createBookCard(book));
    }

    function updateControls() {
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        const position = Math.abs(rail.scrollLeft);

        previous.disabled = position < 2;
        next.disabled = position >= maxScroll - 2;
    }

    previous.addEventListener("click", function () {
        rail.scrollBy({
            left: rail.clientWidth * 0.75,
            behavior: "smooth"
        });
    });

    next.addEventListener("click", function () {
        rail.scrollBy({
            left: -rail.clientWidth * 0.75,
            behavior: "smooth"
        });
    });

    rail.addEventListener(
        "scroll",
        updateControls,
        { passive: true }
    );

    window.addEventListener("resize", updateControls);

    controls.append(previous, next);

    section.append(
        createSectionHeading(
            title,
            description,
            listUrl({ section: sectionName }),
            controls
        ),
        rail
    );

    app.appendChild(section);
    requestAnimationFrame(updateControls);
}

function renderHome() {
    renderBanner();
    renderCategories();

    renderBookRow(
        "پیشنهادهای کتاب‌نما",
        "آثاری با امتیاز بالاتر",
        "recommended"
    );

    renderBookRow(
        "تازه‌ها",
        "کتاب‌های دیگر مجموعه",
        "recent"
    );

    renderBookRow(
        "کتاب‌های رایگان",
        "مطالعه بدون هزینه",
        "free"
    );
}


function normalizeText(text) {
    return String(text)
        .trim()
        .toLowerCase()
        .replace(/[يى]/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, " ")
        .replace(/\s+/g, " ");
}



function renderList() {
    const section = params.get("section") || "";
    const category = params.get("category") || "";
    const query = params.get("q") || "";
    const free = params.get("free") === "1" || section === "free";
    const sort = params.get("sort") || "default";

    const sectionTitles = {
        recommended: "پیشنهادهای کتاب‌نما",
        recent: "تازه‌ها"
    };

    const heading = createPageHeading(
        "فهرست کتاب‌ها",
        "جستجو و فیلتر کتاب‌ها"
    );

    const title = heading.querySelector("h1");
    const filters = createElement("form", "catalog-filters");
    const fields = createElement("div", "filter-fields");

    function addField(labelText, input) {
        const label = createElement("label", "filter-field");
        label.append(createElement("span", "", labelText), input);
        fields.appendChild(label);
    }

    function addOption(select, value, text) {
        const option = createElement("option", "", text);
        option.value = value;
        select.appendChild(option);
    }

    const queryInput = createElement("input", "filter-control");
    queryInput.type = "search";
    queryInput.name = "q";
    queryInput.placeholder = "عنوان کتاب یا نام نویسنده";
    queryInput.value = query;

    addField("جستجو", queryInput);

    const categorySelect = createElement("select", "filter-control");
    addOption(categorySelect, "", "همه دسته‌بندی‌ها");

    const categories = [
        ...new Set(allBooks.map(book => book.category))
    ];

    for (const item of categories) {
        addOption(categorySelect, item, item);
    }

    categorySelect.value = category;
    addField("دسته‌بندی", categorySelect);

    const sortSelect = createElement("select", "filter-control");

    addOption(sortSelect, "default", "پیش‌فرض");
    addOption(sortSelect, "price-asc", "قیمت: کم به زیاد");
    addOption(sortSelect, "price-desc", "قیمت: زیاد به کم");
    addOption(sortSelect, "rating-desc", "بیشترین امتیاز");

    sortSelect.value = [
        "price-asc",
        "price-desc",
        "rating-desc"
    ].includes(sort) ? sort : "default";

    addField("مرتب‌سازی", sortSelect);

    const bottom = createElement("div", "filter-bottom");
    const freeLabel = createElement("label", "free-filter");
    const freeCheckbox = createElement("input");

    freeCheckbox.type = "checkbox";
    freeCheckbox.checked = free;

    freeLabel.append(freeCheckbox, "فقط کتاب‌های رایگان");

    const actions = createElement("div", "filter-actions");

    const searchButton = createElement(
        "button",
        "filter-submit",
        "جستجو"
    );

    searchButton.type = "submit";

    const resetLink = createLink(
        "پاک کردن فیلترها",
        listUrl(),
        "reset-filters"
    );

    actions.append(searchButton, resetLink);
    bottom.append(freeLabel, actions);
    filters.append(fields, bottom);

    const count = createElement("p", "result-count");
    count.setAttribute("role", "status");

    const results = createElement("div");

    app.append(heading, filters, count, results);

    function updateList() {
        const currentCategory = categorySelect.value;
        const currentQuery = normalizeText(queryInput.value);

        let books = getBooksBySection(
            section === "free" ? "" : section
        );

        if (currentCategory) {
            books = books.filter(
                book => book.category === currentCategory
            );
        }

        if (freeCheckbox.checked) {
            books = books.filter(book => book.price === 0);
        }

        if (currentQuery) {
            books = books.filter(book =>
                normalizeText(book.title).includes(currentQuery) ||
                normalizeText(book.author).includes(currentQuery)
            );
        }

        if (sortSelect.value === "price-asc") {
            books.sort((a, b) => a.price - b.price);
        } else if (sortSelect.value === "price-desc") {
            books.sort((a, b) => b.price - a.price);
        } else if (sortSelect.value === "rating-desc") {
            books.sort((a, b) => b.rating - a.rating);
        }

        count.textContent =
            books.length.toLocaleString("fa-IR") +
            " کتاب پیدا شد";

        results.replaceChildren();

        if (books.length === 0) {
            const empty = createElement("div", "empty-state");

            empty.append(
                createElement(
                    "p",
                    "",
                    "کتابی با این مشخصات پیدا نشد."
                ),
                createLink("نمایش همه کتاب‌ها", listUrl())
            );

            results.appendChild(empty);
        } else {
            results.appendChild(createBookGrid(books));
        }

        title.textContent = currentQuery
            ? "نتایج جستجو"
            : currentCategory || (
                freeCheckbox.checked
                    ? "کتاب‌های رایگان"
                    : sectionTitles[section] || "همه کتاب‌ها"
            );

        const options = {};

        if (section && section !== "free") {
            options.section = section;
        }

        if (queryInput.value.trim()) {
            options.q = queryInput.value.trim();
        }

        if (currentCategory) {
            options.category = currentCategory;
        }

        if (freeCheckbox.checked) {
            options.free = "1";
        }

        if (sortSelect.value !== "default") {
            options.sort = sortSelect.value;
        }

        const url = listUrl(options);

        try {
            window.history.replaceState(null, "", url);
        } catch (error) {
            console.warn(
                "آدرس فیلترها به‌روزرسانی نشد.",
                error
            );
        }

        searchInput.value = queryInput.value;

        for (const link of categoryNav.querySelectorAll("a")) {
            const linkCategory = new URLSearchParams(
                link.search
            ).get("category") || "";

            link.classList.toggle(
                "active",
                linkCategory === currentCategory
            );
        }
    }

    filters.addEventListener("submit", function(event) {
        event.preventDefault();
        updateList();
    });

    queryInput.addEventListener("input", updateList);
    categorySelect.addEventListener("change", updateList);
    freeCheckbox.addEventListener("change", updateList);
    sortSelect.addEventListener("change", updateList);

    updateList();
}


function createPageHeading(title, description) {
    const heading = createElement("div", "page-heading");

    heading.append(
        createLink(
            "بازگشت به صفحه اصلی",
            "index.html",
            "back-link"
        ),
        createElement("h1", "", title),
        createElement("p", "", description)
    );

    return heading;
}

function showEmpty(message) {
    const box = createElement("div", "empty-state");

    box.append(
        createElement("p", "", message),
        createLink("مشاهده همه کتاب‌ها", listUrl())
    );

    app.appendChild(box);
}


function renderBookDetail() {
    const id = params.get("id");
    const book = allBooks.find(item => item.id === id);

    if (!book) {
        app.appendChild(
            createPageHeading(
                "کتاب یافت نشد",
                "شناسه کتاب معتبر نیست."
            )
        );

        showEmpty("کتاب موردنظر پیدا نشد.");
        return;
    }

    const heading = createPageHeading(
        "جزئیات کتاب",
        book.category
    );

    const layout = createElement("article", "book-detail");

    const cover = createElement("img", "detail-cover");
    setBookCover(cover, book);
    cover.alt = "جلد کتاب " + book.title;

    const info = createElement("div", "detail-info");

    const category = createElement(
        "span",
        "book-category",
        book.category
    );

    const title = createElement("h1", "", book.title);

    const author = createElement(
        "p",
        "",
        "نویسنده: " + book.author
    );

    const rating = createElement(
        "p",
        "",
        "امتیاز: " + book.rating.toLocaleString("fa-IR") + " از ۵"
    );

    const priceText = book.price === 0
        ? "رایگان"
        : book.price.toLocaleString("fa-IR") + " تومان";

    const price = createElement(
        "p",
        "",
        "قیمت: " + priceText
    );

    const description = createElement(
        "p",
        "detail-description",
        book.description
    );

    const actions = createElement("div", "detail-actions");

    const favoriteButton = createFavoriteButton(book);

    const downloadButton = createElement(
        "button",
        "purchase-btn"
    );

    downloadButton.type = "button";

    const message = createElement("p", "detail-message");
    message.setAttribute("role", "status");

    
    function updateDownloadButton() {
        const isDownloaded = state.library.includes(book.id);

        if (isDownloaded) {
            downloadButton.textContent = "در کتابخانه من";
            downloadButton.disabled = true;
        } else if (!state.user) {
            downloadButton.textContent = book.price === 0
                ? "ورود برای دریافت رایگان"
                : "ورود برای خرید کتاب";

            downloadButton.disabled = false;
        } else if (book.price === 0) {
            downloadButton.textContent = "دریافت رایگان";
            downloadButton.disabled = false;
        } else {
            downloadButton.textContent = "خرید کتاب";
            downloadButton.disabled = false;
        }
}


    
    downloadButton.addEventListener("click", function() {
        if (state.library.includes(book.id)) {
            return;
        }

        if (!state.user) {
            window.location.href =
                "index.html?view=account&bookId=" +
                encodeURIComponent(book.id);

            return;
        }


        if (book.price > 0) {
            const confirmed = window.confirm(
                "آیا از خرید نمایشی کتاب «" +
                book.title +
                "» به قیمت " +
                priceText +
                " مطمئن هستید؟"
            );

            if (!confirmed) {
                return;
            }
        }

        if (addToLibrary(book.id)) {
            updateDownloadButton();

            message.textContent = book.price === 0
                ? "کتاب با موفقیت به کتابخانه اضافه شد."
                : "خرید نمایشی انجام شد و کتاب به کتابخانه اضافه شد.";
        } else {
            message.textContent =
                "امکان ذخیره کتاب وجود ندارد. دوباره تلاش کنید.";
        }
    });

    const hasSample = Array.isArray(book.sample) &&
        book.sample.length > 0;

    let sampleControl;

    if (hasSample) {
        sampleControl = createLink(
            "مطالعه نمونه کتاب",
            "index.html?view=sample&id=" +
                encodeURIComponent(book.id),
            "sample-link"
        );
    } else {
        sampleControl = createElement(
            "button",
            "sample-link",
            "نمونه مطالعه موجود نیست"
        );

        sampleControl.type = "button";
        sampleControl.disabled = true;
        sampleControl.title = "این کتاب نمونه مطالعه ندارد";
    }

    const note = createElement(
        "p",
        "detail-note",
        "خرید و دریافت کتاب در این پروژه فقط به صورت نمایشی انجام می‌شود."
    );

    actions.append(
        favoriteButton,
        downloadButton,
        sampleControl,
        message
    );

    info.append(
        category,
        title,
        author,
        rating,
        price,
        description,
        actions,
        note
    );

    layout.append(cover, info);

    const relatedBooks = allBooks
        .filter(item =>
            item.category === book.category &&
            item.id !== book.id
        )
        .slice(0, 3);

    const relatedSection = createElement(
        "section",
        "related-section"
    );

    relatedSection.appendChild(
        createSectionHeading(
            "کتاب‌های مرتبط",
            "کتاب‌های دیگری از همین دسته‌بندی",
            listUrl({ category: book.category })
        )
    );

    if (relatedBooks.length > 0) {
        relatedSection.appendChild(createBookGrid(relatedBooks));
    }

    app.append(heading, layout, relatedSection);

    updateDownloadButton();
}



function renderSample() {
    const id = params.get("id");
    const book = allBooks.find(item => item.id === id);

    if (!book) {
        app.appendChild(
            createPageHeading("کتاب یافت نشد", "شناسه کتاب معتبر نیست.")
        );
        showEmpty("کتاب موردنظر پیدا نشد.");
        return;
    }

    const heading = createElement("div", "page-heading");

    heading.append(
        createLink("بازگشت به جزئیات کتاب", bookUrl(book.id), "back-link"),
        createElement("h1", "", "نمونه مطالعه: " + book.title),
        createElement("p", "", "نویسنده: " + book.author)
    );

    app.appendChild(heading);

    if (!Array.isArray(book.sample) || book.sample.length === 0) {
        const empty = createElement("div", "empty-state");

        empty.append(
            createElement("p", "", "برای این کتاب نمونه مطالعه موجود نیست."),
            createLink("بازگشت به جزئیات کتاب", bookUrl(book.id))
        );

        app.appendChild(empty);
        return;
    }

    const section = createElement("section", "reader-section");
    const toolbar = createElement("div", "reader-toolbar");
    const fontGroup = createElement("div", "reader-control-group");
    const themeGroup = createElement("div", "reader-control-group");
    const status = createElement("p", "reader-message");
    const reader = createElement("article", "sample-reader");
    const fontButtons = [];
    const themeButtons = [];

    fontGroup.setAttribute("role", "group");
    fontGroup.setAttribute("aria-label", "اندازه قلم");

    themeGroup.setAttribute("role", "group");
    themeGroup.setAttribute("aria-label", "تم مطالعه");

    status.setAttribute("role", "status");
    reader.setAttribute("aria-label", "نمونه متن کتاب " + book.title);

    fontGroup.appendChild(
        createElement("span", "reader-control-label", "اندازه قلم")
    );

    themeGroup.appendChild(
        createElement("span", "reader-control-label", "تم مطالعه")
    );

    function applyReadingSettings() {
        reader.dataset.fontSize = state.readingSettings.fontSize;
        reader.dataset.theme = state.readingSettings.theme;

        for (const button of fontButtons) {
            const active =
                button.dataset.value === state.readingSettings.fontSize;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        }

        for (const button of themeButtons) {
            const active =
                button.dataset.value === state.readingSettings.theme;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        }
    }

    const fontOptions = [
        { value: "small", label: "کوچک" },
        { value: "medium", label: "متوسط" },
        { value: "large", label: "بزرگ" }
    ];

    for (const option of fontOptions) {
        const button = createElement("button", "reader-option", option.label);
        button.type = "button";
        button.dataset.value = option.value;

        button.addEventListener("click", function() {
            const previous = state.readingSettings.fontSize;
            state.readingSettings.fontSize = option.value;

            if (!saveState()) {
                state.readingSettings.fontSize = previous;
                status.textContent = "تنظیمات ذخیره نشد. دوباره تلاش کنید.";
                return;
            }

            applyReadingSettings();
            status.textContent = "اندازه قلم ذخیره شد.";
        });

        fontGroup.appendChild(button);
        fontButtons.push(button);
    }

    const themeOptions = [
        { value: "light", label: "روشن" },
        { value: "dark", label: "تیره" }
    ];

    for (const option of themeOptions) {
        const button = createElement("button", "reader-option", option.label);
        button.type = "button";
        button.dataset.value = option.value;

        button.addEventListener("click", function() {
            const previous = state.readingSettings.theme;
            state.readingSettings.theme = option.value;

            if (!saveState()) {
                state.readingSettings.theme = previous;
                status.textContent = "تنظیمات ذخیره نشد. دوباره تلاش کنید.";
                return;
            }

            applyReadingSettings();
            status.textContent = "تم مطالعه ذخیره شد.";
        });

        themeGroup.appendChild(button);
        themeButtons.push(button);
    }

    for (const paragraph of book.sample) {
        reader.appendChild(createElement("p", "", paragraph));
    }

    toolbar.append(fontGroup, themeGroup);

    section.append(
        toolbar,
        status,
        reader,
        createLink("بازگشت به جزئیات کتاب", bookUrl(book.id), "sample-back")
    );

    app.appendChild(section);
    applyReadingSettings();
}




function renderLibrary() {
    app.appendChild(
        createPageHeading(
            "کتابخانه من",
            "علاقه‌مندی‌ها و کتاب‌های دریافت‌شده"
        )
    );

    const favorites = allBooks.filter(
        book => state.favorites.includes(book.id)
    );

    const downloaded = allBooks.filter(
        book => state.library.includes(book.id)
    );

    app.appendChild(
        createSectionHeading(
            "علاقه‌مندی‌ها",
            "کتاب‌هایی که نشان کرده‌اید",
            null
        )
    );

    if (favorites.length > 0) {
        app.appendChild(createBookGrid(favorites));
    } else {
        showEmpty(
            "هنوز کتابی به علاقه‌مندی‌ها اضافه نکرده‌اید."
        );
    }

    app.appendChild(
        createSectionHeading(
            "کتاب‌های دریافت‌شده",
            "کتاب‌هایی که به کتابخانه اضافه کرده‌اید",
            null
        )
    );

    if (downloaded.length > 0) {
        app.appendChild(createBookGrid(downloaded));
    } else {
        showEmpty(
            "هنوز کتابی دریافت نکرده‌اید. برای دریافت کتاب، به صفحه جزئیات آن بروید."
        );
    }
}

function normalizePhoneNumber(value) {
    return value.trim()
        .replace(/[۰-۹]/g, digit =>
            String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
        )
        .replace(/[٠-٩]/g, digit =>
            String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
        );
}


function renderAccount() {
    app.appendChild(
        createPageHeading(
            "حساب من",
            "ورود نمایشی به کتاب‌نما"
        )
    );

    const panel = createElement("section", "account-panel");

    if (state.user) {
        panel.append(
            createElement(
                "h2",
                "",
                "خوش آمدید، " + state.user.name
            ),
            createElement(
                "p",
                "account-note",
                "شما وارد حساب نمایشی خود شده‌اید. برای خروج از گزینه خروج در سربرگ استفاده کنید."
            )
        );

        app.appendChild(panel);
        return;
    }

    const form = createElement("form", "account-form");
    form.noValidate = true;

    const nameField = createElement("div", "form-field");

    const nameLabel = createElement(
        "label",
        "",
        "نام نمایشی"
    );
    nameLabel.htmlFor = "display-name";

    const nameInput = createElement("input", "account-input");
    nameInput.id = "display-name";
    nameInput.type = "text";
    nameInput.maxLength = 60;
    nameInput.placeholder = "نام خود را وارد کنید";
    nameInput.required = true;
    nameInput.setAttribute(
        "aria-describedby",
        "display-name-error"
    );

    const nameError = createElement("small", "field-error");
    nameError.id = "display-name-error";

    nameField.append(nameLabel, nameInput, nameError);

    const phoneField = createElement("div", "form-field");

    const phoneLabel = createElement(
        "label",
        "",
        "شماره موبایل"
    );
    phoneLabel.htmlFor = "phone-number";

    const phoneInput = createElement("input", "account-input");
    phoneInput.id = "phone-number";
    phoneInput.type = "tel";
    phoneInput.inputMode = "numeric";
    phoneInput.dir = "ltr";
    phoneInput.maxLength = 11;
    phoneInput.placeholder = "09xxxxxxxxx";
    phoneInput.autocomplete = "off";
    phoneInput.required = true;
    phoneInput.setAttribute(
        "aria-describedby",
        "phone-number-error"
    );

    const phoneError = createElement("small", "field-error");
    phoneError.id = "phone-number-error";

    phoneField.append(phoneLabel, phoneInput, phoneError);

    const submitButton = createElement(
        "button",
        "login-btn",
        "ورود"
    );
    submitButton.type = "submit";

    const status = createElement("p", "login-status");
    status.setAttribute("role", "status");

    const note = createElement(
        "p",
        "account-note",
        "این ورود فقط نمایشی است. از شماره واقعی استفاده نکنید. شماره موبایل ذخیره نمی‌شود."
    );

    form.append(
        nameField,
        phoneField,
        submitButton,
        status
    );

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const phone = normalizePhoneNumber(phoneInput.value);

        let isValid = true;

        nameError.textContent = "";
        phoneError.textContent = "";
        status.textContent = "";

        if (name === "") {
            nameError.textContent =
                "نام نمایشی نمی‌تواند خالی باشد.";

            nameInput.setAttribute("aria-invalid", "true");
            isValid = false;
        } else {
            nameInput.removeAttribute("aria-invalid");
        }

        if (!/^09[0-9]{9}$/.test(phone)) {
            phoneError.textContent =
                "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.";

            phoneInput.setAttribute("aria-invalid", "true");
            isValid = false;
        } else {
            phoneInput.removeAttribute("aria-invalid");
        }

        if (!isValid) {
            return;
        }

        if (!loginUser(name, phone)) {
            status.textContent =
                "امکان ذخیره اطلاعات وجود ندارد.";
            return;
        }

        
        updateHeaderUser();
        updateFavoriteCount();

        const requestedBookId = params.get("bookId");


        const validBook = allBooks.some(
            book => book.id === requestedBookId
        );

        if (requestedBookId && validBook) {
            window.location.href = bookUrl(requestedBookId);
        } else {
            renderPage();
        }
    });

    panel.append(
        createElement("h2", "", "ورود به حساب"),
        note,
        form
    );

    app.appendChild(panel);
}

function updateHeaderUser() {
    const accountLink = document.getElementById("account-link");
    const logoutButton = document.getElementById("logout-button");

    if (state.user) {
        accountLink.textContent = state.user.name;
        logoutButton.hidden = false;
    } else {
        accountLink.textContent = "حساب من";
        logoutButton.hidden = true;
    }
}


function renderHeader() {
    const categories = [
        ...new Set(allBooks.map(book => book.category))
    ];

    categoryNav.replaceChildren(
        createLink("همه کتاب‌ها", listUrl())
    );

    for (const category of categories) {
        const link = createLink(
            category,
            listUrl({ category })
        );

        if (params.get("category") === category) {
            link.classList.add("active");
        }

        categoryNav.appendChild(link);
    }

    searchInput.value = params.get("q") || "";

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const query = searchInput.value.trim();

        const currentParams = new URLSearchParams(
            window.location.search
        );

        const options = {};

        if (currentParams.get("view") === "list") {
            for (const key of ["section", "category", "free", "sort"]) {
                const value = currentParams.get(key);

                if (value) {
                    options[key] = value;
                }
            }
        }

        if (query) {
            options.q = query;
        }

        window.location.href = listUrl(options);
    });

    const logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", function() {
        if (!logoutUser()) {
            window.alert("خروج از حساب انجام نشد.");
            return;
        }

        
        updateHeaderUser();
        updateFavoriteCount();
        renderPage();

    });

    updateHeaderUser();
    updateFavoriteCount();
}



function renderPage() {
    app.replaceChildren();

    const view = params.get("view") || "home";

    if (view === "list") {
        renderList();
    } else if (view === "book") {
        renderBookDetail();
    } else if (view === "sample") {
        renderSample();
    } else if (view === "library") {
        renderLibrary();
    } else if (view === "account") {
        renderAccount();
    } else {
        renderHome();
    }
}


renderHeader();
renderPage();

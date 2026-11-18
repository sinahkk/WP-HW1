
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

function createFavoriteButton(book) {
    const button = createElement("button", "favorite-btn");
    button.type = "button";

    function updateButton() {
        const active = state.favorites.includes(book.id);

        button.textContent = active
            ? "♥ حذف از علاقه‌مندی‌ها"
            : "♡ افزودن به علاقه‌مندی‌ها";

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    }

    button.addEventListener("click", function () {
        if (toggleFavorite(book.id)) {
            updateButton();
            updateFavoriteCount();

            if (params.get("view") === "library") {
                renderPage();
            }
        }
    });

    updateButton();
    return button;
}

function createBookCard(book) {
    const card = createElement("article", "book-card");

    const coverLink = createLink(
        "",
        bookUrl(book.id),
        "book-cover-link"
    );

    const cover = createElement("img", "book-cover");
    cover.src = book.cover;
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
                image.src = book.cover;
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

        showEmpty("کتاب موردنظر در مجموعه وجود ندارد.");
        return;
    }

    const layout = createElement("article", "book-detail");

    const cover = createElement("img", "detail-cover");
    cover.src = book.cover;
    cover.alt = "جلد کتاب " + book.title;

    const info = createElement("div", "detail-info");

    const priceText = book.price === 0
        ? "رایگان"
        : book.price.toLocaleString("fa-IR") + " تومان";

    const action = createElement("div", "detail-action");
    action.appendChild(createFavoriteButton(book));

    info.append(
        createElement(
            "span",
            "book-category",
            book.category
        ),
        createElement("h1", "", book.title),
        createElement(
            "p",
            "",
            "نویسنده: " + book.author
        ),
        createElement(
            "p",
            "",
            "امتیاز: " +
            book.rating.toLocaleString("fa-IR") +
            " از ۵"
        ),
        createElement(
            "p",
            "",
            "قیمت: " + priceText
        ),
        createElement(
            "p",
            "detail-description",
            book.description
        ),
        action
    );

    layout.append(cover, info);

    app.append(
        createPageHeading(
            "جزئیات کتاب",
            "اطلاعات کتاب انتخاب‌شده"
        ),
        layout
    );
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
            "هنوز کتابی دریافت نکرده‌اید. امکان دریافت در مراحل بعد اضافه می‌شود."
        );
    }
}

function renderAccount() {
    app.appendChild(
        createPageHeading(
            "حساب من",
            "حساب نمایشی کتاب‌نما"
        )
    );

    const message = state.user
        ? "کاربر فعلی: " + state.user.name
        : "فرم ورود نمایشی در گام ششم به این صفحه اضافه می‌شود.";

    showEmpty(message);
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
}

function renderPage() {
    app.replaceChildren();

    const view = params.get("view") || "home";

    if (view === "list") {
        renderList();
    } else if (view === "book") {
        renderBookDetail();
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

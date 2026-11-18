
/*
    اطلاعات کتاب‌های پروژه کتاب‌نما
    منابع اصلی: Project Gutenberg
    قیمت‌ها و امتیازها: آزمایشی
    نمونه متن‌ها: بازآفرینی آموزشی
*/

const books = [
    {
        id: "pride-prejudice",
        title: "غرور و تعصب",
        author: "جین آستن",
        category: "رمان کلاسیک",
        description: "داستان الیزابت بنت و آقای دارسی درباره قضاوت، تفاوت‌های اجتماعی و شناخت تدریجی یکدیگر است.",
        price: 0,
        rating: 4.8,
        gutenbergId: 1342,
        sample: [
            "خانواده بنت از شنیدن خبری تازه هیجان‌زده شده بودند. قرار بود خانواده‌ای ثروتمند به خانه‌ای در نزدیکی روستا نقل مکان کنند.",
            "الیزابت با لبخند به صحبت‌های اطرافیان گوش می‌داد. او معتقد بود که نباید پیش از شناختن افراد درباره شخصیت آن‌ها قضاوت کرد.",
            "در جمع‌های کوچک روستا، برداشت‌ها به‌سرعت شکل می‌گرفتند. گاهی یک نگاه یا جمله کوتاه می‌توانست آغاز سوءتفاهمی طولانی باشد."
        ]
    },

    {
        id: "emma",
        title: "اما",
        author: "جین آستن",
        category: "رمان کلاسیک",
        description: "اما وودهاوس تصور می‌کند در شناخت احساسات دیگران مهارت دارد، اما تصمیم‌های او نتایج غیرمنتظره‌ای به همراه دارند.",
        price: 320000,
        rating: 4.4,
        gutenbergId: 158,
        sample: []
    },

    {
        id: "jane-eyre",
        title: "جین ایر",
        author: "شارلوت برونته",
        category: "رمان کلاسیک",
        description: "داستان دختری مستقل که در مسیر زندگی برای رسیدن به احترام، عشق و استقلال تلاش می‌کند.",
        price: 390000,
        rating: 4.7,
        gutenbergId: 1260,
        sample: []
    },

    {
        id: "great-expectations",
        title: "آرزوهای بزرگ",
        author: "چارلز دیکنز",
        category: "رمان کلاسیک",
        description: "پیپ، پسری یتیم، با فرصت‌هایی غیرمنتظره روبه‌رو می‌شود و معنای واقعی خوشبختی را کشف می‌کند.",
        price: 450000,
        rating: 4.5,
        gutenbergId: 1400,
        sample: []
    },

    {
        id: "sherlock-holmes",
        title: "ماجراهای شرلوک هولمز",
        author: "آرتور کانن دویل",
        category: "معمایی و ماجراجویی",
        description: "مجموعه‌ای از پرونده‌های کارآگاهی که شرلوک هولمز با دقت و استدلال آن‌ها را حل می‌کند.",
        price: 0,
        rating: 4.9,
        gutenbergId: 1661,
        sample: [
            "وقتی وارد اتاق شدم، هولمز کنار پنجره ایستاده بود و چیزی را با دقت بررسی می‌کرد.",
            "او تنها با نگاه کردن به کفش‌های من توانست مسیر پیاده‌روی صبحگاهی‌ام را حدس بزند. از این توانایی او شگفت‌زده شدم.",
            "روی میز نامه‌ای ناشناس قرار داشت. هولمز گفت که گاهی نوع کاغذ و شیوه نوشتن، بیشتر از متن نامه اطلاعات در اختیار ما قرار می‌دهد."
        ]
    },

    {
        id: "baskervilles",
        title: "سگ باسکرویل",
        author: "آرتور کانن دویل",
        category: "معمایی و ماجراجویی",
        description: "هولمز و واتسون برای حل معمای مرگی مرموز به سرزمینی مه‌آلود سفر می‌کنند.",
        price: 420000,
        rating: 4.7,
        gutenbergId: 2852,
        sample: []
    },

    {
        id: "treasure-island",
        title: "جزیره گنج",
        author: "رابرت لوئیس استیونسن",
        category: "معمایی و ماجراجویی",
        description: "نقشه‌ای قدیمی، سفری دریایی و مواجهه با دزدان دریایی، ماجرایی هیجان‌انگیز را آغاز می‌کند.",
        price: 700000,
        rating: 4.6,
        gutenbergId: 120,
        sample: []
    },

    {
        id: "around-world",
        title: "دور دنیا در هشتاد روز",
        author: "ژول ورن",
        category: "معمایی و ماجراجویی",
        description: "فیلیاس فاگ تصمیم می‌گیرد در هشتاد روز دور دنیا سفر کند و با چالش‌های متعددی روبه‌رو می‌شود.",
        price: 480000,
        rating: 4.5,
        gutenbergId: 103,
        sample: []
    },

    {
        id: "alice-wonderland",
        title: "آلیس در سرزمین عجایب",
        author: "لوئیس کارول",
        category: "فانتزی و علمی‌تخیلی",
        description: "آلیس با دنبال کردن خرگوشی عجیب وارد جهانی شگفت‌انگیز با قوانین متفاوت می‌شود.",
        price: 0,
        rating: 4.8,
        gutenbergId: 11,
        sample: [
            "آلیس کنار خواهرش نشسته بود و از سکوت بعدازظهر خسته شده بود. او به اطراف نگاه می‌کرد و در فکر سرگرمی تازه‌ای بود.",
            "ناگهان خرگوش سفیدی از نزدیکی او عبور کرد. خرگوش با عجله حرکت می‌کرد و مدام به ساعت کوچکش نگاه می‌انداخت.",
            "کنجکاوی آلیس بیشتر شد. از جایش برخاست و خرگوش را دنبال کرد، بدون آنکه بداند این مسیر او را به چه دنیای عجیبی خواهد برد."
        ]
    },

    {
        id: "wizard-oz",
        title: "جادوگر شگفت‌انگیز اُز",
        author: "ال. فرانک باوم",
        category: "فانتزی و علمی‌تخیلی",
        description: "دوروتی و دوستانش در مسیری پرماجرا به دنبال آرزوهایشان و راه بازگشت به خانه هستند.",
        price: 490000,
        rating: 4.5,
        gutenbergId: 55,
        sample: []
    },

    {
        id: "time-machine",
        title: "ماشین زمان",
        author: "اچ. جی. ولز",
        category: "فانتزی و علمی‌تخیلی",
        description: "دانشمندی با دستگاهی شگفت‌انگیز به آینده سفر می‌کند و با سرنوشت متفاوت انسان‌ها روبه‌رو می‌شود.",
        price: 0,
        rating: 4.7,
        gutenbergId: 35,
        sample: [
            "مسافر زمان در میان مهمانان نشسته بود و درباره مفهوم زمان صحبت می‌کرد. او باور داشت که شاید بتوان مانند مکان، در زمان نیز حرکت کرد.",
            "مهمانان با تردید به حرف‌های او گوش می‌دادند. بعضی تصور می‌کردند که این صحبت‌ها تنها یک سرگرمی علمی است.",
            "او دستگاه کوچکی را روی میز گذاشت. همه ساکت شدند و با کنجکاوی به آن نگاه کردند تا نتیجه آزمایشی عجیب را مشاهده کنند."
        ]
    },

    {
        id: "war-worlds",
        title: "جنگ دنیاها",
        author: "اچ. جی. ولز",
        category: "فانتزی و علمی‌تخیلی",
        description: "با ورود موجوداتی از مریخ به زمین، زندگی عادی انسان‌ها تغییر می‌کند و تلاش برای بقا آغاز می‌شود.",
        price: 670000,
        rating: 4.6,
        gutenbergId: 36,
        sample: []
    }
];


/*
    تولید جلد اختصاصی برای هر کتاب
    با استفاده از SVG داخلی، بدون فایل خارجی
*/

function escapeSvgText(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function createBookCover(book) {
    const colors = {
        "رمان کلاسیک": ["#60435f", "#ad7c86"],
        "معمایی و ماجراجویی": ["#163c52", "#397b82"],
        "فانتزی و علمی‌تخیلی": ["#342d68", "#8277c4"]
    };

    const selectedColors = colors[book.category] || ["#345", "#789"];

    const words = book.title.split(" ");
    const middle = Math.ceil(words.length / 2);

    const firstLine = escapeSvgText(
        words.slice(0, middle).join(" ")
    );

    const secondLine = escapeSvgText(
        words.slice(middle).join(" ")
    );

    const author = escapeSvgText(book.author);

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="420" height="600" viewBox="0 0 420 600">

            <defs>
                <linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${selectedColors[0]}"/>
                    <stop offset="100%" stop-color="${selectedColors[1]}"/>
                </linearGradient>
            </defs>

            <rect width="420" height="600" fill="url(#cover-bg)"/>

            <rect x="22" y="22" width="376" height="556"
                  rx="8" fill="none"
                  stroke="#ffffff" stroke-opacity="0.5"
                  stroke-width="2"/>

            <circle cx="210" cy="225" r="100"
                    fill="none" stroke="#ffffff"
                    stroke-opacity="0.3" stroke-width="3"/>

            <text x="210" y="245"
                  font-size="80" text-anchor="middle"
                  fill="#ffffff">✦</text>

            <g font-family="Tahoma,Arial,sans-serif"
               fill="#ffffff" text-anchor="middle"
               direction="rtl">

                <text x="210" y="385"
                      font-size="25" font-weight="bold">
                    ${firstLine}
                </text>

                <text x="210" y="424"
                      font-size="25" font-weight="bold">
                    ${secondLine}
                </text>

                <text x="210" y="505" font-size="19">
                    ${author}
                </text>
            </g>

        </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


// تکمیل اطلاعات کتاب‌ها با جلد و لینک منبع
window.bookCatalog = books.map(function (book) {
    return {
        ...book,
        cover: createBookCover(book),
        source: "https://www.gutenberg.org/ebooks/" + book.gutenbergId
    };
});

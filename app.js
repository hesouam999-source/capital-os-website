const releaseApi = "https://api.github.com/repos/hesouam999-source/capital-os-updates/releases/latest";
const releasePage = "https://github.com/hesouam999-source/capital-os-updates/releases/latest";
const languageStorageKey = "capital-os-website-language";

const translations = {
  en: {
    pageTitle: "Capital OS — Your Personal Financial Operating System",
    metaDescription: "Capital OS is a local-first personal financial operating system for tracking net worth, assets, liabilities, and everyday finances.",
    skipToContent: "Skip to content", homeAria: "Capital OS home", mainNavigation: "Main navigation", languageSelector: "Language selector",
    navFeatures: "Features", navInstall: "Install", navScreenshots: "Screenshots", heroEyebrow: "LOCAL-FIRST • WINDOWS BETA",
    heroTitleFirst: "Your Personal Financial", heroTitleSecond: "Operating System.",
    heroDescription: "See what you own, what you owe, and how your financial life changes over time — without handing your data to a cloud service.",
    checkingRelease: "Checking latest release…", connectingRelease: "Connecting to the official release channel…", exploreFeatures: "Explore features",
    appPreview: "Capital OS application preview", previewOverview: "Overview", previewDate: "October 2026", previewNetWorth: "Net worth", previewMonthlyFlow: "Monthly flow", previewCaption: "Built for clarity, not complexity.",
    productPrinciples: "Product principles", trustLocalTitle: "Local data", trustLocalText: "Your data stays on your computer", trustPictureTitle: "One clear picture", trustPictureText: "Capital and cash flow, side by side", trustUpdatesTitle: "Built to evolve", trustUpdatesText: "Updates arrive through the app",
    foundationEyebrow: "THE FOUNDATION", featuresTitle: "Everything you need to understand your money.", featuresDescription: "Capital OS brings long-term wealth tracking and everyday personal finance into one focused desktop application.",
    featureNetWorthTitle: "Net Worth Tracking", featureNetWorthText: "Track the value of your full financial picture over time.", featureAssetsTitle: "Assets & Liabilities", featureAssetsText: "Keep property, vehicles, accounts, debts, and other objects in one place.", featureSnapshotsTitle: "Historical Snapshots", featureSnapshotsText: "See how your capital changed, with a clear history you can revisit.", featureFinanceTitle: "Finance Management", featureFinanceText: "Manage accounts, transactions, budgets, goals, and recurring payments.", featureExcelTitle: "Excel Import", featureExcelText: "Bring historical financial data into a structured, reviewable workspace.", featureWorkspaceTitle: "Customizable Workspace", featureWorkspaceText: "Arrange the information that matters most to you.",
    screenshotsEyebrow: "A CLOSER LOOK", screenshotsTitle: "Designed for a calm financial review.", screenshotsDescription: "Product screenshots will be added here as the beta evolves.", screenshotPlaceholders: "Screenshot placeholders", screenshotCapital: "Capital overview", screenshotFinance: "Finance workspace", screenshotHistory: "Historical view", screenshotComingSoon: "Screenshot coming soon",
    windowsBeta: "WINDOWS BETA", installTitle: "Start with your own financial system.", installVersionLoading: "The latest beta will appear here when the release channel is available.", guideDownloadTitle: "Download", guideDownloadText: "Download the latest Windows installer from the official release channel.", guideInstallTitle: "Install", guideInstallText: "Run the installer and follow the Windows prompts. Your existing data is kept in its current location.", guideOpenTitle: "Open Capital OS", guideOpenText: "Create a test Capital first if you are evaluating the beta.", betaNoticeTitle: "Beta notice:", betaNoticeText: "the installer is not yet Authenticode-signed by Windows. Windows may show a reputation warning. Download only from this official page or the linked GitHub Release.", footerDescription: "Local-first personal finance for Windows.", reportBug: "Report a bug",
    downloadForWindows: "Download for Windows", downloadAria: "Download Capital OS {version} for Windows", latestRelease: "Latest public beta: v{version} · Windows x64", currentRelease: "Current public beta: v{version} for Windows x64.", viewDownloads: "View Windows downloads", releaseLoadError: "The latest version could not be loaded. Open the official releases page to download it.", releaseInstallError: "Open the official release page to choose the latest Windows installer.",
  },
  ru: {
    pageTitle: "Capital OS — Ваша персональная финансовая ОС",
    metaDescription: "Capital OS — локальная персональная финансовая система для учёта капитала, активов, обязательств и ежедневных финансов.",
    skipToContent: "Перейти к содержимому", homeAria: "Главная Capital OS", mainNavigation: "Основная навигация", languageSelector: "Выбор языка",
    navFeatures: "Возможности", navInstall: "Установка", navScreenshots: "Скриншоты", heroEyebrow: "ЛОКАЛЬНЫЕ ДАННЫЕ • WINDOWS BETA",
    heroTitleFirst: "Ваша персональная", heroTitleSecond: "финансовая ОС.",
    heroDescription: "Видьте, чем владеете, что должны и как меняется ваша финансовая жизнь — без передачи данных в облачный сервис.",
    checkingRelease: "Проверяем последнюю версию…", connectingRelease: "Подключаемся к официальному каналу релизов…", exploreFeatures: "Посмотреть возможности",
    appPreview: "Предпросмотр приложения Capital OS", previewOverview: "Обзор", previewDate: "Октябрь 2026", previewNetWorth: "Капитал", previewMonthlyFlow: "Денежный поток за месяц", previewCaption: "Создано для ясности, а не сложности.",
    productPrinciples: "Принципы продукта", trustLocalTitle: "Данные локально", trustLocalText: "Ваши данные остаются на компьютере", trustPictureTitle: "Одна понятная картина", trustPictureText: "Капитал и денежный поток рядом", trustUpdatesTitle: "Готово к развитию", trustUpdatesText: "Обновления приходят через приложение",
    foundationEyebrow: "ОСНОВА", featuresTitle: "Всё, чтобы понимать свои финансы.", featuresDescription: "Capital OS объединяет долгосрочный учёт капитала и ежедневные личные финансы в одном понятном приложении для ПК.",
    featureNetWorthTitle: "Учёт капитала", featureNetWorthText: "Отслеживайте стоимость всей вашей финансовой картины во времени.", featureAssetsTitle: "Активы и обязательства", featureAssetsText: "Храните недвижимость, автомобили, счета, долги и другие объекты в одном месте.", featureSnapshotsTitle: "Исторические снимки", featureSnapshotsText: "Смотрите, как менялся капитал, в понятной истории.", featureFinanceTitle: "Управление финансами", featureFinanceText: "Ведите счета, операции, бюджеты, цели и регулярные платежи.", featureExcelTitle: "Импорт из Excel", featureExcelText: "Переносите исторические финансовые данные в структурированное рабочее пространство.", featureWorkspaceTitle: "Настраиваемое рабочее пространство", featureWorkspaceText: "Расположите информацию, которая важнее всего для вас.",
    screenshotsEyebrow: "БЛИЖЕ К ПРОДУКТУ", screenshotsTitle: "Спокойный взгляд на финансы.", screenshotsDescription: "Скриншоты продукта будут добавлены по мере развития бета-версии.", screenshotPlaceholders: "Места для скриншотов", screenshotCapital: "Обзор капитала", screenshotFinance: "Рабочее пространство финансов", screenshotHistory: "Исторический вид", screenshotComingSoon: "Скриншот скоро появится",
    windowsBeta: "WINDOWS BETA", installTitle: "Начните со своей финансовой системы.", installVersionLoading: "Последняя бета появится здесь, когда будет доступен канал релизов.", guideDownloadTitle: "Скачать", guideDownloadText: "Скачайте последнюю версию установщика Windows из официального канала релизов.", guideInstallTitle: "Установить", guideInstallText: "Запустите установщик и следуйте подсказкам Windows. Существующие данные останутся на прежнем месте.", guideOpenTitle: "Открыть Capital OS", guideOpenText: "Для знакомства с бета-версией сначала создайте тестовый Capital.", betaNoticeTitle: "Бета-версия:", betaNoticeText: "у установщика пока нет подписи Windows Authenticode. Windows может показать предупреждение репутации. Скачивайте программу только с этой официальной страницы или по ссылке на GitHub Release.", footerDescription: "Локальная персональная финансовая система для Windows.", reportBug: "Сообщить об ошибке",
    downloadForWindows: "Скачать для Windows", downloadAria: "Скачать Capital OS {version} для Windows", latestRelease: "Последняя публичная бета: v{version} · Windows x64", currentRelease: "Текущая публичная бета: v{version} для Windows x64.", viewDownloads: "Открыть загрузки для Windows", releaseLoadError: "Не удалось загрузить последнюю версию. Откройте официальную страницу релизов, чтобы скачать её.", releaseInstallError: "Откройте официальную страницу релизов и выберите последнюю версию установщика Windows.",
  },
};

const primaryButton = document.querySelector("#download-button");
const installButton = document.querySelector("#install-download-button");
const primaryLabel = document.querySelector("#download-label");
const installLabel = document.querySelector("#install-download-label");
const status = document.querySelector("#release-status");
const installVersion = document.querySelector("#install-version");
const languageButtons = document.querySelectorAll("[data-language]");
let currentLanguage = "en";
let releaseState = { type: "loading" };

function getInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    if (savedLanguage === "en" || savedLanguage === "ru") return savedLanguage;
  } catch {
    // The site remains usable when browser storage is unavailable.
  }
  return navigator.language?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function t(key, values = {}) {
  const template = translations[currentLanguage][key] || translations.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function setDownloadLink(button, label, url, version) {
  button.href = url;
  button.removeAttribute("aria-disabled");
  button.classList.remove("is-loading");
  label.textContent = t("downloadForWindows");
  button.setAttribute("aria-label", t("downloadAria", { version }));
}

function renderReleaseState() {
  status.classList.remove("error");
  if (releaseState.type === "ready") {
    setDownloadLink(primaryButton, primaryLabel, releaseState.url, releaseState.version);
    setDownloadLink(installButton, installLabel, releaseState.url, releaseState.version);
    status.textContent = t("latestRelease", { version: releaseState.version });
    installVersion.textContent = t("currentRelease", { version: releaseState.version });
    return;
  }
  if (releaseState.type === "error") {
    [primaryButton, installButton].forEach((button) => {
      button.href = releasePage;
      button.removeAttribute("aria-disabled");
      button.classList.remove("is-loading");
    });
    primaryLabel.textContent = t("viewDownloads");
    installLabel.textContent = t("viewDownloads");
    status.textContent = t("releaseLoadError");
    status.classList.add("error");
    installVersion.textContent = t("releaseInstallError");
  }
}

function applyLanguage(language, persist = false) {
  currentLanguage = language === "ru" ? "ru" : "en";
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("metaDescription");
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  languageButtons.forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage)); });
  if (persist) {
    try { localStorage.setItem(languageStorageKey, currentLanguage); } catch { /* Storage is optional. */ }
  }
  renderReleaseState();
}

async function loadLatestRelease() {
  try {
    const response = await fetch(releaseApi, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`Release service returned ${response.status}`);
    const release = await response.json();
    const installer = release.assets?.find((asset) => /-setup\.exe$/i.test(asset.name));
    if (!installer?.browser_download_url) throw new Error("Windows installer was not found in the latest release");
    releaseState = { type: "ready", url: installer.browser_download_url, version: release.tag_name?.replace(/^v/, "") || "latest" };
  } catch (error) {
    releaseState = { type: "error" };
    console.warn("Capital OS release lookup failed:", error.message);
  }
  renderReleaseState();
}

languageButtons.forEach((button) => { button.addEventListener("click", () => applyLanguage(button.dataset.language, true)); });
applyLanguage(getInitialLanguage());
loadLatestRelease();

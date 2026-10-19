const releaseApi = "https://api.github.com/repos/hesouam999-source/capital-os-updates/releases/latest";
const releasePage = "https://github.com/hesouam999-source/capital-os-updates/releases/latest";
const languageStorageKey = "capital-os-website-language";
const analyticsConsentStorageKey = "capital-os-website-analytics-consent";
const analyticsMeasurementId = window.CapitalOSAnalyticsConfig?.measurementId || "";
let analyticsInitialized = false;

const translations = {
  en: {
    pageTitle: "Capital OS — Your Personal Financial Operating System",
    metaDescription: "Capital OS is a local-first personal financial operating system for tracking net worth, assets, liabilities, and everyday finances.",
    socialLocale: "en_US",
    skipToContent: "Skip to content", homeAria: "Capital OS home", mainNavigation: "Main navigation", languageSelector: "Language selector",
    navFeatures: "Features", navInstall: "Install", navScreenshots: "Screenshots", supportNav: "Support", heroEyebrow: "LOCAL-FIRST • WINDOWS BETA",
    heroTitleFirst: "Your Personal Financial", heroTitleSecond: "Operating System.",
    heroDescription: "See what you own, what you owe, and how your financial life changes over time — without handing your data to a cloud service.",
    checkingRelease: "Checking latest release…", connectingRelease: "Connecting to the official release channel…", exploreFeatures: "Explore features",
    appPreview: "Capital OS application preview", heroBannerAria: "Capital OS product overview", heroBannerAlt: "Capital OS product overview", previewOverview: "Overview", previewDate: "October 2026", previewNetWorth: "Net worth", previewMonthlyFlow: "Monthly flow", previewCaption: "Built for clarity, not complexity.",
    productPrinciples: "Product principles", trustLocalTitle: "Local data", trustLocalText: "Your data stays on your computer", trustPictureTitle: "One clear picture", trustPictureText: "Capital and cash flow, side by side", trustUpdatesTitle: "Built to evolve", trustUpdatesText: "Updates arrive through the app",
    foundationEyebrow: "THE FOUNDATION", featuresTitle: "Everything you need to understand your money.", featuresDescription: "Capital OS brings long-term wealth tracking and everyday personal finance into one focused desktop application.",
    featureNetWorthTitle: "Net Worth Tracking", featureNetWorthText: "Track the value of your full financial picture over time.", featureAssetsTitle: "Assets & Liabilities", featureAssetsText: "Keep property, vehicles, accounts, debts, and other objects in one place.", featureSnapshotsTitle: "Historical Snapshots", featureSnapshotsText: "See how your capital changed, with a clear history you can revisit.", featureFinanceTitle: "Finance Management", featureFinanceText: "Manage accounts, transactions, budgets, goals, and recurring payments.", featureExcelTitle: "Excel Import", featureExcelText: "Bring historical financial data into a structured, reviewable workspace.", featureWorkspaceTitle: "Customizable Workspace", featureWorkspaceText: "Arrange the information that matters most to you.",
    excelMigrationEyebrow: "FROM EXCEL TO CAPITAL OS", excelMigrationTitle: "Bring your Excel history to Capital OS.", excelMigrationText: "Already tracking your finances in Excel? Transfer your capital history with our step-by-step AI guide.", excelMigrationButton: "How to import Excel →", excelMigrationNote: "Your original file stays unchanged. Review converted values before importing.",
    screenshotsEyebrow: "A CLOSER LOOK", screenshotsTitle: "Designed for a calm financial review.", screenshotsDescription: "Explore Capital OS across its core workspaces.", galleryAria: "Product screenshots", galleryOpenAria: "Open screenshot full screen", galleryPreviousAria: "Previous screenshot", galleryNextAria: "Next screenshot", galleryCloseAria: "Close full screen screenshot", galleryThumbnailsAria: "Choose a screenshot",
    galleryDashboardTitle: "Capital dashboard", galleryDashboardText: "Your capital overview in one place.", galleryObjectsTitle: "Assets and liabilities", galleryObjectsText: "Organize the things you own and what you owe.", galleryWorkspaceTitle: "Object workspace", galleryWorkspaceText: "Review an object and its details in a focused workspace.", gallerySnapshotsTitle: "Historical snapshots", gallerySnapshotsText: "Follow the history of your capital over time.", galleryFinanceTitle: "Finance OS", galleryFinanceText: "Track accounts, transactions, and everyday cash flow.", galleryAnalyticsTitle: "Finance analytics", galleryAnalyticsText: "Understand spending and cash-flow patterns.",
    supportEyebrow: "SUPPORT CAPITAL OS", supportTitle: "Help us build a better Capital OS.", supportText: "Your support helps us keep improving this local-first financial workspace.", supportButton: "❤️ Support Development",
    windowsBeta: "WINDOWS BETA", installTitle: "Start with your own financial system.", installVersionLoading: "The latest beta will appear here when the release channel is available.", guideDownloadTitle: "Download", guideDownloadText: "Download the latest Windows installer from the official release channel.", guideInstallTitle: "Install", guideInstallText: "Run the installer and follow the Windows prompts. Your existing data is kept in its current location.", guideOpenTitle: "Open Capital OS", guideOpenText: "Create a test Capital first if you are evaluating the beta.", betaNoticeTitle: "Beta notice:", betaNoticeText: "the installer is not yet Authenticode-signed by Windows. Windows may show a reputation warning. Download only from this official page or the linked GitHub Release.", footerDescription: "Local-first personal finance for Windows.", reportBug: "Report a bug",
    downloadForWindows: "Download for Windows", downloadAria: "Download Capital OS {version} for Windows", latestRelease: "Latest public beta: v{version} · Windows x64", currentRelease: "Current public beta: v{version} for Windows x64.", viewDownloads: "View Windows downloads", releaseLoadError: "The latest version could not be loaded. Open the official releases page to download it.", releaseInstallError: "Open the official release page to choose the latest Windows installer.",
    analyticsConsentText: "Help us understand which pages and download links are useful. Analytics never receives your financial data.", analyticsAccept: "Accept analytics", analyticsDecline: "Essential only",
  },
  ru: {
    pageTitle: "Capital OS — Ваша персональная финансовая ОС",
    metaDescription: "Capital OS — локальная персональная финансовая система для учёта капитала, активов, обязательств и ежедневных финансов.",
    socialLocale: "ru_RU",
    skipToContent: "Перейти к содержимому", homeAria: "Главная Capital OS", mainNavigation: "Основная навигация", languageSelector: "Выбор языка",
    navFeatures: "Возможности", navInstall: "Установка", navScreenshots: "Скриншоты", supportNav: "Поддержать", heroEyebrow: "ЛОКАЛЬНЫЕ ДАННЫЕ • WINDOWS BETA",
    heroTitleFirst: "Ваша персональная", heroTitleSecond: "финансовая ОС.",
    heroDescription: "Видьте, чем владеете, что должны и как меняется ваша финансовая жизнь — без передачи данных в облачный сервис.",
    checkingRelease: "Проверяем последнюю версию…", connectingRelease: "Подключаемся к официальному каналу релизов…", exploreFeatures: "Посмотреть возможности",
    appPreview: "Предпросмотр приложения Capital OS", heroBannerAria: "Обзор продукта Capital OS", heroBannerAlt: "Обложка с обзором возможностей Capital OS", previewOverview: "Обзор", previewDate: "Октябрь 2026", previewNetWorth: "Капитал", previewMonthlyFlow: "Денежный поток за месяц", previewCaption: "Создано для ясности, а не сложности.",
    productPrinciples: "Принципы продукта", trustLocalTitle: "Данные локально", trustLocalText: "Ваши данные остаются на компьютере", trustPictureTitle: "Одна понятная картина", trustPictureText: "Капитал и денежный поток рядом", trustUpdatesTitle: "Готово к развитию", trustUpdatesText: "Обновления приходят через приложение",
    foundationEyebrow: "ОСНОВА", featuresTitle: "Всё, чтобы понимать свои финансы.", featuresDescription: "Capital OS объединяет долгосрочный учёт капитала и ежедневные личные финансы в одном понятном приложении для ПК.",
    featureNetWorthTitle: "Учёт капитала", featureNetWorthText: "Отслеживайте стоимость всей вашей финансовой картины во времени.", featureAssetsTitle: "Активы и обязательства", featureAssetsText: "Храните недвижимость, автомобили, счета, долги и другие объекты в одном месте.", featureSnapshotsTitle: "Исторические снимки", featureSnapshotsText: "Смотрите, как менялся капитал, в понятной истории.", featureFinanceTitle: "Управление финансами", featureFinanceText: "Ведите счета, операции, бюджеты, цели и регулярные платежи.", featureExcelTitle: "Импорт из Excel", featureExcelText: "Переносите исторические финансовые данные в структурированное рабочее пространство.", featureWorkspaceTitle: "Настраиваемое рабочее пространство", featureWorkspaceText: "Расположите информацию, которая важнее всего для вас.",
    excelMigrationEyebrow: "ИЗ EXCEL В CAPITAL OS", excelMigrationTitle: "Перенесите историю капитала из Excel в Capital OS.", excelMigrationText: "Ведёте учёт в Excel? Сохраните историю активов и долгов — наша инструкция поможет подготовить таблицу через ИИ.", excelMigrationButton: "Как перенести Excel →", excelMigrationNote: "Исходный Excel остаётся без изменений. Перед импортом проверьте суммы и даты.",
    screenshotsEyebrow: "БЛИЖЕ К ПРОДУКТУ", screenshotsTitle: "Спокойный взгляд на финансы.", screenshotsDescription: "Посмотрите ключевые рабочие пространства Capital OS.", galleryAria: "Скриншоты продукта", galleryOpenAria: "Открыть скриншот на весь экран", galleryPreviousAria: "Предыдущий скриншот", galleryNextAria: "Следующий скриншот", galleryCloseAria: "Закрыть полноэкранный скриншот", galleryThumbnailsAria: "Выберите скриншот",
    galleryDashboardTitle: "Панель капитала", galleryDashboardText: "Обзор вашего капитала в одном месте.", galleryObjectsTitle: "Активы и обязательства", galleryObjectsText: "Организуйте то, чем владеете, и то, что должны.", galleryWorkspaceTitle: "Рабочее пространство объекта", galleryWorkspaceText: "Изучайте объект и его детали в отдельном рабочем пространстве.", gallerySnapshotsTitle: "Исторические снимки", gallerySnapshotsText: "Следите за историей капитала во времени.", galleryFinanceTitle: "Finance OS", galleryFinanceText: "Ведите счета, операции и ежедневный денежный поток.", galleryAnalyticsTitle: "Финансовая аналитика", galleryAnalyticsText: "Понимайте структуру расходов и денежного потока.",
    supportEyebrow: "ПОДДЕРЖКА CAPITAL OS", supportTitle: "Помогите нам сделать Capital OS лучше.", supportText: "Ваша поддержка помогает развивать локальное финансовое рабочее пространство.", supportButton: "❤️ Поддержать разработку",
    windowsBeta: "WINDOWS BETA", installTitle: "Начните со своей финансовой системы.", installVersionLoading: "Последняя бета появится здесь, когда будет доступен канал релизов.", guideDownloadTitle: "Скачать", guideDownloadText: "Скачайте последнюю версию установщика Windows из официального канала релизов.", guideInstallTitle: "Установить", guideInstallText: "Запустите установщик и следуйте подсказкам Windows. Существующие данные останутся на прежнем месте.", guideOpenTitle: "Открыть Capital OS", guideOpenText: "Для знакомства с бета-версией сначала создайте тестовый Capital.", betaNoticeTitle: "Бета-версия:", betaNoticeText: "у установщика пока нет подписи Windows Authenticode. Windows может показать предупреждение репутации. Скачивайте программу только с этой официальной страницы или по ссылке на GitHub Release.", footerDescription: "Локальная персональная финансовая система для Windows.", reportBug: "Сообщить об ошибке",
    downloadForWindows: "Скачать для Windows", downloadAria: "Скачать Capital OS {version} для Windows", latestRelease: "Последняя публичная бета: v{version} · Windows x64", currentRelease: "Текущая публичная бета: v{version} для Windows x64.", viewDownloads: "Открыть загрузки для Windows", releaseLoadError: "Не удалось загрузить последнюю версию. Откройте официальную страницу релизов, чтобы скачать её.", releaseInstallError: "Откройте официальную страницу релизов и выберите последнюю версию установщика Windows.",
    analyticsConsentText: "Помогите понять, какие страницы и ссылки на скачивание полезны. Аналитика никогда не получает ваши финансовые данные.", analyticsAccept: "Разрешить аналитику", analyticsDecline: "Только необходимое",
  },
};

const primaryButton = document.querySelector("#download-button");
const installButton = document.querySelector("#install-download-button");
const primaryLabel = document.querySelector("#download-label");
const installLabel = document.querySelector("#install-download-label");
const status = document.querySelector("#release-status");
const installVersion = document.querySelector("#install-version");
const languageButtons = document.querySelectorAll("[data-language]");
const galleryMainImage = document.querySelector("#gallery-main-image");
const galleryOpenButton = document.querySelector("#gallery-open");
const galleryPreviousButton = document.querySelector("#gallery-previous");
const galleryNextButton = document.querySelector("#gallery-next");
const galleryCaptionTitle = document.querySelector("#gallery-caption-title");
const galleryCaptionDescription = document.querySelector("#gallery-caption-description");
const galleryThumbnails = document.querySelector("#gallery-thumbnails");
const galleryDialog = document.querySelector("#gallery-dialog");
const galleryDialogImage = document.querySelector("#gallery-dialog-image");
const galleryDialogTitle = document.querySelector("#gallery-dialog-title");
const galleryDialogDescription = document.querySelector("#gallery-dialog-description");
const galleryCloseButton = document.querySelector("#gallery-close");
const galleryDialogPreviousButton = document.querySelector("#gallery-dialog-previous");
const galleryDialogNextButton = document.querySelector("#gallery-dialog-next");
const analyticsConsent = document.querySelector("#analytics-consent");
const analyticsAcceptButton = document.querySelector("#analytics-accept");
const analyticsDeclineButton = document.querySelector("#analytics-decline");
const screenshots = [
  { file: "dashboard.webp", title: "galleryDashboardTitle", description: "galleryDashboardText" },
  { file: "objects.webp", title: "galleryObjectsTitle", description: "galleryObjectsText" },
  { file: "object-workspace.webp", title: "galleryWorkspaceTitle", description: "galleryWorkspaceText" },
  { file: "snapshots.webp", title: "gallerySnapshotsTitle", description: "gallerySnapshotsText" },
  { file: "finance-os.webp", title: "galleryFinanceTitle", description: "galleryFinanceText" },
  { file: "analytics.webp", title: "galleryAnalyticsTitle", description: "galleryAnalyticsText" },
];
let currentLanguage = "en";
let releaseState = { type: "loading" };
let selectedScreenshotIndex = 0;

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

function getAnalyticsConsent() {
  try { return localStorage.getItem(analyticsConsentStorageKey); } catch { return null; }
}

function saveAnalyticsConsent(value) {
  try { localStorage.setItem(analyticsConsentStorageKey, value); } catch { /* Consent stays session-only when storage is unavailable. */ }
}

function initializeAnalytics() {
  if (analyticsInitialized || !analyticsMeasurementId) return;
  analyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsMeasurementId)}`;
  document.head.append(script);
}

function trackWindowsDownload(button) {
  if (!analyticsInitialized || !window.gtag || releaseState.type !== "ready") return;
  window.gtag("event", "download_windows", {
    event_category: "engagement",
    event_label: "windows_installer",
    version: releaseState.version,
    placement: button.id === "download-button" ? "hero" : "install",
  });
}

function configureAnalyticsConsent() {
  if (!analyticsMeasurementId) return;
  const consent = getAnalyticsConsent();
  if (consent === "granted") {
    initializeAnalytics();
    return;
  }
  if (consent !== "denied") analyticsConsent.hidden = false;
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
  document.querySelector('meta[property="og:title"]').content = t("pageTitle");
  document.querySelector('meta[property="og:description"]').content = t("metaDescription");
  document.querySelector('meta[property="og:locale"]').content = t("socialLocale");
  document.querySelector('meta[property="og:image:alt"]').content = t("heroBannerAlt");
  document.querySelector('meta[name="twitter:title"]').content = t("pageTitle");
  document.querySelector('meta[name="twitter:description"]').content = t("metaDescription");
  document.querySelector('meta[name="twitter:image:alt"]').content = t("heroBannerAlt");
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => { element.alt = t(element.dataset.i18nAlt); });
  languageButtons.forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage)); });
  if (persist) {
    try { localStorage.setItem(languageStorageKey, currentLanguage); } catch { /* Storage is optional. */ }
  }
  renderReleaseState();
  renderGallery();
}

function renderGallery() {
  const screenshot = screenshots[selectedScreenshotIndex];
  if (!screenshot) return;
  const source = `assets/screenshots/${screenshot.file}`;
  const title = t(screenshot.title);
  const description = t(screenshot.description);
  galleryMainImage.src = source;
  galleryMainImage.alt = title;
  galleryCaptionTitle.textContent = title;
  galleryCaptionDescription.textContent = description;
  galleryDialogImage.src = source;
  galleryDialogImage.alt = title;
  galleryDialogTitle.textContent = title;
  galleryDialogDescription.textContent = description;
  galleryThumbnails.innerHTML = screenshots.map((item, index) => {
    const isSelected = index === selectedScreenshotIndex;
    const itemTitle = t(item.title);
    return `<button class="gallery-thumbnail${isSelected ? " is-selected" : ""}" type="button" role="tab" aria-selected="${isSelected}" aria-label="${itemTitle}" data-screenshot-index="${index}"><img src="assets/screenshots/${item.file}" alt="" /><span>${itemTitle}</span></button>`;
  }).join("");
  galleryThumbnails.querySelectorAll("[data-screenshot-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedScreenshotIndex = Number(button.dataset.screenshotIndex);
      renderGallery();
    });
  });
}

function selectScreenshot(offset) {
  selectedScreenshotIndex = (selectedScreenshotIndex + offset + screenshots.length) % screenshots.length;
  renderGallery();
}

function openGallery() {
  if (!galleryDialog.open) galleryDialog.showModal();
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
analyticsAcceptButton.addEventListener("click", () => { saveAnalyticsConsent("granted"); analyticsConsent.hidden = true; initializeAnalytics(); });
analyticsDeclineButton.addEventListener("click", () => { saveAnalyticsConsent("denied"); analyticsConsent.hidden = true; });
[primaryButton, installButton].forEach((button) => button.addEventListener("click", () => trackWindowsDownload(button)));
galleryOpenButton.addEventListener("click", openGallery);
galleryPreviousButton.addEventListener("click", () => selectScreenshot(-1));
galleryNextButton.addEventListener("click", () => selectScreenshot(1));
galleryDialogPreviousButton.addEventListener("click", () => selectScreenshot(-1));
galleryDialogNextButton.addEventListener("click", () => selectScreenshot(1));
galleryCloseButton.addEventListener("click", () => galleryDialog.close());
applyLanguage(getInitialLanguage());
configureAnalyticsConsent();
loadLatestRelease();

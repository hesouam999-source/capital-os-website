const releaseApi = "https://api.github.com/repos/hesouam999-source/capital-os-updates/releases/latest";
const releasePage = "https://github.com/hesouam999-source/capital-os-updates/releases/latest";

const primaryButton = document.querySelector("#download-button");
const installButton = document.querySelector("#install-download-button");
const primaryLabel = document.querySelector("#download-label");
const installLabel = document.querySelector("#install-download-label");
const status = document.querySelector("#release-status");
const installVersion = document.querySelector("#install-version");

function setDownloadLink(button, label, url, version) {
  button.href = url;
  button.removeAttribute("aria-disabled");
  button.classList.remove("is-loading");
  label.textContent = "Download for Windows";
  button.setAttribute("aria-label", `Download Capital OS ${version} for Windows`);
}

async function loadLatestRelease() {
  try {
    const response = await fetch(releaseApi, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`Release service returned ${response.status}`);

    const release = await response.json();
    const installer = release.assets?.find((asset) => /-setup\.exe$/i.test(asset.name));
    if (!installer?.browser_download_url) throw new Error("Windows installer was not found in the latest release");

    const version = release.tag_name?.replace(/^v/, "") || "latest";
    setDownloadLink(primaryButton, primaryLabel, installer.browser_download_url, version);
    setDownloadLink(installButton, installLabel, installer.browser_download_url, version);
    status.textContent = `Latest public beta: v${version} · Windows x64`;
    installVersion.textContent = `Current public beta: v${version} for Windows x64.`;
  } catch (error) {
    primaryButton.href = releasePage;
    installButton.href = releasePage;
    primaryButton.removeAttribute("aria-disabled");
    installButton.removeAttribute("aria-disabled");
    primaryButton.classList.remove("is-loading");
    installButton.classList.remove("is-loading");
    primaryLabel.textContent = "View Windows downloads";
    installLabel.textContent = "View Windows downloads";
    status.textContent = "The latest version could not be loaded. Open the official releases page to download it.";
    status.classList.add("error");
    installVersion.textContent = "Open the official release page to choose the latest Windows installer.";
    console.warn("Capital OS release lookup failed:", error.message);
  }
}

loadLatestRelease();

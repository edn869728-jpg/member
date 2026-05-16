const LIFF_ID = "2010011257-ohQpQk3L";

const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function log(text) {
  const line = `[${new Date().toLocaleTimeString("zh-TW", { hour12: false })}] ${text}`;
  console.log(line);
  if (logEl) logEl.textContent += line + "\n";
}

async function main() {
  try {
    setStatus("開始初始化");
    log("start");
    log("href = " + location.href);
    log("origin = " + location.origin);
    log("userAgent = " + navigator.userAgent);

    if (!window.liff) {
      throw new Error("LIFF SDK 未載入");
    }

    setStatus("執行 liff.init()");
    await liff.init({
      liffId: LIFF_ID,
      withLoginOnExternalBrowser: true
    });

    log("liff.init ok");
    log("isInClient = " + liff.isInClient());
    log("isLoggedIn = " + liff.isLoggedIn());

    if (!liff.isLoggedIn()) {
      setStatus("導向 LINE Login");
      log("not logged in, redirect to login");
      liff.login({ redirectUri: location.href });
      return;
    }

    setStatus("讀取 LINE 個人資料");
    const profile = await liff.getProfile();

    log("getProfile ok");
    log("userId = " + (profile.userId || ""));
    log("displayName = " + (profile.displayName || ""));
    log("pictureUrl = " + (profile.pictureUrl || ""));

    setStatus("LIFF 成功");
    
    // 之後你可以在這裡呼叫 GAS API
    // await fetch("你的GAS_API_URL", { method: "POST", ... });

  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    setStatus("初始化失敗");
    log("error = " + msg);
    if (err && err.stack) {
      log("stack = " + err.stack);
    }
  }
}

main();
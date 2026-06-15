const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { config } = require('./config');

const stateFilePath = path.join(__dirname, 'state.json');

// ============ State Management ============

function getLastScheduledTime() {
  if (fs.existsSync(stateFilePath)) {
    try {
      const data = fs.readFileSync(stateFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed.lastTime) {
        return new Date(parsed.lastTime);
      }
    } catch (e) {
      console.error('[!] Lỗi đọc file state.json, sẽ khởi tạo mốc thời gian mới.');
    }
  }
  return null;
}

function saveLastTime(dateObj) {
  const data = { lastTime: dateObj ? dateObj.toISOString() : null };
  fs.writeFileSync(stateFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============ Timing Logic ============

function initializeScheduledTime() {
  let scheduledTime = getLastScheduledTime();
  
  if (scheduledTime) {
    console.log(`[➔] Tiếp tục tiến trình. Mốc thời gian đã lên lịch thành công gần nhất: ${scheduledTime.toLocaleString()}`);
  } else {
    scheduledTime = new Date();
    scheduledTime.setMinutes(Math.round(scheduledTime.getMinutes() / 5) * 5);
    scheduledTime.setSeconds(0);
    scheduledTime.setMilliseconds(0);
    console.log(`[+] Khởi tạo chu kỳ mới từ mốc thời gian hiện tại: ${scheduledTime.toLocaleString()}`);
  }
  
  return scheduledTime;
}

function getStopTime() {
  const stopTime = new Date();
  stopTime.setDate(stopTime.getDate() + 1);
  stopTime.setHours(12, 0, 0, 0);
  console.log(`[+] Mốc chặn dừng tool cố định: ${stopTime.toLocaleString()}`);
  return stopTime;
}

function shouldContinuePosting(scheduledTime, stopTime) {
  return scheduledTime < stopTime;
}

// ============ Browser & Navigation ============

async function initializeBrowser() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  return { browser, page };
}

async function loginAndNavigate(page) {
  await page.goto('https://timedealer.io/');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await page.getByRole('combobox', { name: 'United States' }).click();
  await page.getByLabel(config.region).getByText(config.region).click();
  
  await page.getByRole('textbox', { name: 'Input your phone number' }).fill(config.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(config.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForSelector('text=Auto-Posting', { timeout: 15000 });

  await page.getByRole('link', { name: 'Auto-Posting' }).first().click();
  await page.waitForLoadState('domcontentloaded');
}

async function selectAllAccounts(page) {
  const selectAccountBtn = page.getByRole('button', { name: 'Select Account' });
  await selectAccountBtn.waitFor({ state: 'visible' });
  await selectAccountBtn.click();

  await page.waitForLoadState('networkidle');

  const headerCheckbox = page.locator('th.rt-TableColumnHeaderCell button[role="checkbox"]');
  await headerCheckbox.waitFor({ state: 'visible' });
  await headerCheckbox.click();
}

// ============ File Operations ============

function findImageFile() {
  const files = fs.readdirSync(__dirname);
  const imageFile = files.find(f => f.startsWith('image'));
  return imageFile ? path.join(__dirname, imageFile) : null;
}

// ============ Post Composition ============

async function composePost(page, imagePath) {
  const composeBtn = page.locator('button.rt-Button:has-text("Compose")');
  await composeBtn.waitFor({ state: 'visible' });
  await composeBtn.click();

  await page.locator('input#title').waitFor({ state: 'visible' });
  await page.locator('input#title').fill(config.title);
  
  const randomUnderscores = '_'.repeat(Math.floor(Math.random() * 10) + 1);
  const messageWithUnderscores = config.message + '\n' + randomUnderscores;
  
  await page.locator('textarea#message').fill(messageWithUnderscores);

  if (imagePath && fs.existsSync(imagePath)) {
    const fileInput = page.locator('div.dropzone input[type="file"]');
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(imagePath);
    await page.waitForTimeout(3000);
  }
}

// ============ Schedule Posting ============

function formatScheduleTime(scheduledTime) {
  const dateVal = scheduledTime.getDate();
  const h24 = scheduledTime.getHours();
  const m = scheduledTime.getMinutes();
  
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  h12 = h12 === 0 ? 12 : h12;

  return { dateVal, h12, m, ampm };
}

async function schedulePost(page, { dateVal, h12, m, ampm }) {
  const scheduleBtn = page.locator('button:has-text("Schedule send")');
  await scheduleBtn.waitFor({ state: 'visible' });
  await scheduleBtn.click();

  const dateCell = page.getByRole('gridcell', { name: String(dateVal), exact: true });
  await dateCell.waitFor({ state: 'visible' });
  await dateCell.click();

  const nextBtn = page.locator('button:has-text("Next")');
  await nextBtn.waitFor({ state: 'visible' });
  await nextBtn.click();

  const hourItem = page.locator(`ul[aria-label="Select hours"] li[aria-label="${h12} hours"]`);
  await hourItem.waitFor({ state: 'visible' });
  await hourItem.click();

  const minuteItem = page.locator(`ul[aria-label="Select minutes"] li[aria-label="${m} minutes"]`);
  await minuteItem.waitFor({ state: 'visible' });
  await minuteItem.click();

  const ampmItem = page.locator(`ul[aria-label="Select meridiem"] li[aria-label="${ampm}"]`);
  await ampmItem.waitFor({ state: 'visible' });
  await ampmItem.click();

  const okBtn = page.locator('button:has-text("OK")');
  await okBtn.waitFor({ state: 'visible' });
  await okBtn.click();

  await page.waitForSelector('span.rt-Text:has-text("Confirm schedule send?")', { state: 'visible', timeout: 10000 });

  const continueBtn = page.locator('button:has-text("Continue")');
  await continueBtn.waitFor({ state: 'visible' });
  await continueBtn.click();
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
}

// ============ Main Flow ============

async function runAutoPostingLoop(page, imagePath, scheduledTime, stopTime) {
  let loopCount = 1;

  while (shouldContinuePosting(scheduledTime, stopTime)) {
    const minutesInterval = Math.random() < 0.5 ? 15 : 20;
    scheduledTime.setMinutes(scheduledTime.getMinutes() + minutesInterval);

    console.log(`[+] Đang xử lý bài đăng thứ ${loopCount} (Dự kiến phát: ${scheduledTime.toLocaleString()})...`);

    await composePost(page, imagePath);

    const timeFormat = formatScheduleTime(scheduledTime);
    await schedulePost(page, timeFormat);

    const { h12, m, ampm } = timeFormat;
    console.log(`[+] Đã đặt lịch thành công: Lần phát tiếp theo vào ${h12}:${m < 10 ? '0' + m : m} ${ampm} ngày ${timeFormat.dateVal}`);
    
    saveLastTime(scheduledTime);
    loopCount++;
  }

  console.log(`[-] Thời gian lên lịch (${scheduledTime.toLocaleString()}) đã đạt/vượt mốc giới hạn 12h trưa hôm sau.`);
  console.log(`[✓] Hoàn thành kế hoạch. Tự động xóa file trạng thái cũ.`);
  saveLastTime(null);
}

async function main() {
  const scheduledTime = initializeScheduledTime();
  const stopTime = getStopTime();

  const { browser, page } = await initializeBrowser();

  try {
    await loginAndNavigate(page);
    await selectAllAccounts(page);
    
    const imagePath = findImageFile();
    await runAutoPostingLoop(page, imagePath, scheduledTime, stopTime);
  } catch (error) {
    console.error('Có lỗi xảy ra trong quá trình chạy tool:', error);
  } finally {
    await browser.close();
  }
}

main();
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { config } = require('./config');

const stateFilePath = path.join(__dirname, 'state.json');

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

(async () => {
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

  const stopTime = new Date();
  stopTime.setDate(stopTime.getDate() + 1);
  stopTime.setHours(12, 0, 0, 0);
  console.log(`[+] Mốc chặn dừng tool cố định: ${stopTime.toLocaleString()}`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();

  try {
    // 1. Điều hướng và Đăng nhập
    await page.goto('https://timedealer.io/');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.getByRole('combobox', { name: 'United States' }).click();
    await page.getByLabel(config.region).getByText(config.region).click();
    
    await page.getByRole('textbox', { name: 'Input your phone number' }).fill(config.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(config.password);
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.waitForSelector('text=Auto-Posting', { timeout: 15000 });

    // 2. Thao tác điều hướng sang Auto-Posting
    await page.getByRole('link', { name: 'Auto-Posting' }).first().click();
    await page.waitForLoadState('domcontentloaded');

    // 3. Mở bảng Chọn tài khoản (Select Account)
    const selectAccountBtn = page.getByRole('button', { name: 'Select Account' });
    await selectAccountBtn.waitFor({ state: 'visible' });
    await selectAccountBtn.click();

    await page.waitForLoadState('networkidle'); 

    const headerCheckbox = page.locator('th.rt-TableColumnHeaderCell button[role="checkbox"]');
    await headerCheckbox.waitFor({ state: 'visible' });
    await headerCheckbox.click();

    const imagePath = path.join(__dirname, 'content_img.jpeg');
    let loopCount = 1;

    while (true) {
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 5); 

      if (scheduledTime >= stopTime) {
        console.log(`[-] Thời gian lên lịch (${scheduledTime.toLocaleString()}) đã đạt/vượt mốc giới hạn 12h trưa hôm sau.`);
        console.log(`[✓] Hoàn thành kế hoạch. Tự động xóa file trạng thái cũ.`);
        saveLastTime(null);
        break; 
      }

      console.log(`[+] Đang xử lý bài đăng thứ ${loopCount} (Dự kiến phát: ${scheduledTime.toLocaleString()})...`);

      // 4. Mở Compose và điền nội dung
      const composeBtn = page.locator('button.rt-Button:has-text("Compose")');
      await composeBtn.waitFor({ state: 'visible' }); 
      await composeBtn.click();

      await page.locator('input#title').waitFor({ state: 'visible' });
      await page.locator('input#title').fill(config.title);
      await page.locator('textarea#message').fill(config.message);

      // Upload ảnh
      if (fs.existsSync(imagePath)) {
        const fileInput = page.locator('div.dropzone input[type="file"]');
        await fileInput.waitFor({ state: 'attached' });
        await fileInput.setInputFiles(imagePath);
        await page.waitForTimeout(3000);
      }

      // 5. Bấm Schedule send
      const scheduleBtn = page.locator('button:has-text("Schedule send")');
      await scheduleBtn.waitFor({ state: 'visible' });
      await scheduleBtn.click();

      const dateVal = scheduledTime.getDate();
      const h24 = scheduledTime.getHours();
      const m = scheduledTime.getMinutes();
      
      const ampm = h24 >= 12 ? 'PM' : 'AM';
      let h12 = h24 % 12;
      h12 = h12 === 0 ? 12 : h12;

      // 6. Chọn Ngày trên Lịch
      const dateCell = page.getByRole('gridcell', { name: String(dateVal), exact: true });
      await dateCell.waitFor({ state: 'visible' });
      await dateCell.click();

      // 7. Bấm Next
      const nextBtn = page.locator('button:has-text("Next")');
      await nextBtn.waitFor({ state: 'visible' });
      await nextBtn.click();

      // 8. Chọn Giờ
      const hourItem = page.locator(`ul[aria-label="Select hours"] li[aria-label="${h12} hours"]`);
      await hourItem.waitFor({ state: 'visible' });
      await hourItem.click();

      // 9. Chọn Phút
      const minuteItem = page.locator(`ul[aria-label="Select minutes"] li[aria-label="${m} minutes"]`);
      await minuteItem.waitFor({ state: 'visible' });
      await minuteItem.click();

      // 10. Chọn AM/PM
      const ampmItem = page.locator(`ul[aria-label="Select meridiem"] li[aria-label="${ampm}"]`);
      await ampmItem.waitFor({ state: 'visible' });
      await ampmItem.click();

      // 11. Bấm OK trên popup đồng hồ
      const okBtn = page.locator('button:has-text("OK")');
      await okBtn.waitFor({ state: 'visible' });
      await okBtn.click();

      await page.waitForSelector('span.rt-Text:has-text("Confirm schedule send?")', { state: 'visible', timeout: 10000 });

      const continueBtn = page.locator('button:has-text("Continue")');
      await continueBtn.waitFor({ state: 'visible' });
      await continueBtn.click();
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000); 

      console.log(`[+] Đã đặt lịch thành công: Lần phát tiếp theo vào ${h12}:${m < 10 ? '0' + m : m} ${ampm} ngày ${dateVal}`);
      
      saveLastTime(scheduledTime);
      
      loopCount++;
    }

  } catch (error) {
    console.error('Có lỗi xảy ra trong quá trình chạy tool:', error);
  } finally {
    await browser.close();
  }
})();
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { config } = require('./config');

(async () => {
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

    let scheduledTime = new Date();
    scheduledTime.setMinutes(Math.round(scheduledTime.getMinutes() / 5) * 5);
    scheduledTime.setSeconds(0);
    scheduledTime.setMilliseconds(0);

    // dừng tool vào ngày mai
    const stopTime = new Date();
    stopTime.setDate(stopTime.getDate() + 1);
    stopTime.setHours(12, 0, 0, 0);

    const imagePath = path.join(__dirname, 'content_img.jpeg');

    for (let i = 0; i < 288; i++) {
      console.log(`[+] Bắt đầu lên lịch lần thứ ${i + 1}...`);
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 5); 
      if (scheduledTime >= stopTime) {
        console.log(`[-] 12h dừng tool. Tool tự động dừng ở lần thứ ${i + 1}.`);
        break; 
      }

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

      // 12. Xác nhận gửi trên Modal thông báo
      await page.waitForSelector('span.rt-Text:has-text("Confirm schedule send?")', { state: 'visible', timeout: 10000 });

      const continueBtn = page.locator('button:has-text("Continue")');
      await continueBtn.waitFor({ state: 'visible' });
      await continueBtn.click();
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000); 

      console.log(`[+] Đã đặt lịch thành công: Lần phát tiếp theo vào ${h12}:${m < 10 ? '0' + m : m} ${ampm} ngày ${dateVal}`);
    }

  } catch (error) {
    console.error('Có lỗi xảy ra trong quá trình chạy tool:', error);
  } finally {
    await browser.close();
  }
})();
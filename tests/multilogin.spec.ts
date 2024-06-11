import { expect, test } from "@playwright/test";
import { Browser, BrowserContext, Page } from "playwright";
import { Multilogin } from "../src/Multilogin";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let multilogin: Multilogin;

test.beforeEach(async () => {
  multilogin = new Multilogin({
    profileId: process.env.PROFILE_ID!,
    folderId: process.env.FOLDER_ID!,
  });
  await multilogin.signIn({
    email: process.env.MULTILOGIN_EMAIL!,
    password: process.env.MULTILOGIN_PASSWORD!,
  });
  const profile = await multilogin.startProfile();
  browser = profile.browser;
  page = profile.page;
  context = profile.context;
});

test("SHOULD open the Multilogin browser", async () => {
  await page.goto("https://bot.sannysoft.com/");
  const webDriverAdvanced = await page.$("td#advanced-webdriver-result");
  if (webDriverAdvanced) {
    expect(await webDriverAdvanced.textContent()).toBe("passed");
  }
});

test.afterEach(async () => {
  await context.close();
  await multilogin.stopProfile();
});

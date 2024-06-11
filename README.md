# Multilogin Browser with Playwright

This project demonstrates how to integrate the Multilogin browser with Playwright for automated browser testing. The example includes signing in to Multilogin, starting a browser profile, running a test, and then stopping the profile.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (>=14.x)
- npm (Node Package Manager)
- Playwright

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/naimulcsx/multilogin-playwright
cd multilogin-playwright
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Install Playwright Browsers

Run the following command to install the necessary browsers for Playwright:

```bash
npx playwright install
```

### 4. Set Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
MULTILOGIN_EMAIL=<your-multilogin-email>
MULTILOGIN_PASSWORD=<your-multilogin-password>
FOLDER_ID=<your-folder-id>
PROFILE_ID=<your-profile-id>
```

Replace `<your-multilogin-email>`, `<your-multilogin-password>`, `<your-folder-id>`, and `<your-profile-id>` with your actual Multilogin credentials and IDs.

## Usage

### Multilogin Class

The `Multilogin` class handles the following tasks:

- Signing in to Multilogin
- Starting a browser profile
- Stopping the browser profile

#### Method Signatures

- **constructor(options: MultiloginOptions)**: Initializes the Multilogin instance with folder and profile IDs.
  - `options`: An object containing `folderId` and `profileId`.

- **signIn(args: SignInArgs): Promise<SignInResponse>**: Signs in to Multilogin using the provided email and password.
  - `args`: An object containing `email` and `password`.

- **startProfile(): Promise<{ browser: Browser, page: Page, context: BrowserContext }>**: Starts the Multilogin browser profile and returns the browser, page, and context instances.

- **stopProfile(): Promise<void>**: Stops the Multilogin browser profile.

### Playwright Tests

The example test script does the following:

1. Signs in to Multilogin.
2. Starts a Multilogin browser profile.
3. Runs a test to verify if the browser is detected as automated.
4. Stops the Multilogin browser profile.

Here is the test script:

```typescript
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
```

### Running the Tests

To run the tests, use the following command:

```bash
npx playwright test --ui
```

This will open the Playwright Test Runner UI, where you can run and inspect the tests.

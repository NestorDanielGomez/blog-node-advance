require("dotenv").config();
const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("Titulo del Header correcto", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  expect(text).toEqual("Blogs | node | advanced");
});

test("Click en login empieza el proceso de oauth", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("Click me logueo, debe mostrar el boton de cerrar sesión", async () => {
  const id = "64f731f975185731d0554965";

  const sessionObject = {
    passport: {
      user: id,
    },
  };
  const Buffer = require("safe-buffer").Buffer;
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = Keygrip([keys.cookieKey]);
  const sessionSigned = keygrip.sign("session=" + sessionString);

  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sessionSigned });
  await page.goto("localhost:3000");
  await page.waitFor(`a[href="/auth/logout"]`);

  const text = await page.$eval(`a[href="/auth/logout"]`, (el) => el.innerHTML);
  expect(text).toEqual("Cerrar Sesión");
});

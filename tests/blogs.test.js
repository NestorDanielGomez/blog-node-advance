const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("Inicio de sesion Exitoso", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("Puedo ver el formulario de blogs", async () => {
    const label = await page.getContentOfPage("form label");

    expect(label).toEqual("Blog Titulo");
  });
});

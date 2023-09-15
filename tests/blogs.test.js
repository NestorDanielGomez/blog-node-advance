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
  describe("Ingreso los campos de forma correta", async () => {
    beforeEach(async () => {
      await page.type(".title input", "El titulo desde testing");
      await page.type(".content input", "El contenido desde testing");
      await page.click("form button");
    });
    test("Me envia a la pagina de review para confirmar si elimino o guardo el post", async () => {
      const text = await page.getContentOfPage("h5");
      expect(text).toEqual("Confirmar datos");
    });
    test("Envio los datos del blog y me lleva al index (/blogs) donde veo todos los blogs", async () => {
      await page.click("button.green");
      await page.waitFor(`.card`);

      const title = await page.getContentOfPage(".card-title");
      const content = await page.getContentOfPage("p");

      expect(title).toEqual("El titulo desde testing");
      expect(content).toEqual("El contenido desde testing");
    });
  });

  describe("Ingreso los campos de forma INcorreta", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("El formulario muestra un mensaje de error", async () => {
      const titleError = await page.getContentOfPage(".title .red-text");
      const contentError = await page.getContentOfPage(".content .red-text");

      expect(titleError).toEqual("Debe ingresar un texto");
      expect(contentError).toEqual("Debe ingresar un texto");
    });
  });
});

describe("Inicio de sesión NO exitoso", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: { title: "Titulo desde test", content: "Contenido desde tes" },
    },
  ];

  test("Las acciones relacionadas con el blog que están prohibidas.", async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "Debes Iniciar sesión!" });
    }
  });
});

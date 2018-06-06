import path from "path";

const timeout = 5000;

describe('form test', () => {
  let page, port;

  beforeAll(async () => {
    return await global.__SERVER__.listen(0, () => {
      port = global.__SERVER__.address().port;
    })
  });
  afterAll(async () => {
    global.__SERVER__.close();
    let pages = await browser.pages();
    pages.forEach(async p => await p.close());
    return;
  })

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();

    let url = `http://localhost:${port}/example`;
    await page.goto(url);

  }, timeout);

  afterEach(async () => await page.close());

  it('should load', async () => {
    expect.assertions(1);

    let text = await page.evaluate(() => document.body.textContent);
    return expect(text).toContain('Hello');
  });

  it('should validate input', async () => {
    expect.assertions(1);

    let mockInvalid = jest.fn();
    await page.exposeFunction('invalidInput', mockInvalid);
    await page.evaluate(() =>
      document.querySelector("#firstName")
        .addEventListener("invalid", window.invalidInput)
    );

    await page.click('#firstName');
    await page.type('#firstName', "name", { delay: 0 });
    await page.click('button');

    return expect(mockInvalid).not.toBeCalled();
  });

  it('should not validate input a space', async () => {
    expect.assertions(1);

    let mockInvalid = jest.fn();
    await page.exposeFunction('invalidInput', mockInvalid);
    await page.evaluate(() =>
      document.querySelector("#firstName")
        .addEventListener("invalid", window.invalidInput)
    );

    await page.click('#firstName');
    await page.type('#firstName', "name name", { delay: 0 });
    await page.click('button');

    return expect(mockInvalid).toBeCalled();
  });

  it('should not validate input a numeral', async () => {
    expect.assertions(1);

    let mockInvalid = jest.fn();
    await page.exposeFunction('invalidInput', mockInvalid);
    await page.evaluate(() =>
      document.querySelector("#firstName")
        .addEventListener("invalid", window.invalidInput)
    );

    await page.click('#firstName');
    await page.type('#firstName', "nam3", { delay: 0 });
    await page.click('button');

    return expect(mockInvalid).toBeCalled();
  });

}, timeout);

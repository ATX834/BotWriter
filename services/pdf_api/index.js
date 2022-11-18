const express = require("express");
const app = express();
const port = process.env.PORT | 8000;
const puppeteer = require("puppeteer");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const printPDF = async (html) => {
  html = `
  <style>
    @page  {
      margin: 2cm;
      size: A4
    }
  </style>
  ${html}
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
};

app.get("/", (req, res) => {
  res.send(html);
});

app.post("/generate-pdf", (req, res) => {
  printPDF(req.body.finalHtml)
    .then((pdf) => {
      res.send(pdf);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

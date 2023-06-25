const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const delay = require("delay");
const fs = require("fs");
const chalk = require("chalk");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const generateUser = () =>
  new Promise((resolve, reject) => {
    fetch("https://randomuser.me/api/?nat=us", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

const randstr = (length) => {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const submitForm = (email, first, last) =>
  new Promise((resolve, reject) => {
    fetch("https://app.viral-loops.com/api/v2/events", {
      method: "POST",
      headers: {
        Host: "app.viral-loops.com",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        "content-type": "application/json",
        "x-ucid": "7FEbQRCa7hqGYyMnhc7jQC5bSXI",
        "sec-ch-ua-mobile": "?0",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": '"Windows"',
        accept: "*/*",
        origin: "https://www.token.com",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        referer: "https://www.token.com/",
        "accept-language": "id-ID,id;q=0.9",
      },
      body: JSON.stringify({
        publicToken: "7FEbQRCa7hqGYyMnhc7jQC5bSXI",
        params: {
          event: "registration",
          user: {
            firstname: first,
            lastname: last,
            email: email,
            acquiredFrom: "form_widgetV2",
            initialAcquiredFrom:
              "https://token.com/?referralCode=7htuhdb&refSource=copy",
            extraData: {
              "5uNMI4N-": "Indonesia",
            },
          },
          referrer: {
            referralCode: "7htuhdb",
          },
          refSource: "copy",
          acquiredFrom: "form_widgetV2",
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });

const functionGetLink = (email, domain) =>
  new Promise((resolve, reject) => {
    fetch(`https://generator.email/${domain}/${email}`, {
      method: "get",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3",
        "accept-encoding": "gzip, deflate, br",
        cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(
          3
        )}; surl=${domain}%2F${email}`,
        "upgrade-insecure-requests": 1,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
      },
    })
      .then((res) => res.text())
      .then((text) => {
        const $ = cheerio.load(text);
        const src = $(
          "#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy > div > div > table.jumbotron > tbody > tr > td > div > div > table > tbody > tr > td > table > tbody > tr > td > a"
        ).attr("href");
        resolve(src);
      })
      .catch((err) => reject(err));
  });

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });

  for (let i = 1; i < 999999; i++) {
    const getUser = await generateUser();
        const first = `${getUser.results[0].name.first}`;
        const last = `${getUser.results[0].name.last}`;
        const email = `${getUser.results[0].login.username}@gmailos.com`;
        console.log(`[${i}] `, `${chalk.blue(`Get email > ${email}`)}`);
        const submit = await submitForm(email, first, last);
        if (submit.dt) {
          console.log(`[${i}] `, `${chalk.green(`Successfully registration`)}`);
          let verifUrl;
          do {
            verifUrl = await functionGetLink(
              email.split("@")[0],
              email.split("@")[1]
            );
          } while (!verifUrl);
          const queryParams = verifUrl.split("?")[1];
          const jwtParam = queryParams
            .split("&")
            .find((param) => param.startsWith("p="));
          const jwtToken = jwtParam.split("=")[1];
          const decodedToken = Buffer.from(jwtToken, "base64").toString("utf8");
          const jwtPayload = JSON.parse(decodedToken);
          const pValue = jwtPayload.p;
          const parsedPayload = JSON.parse(pValue);
          const url = parsedPayload.url;
          console.log(`[${i}] `, `${chalk.green(`Successfully get url verification > ${url}`)}`);
          const page = await browser.newPage();
          const option = {
            waituntil: "load",
            waituntil: "networkidle2",
            setTimeout: 999999,
            defaultViewport: {
              width: 300,
              height: 300,
            },
          };

          console.log(`[${i}] `, `${chalk.blue(`Open ${url}`)}`);
          await page.goto(url, option);

          const searchString = "Invest with intent";
          const isStringFound = await page.evaluate((searchString) => {
            return document.body.innerText.includes(searchString);
          }, searchString);

          if (isStringFound) {
            console.log(
              `[${i}] `,
              `${chalk.green(`Url successfully verified.`)}`
            );
          } else {
            console.log(`[${i}] `, `${chalk.red(`Url failed verified.`)}`);
            fs.appendFileSync("token.txt", `${url}\n`);
            await delay(5000)
          }
          console.log("");
          await page.close();
        } else {
          console.log(`[${i}] `, `${chalk.red(`Failed registration`)}`);
          console.log("");
        }
  }
  await browser.close();
})();

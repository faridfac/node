const fetch = require('node-fetch');
const cluster = require('cluster');
const cheerio = require('cheerio');

const generateUser = () => new Promise((resolve, reject) => {
    fetch('https://randomuser.me/api/?nat=us', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const randstr = length => {
    var text = "";
    var possible =
        "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

const submitForm = (email, username) => new Promise((resolve, reject) => {
    fetch('https://getlaunchlist.com/s/GKSwjB/?ref=HiYy5v', {
        method: 'POST',
        headers: {
            'Host': 'getlaunchlist.com',
            'cache-control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            'origin': 'https://vera.thefiverse.com',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'referer': 'https://vera.thefiverse.com/',
            'accept-language': 'id-ID,id;q=0.9'
        },
        body: new URLSearchParams({
            'name': email,
            'email': email,
            'telegram': username
        })
    })
        .then(res => res.text())
        .then(res => {
            resolve(res)
        })
        .catch(err => reject(err))
});

const resendEmail = (email) => new Promise((resolve, reject) => {
    fetch(`https://getlaunchlist.com/s/verify/send/${email}`, {
        method: 'POST',
        headers: {
            'Host': 'getlaunchlist.com',
            'Cookie': 'XSRF-TOKEN=eyJpdiI6ImJkTGRmM1FXYkZsNitJY3VPcWlNNUE9PSIsInZhbHVlIjoiM2Q2dXU1cUJ0dkQ5S0VpdzlIRTUxM0hhYjAzeTVDcERCR1UvS1dwYnRkRDZLb1c4NGdMcHY2UUplYnlyWis4Z1cwQUVKbkhWSE9WT2h2eVVZZFZRRE5vZ0VmMDVWR2tJY2ZwVGJwQzE2elF4eGxxZ1o3bHlBSWxMNmZRVkFNSUEiLCJtYWMiOiIyODFiMWVjMDhiOGVlNmEzMDljYTY5MDQzODk4YTdjNmRlOGI5MzdlNTg5M2EyN2Y1NTNhODNmYjEzNGQxOGQ2IiwidGFnIjoiIn0%3D; launchlist_session=eyJpdiI6IjA5bGppS0FDcGMzNXlMeWJkNFRUbXc9PSIsInZhbHVlIjoiYTdja1Z3MEd0eDg5SDRsVFUxNThCcDB0NkIxQjFFNHlzU205WXdFL0dhQW1XRjgwbi92VVpLYVBNcFUwcHF2QzJlZFNFRGxObFFnbmNsVkJwcFROWFlxNnZxR0phMnIrMVJ5YS82ME40YkZhNlBWd3ozWU0wc0trdE5NdTZnUHQiLCJtYWMiOiI3ZGE1OGNkYzZmZGRkYWFiNmIyMmRhNTZhZjBkMzkzOGUwYzI1MWI2NTJmZGU4YWUzNDI1NTg2ZTY4NWUyMjg2IiwidGFnIjoiIn0%3D; IdvdRPDhfhGCtSF6eNUQpRBYXHLOzBY7a0zBpPX3=eyJpdiI6InNudng3dlZDQ0ZSQ0VDN2VJK0diWHc9PSIsInZhbHVlIjoiVDAxNzlBUXE0Y1BKL0pHODdxMUhuTjcyczV6SW1HYlJmKzE0L3FnblZqck84TmorU0lHVmdnYitiTEprYW9Bdi9NNzQySjFYTjBnV1UvQzJHSmtvMGM2bHd4UGlvdEUzVzB3RWw3UmxnUm9mWmpDN2FNeGV1eUYva280dTVkTlpZY3RjZjRZbXlESHYrbUZQQjhBRXQwckFCNkppNGlWczNXY0xVczUybW9Mc3dXWmg4KzRSUzVUVTZKQjRoNlI0TE5TTGZzTFVvcWJlaTFHRlRlZmNGTFhkM3dENE5lc1BsVy9hU0RLbEd3UkJMUFJ4QkUwdUJqZ2lGd25vNnkvOHRQMVdlOFlWdWljQTI4ejZzVzRXYzNuakg0am82WFVwckp0QlAzWFU1YTNIelBQR0tTOFV1MG1UVFZyTUdXUVdMWnhjL2ZDR3JCQWVaSWFNZkRKN3NKQ0xsKzVFZjZOMjM3c3YrUFdjRkZDdFFTNWJTL3hoZjdGVE5ES0xWYVptTjN3S1dkOW5uemtwbTNqM1UxckJoYWdScDFWcTNUUGVjbzBtRjFmOStkN21pWTJrMXRxek5aYi9rNXBqL1p1U1Fhb3puUit2clc2dmQwR24ra0lqdVdXNXVrWXFXRTYyZWhhRWZ6MGVXTmJFc1UwaEtzY0FRMHNTdDM1azdzdmQiLCJtYWMiOiI3NTYyYWNjMWJiZWM5ZTAzZThiNmEwZDFiYjQ3MTA2ZjQzZWJlMDUzYzI0YzQ3ODIyY2I1ZWJkMzgyNGU4MzY5IiwidGFnIjoiIn0%3D; __cf_bm=pYsqd34d9WlK6CmY5CBRzkLatKAAKIqtzMhl3cNgl.Q-1684863566-0-AaRPl85eABdifAaykRDfFZpZd4AzZk33ZigCwCpoZ7HfnDSs6ctjWoWSJDBnBiONQKhsqFCJ8MJoZwuqQmQ408xOet2n+hCbLCudkMJu59Ac',
            'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'content-type': 'application/json',
            'accept': '*/*',
            'origin': 'https://getlaunchlist.com',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': `https://getlaunchlist.com/s/GKSwjB/${email}?confetti=fire`,
            'accept-language': 'id-ID,id;q=0.9'
        },
        body: JSON.stringify({
            'email': email,
            'csrf_token': 'DREFKHNzmOmcVf6qvQhopru0Q5ITR3qEfXpEkdWn'
        })
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => reject(err))
});

const verify = (verifUrl) => new Promise((resolve, reject) => {
    fetch(verifUrl, {
        headers: {
            'Host': 'getlaunchlist.com',
            'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'id-ID,id;q=0.9'
        }
    })
        .then(res => res.text())
        .then(res => {
            resolve(res)
        })
        .catch(err => reject(err))
});

const functionGetLink = (email, domain) => new Promise((resolve, reject) => {
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
                    "#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table.subcopy > tbody > tr > td > span > a"
                ).text();
                resolve(src);
            })
            .catch((err) => reject(err));
});

function getSubstring(str, char1, char2) {
  return str.substring(
    str.indexOf(char1) + 1,
    str.lastIndexOf(char2)
  );
}

if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < 5; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    (async () => {
        while (true) {
            try {
                const getUser = await generateUser()
                const username = `@${getUser.results[0].login.username}`
                const email = `${getUser.results[0].login.username}@emvil.com`
                console.log(`[+] Get email > ${email}`)
                const submit = await submitForm(email, username)
                const t = submit.includes("We have sent an email")
                if (t === true){
                    console.log('[+] Successfully registration')
                    const reSend = await resendEmail(email)
                    if(reSend.ok === true){
                        console.log('[+] Successfully sent an email')
                        let verifUrl;
                        do {
                            verifUrl = await functionGetLink(email.split("@")[0], email.split("@")[1]);
                        } while (!verifUrl);
                        console.log(`[+] Successfully get url > ${verifUrl}`)
                        const getVerify = await verify(verifUrl)
                        const t2 = getVerify.includes("Sign up process is completed")
                        if(t2 === true){
                            console.log('[+] Successfully verified')
                            console.log('')
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    })();
}

const fetch = require('node-fetch');
const crypto = require('crypto');
const delay = require('delay');
const readlineSync = require("readline-sync");

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

const submitForm = (email, address, rid, uid, sid, reff) => new Promise((resolve, reject) => {
    fetch('https://leads.kickofflabs.com/lead/172427', {
        method: 'POST',
        headers: {
            'Host': 'leads.kickofflabs.com',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'accept': 'application/json',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Origin': 'https://degenwin.com',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://degenwin.com/',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        body: JSON.stringify({
            'email': email,
            'wallet_address': address,
            '__form_name': 'Default Form',
            '__source': 'kf',
            '__rid': rid,
            '__uid': uid,
            '__sid': sid,
            '__kid': reff,
            '__url': `https://degenwin.com/airdrop/?kid=${reff}`,
            '__lid': '172427',
            '__language': 'en-US',
            '__custom': {},
            '__mm': 243,
            '__kd': 8
        })
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => reject(err))
});

const submitTask = (id, reff) => new Promise((resolve, reject) => {
    fetch('https://leads.kickofflabs.com/action/172427', {
        method: 'POST',
        headers: {
            'Host': 'leads.kickofflabs.com',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'accept': 'application/json',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Origin': 'https://degenwin.com',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://degenwin.com/',
            'Accept-Language': 'id-ID,id;q=0.9'
        },
        body: JSON.stringify({
            'aid': id,
            'data': {},
            'kid': reff,
            '__source': 'koljs'
        })
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => reject(err))
});

(async () => {
    const reff = readlineSync.question("[?] Masukan Kode reff : ");
    while (true) {
        try {
            const getUser = await generateUser()
            const address = `0x${getUser.results[0].login.sha1}`
            const splits = getUser.results[0].email.split("@")
            const email = `${splits[0]}@gmail.com`
            console.log(`[+] Using data ${email}|${address}`)
            const submit = await submitForm(email, address, crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID(), reff)
            if(submit.waitlisted === true){
                console.log('[+] Successfully registration')
                const datas = ["164449", "164450", "164451", "164452", "164453", "164454"];
                for (let i = 0; i < datas.length; i++) {
                    const task = await submitTask(datas[i], submit.social_id)
                    console.log(`[+] Complete task ${datas[i]} > ${task.message}`)
                }
                console.log('')
                await delay(5000)
            } else {
                console.log('Failed')

            }
        } catch (e) {
            console.log('Sleep for 60 seconds')
            await delay(60000)
        }
    }
})();

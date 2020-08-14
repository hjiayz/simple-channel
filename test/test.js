// eslint-disable-next-line @typescript-eslint/no-var-requires
const channel = require('../dist/index').Channel.channel;

it('channel', async () => {
  let [tx, rx] = channel();
  tx.send("123");
  tx.send("456");
  let tx2 = tx.clone();
  setTimeout(() => {
    tx2.send("567");
    tx2.close();
  }, 1000);
  let results = [];
  let haserr = false;
  try {
    for await (let msg of rx) {
      results.push(msg);
      if (msg === "567") throw 6;
    }
  }
  catch (e) {
    haserr = true;
    expect(e).toBe(6);
  }
  expect(haserr).toBe(true);
  expect(results[0]).toBe("123");
  expect(results[1]).toBe("456");
  expect(results[2]).toBe("567");
  expect(results.length).toBe(3);
});

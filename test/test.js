// eslint-disable-next-line @typescript-eslint/no-var-requires
const channel = require('../dist/index').Channel.channel;

it('channel', async () => {
  let [tx, rx] = channel();
  tx.send("123");
  tx.send("456");
  setTimeout(()=>{
    tx.send("567");
    tx.close();
  },1000);
  let results = [];
  for await (let msg of rx) {
    results.push(msg);
  }
  expect(results[0]).toBe("123");
  expect(results[1]).toBe("456");
  expect(results[2]).toBe("567");
  expect(results.length).toBe(3);
});

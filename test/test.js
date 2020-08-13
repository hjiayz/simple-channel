// eslint-disable-next-line @typescript-eslint/no-var-requires
const channel = require('../dist/index').Channel.channel;

it('channel', async () => {
  let [tx, rx] = channel();
  tx.send("123");
  tx.send("456");
  tx.close();
  let results = [];
  for await (let msg of rx) {
    results.push(msg);
  }
  expect(results[0]).toBe("123");
  expect(results[1]).toBe("456");
  expect(results.length).toBe(2);
});

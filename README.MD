## Install
```
npm i --save simple-channel
```
## Usage
```javascript
const channel = require('simple-channel').Channel.channel;
(async () => {
  let [tx, rx] = channel();
  tx.send("123");
  tx.send("456");
  tx.close();
  for await (let msg of rx) {
    console.log(msg);
  }
})()
```
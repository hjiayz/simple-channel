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
  tx2 = tx.clone();
  tx2.send("789");
  tx2.close();
  for await (let msg of rx) {
    console.log(msg);
  }
})();
```
### features:
* [AsyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)

### Callback to AsyncIterator

```javascript
const channel = require('simple-channel').Channel.channel;
let [tx, rx] = channel();
let count = 0;
const onMessage = (msg)=>{
  tx.send(msg);
};
const onClose = () =>{
  tx.close();
};
let handle = setInterval(()=>{
  count++;
  if (count>5) {
    onClose();
    clearInterval(handle);
    return;
  }
  onMessage(new Date());
},1000);
(async () => {
  for await (let msg of rx) {
    console.log(msg);
  }
})();
```
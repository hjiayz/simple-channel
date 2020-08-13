const closeCmd = Symbol();

class Receiver<T> {
    private handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null];
    private cache: (T|symbol)[];
    constructor(handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null], cache: (T|symbol)[]) {
        this.handle = handle;
        this.cache = cache;
    }
    async*[Symbol.asyncIterator]() {
        while (true) {
            try {
                yield new Promise((res, err) => {
                    if (this.cache.length > 0) {
                        const msg = this.cache.shift();
                        if (msg === closeCmd) {
                            err();
                        }
                        res(msg);
                    } else {
                        this.handle[0] = res;
                        this.handle[1] = err;
                    }
                });
            }
            catch (e) {
                if (typeof e !== "undefined") {
                    throw e;
                }
                return;
            }
        }
    }
}
class Sender<T> {
    private onSend: (this: void, msg: T ) => void;
    private onClose: (this: void) => void;
    private isClosed: boolean;
    constructor(onSend: (this: void, msg: T ) => void,onClose:(this:void)=>void) {
        this.onSend = onSend;
        this.isClosed = false;
        this.onClose = onClose;
    }
    send(msg: T) {
        if (this.isClosed) {
            throw new Error("Channel Closed")
        }
        this.onSend(msg);
    }
    close() {
        this.isClosed = true;
        this.onClose();
    }
}
function channel<T>(): [Sender<T>, Receiver<T>] {
    const cache: (T|symbol)[] = [];
    const handle: [((this: void, msg: T ) => void) | null, ((this: void) => void) | null] = [null, null];
    const rx = new Receiver(handle, cache);
    const senderOnSend = (msg: T) => {
        if (handle[0] === null) {
            cache.push(msg);
            return;
        }
        handle[0](msg);
        handle.fill(null);
    };
    const senderOnClose = () =>{
        if (handle[1] === null) {
            cache.push(closeCmd);
            return;
        }
        handle[1]();
        handle.fill(null);
    };
    const tx = new Sender(senderOnSend,senderOnClose);
    return [tx, rx]
}

export { channel };
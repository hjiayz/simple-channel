class Receiver<T> {
    private handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null, boolean];
    private cache: T[];
    constructor(handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null, boolean], cache: T[]) {
        this.handle = handle;
        this.cache = cache;
    }
    async*[Symbol.asyncIterator](): AsyncGenerator<T, void, void> {
        while (true) {
            try {
                yield new Promise((res: (this: void, msg: T) => void, err: (this: void) => void) => {
                    const msg = this.cache.shift();
                    if (typeof msg !== "undefined") {
                        //send cache msg to iterator
                        res(msg);
                    } else {
                        if (this.handle[2]) {
                            //stop
                            err();
                        }
                        else {
                            //waiting
                            this.handle[0] = res;
                            this.handle[1] = err;
                        }
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
    private onSend: (this: void, msg: T) => void;
    private onClose: (this: void) => void;
    private isClosed: boolean;
    constructor(onSend: (this: void, msg: T) => void, onClose: (this: void) => void) {
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
    const cache: T[] = [];
    //[onSend,onClose,isClosed]
    const handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null, boolean] = [null, null, false];
    const rx = new Receiver(handle, cache);
    const senderOnSend = (msg: T) => {
        if (handle[0] === null) {
            cache.push(msg);
            return;
        }
        const onSend = handle[0];
        handle[0] = null;
        handle[1] = null;
        onSend(msg);
    };
    const senderOnClose = () => {
        if (handle[1] === null) {
            handle[2] = true;
            return;
        }
        //onClose not null
        //Promise waiting
        //cache is empty
        const onClose = handle[1];
        handle[0] = null;
        handle[1] = null;
        onClose();
    };
    const tx = new Sender(senderOnSend, senderOnClose);
    return [tx, rx]
}

export { channel };
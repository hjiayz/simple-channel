declare class Receiver<T> {
    private handle;
    private cache;
    constructor(handle: [((this: void, msg: T) => void) | null, ((this: void) => void) | null, boolean], cache: T[]);
    [Symbol.asyncIterator](): AsyncGenerator<T, void, void>;
}
declare class Sender<T> {
    private onSend;
    private onClose;
    private isClosed;
    constructor(onSend: (this: void, msg: T) => void, onClose: (this: void) => void);
    send(msg: T): void;
    close(): void;
}
declare function channel<T>(): [Sender<T>, Receiver<T>];
export { channel };

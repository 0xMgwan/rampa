declare module 'tronweb' {
  class TronWeb {
    constructor(options: any);
    trx: any;
    contract(): any;
    address: {
      fromPrivateKey(privateKey: string): string;
    };
    static address: {
      fromPrivateKey(privateKey: string): string;
    };
  }
  export = TronWeb;
}

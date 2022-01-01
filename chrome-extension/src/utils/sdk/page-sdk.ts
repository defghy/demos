import PageExtensionSDK from './sdk-base';

(window as any).PageExtensionSDK = new PageExtensionSDK({ self: 'page', other: 'content' });

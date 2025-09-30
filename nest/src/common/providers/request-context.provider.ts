import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import { RequestContextStore } from '../middleware/request-context.middleware';

@Injectable()
export class RequestContext {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  public run(
    store: RequestContextStore,
    callback: (...args: any[]) => void,
  ): void {
    this.storage.run(store, callback);
  }

  public get<T extends keyof RequestContextStore>(
    key: T,
  ): RequestContextStore[T] | undefined {
    const store = this.storage.getStore();
    if (!store) throw new Error('No RequestContext store found!');
    return store?.[key];
  }

  public set<K extends keyof RequestContextStore>(
    key: K,
    value: RequestContextStore[K],
  ): void {
    const store = this.storage.getStore();
    if (!store) throw new Error('No RequestContext store found!');
    store[key] = value;
  }

  public getStore(): RequestContextStore | undefined {
    const store = this.storage.getStore();
    return store;
  }
}

import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

interface RequestContextStore {
  requestId: string;
  userId?: string;
  ipAddress?: string;
}

@Injectable()
export class RequestContext {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run(store: RequestContextStore, callback: (...args: any[]) => void) {
    this.storage.run(store, callback);
  }

  get<T extends keyof RequestContextStore>(
    key: T,
  ): RequestContextStore[T] | undefined {
    const store = this.storage.getStore();
    return store?.[key];
  }

  getStore(): RequestContextStore | undefined {
    return this.storage.getStore();
  }
}

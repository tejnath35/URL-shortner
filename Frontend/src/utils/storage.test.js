import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readStoredUser } from './storage.js';

describe('readStoredUser', () => {
  let storage;

  beforeEach(() => {
    storage = {
      data: {},
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
      },
      setItem(key, value) {
        this.data[key] = String(value);
      },
      removeItem(key) {
        delete this.data[key];
      },
    };

    globalThis.localStorage = storage;
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('returns an empty object when stored user is invalid JSON', () => {
    storage.setItem('user', '{bad json');

    expect(readStoredUser()).toEqual({});
  });
});

export class SimpleStorage<T>{
  /** Unique identifier of this resource in the storage database */
  key: string;
  constructor(
    /** Unique identifier of this resource in the storage database */
    key: string
  ) {
    this.key = key;
  }
  serialize(data: T) { return JSON.stringify(data); }
  deserialize(serializedData: string) { return JSON.parse(serializedData) as T; }
  get() {
    const serializedData = window.localStorage.getItem(this.key);
    if (serializedData === null) return null;
    return this.deserialize(serializedData);
  }
  save(data: T) {
    const serializedData = this.serialize(data);
    window.localStorage.setItem(this.key, serializedData);
  }
  destroy() {
    window.localStorage.removeItem(this.key);
  }
}
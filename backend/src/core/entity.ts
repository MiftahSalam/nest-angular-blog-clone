export interface EntityCore<T> {
  toDto(): Promise<T>;
}

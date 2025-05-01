export type Replace<T, K extends { [P in keyof T]?: any }> = Omit<T, keyof K> &
  K

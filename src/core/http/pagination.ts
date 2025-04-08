export type Pagination<T> = {
  data: T[]
  count?: number
}

export type NotPagination<T> = {
  data: T[]
}

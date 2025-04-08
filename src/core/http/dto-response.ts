export type DtoResponsePagination = {
  count: number
  query: { page: string; size: string }
  withPagination: boolean
}

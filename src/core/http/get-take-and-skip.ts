export function getTakeAndSkip(size: string, page: string) {
  const take = size ? Number(size) : 20
  const skip = page ? Number(page) : 1

  return { take, skip }
}

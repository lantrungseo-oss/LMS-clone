
type PaginationParams = {
  offset: number;
  limit: number;
}

export const recursivePaginationCall = async <T>(
  callback: (params: PaginationParams) => T[] | Promise<T[]>,
  {
    offset = 0,
    limit = 100,
  }: PaginationParams
) => {
  if(offset < 0 || (offset +  limit < offset)) {
    return;
  }
  
  const data = await callback({ offset, limit });
  if(data.length === 0) {
    return;
  }
  await recursivePaginationCall(callback, { offset: offset + limit, limit })
}

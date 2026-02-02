export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginateMongo<T>(
  model: any,
  query: any,
  page: number = 1,
  limit: number = 10,
  options: {
    sort?: any;
    select?: string;
  } = {}
): Promise<PaginationResponse<T>> {

  const skip = (page - 1) * limit;

  let dbQuery = model.find(query);

  if (options.select) dbQuery = dbQuery.select(options.select);
  if (options.sort) dbQuery = dbQuery.sort(options.sort);

  const [rows, total] = await Promise.all([
    dbQuery.skip(skip).limit(limit),
    model.countDocuments(query)
  ]);

  return {
    data: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

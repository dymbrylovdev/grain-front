export interface IServerResponse<D> {
  status: number;
  message: string;
  errors: any;
  data: D;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface IPaginationProps {
  page?: number;
  per_page?: number;
}

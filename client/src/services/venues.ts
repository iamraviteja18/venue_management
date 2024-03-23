import { createClientHttpClient } from './lib/client';
const http = createClientHttpClient();

export type Venue = {
  _id: string;
  name: string;
  description: string;
  location: {
    address: string;
    secondary_address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  image: string;
  availability: {
    start: Date;
    end: Date;
  }[];
};

const GetById = async (id: string) => {
  const res = await http.get<Venue>(`/venue/${id}`);
  return res.data;
};

const GetByUserId = async (id: string) => {
  const res = await http.get<Venue[]>(`/venue/user/${id}`);
  return res.data;
};

const List = async (query?: string) => {
  const res = await http.get<[]>('/venue', { params: { name: query } });
  return res.data;
};

const ListWithSearch = async (query?: string) => {
  if (query?.length) {
    const res = await http.get<[]>(`/venue?name=${query}`);
    return res.data;
  } else {
    const res = await http.get<[]>('/venue');
    return res.data;
  }
};
const ListWithFilter = async (query?: any) => {
  const res = await http.get<[]>(`/venue?${query?.type}=${query?.o}`);
  return res.data;
};

const Create = async (data: any) => {
  const res = await http.post<{}>('/venue', data);
  return res.data;
};

const Availability = async (id: string) => {
  const res = await http.get<{ start: Date; end: Date }[]>(
    `/venue/${id}/availability`
  );
  return res.data;
};

const DeleteById = async (id: string) => {
  const res = await http.delete<Venue>(`/venue/${id}`);
  return res.data;
};

const VenuesService = {
  GetById,
  GetByUserId,
  List,
  Create,
  Availability,
  ListWithSearch,
  ListWithFilter,
  DeleteById
};

export default VenuesService;

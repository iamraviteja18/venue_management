import { createClientHttpClient } from './lib/client';
const http = createClientHttpClient();

import { User } from './auth';
import { Venue } from './venues';

export type Booking = {
  _id: string;
  user: User;
  venue?: Venue;
  startTime: string;
  endTime: string;
};

type BookingData = {
  user: string;
  venue: string;
  startTime: Date;
  endTime: Date;
};

const GetById = async (id: string) => {
  const res = await http.get<Booking>(`/booking/${id}`);
  return res.data;
};

const GetByUser = async (
  userId: string,
  filters?: { [key: string]: string }
) => {
  const res = await http.get<Booking[]>(`/booking/user/${userId}`, {
    params: filters,
  });
  return res.data;
};

const GetByVenue = async (
  venueId: string,
  filters?: { [key: string]: string }
) => {
  const res = await http.get<Booking[]>(`/booking/venue/${venueId}`, {
    params: filters,
  });
  return res.data;
};

const Create = async (data: BookingData) => {
  const res = await http.post<BookingData>('/booking', data);
  return res.data;
};

const Delete = async (id: string) => {
  const res = await http.delete(`/booking/${id}`);
  return res.data;
};

const BookingService = {
  GetById,
  GetByUser,
  GetByVenue,
  Create,
  Delete,
};

export default BookingService;

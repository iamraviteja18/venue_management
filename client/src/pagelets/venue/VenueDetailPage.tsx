'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './venues.module.css';
import VenuesService, { Venue } from '@/services/venues';
import { Button, Calendar, CalendarProps, Image, Typography } from 'antd';
import { HiArrowSmLeft } from 'react-icons/hi';
import dayjs, { Dayjs } from 'dayjs';
import BookingService, { Booking } from '@/services/booking';
import userState from '@/state/user';
import { useRecoilValue } from 'recoil';
import toast from 'react-hot-toast';
import { ChatWindow } from '@/components/chat';

const { Title } = Typography;

/* TYPES */

type VenueDetailPageProps = {
  id: string;
};

/* COMPONENT */

const VenueDetailPage = ({ id }: VenueDetailPageProps) => {
  // State
  const user = useRecoilValue(userState);

  const [venue, setVenue] = useState<Venue | undefined>();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    dayjs(new Date()).add(1, 'day')
  );

  const booking = useMemo(() => {
    return bookings.find((booking) => {
      const bookingDate = dayjs(booking.startTime);
      return bookingDate.isSame(selectedDate, 'day');
    });
  }, [selectedDate, bookings]);

  // Lifecycle
  useEffect(() => {
    fetchVenueDetail(id);
    fetchVenueBookings(id);
    console.log(id);
    
  }, [id]);

  // Helpers
  const fetchVenueDetail = async (id: string) => {
    const response = await VenuesService.GetById(id);
    setVenue(response);
  };

  const fetchVenueBookings = async (id: string) => {
    const response = await BookingService.GetByVenue(id);
    setBookings(response || []);
  };

  const bookDate = async () => {
    await BookingService.Create({
      user: user?._id || '',
      venue: id,
      startTime: selectedDate.startOf('day').toDate(),
      endTime: selectedDate.endOf('day').toDate(),
    });

    toast.success('Venue Booked');
    fetchVenueBookings(id);
  };

  const unbookDate = async (bookingId: string) => {
    await BookingService.Delete(bookingId);

    toast.success('Booking removed');
    fetchVenueBookings(id);
  };

  // Renderers
  const dateCellRender = (value: Dayjs) => {
    const bookingsForDate = bookings.filter((booking) => {
      const bookingDate = dayjs(booking.startTime);
      return bookingDate.isSame(value, 'day');
    });

    return (
      <ul className={styles.dateBookingList}>
        {bookingsForDate.map((booking) => (
          <li key={booking.startTime} className={styles.dateBooking}>
            {booking.user.name}
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className={styles.detailPageContainer}>
      <div className={styles.detailPageHeader}>
        <Button href='/venues' shape='circle' icon={<HiArrowSmLeft />} />
        <Title level={2} style={{ margin: 0 }}>
          {venue?.name}
        </Title>
        <div className={styles.detailPageHeaderActions}>
          <Button
            disabled={Boolean(booking) && booking?.user._id !== user?._id}
            onClick={() =>
              booking && booking?.user._id === user?._id
                ? unbookDate(booking?._id)
                : bookDate()
            }
            type='primary'
          >
            {booking?.user._id === user?._id ? 'Unbook' : 'Book'}
          </Button>
        </div>
      </div>
      <div className={styles.detailPageDetailsContainer}>
        <div className={styles.detailPageSidebar}>
          <div className={styles.detailPageImage}>
            <Image
              width={350}
              src={'data:image/png;base64,' + venue?.image}
              fallback='https://via.placeholder.com/350'
            />
          </div>
          <div>
            <div className={styles.detailPageAddressLabel}>Desc:</div>
            {venue?.description}
          </div>
          <div className={styles.detailPageAddressBar}>
            <div className={styles.detailPageAddressSegment}>
              <span className={styles.detailPageAddressLabel}>Address:</span>
              <span>{venue?.location?.address}</span>
            </div>
            <div className={styles.detailPageAddressSegment}>
              <span className={styles.detailPageAddressLabel}>City:</span>
              <span>{venue?.location?.city}</span>
            </div>
            <div className={styles.detailPageAddressSegment}>
              <span className={styles.detailPageAddressLabel}>State:</span>
              <span>{venue?.location?.state}</span>
            </div>
            <div className={styles.detailPageAddressSegment}>
              <span className={styles.detailPageAddressLabel}>
                Postal Code:
              </span>
              <span>{venue?.location?.postal_code}</span>
            </div>
          </div>
        </div>
        <div className={styles.detailPageCalendar}>
          <Calendar
            cellRender={cellRender}
            onSelect={(date) => {
              if (date.isBefore(new Date())) return;
              setSelectedDate(date);
            }}
            value={selectedDate}
          />
        </div>
      </div>
      <ChatWindow roomId={id} />
    </div>
  );
};

export default VenueDetailPage;

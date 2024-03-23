'use client';

import React, { useEffect, useMemo, useState } from 'react';
import BookingService, { Booking } from '@/services/booking';
import VenueService, { Venue } from '@/services/venues';
import { useRecoilValue } from 'recoil';
import userState from '@/state/user';

import styles from './dashboard.module.css';
import { Card, Col, Flex, Row, Segmented, Typography } from 'antd';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const Dashboard = () => {
  // State
  const user = useRecoilValue(userState);

  const [view, setView] = useState<'bookings' | 'venues'>('bookings');

  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [previousBookings, setPreviousBookings] = useState<Booking[]>([]);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueBookings, setVenueBookings] = useState<Booking[]>([]);

  const router = useRouter();

  // Lifecycle
  useEffect(() => {
    fetchPreviousBookings();
    fetchUpcomingBookings();

    fetchVenues();
  }, [user]);

  useEffect(() => {
    fetchVenueBookings();
  }, [venues]);

  // Helpers
  const fetchPreviousBookings = async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    const bookingData = await BookingService.GetByUser(user._id, {
      before: today.toISOString(),
    });
    if (!bookingData) return;

    setPreviousBookings(bookingData);
  };

  const fetchUpcomingBookings = async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    const bookingData = await BookingService.GetByUser(user._id, {
      after: today.toISOString(),
    });
    if (!bookingData) return;

    setUpcomingBookings(bookingData);
  };

  const fetchVenues = async () => {
    if (!user) return;

    const venueData = await VenueService.GetByUserId(user._id);
    if (!venueData) return;

    setVenues(venueData);
  };

  const fetchVenueBookings = async () => {
    if (!user) return;

    const venueIds = venues.map((venue) => venue._id);

    const bookingPromises = venueIds.map((venueId) =>
      BookingService.GetByVenue(venueId, {
        after: startOfDay(new Date()).toISOString(),
        before: endOfDay(new Date()).toISOString(),
      })
    );
    const bookingData = await Promise.all(bookingPromises);

    const flattenedData = bookingData.map((data) => data || []).flat();
    setVenueBookings(flattenedData);
  };

  const bookedVenues = useMemo(() => {
    const bookedVenueIds = venueBookings
      .filter((booking) => Boolean(booking.venue))
      .map((booking) => booking.venue?._id);

    return venues.filter((venue) => bookedVenueIds.includes(venue._id));
  }, [venues, venueBookings]);
  const unbookedVenues = useMemo(() => {
    const bookedVenueIds = venueBookings
      .filter((booking) => Boolean(booking.venue))
      .map((booking) => booking.venue?._id);

    return venues.filter((venue) => !bookedVenueIds.includes(venue._id));
  }, [venues, venueBookings]);

  // Renderers
  const renderBookings = () => {
    return (
      <Flex flex='1' gap='16px'>
        <Flex flex='1' gap='16px' vertical>
          <Card>
            <Title level={4} style={{ margin: 0 }}>
              Previous Bookings
            </Title>
          </Card>
          <Row gutter={[16, 24]}>
            {previousBookings.map((booking) => {
              if (!booking.venue) return null;

              return (
                <Col
                  key={booking._id}
                  onClick={() =>
                    booking.venue && router.push(`/venues/${booking.venue._id}`)
                  }
                  span={12}
                >
                  <Card
                    cover={
                      <img
                        alt='example'
                        src={'data:image/png;base64,' + booking.venue.image}
                      />
                    }
                  >
                    <Title level={5}>{booking.venue.name}</Title>
                    <Flex align='center' justify='space-between' gap='32px'>
                      <div>Booked On:</div>
                      <div>
                        {format(new Date(booking.startTime), 'MM/dd/yyyy')}
                      </div>
                    </Flex>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Flex>
        <Flex flex='1' gap='16px' vertical>
          <Card>
            <Title level={4} style={{ margin: 0 }}>
              Upcoming Bookings
            </Title>
          </Card>
          <Row gutter={[16, 24]}>
            {upcomingBookings.map((booking) => {
              if (!booking.venue) return null;

              return (
                <Col
                  key={booking._id}
                  onClick={() =>
                    booking.venue && router.push(`/venues/${booking.venue._id}`)
                  }
                  span={12}
                >
                  <Card
                    cover={
                      <img
                        alt='example'
                        src={'data:image/png;base64,' + booking.venue.image}
                      />
                    }
                  >
                    <Title level={5}>{booking.venue.name}</Title>
                    <Flex align='center' justify='space-between' gap='32px'>
                      <div>Booked On:</div>
                      <div>
                        {format(new Date(booking.startTime), 'MM/dd/yyyy')}
                      </div>
                    </Flex>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Flex>
      </Flex>
    );
  };

  const renderVenues = () => {
    return (
      <Flex gap='16px' vertical>
        <Flex gap='32px'>
          <Card style={{ flex: '1' }}>
            <Flex align='center' justify='space-around'>
              <Title level={4} style={{ margin: 0 }}>
                Total
              </Title>
              <Title level={2} style={{ margin: 0 }}>
                {venues.length}
              </Title>
            </Flex>
          </Card>
          <Card style={{ flex: '1' }}>
            <Flex align='center' justify='space-around'>
              <Title level={4} style={{ margin: 0 }}>
                Booked
              </Title>
              <Title level={2} style={{ margin: 0 }}>
                {bookedVenues.length}
              </Title>
            </Flex>
          </Card>
          <Card style={{ flex: '1' }}>
            <Flex align='center' justify='space-around'>
              <Title level={4} style={{ margin: 0 }}>
                Unbooked
              </Title>
              <Title level={2} style={{ margin: 0 }}>
                {venues.length - bookedVenues.length}
              </Title>
            </Flex>
          </Card>
        </Flex>
        <Flex flex='1' gap='16px'>
          <Flex flex='1' vertical>
            <Card>
              <Title level={4} style={{ margin: 0 }}>
                Unbooked
              </Title>
            </Card>
            <Row gutter={[16, 24]}>
              {unbookedVenues.map((venue) => {
                return (
                  <Col
                    key={venue._id}
                    onClick={() => router.push(`/venues/${venue._id}`)}
                    span={12}
                  >
                    <Card
                      cover={
                        <img
                          alt='example'
                          src={'data:image/png;base64,' + venue.image}
                        />
                      }
                    >
                      <Title level={5}>{venue.name}</Title>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Flex>
          <Flex flex='1' vertical>
            <Card>
              <Title level={4} style={{ margin: 0 }}>
                Booked
              </Title>
            </Card>
            <Row gutter={[16, 24]}>
              {venueBookings.map((booking) => {
                if (!booking.venue) return null;

                return (
                  <Col
                    key={booking._id}
                    onClick={() =>
                      booking.venue &&
                      router.push(`/venues/${booking.venue._id}`)
                    }
                    span={12}
                  >
                    <Card
                      cover={
                        <img
                          alt='example'
                          src={'data:image/png;base64,' + booking.venue.image}
                        />
                      }
                    >
                      <Title level={5}>{booking.venue.name}</Title>
                      <Flex align='center' justify='space-between' gap='32px'>
                        <div>Booked On:</div>
                        <div>
                          {format(new Date(booking.startTime), 'MM/dd/yyyy')}
                        </div>
                      </Flex>
                      <Flex align='center' justify='space-between' gap='32px'>
                        <div>Booked By:</div>
                        <div>{booking.user.name}</div>
                      </Flex>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  return (
    <div className={styles.dashboardPage}>
      <Flex vertical>
        <Flex align='center' justify='space-between'>
          <Title level={2}>
            {view === 'bookings' ? 'Your Bookings' : 'Your Venues'}
          </Title>
          <Segmented
            options={[
              { label: 'Bookings', value: 'bookings' },
              { label: 'Venues', value: 'venues' },
            ]}
            onChange={(value) =>
              setView(value === 'bookings' ? 'bookings' : 'venues')
            }
            value={view}
          />
        </Flex>
        {view === 'bookings' ? renderBookings() : renderVenues()}
      </Flex>
    </div>
  );
};

export default Dashboard;

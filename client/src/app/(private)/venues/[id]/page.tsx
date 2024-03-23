import React from 'react';
import VenueDetailPage from '@/pagelets/venue/VenueDetailPage';

export default function page({ params }: any) {
  const id = params.id;

  return <VenueDetailPage id={id} />;
}

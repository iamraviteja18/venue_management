'use client';

import styles from './venues.module.css';
import SearchBar from '@/components/venues/searchBar';
import Filters from '@/components/venues/filters';
import Listing from '@/components/venues/listing';
import VenueService from '@/services/venues';
import { useEffect, useState } from 'react';
import AddNew from '@/components/venues/addNew';

export const VenueListing = () => {
  const [venues, SetVenues] = useState<any>([]);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    const response = await VenueService.List();
    SetVenues(response ?? []);
  };

  const fetchVenuesWithSearchTerm = async (searchTerm: any) => {
    const response = await VenueService.ListWithSearch(searchTerm);
    SetVenues(response ?? []);
  };

  const fetchVenuesWithFilter = async (filter: any) => {
      const response = await VenueService.ListWithFilter(filter);
      SetVenues(response ?? []);
  };

  const deleteVenuesById = async (id: any) => {
    await VenueService.DeleteById(id);
    const response = {
      filterOptions:{
        filters: venues?.filterOptions?.filters
      },
      venues : venues?.venues.filter((item:any):any=> item?._id !== id)
    }
    SetVenues(response ?? []);
};

  const handleChildData = (data: any) => {
    fetchVenuesWithSearchTerm(data);
  };

  const handleChildDataFilter = (data: any) => {
    fetchVenuesWithFilter(data);
  };

  const handleAddNew = () => {
    fetchVenues();
  };

  const deleteVenue = (data: any) => {
    deleteVenuesById(data);
  };

  return (
    <div
      className={`${styles.flex} ${styles.flexCol}  ${styles.fullWidth} ${styles.container}`}
    >
      <div className={styles.header}>
        <div className={styles.headerTitle}>Venues</div>
        <div className={styles.headerDesc}>
          Find the list of venue and book them!
        </div>
      </div>
      <div className={styles.spaceBtn}>
        <SearchBar sendDataToParent={handleChildData} />
        <AddNew sendDataToParentAddNew= {handleAddNew}/>
      </div>
      <div
        className={`${styles.flex} ${styles.flexRow}`}
        style={{ flex: '100%' }}
      >
        <div style={{ flex: '30%' }}>
          <Filters data={venues} sendDataToParentFilter={handleChildDataFilter}/>
        </div>
        <div style={{ flex: '70%' }}>
          <Listing data={venues}  deleteVenues={deleteVenue} />
        </div>
      </div>
    </div>
  );
};

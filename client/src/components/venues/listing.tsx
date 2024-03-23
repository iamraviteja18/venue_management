import React from 'react';
import styles from '../venues/venues.module.css';
import { Card } from 'antd';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function Listing ({data, deleteVenues}:any) {

  const router = useRouter();
  const redirectToDetailPage = (venueID: any) => {
    router.push(`/venues/${venueID}`);
  };

  const deleteVenue = (id: any,event:any) => {
    event?.stopPropagation();
    deleteVenues(id);
  };
  return (
    <>
      <div className={styles.gridContainer}>
        {data?.venues?.map((venue: any, i: number) => (
          <div
            key={i}
            className={styles.gridItem}
            onClick={() => redirectToDetailPage(venue?._id)}
          >
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt='example'
                  src={'data:image/png;base64,' + venue?.image}
                />
              }
            >
              <div>
                <div className={styles.cardTitle}>
                  {venue?.name}{' '}
                  <div className={styles.actionBtns}>
                    <EditOutlined /> <DeleteOutlined  onClick={(event) => deleteVenue(venue?._id,event)} />
                  </div>
                </div>
                <div className={styles.cardDesc}>{venue?.description}</div>
                <div className={styles.cardSubDesc}>
                  {venue?.location?.address}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default Listing;

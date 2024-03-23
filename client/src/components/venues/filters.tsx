import React, { useState } from 'react';
import styles from '../venues/venues.module.css';

function Filters({data, sendDataToParentFilter }: any) {
  const [selected, setSelected] = useState(null);
  function onChange(i: any, o: any, type:any) {
    let payload = {
      o,type
    }
      sendDataToParentFilter(payload);
    setSelected((prev) => (i === prev ? null : i));
  }
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersTitle}> Filters </div>
      <div className={styles.filtersCollapse}>
        <div>
          <div className={styles.filtersHeaderTitle}>City</div>
          <div>
            <div className={styles.filterContainer}>
              {data?.filterOptions?.filters[0]?.values?.map(
                (o: any, i: any) => (
                  <label key={i}>
                    <input
                      type='checkbox'
                      checked={i === selected}
                      onChange={() => onChange(i, o, 'location.city')}
                    />
                    {o}
                  </label>
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.filtersHeaderTitle}>State</div>
          <div>
            <div className={styles.filterContainer}>
              {data?.filterOptions?.filters[1]?.values?.map(
                (o: any, i: any) => (
                  <label key={i}>
                    <input
                      type='checkbox'
                      checked={i === selected}
                      onChange={() => onChange(i, o, 'location.state')}
                    />
                    {o}
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
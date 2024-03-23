import { Button } from 'antd';

import LandingSplash from '@/assets/backgrounds/LandingSplash.jpg';

import styles from './Landing.module.css';

/* COMPONENT */

export const metadata = {
  title: 'EMS',
};

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <div className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.actions}>
          <Button href='/login' type='primary' size='large'>
            Login
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.landing}>
          <div className={styles.headlines}>
            <span className={styles.headline}>
              Next Level Venue <br /> Management And <br /> Rental Service
            </span>
            <span className={styles.subheadline}>
              Explore a wide range of stunning venues in your preferred
              location. From intimate meeting spaces to grand ballrooms, we have
              options for every event size and style.
            </span>
          </div>
          <div
            className={styles.splash}
            style={{
              backgroundImage: `url(${LandingSplash.src})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

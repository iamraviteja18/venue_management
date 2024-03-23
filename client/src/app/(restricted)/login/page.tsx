import StadiumSplash from '@/assets/backgrounds/StadiumSplash.jpg';
import { LoginForm } from '@/pagelets/login';

import styles from './Login.module.css';

/* COMPONENT */

export const metadata = {
  title: 'Login',
};

const LoginPage = () => (
  <div className={styles.loginPage}>
    <div
      className={styles.splash}
      style={{
        backgroundImage: `url(${StadiumSplash.src})`,
      }}
    />
    <div className={styles.form}>
      <div className={styles.logo}>
        <div>Logo</div>
      </div>
      <LoginForm />
    </div>
  </div>
);

export default LoginPage;

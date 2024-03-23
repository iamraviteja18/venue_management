import StadiumSplash from '@/assets/backgrounds/StadiumSplash.jpg';
import { RegisterForm } from '@/pagelets/register';

import styles from './Register.module.css';

/* COMPONENT */

export const metadata = {
  title: 'Register',
};

const RegisterPage = () => (
  <div className={styles.registerPage}>
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
      <RegisterForm />
    </div>
  </div>
);

export default RegisterPage;

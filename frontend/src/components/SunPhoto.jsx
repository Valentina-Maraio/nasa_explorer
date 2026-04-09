import styles from './styles/SunPhoto.module.css';
import solarFlaresVideo from '../assets/solar_flares.webm';

function SunPhoto() {
  return (
    <div className={styles.card}>      
      <div className={styles.imageContainer}>
        <video 
          src={solarFlaresVideo}
          className={styles.sunVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
}

export default SunPhoto;

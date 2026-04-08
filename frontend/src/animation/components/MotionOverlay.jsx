import styles from './MotionOverlay.module.css';

function MotionOverlay({
  motionVisible,
  roverRef,
  buttonRef,
  roverImage,
  buttonImage,
  pressedButtonImage,
  buttonPressed,
  onRoverLoad,
  onButtonLoad,
  animationLayout,
  roverTransitionMs,
  buttonTransitionMs,
}) {
  return (
    <div className={`${styles.motionOverlay} ${motionVisible ? styles.motionOverlayVisible : styles.motionOverlayHidden}`} aria-hidden="true">
      <img
        ref={roverRef}
        className={`${styles.motionImage} ${styles.roverMotionImage}`}
        src={roverImage}
        alt=""
        onLoad={onRoverLoad}
        style={{
          left: `${animationLayout.roverLeft}px`,
          bottom: `${animationLayout.roverBottom}px`,
          transitionDuration: `${roverTransitionMs}ms`,
        }}
      />
      <img
        ref={buttonRef}
        className={`${styles.motionImage} ${styles.buttonMotionImage}`}
        src={buttonPressed ? pressedButtonImage : buttonImage}
        alt=""
        onLoad={onButtonLoad}
        style={{
          left: `${animationLayout.buttonLeft}px`,
          bottom: `${animationLayout.buttonBottom}px`,
          transitionDuration: `${buttonTransitionMs}ms`,
        }}
      />
    </div>
  );
}

export default MotionOverlay;

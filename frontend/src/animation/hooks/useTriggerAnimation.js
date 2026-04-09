import { useCallback } from 'react';
import {
  BUTTON_ENTER_DURATION_MS,
  ENTER_PHASE_DURATION_MS,
  FLOAT_TRIGGER_DELAY_MS,
  POST_ARRIVAL_DELAY_MS,
  PRE_WARNING_DELAY_MS,
  PRESS_DURATION_MS,
  ROVER_ENTER_DURATION_MS,
  WARNING_PHASE_MS,
} from '../constants.js';

export function useTriggerAnimation({
  dangerLocked,
  setDangerLocked,
  setIsTriggeredFloating,
  setWarningVisible,
  setRoverPaused,
  setButtonPressed,
  setMotionVisible,
  setRoverTransitionMs,
  setButtonTransitionMs,
  setAnimationLayout,
  calculateAnimationLayout,
  clearSequenceTimers,
  timeoutIdsRef,
  rafIdsRef,
}) {
  const handleDangerTrigger = useCallback(() => {
    if (dangerLocked) {
      return;
    }

    clearSequenceTimers();
    const nextLayout = calculateAnimationLayout();
    setDangerLocked(true);
    setIsTriggeredFloating(false);
    setWarningVisible(false);
    setButtonPressed(false);
    setRoverPaused(false);
    setMotionVisible(false);
    setRoverTransitionMs(0);
    setButtonTransitionMs(0);
    setAnimationLayout(nextLayout);

    const warningDelayTimer = window.setTimeout(() => {
      setWarningVisible(true);

      const warningPhaseTimer = window.setTimeout(() => {
        setWarningVisible(false);
        setMotionVisible(true);

        const rafA = window.requestAnimationFrame(() => {
          const rafB = window.requestAnimationFrame(() => {
            setRoverTransitionMs(ROVER_ENTER_DURATION_MS);
            setButtonTransitionMs(BUTTON_ENTER_DURATION_MS);
            setAnimationLayout((layout) => ({
              ...layout,
              roverLeft: layout.roverFinalLeft,
              buttonBottom: layout.buttonFinalBottom,
            }));
          });
          rafIdsRef.current.push(rafB);
        });
        rafIdsRef.current.push(rafA);

        const pressTimer = window.setTimeout(() => {
          setRoverPaused(true);
          const delayTimer = window.setTimeout(() => {
            setRoverPaused(false);
            setRoverTransitionMs(PRESS_DURATION_MS);
            setAnimationLayout((layout) => ({
              ...layout,
              roverLeft: layout.roverPressLeft,
            }));

            const pressEndTimer = window.setTimeout(() => {
              setButtonPressed(true);
              const floatingStartTimer = window.setTimeout(() => {
                setIsTriggeredFloating(true);
                setWarningVisible(false);
                setMotionVisible(false);
                setButtonPressed(false);
                setRoverTransitionMs(0);
                setButtonTransitionMs(0);
                setRoverPaused(false);
              }, FLOAT_TRIGGER_DELAY_MS);
              timeoutIdsRef.current.push(floatingStartTimer);
            }, PRESS_DURATION_MS);
            timeoutIdsRef.current.push(pressEndTimer);
          }, POST_ARRIVAL_DELAY_MS);
          timeoutIdsRef.current.push(delayTimer);
        }, ENTER_PHASE_DURATION_MS);
        timeoutIdsRef.current.push(pressTimer);
      }, WARNING_PHASE_MS);
      timeoutIdsRef.current.push(warningPhaseTimer);
    }, PRE_WARNING_DELAY_MS);
    timeoutIdsRef.current.push(warningDelayTimer);
  }, [
    calculateAnimationLayout,
    clearSequenceTimers,
    dangerLocked,
    rafIdsRef,
    setAnimationLayout,
    setButtonPressed,
    setButtonTransitionMs,
    setDangerLocked,
    setIsTriggeredFloating,
    setMotionVisible,
    setRoverPaused,
    setRoverTransitionMs,
    setWarningVisible,
    timeoutIdsRef,
  ]);

  return {
    handleDangerTrigger,
  };
}

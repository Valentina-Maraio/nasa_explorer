import { useCallback, useEffect, useState } from 'react';

function getInitialLayout() {
  return {
    roverStartLeft: -320,
    roverFinalLeft: 40,
    roverPressLeft: 56,
    roverLeft: -320,
    roverBottom: 24,
    buttonLeft: 240,
    buttonStartBottom: -180,
    buttonFinalBottom: 24,
    buttonBottom: -180,
  };
}

export function useAnimationLayout({ roverRef, buttonRef, motionVisible }) {
  const [animationLayout, setAnimationLayout] = useState(getInitialLayout);

  const calculateAnimationLayout = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const roverRect = roverRef.current?.getBoundingClientRect();
    const buttonRect = buttonRef.current?.getBoundingClientRect();

    const roverWidth = Math.max(120, Math.round(roverRect?.width || 220));
    const buttonWidth = Math.max(110, Math.round(buttonRect?.width || 170));
    const buttonHeight = Math.max(70, Math.round(buttonRect?.height || 110));

    const sideMargin = 12;
    const desiredGap = 10;
    const targetCenterFromRight = viewportWidth / 3;
    let buttonLeft = Math.round(viewportWidth - targetCenterFromRight - buttonWidth / 2);
    buttonLeft = Math.max(sideMargin, Math.min(buttonLeft, viewportWidth - buttonWidth - sideMargin));

    let roverFinalLeft = buttonLeft - roverWidth - desiredGap;
    if (roverFinalLeft < sideMargin) {
      roverFinalLeft = sideMargin;
      buttonLeft = roverFinalLeft + roverWidth + desiredGap;
    }
    if (buttonLeft > viewportWidth - buttonWidth - sideMargin) {
      buttonLeft = viewportWidth - buttonWidth - sideMargin;
      roverFinalLeft = Math.max(sideMargin, buttonLeft - roverWidth - desiredGap);
    }

    const footerBandBottom = Math.max(18, Math.round(viewportHeight * 0.06));
    const buttonFinalBottom = footerBandBottom;
    const buttonStartBottom = -buttonHeight - 20;
    const roverBottom = buttonFinalBottom;
    const roverPressLeft = Math.round(buttonLeft + buttonWidth * 0.24 - roverWidth);

    return {
      roverStartLeft: -roverWidth - 24,
      roverFinalLeft,
      roverPressLeft,
      roverLeft: -roverWidth - 24,
      roverBottom,
      buttonLeft,
      buttonStartBottom,
      buttonFinalBottom,
      buttonBottom: buttonStartBottom,
    };
  }, [buttonRef, roverRef]);

  useEffect(() => {
    setAnimationLayout(calculateAnimationLayout());

    const onResize = () => {
      const nextLayout = calculateAnimationLayout();
      if (!motionVisible) {
        setAnimationLayout(nextLayout);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [calculateAnimationLayout, motionVisible]);

  return {
    animationLayout,
    setAnimationLayout,
    calculateAnimationLayout,
  };
}

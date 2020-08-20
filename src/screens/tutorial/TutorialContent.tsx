import React, {useRef, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, ScrollView, useWindowDimensions, AccessibilityInfo, findNodeHandle} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import LottieView from 'lottie-react-native';
import {useReduceMotionPreference} from 'shared/useReduceMotionPreference';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3'];

const animationData = {
  'step-1': {
    source: require('assets/animation/onboarding-step-1.json'),
    pauseFrame: 0,
  },
  'step-2': {
    source: require('assets/animation/onboarding-step-2.json'),
    pauseFrame: 378,
  },
  'step-3': {
    source: require('assets/animation/onboarding-step-3.json'),
    pauseFrame: 398,
  },
};

export interface TutorialContentProps {
  item: TutorialKey;
  isActive: boolean;
}

export const TutorialContent = ({item, isActive}: TutorialContentProps) => {
  const [i18n] = useI18n();
  const prefersReducedMotion = useReduceMotionPreference();
  const {width: viewportWidth, height: viewportHeight} = useWindowDimensions();

  const animationRef: React.Ref<LottieView> = useRef(null);
  useEffect(() => {
    // need to stop if user prefers reduced animations
    if (prefersReducedMotion) {
      animationRef.current?.play(animationData[item].pauseFrame, animationData[item].pauseFrame);
    } else if (isActive) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [isActive, prefersReducedMotion, item]);

  const autoFocusRef = useRef<any>();
  useLayoutEffect(() => {
    const tag = findNodeHandle(autoFocusRef.current);
    if (isActive && tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, [isActive]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
      <LottieView
        ref={animationRef}
        style={{width: viewportWidth, height: viewportHeight / 2}}
        source={animationData[item].source}
        imageAssetsFolder="animation/images"
        loop={!prefersReducedMotion}
      />
      <Box paddingHorizontal="xxl">
        <Text
          ref={autoFocusRef}
          textAlign="center"
          color="overlayBodyText"
          variant="bodySubTitle"
          marginBottom="m"
          accessibilityRole="header"
        >
          {i18n.translate(`Tutorial.${item}Title`)}
        </Text>
        <Text variant="bodyText" textAlign="center" color="overlayBodyText">
          {i18n.translate(`Tutorial.${item}`)}
        </Text>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
});

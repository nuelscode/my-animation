import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Animated, Image } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

const CircularProgress = (props) => {
  const {
    value,
    initialValue,
    radius,
    duration,
    delay,
    textColor,
    textStyle,
    fontSize,
    maxValue,
    strokeLinecap,
    onAnimationComplete,
    valuePrefix,
    valueSuffix,
    activeStrokeColor,
    activeStrokeWidth,
    inActiveStrokeColor,
    inActiveStrokeWidth,
    inActiveStrokeOpacity,
    showProgressValue,
    imageSource,
    imageStyles
  } = props;

  const styleProps = {
    radius,
    textColor,
    fontSize,
    textStyle,
    activeStrokeColor
  };

  const animatedValue = useRef(new Animated.Value(initialValue)).current;
  const circleRef = useRef();
  const inputRef = useRef();

  const halfCircle = radius + Math.max(activeStrokeWidth, inActiveStrokeWidth);
  const circleCircumference = 2 * Math.PI * radius;
  const animation = (toValue) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(value);
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const biggestValue = Math.max(initialValue, maxValue);
        const maxPerc = (100 * v.value) / biggestValue;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPerc) / 100;
        circleRef?.current?.setNativeProps({
          strokeDashoffset,
        });
      }
      if (inputRef?.current) {
        inputRef?.current?.setNativeProps({
          text: `${valuePrefix}${Math.round(v?.value)}${valueSuffix}`,
        });
      }
      if (value === v?.value) {
        onAnimationComplete();
      }
    });
    return () => animatedValue.removeAllListeners();
  }, [value]);

  return (
    <View style = {{ flex: 1, backgroundColor: "purple" }}>
    
    
      <Image 
         style = {imageStyles} 
         source = {{ uri: imageSource }} />
      <View style = {{ position: "absolute" }}>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G  rotation={'-90'} origin={`${halfCircle}, ${halfCircle}`}>
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            stroke={activeStrokeColor}
            strokeWidth={activeStrokeWidth}
            r={radius}
            fill={'transparent'}
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap = "butt"
            strokeOpacity = {20}
          />
        </G>
      </Svg>
      </View>
    </View>
  );
};

CircularProgress.propTypes = {
  value: PropTypes.number.isRequired,
  initialValue: PropTypes.number,
  radius: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  textColor: PropTypes.string,
  textStyle: PropTypes.object,
  maxValue: PropTypes.number,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  onAnimationComplete: PropTypes.func,
  valuePrefix: PropTypes.string,
  valueSuffix: PropTypes.string,
  activeStrokeColor: PropTypes.string,
  inActiveStrokeColor: PropTypes.string,
  inActiveStrokeOpacity: PropTypes.number,
  activeStrokeWidth: PropTypes.number,
  inActiveStrokeWidth: PropTypes.number,
  showProgressValue: PropTypes.bool
};

CircularProgress.defaultProps = {
  value: 0,
  initialValue: 0,
  radius: 60,
  duration: 500,
  delay: 0,
  maxValue: 100,
  onAnimationComplete: () => { },
  valuePrefix: '',
  valueSuffix: '',
  textStyle: {},
  activeStrokeColor: 'white',
  activeStrokeWidth: 120,
  inActiveStrokeWidth: 10,
  showProgressValue: true
};

export default CircularProgress;






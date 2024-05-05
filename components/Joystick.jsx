import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// import GameContext from "../../contexts/GameContext";
import { colors } from "../utils/colors";

const Joystick = (props) => {
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const [values, setValues] = useState(0);
  // const context = useContext(GameContext);

  useEffect( () => {
    // console.log("hand :", context.handsOn)
    // console.log("pressed :", pressed)
    // !context.handsOn &&
    if( !pressed.value){
      offsetX.value = 0;
      offsetY.value = 0;
      props.onChange({ x: 0, y: 0, pressed: false })
    }
    // context.handsOn
  }, [] )



  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      runOnJS(props.onChange)({
        x: offsetX.value,
        y: offsetY.value,
        pressed: pressed.value,
      });
    })
    .onChange((event) => {
      let x = event.absoluteX - 185/2;
      let y = event.absoluteY - 185*1.6;
    
      // Calculate the distance from the center (0,0) to the point (x,y)
      let distance = Math.sqrt(x*x + y*y);
    
      // If the distance is greater than the radius (80), adjust x and y
      if (distance > 90) {
        // Calculate the angle of the point
        let angle = Math.atan2(y, x);
    
        // Set x and y to the point on the circle in the same angle
        x = (90) * Math.cos(angle) ;
        y = (90) * Math.sin(angle) ;
      }
    
      offsetX.value = x;
      offsetY.value = y;
     
      runOnJS(props.onChange)({
        x:  offsetX.value,
        y: offsetY.value,
        pressed: pressed.value,
      });
    })
    .onFinalize(() => {
      pressed.value = false;
      // !context.handsOn
      if(true){
        offsetX.value = 0;
        offsetY.value = 0;
        runOnJS(props.onChange)({
          x: 0,
          y: 0,
          pressed: pressed.value,
        });
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX:  offsetX.value },
      { translateY: offsetY.value },
      // { scale: withTiming(pressed.value ? 0.9 : 1) },
    ],
    backgroundColor: "rgba(39, 176, 245, 1)",
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}></View>
      <View style={styles.controlArea}>
        <GestureDetector gesture={pan}>
        
          <Animated.View style={[styles.circle, animatedStyles]} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "cente",
    // justifyContent: "flex-end",
    height: "auto",
    width: "100%"
  },
  controlArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 588,
    height: 185,
    width: 185,
    marginBottom: 10,
    // marginLeft: 10,
  },
  circle: {
    height: 80,
    width: 80,
    backgroundColor: "#b58df1",
    borderRadius: 500,
    cursor: "grab",
  },
});
export default Joystick;

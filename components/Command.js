import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";

import axios from "axios";
import { debounce } from "lodash";
// import GameContext from "../contexts/GameContext";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import Joystick from "./Joystick";
import { map } from "../utils/fonctions";
import { colors } from "../utils/colors";

const Command = () => {
  const [joystick, setJoystick] = useState({
    forward: 0,
    backward: 0,
    left: 0,
    right: 0,
  });
  const [pressed, setPressed] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [prevSpeed, setPrevSpeed] = useState(0);
  const [direction, setDirection] = useState(90);
  const [prevDir, setPrevDirection] = useState(90);
  
  const url = "http://192.168.4.1";
  const sendClacksState = async (state) => {
    // const url = `${context.url}/clacks?state=${state}`;
    context.setClacks(state);
  };


  const sendRequest = async (urlz, method, data) => {
    try {
      const response = await axios({
        method: method,
        url: urlz,
        // data: data,
       
        timeout: 500,
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error; // rethrow the error for further handling if needed
    }
  };

  async function sendSpeed(_speed) {
    try {
      console.log("propulsion sent");
      const urlz = `${url}/propulsion?speed=${_speed}`;
      await sendRequest(urlz, "GET", { speed: _speed });
      console.log("sended");
    } catch (error) {
      // console.error('Error:', error);
    }
  }

  async function sendDir(_dir) {
    try {
      console.log("direction sent");
      const urlz = `${url}/direction?value=${_dir}`;
      await sendRequest(urlz, "GET", { value: _dir });
    } catch (error) {
      console.error("Error:", error);
    }
  }

//   useEffect(() => {
//    sendSpeed(speed)
//    sendDir(direction)

//   return  () => {

//   }
//   }, [speed, direction]);

  useEffect(() => {
    // sendDir(direction);
  }, [direction]);

  const onSpeedUpChange = useCallback(
    debounce(async (values) => {
      values.y = -1 * values.y;
      let consigne_angle;
      let x = values.x;
      let y = values.y;
      let _speed = 2 * Math.sqrt(x * x + y * y);

      let angle = parseInt(90 - Math.atan2(y, x) * (180 / Math.PI));
      if (angle > 180 && angle < 270) {
        angle = map(angle, 270, 180, -90, -180);
      }

      if (angle == 90 || angle == 180) {
        if (angle == 90) {
          consigne_angle = 90;
        } else {
          consigne_angle = prevDir > 0 && prevDir < 90 ? 35 : 155;
        }
      } else if (angle < 0 && angle > -180) {
        if (angle < -90) {
          consigne_angle = 35;
        } else {
          consigne_angle = map(angle, -90, 0, 35, 90);
        }
      } else {
        if (angle > 90) {
          consigne_angle = 155;
        } else {
          consigne_angle = map(angle, 0, 90, 90, 155);
        }
      }

      _speed = parseInt(_speed);

      consigne_angle = parseInt(consigne_angle);

      console.log(_speed);
      console.log(consigne_angle);

      setSpeed(_speed);
      if (_speed != speed) {
      }

      setPrevDirection(consigne_angle);
      setDirection(consigne_angle);
    }, 2),
    [joystick]
  );

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <View style={{ flex: 0.5 }}>
          <Joystick onChange={onSpeedUpChange} />
        </View>

        <View>
        <WebView
            renderError={ (error) => {} }
              source={{ uri: `${url}/propulsion?speed=${ parseInt(map(speed, 0, 180, 70, 150))}` }}
            />
             <WebView
            renderError={ (error) => {} }
              source={{ uri: `${url}/direction?value=${direction}` }}
            />
            </View> 
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: colors.main,
    color: colors.text,
    opacity: 0.98,
    flexDirection: "row",
    padding: 5,
  },
  actionsContainer: {
    flex: 0.5,
    // display: "flex",
    // flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "flex-start",
    // alignItems: "center",
  },
  actionsButtons: {
    flex: 0.4,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  visualContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    padding: 10,
    alignItems: "center",
  },
  text: {
    color: colors.text,
  },
});

export default Command;

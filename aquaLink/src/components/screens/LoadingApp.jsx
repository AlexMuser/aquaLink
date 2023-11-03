import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Svg,
  G,
  Path,
  Defs,
  Filter,
  FeFlood,
  FeBlend,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  Ellipse,
} from "react-native-svg";
import { useFonts } from "expo-font";

export default function LoadingApp() {
  return (
    <View style={styles.iPhone1415Pro1}>
      <Svg
        style={styles.rectangle42}
        width="393"
        height="852"
        viewBox="0 0 393 852"
        fill="none"
      >
        <G filter="url(#filter0_i_22_111)">
          <Path d="M0 0H393V852H0V0Z" fill="#35C3FB" />
        </G>
      </Svg>

      {/* component polygon1 */}
      <View style={styles.polygon1}>
        <Svg
          style={styles.ellipse2}
          width="342"
          height="498"
          viewBox="0 0 342 498"
          fill="none"
        >
          <Ellipse
            cx="171"
            cy="249"
            rx="170"
            ry="248"
            fill="#016EA3"
            stroke="#E0F3FE"
          />
        </Svg>

        <Svg
          style={styles._polygon1}
          width="299"
          height="438"
          viewBox="0 0 299 438"
          fill="none"
        >
          <Path
            d="M126.283 37.0993C133.338 16.1102 136.866 5.61566 142.166 2.81495C146.551 0.497791 151.797 0.497791 156.182 2.81495C161.482 5.61566 165.01 16.1102 172.065 37.0993L284.302 370.992C294.912 402.555 300.217 418.336 296.542 425.749C293.509 431.869 287.561 436.018 280.769 436.751C272.544 437.639 259.566 427.21 233.61 406.352L209.684 387.125C187.869 369.595 176.962 360.83 164.831 357.551C154.577 354.779 143.771 354.779 133.517 357.551C121.386 360.83 110.479 369.595 88.6638 387.125L64.7376 406.352C38.782 427.21 25.8041 437.639 17.5786 436.751C10.7871 436.018 4.83944 431.869 1.80572 425.748C-1.86853 418.336 3.43624 402.555 14.0458 370.992L126.283 37.0993Z"
            fill="#0BACEC"
            stroke="#E0F3FE"
          />
        </Svg>

        <Svg
          style={styles.ellipse1}
          width="83"
          height="123"
          viewBox="0 0 83 123"
          fill="none"
        >
          <Path
            d="M81.0516 77.4491C87.0251 109.377 63.6677 122 42.2236 122C20.7795 122 -4.07137 110.12 1.90219 77.4491C7.87573 44.7784 27 1 42 1C57 1 75.078 45.521 81.0516 77.4491Z"
            fill="#008ACA"
            stroke="#E0F3FE"
          />
        </Svg>
      </View>
      <Text style={styles.aquaLink}>{`AquaLink`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iPhone1415Pro1: {
    flexShrink: 0,
    height: 852,
    width: 393,
    backgroundColor: "rgba(223, 243, 255, 1)",
    alignItems: "flex-start",
    rowGap: 0,
  },
  rectangle42: {
    position: "absolute",
    flexShrink: 0,
    width: 393,
    height: 852,
    overflow: "visible",
  },
  polygon1: {
    position: "absolute",
    flexShrink: 0,
    top: 78,
    height: 506,
    left: 27,
    right: 26,
    alignItems: "flex-start",
    rowGap: 0,
  },
  ellipse2: {
    position: "absolute",
    flexShrink: 0,
    top: 21,
    width: 340,
    height: 496,
    overflow: "visible",
  },
  _polygon1: {
    position: "absolute",
    flexShrink: 0,
    top: 40,
    right: 0,
    bottom: 0,
    left: 20,
    overflow: "visible",
  },
  ellipse1: {
    position: "absolute",
    flexShrink: 0,
    top: 220,
    left: 129,
    width: 81,
    height: 121,
    overflow: "visible",
  },
  aquaLink: {
    position: "absolute",
    flexShrink: 0,
    top: 645,
    right: 44,
    left: 68,
    height: 63,
    textAlign: "left",
    color: "rgba(7, 49, 74, 1)",
    //fontFamily: "Kanit-Regular",
    fontSize: 64,
    fontWeight: "400",
    letterSpacing: 0,
  },
});

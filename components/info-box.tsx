import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../constants/fonts";

type Props = {
	title: string | number;
	subtitle?: string;
	containerStyle?: ViewStyle;
	titleStyle: TextStyle;
};

export default function InfoBox({ title, subtitle, containerStyle, titleStyle }: Props) {
	return (
		<View style={containerStyle}>
			<Text style={[styles.title, titleStyle]}>{title}</Text>
			{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		color: "white",
		textAlign: "center",
		fontFamily: POPPINS_SEMIBOLD
	},
	subtitle: {
		color: "#cdcde0",
		fontSize: 14,
		textAlign: "center",
		fontFamily: POPPINS_REGULAR
	}
});

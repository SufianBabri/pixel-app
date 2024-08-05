import { StyleSheet, Text, View } from "react-native";
import { POPPINS_BOLD } from "../constants/fonts";
import { LogoSvg } from "../constants/images";

export default function Logo() {
	return (
		<View style={styles.container}>
			<LogoSvg style={styles.logo} />
			<Text style={styles.label}>Pixel</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginBottom: 16
	},
	logo: {
		width: 40,
		height: 46
	},
	label: {
		fontSize: 30,
		color: "white",
		fontWeight: "bold",
		fontFamily: POPPINS_BOLD
	}
});

import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ArrowLeftSvg } from "../constants/icons";

export default function BackButton() {
	const router = useRouter();

	return (
		<TouchableOpacity style={styles.container} onPress={router.back}>
			<ArrowLeftSvg color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		minWidth: 30,
		minHeight: 30,
		marginTop: 8,
		marginStart: 8,
		alignSelf: "flex-start",
		justifyContent: "center",
		alignItems: "center"
	}
});

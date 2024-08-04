import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../constants/colors";

type Props = { isLoading: boolean };
export default function Loader({ isLoading }: Props) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={colors["secondary"]} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

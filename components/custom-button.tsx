import { Text, TouchableOpacity, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import { POPPINS_SEMIBOLD } from "../constants/fonts";

type Props = { style: ViewStyle; title: string; isLoading?: boolean; onPress: () => void };

export default function CustomButton({ style, title, isLoading = false, onPress }: Props) {
	return (
		<TouchableOpacity
			style={[styles.container, style, { opacity: isLoading ? 0.5 : 1 }]}
			activeOpacity={0.7}
			disabled={isLoading}
			onPress={onPress}>
			<Text
				style={{
					color: colors["primary"],
					fontFamily: POPPINS_SEMIBOLD,
					fontSize: 18
				}}>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors["secondary"],
		borderRadius: 12,
		minHeight: 62,
		justifyContent: "center",
		alignItems: "center"
	}
});
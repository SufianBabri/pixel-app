import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { POPPINS_MEDIUM, POPPINS_SEMIBOLD } from "../constants/fonts";
import { EmptySvg } from "../constants/images";
import CustomButton from "./custom-button";

type Props = { title: string; subtitle: string };
export default function EmptyState({ title, subtitle }: Props) {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<EmptySvg />
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.subTitle}>{subtitle}</Text>
			<CustomButton title="Create Video" onPress={() => router.push("/create")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16
	},
	title: {
		color: "white",
		fontSize: 20,
		fontFamily: POPPINS_SEMIBOLD
	},
	subTitle: {
		color: "white",
		fontSize: 16,
		fontFamily: POPPINS_MEDIUM
	}
});

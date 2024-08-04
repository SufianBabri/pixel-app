import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/custom-button";
import Logo from "../components/logo";
import colors from "../constants/colors";
import { POPPINS_REGULAR } from "../constants/fonts";
import { PathSvg, cardsUri } from "../constants/images";
import { useGlobalContext } from "../context/global-provider";

export default function App() {
	const { isLoading, isLoggedIn } = useGlobalContext();

	if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollViewContainer}>
				<View style={styles.innerContainer}>
					<Logo />
					<Image style={styles.cards} source={cardsUri} resizeMode="contain" />

					<View style={styles.titleContainer}>
						<Text style={styles.title}>
							Discover Endless Possibilities with{" "}
							<View>
								<Text
									style={{
										...styles.title,
										top: 5,
										color: colors["secondary"]
									}}>
									Pixel
								</Text>
								<PathSvg style={styles.underline} width={75} height={14} />
							</View>
						</Text>
					</View>
					<Text style={styles.subtitle}>
						Where creativity meets innovation: embark on a journey of limitless
						exploration with Pixel
					</Text>
					<CustomButton
						style={styles.button}
						title="Continue with Email"
						onPress={() => router.push("/sign-in")}
					/>
				</View>
			</ScrollView>
			<StatusBar backgroundColor={colors.primary} style="light" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors["primary"],
		height: "100%"
	},
	scrollViewContainer: { height: "100%" },
	innerContainer: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16
	},
	cards: { width: "100%", height: 300, maxWidth: 380 },
	titleContainer: { marginTop: 20 },
	title: {
		fontSize: 30,
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	underline: { bottom: -12, position: "absolute" },
	subtitle: {
		fontSize: 14,
		fontFamily: POPPINS_REGULAR,
		color: colors["gray.100"],
		textAlign: "center",
		marginTop: 28
	},
	button: { width: "100%", marginTop: 28 }
});

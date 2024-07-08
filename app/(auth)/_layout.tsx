import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import colors from "../../constants/colors";

export default function AuthLayout() {
	return (
		<>
			<Stack>
				<Stack.Screen name="sign-in" options={{ headerShown: false }} />
				<Stack.Screen name="sign-up" options={{ headerShown: false }} />
			</Stack>
			<StatusBar backgroundColor={colors["primary"]} style="light" />
		</>
	);
}

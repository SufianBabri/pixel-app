import { Link } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import Logo from "../../components/Logo";
import colors from "../../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../../constants/fonts";

export default function SignIn() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: ""
	});

	function onSubmit() {
		if (form.email === "" || form.password === "") {
			Alert.alert("Error", "Please fill in all fields");
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.innerContainer}>
					<Logo />
					<Text style={styles.text}>Sign up</Text>

					<FormField
						title="Username"
						value={form.username}
						handleChangeText={username => setForm({ ...form, username })}
						style={styles.formElement}
						keyboardType="default"
					/>
					<FormField
						title="Email"
						value={form.email}
						handleChangeText={email => setForm({ ...form, email })}
						style={styles.formElement}
						keyboardType="email-address"
					/>

					<FormField
						title="Password"
						value={form.password}
						handleChangeText={password => setForm({ ...form, password })}
						style={styles.formElement}
					/>

					<CustomButton style={styles.formElement} title="Sign up" onPress={onSubmit} />

					<View style={styles.footnoteContainer}>
						<Text style={styles.footerText}>Already have an account?</Text>
						<Link href="/sign-in" style={styles.link}>
							Login
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors["primary"]
	},
	scrollViewContent: { flex: 1 },
	innerContainer: {
		width: "100%",
		height: "100%",
		alignContent: "center",
		justifyContent: "center",
		paddingHorizontal: 16
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginTop: 40,
		fontFamily: POPPINS_SEMIBOLD
	},
	formElement: {
		marginTop: 28
	},
	footnoteContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: 20,
		gap: 4
	},
	footerText: {
		fontSize: 18,
		color: colors["gray.100"],
		fontFamily: POPPINS_REGULAR
	},
	link: {
		fontSize: 18,
		fontFamily: POPPINS_SEMIBOLD,
		color: colors["secondary"]
	}
});

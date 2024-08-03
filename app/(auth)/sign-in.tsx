import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField, { FormFieldRef } from "../../components/FormField";
import Logo from "../../components/Logo";
import colors from "../../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../../constants/fonts";
import { useGlobalContext } from "../../context/GlobalProvider";
import { signIn } from "../../services/api";
import { parseArrayAsList } from "../../utils/formatting";
import {
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
	isEmailValid,
	isPasswordLengthValid
} from "../../utils/validation";

export default function SignIn() {
	const [form, setForm] = useState({ email: "", password: "" });
	const { setUser } = useGlobalContext();
	const [submitting, setSubmitting] = useState(false);
	const passwordRef = useRef<FormFieldRef>(null);

	function validateForm() {
		const errors = Array<string>();

		if (!isEmailValid(form.email)) errors.push("Invalid email provided");
		if (!isPasswordLengthValid(form.password))
			errors.push(
				`Password should be between ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters long`
			);

		return parseArrayAsList(errors);
	}

	async function onSubmit() {
		const message = validateForm();
		if (message) return Alert.alert("Error", message);

		setSubmitting(true);

		try {
			const { email, password } = form;
			const user = await signIn(email, password);

			setUser(user);

			router.replace("/home");
		} catch (e) {
			console.log("error", e);
			let message;
			if (e instanceof Error) message = e.message;
			else message = "An error has occurred while trying to sign in";

			Alert.alert("Error", message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollViewContent}
				keyboardShouldPersistTaps="handled">
				<View style={styles.innerContainer}>
					<Logo />
					<Text style={styles.text}>Log in</Text>

					<FormField
						style={styles.formElement}
						title="Email"
						keyboardType="email-address"
						returnKeyType="next"
						value={form.email}
						onSubmitEditing={() => passwordRef.current?.focus()}
						onChangeText={email => setForm({ ...form, email })}
					/>

					<FormField
						ref={passwordRef}
						style={styles.formElement}
						title="Password"
						returnKeyType="done"
						blurOnSubmit
						value={form.password}
						onSubmitEditing={onSubmit}
						onChangeText={password => setForm({ ...form, password })}
					/>

					<CustomButton
						style={styles.formElement}
						title="Sign In"
						isLoading={submitting}
						onPress={onSubmit}
					/>

					<View style={styles.footnoteContainer}>
						<Text style={styles.footerText}>Don't have an account?</Text>
						<Link href="/sign-up" style={styles.link}>
							Signup
						</Link>
					</View>
				</View>
			</KeyboardAwareScrollView>
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

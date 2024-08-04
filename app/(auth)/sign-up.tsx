import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/back-button";
import CustomButton from "../../components/custom-button";
import FormField, { FormFieldRef } from "../../components/form-field";
import Logo from "../../components/logo";
import colors from "../../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../../constants/fonts";
import { useGlobalContext } from "../../context/global-provider";
import { createUser } from "../../services/api";
import { parseArrayAsList } from "../../utils/formatting";
import {
	MAX_PASSWORD_LENGTH,
	MAX_USERNAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	MIN_USERNAME_LENGTH,
	isEmailValid,
	isPasswordLengthValid,
	isUsernameLengthValid
} from "../../utils/validation";

export default function SignIn() {
	const [form, setForm] = useState({ username: "", email: "", password: "" });
	const [submitting, setSubmitting] = useState(false);
	const emailRef = useRef<FormFieldRef>(null);
	const passwordRef = useRef<FormFieldRef>(null);
	const { setUser } = useGlobalContext();

	function validateForm() {
		const errors = Array<string>();

		if (!isUsernameLengthValid(form.username))
			errors.push(
				`Username should be between ${MIN_USERNAME_LENGTH} to ${MAX_USERNAME_LENGTH} characters long`
			);
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
			const { username, email, password } = form;
			const user = await createUser(email, password, username);
			setUser(user);

			router.replace("/home");
		} catch (e) {
			let message;
			if (e instanceof Error) message = e.message;
			else message = "An error has occurred while trying to sign up";

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
				<BackButton />
				<View style={styles.form}>
					<Logo />
					<Text style={styles.text}>Sign up</Text>

					<FormField
						style={styles.formElement}
						title="Username"
						keyboardType="default"
						returnKeyType="next"
						value={form.username}
						onSubmitEditing={() => emailRef.current?.focus()}
						onChangeText={username => setForm({ ...form, username })}
					/>
					<FormField
						ref={emailRef}
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
						title="Sign up"
						isLoading={submitting}
						onPress={onSubmit}
					/>

					<View style={styles.footnoteContainer}>
						<Text style={styles.footerText}>Already have an account?</Text>
						<Link href="/sign-in" style={styles.link}>
							Login
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
	form: {
		width: "100%",
		height: "100%",
		alignContent: "center",
		justifyContent: "center",
		paddingTop: 20,
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

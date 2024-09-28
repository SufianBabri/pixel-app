import { KeyboardAwareScrollView } from "@pietile-native-kit/keyboard-aware-scrollview";
import { Link, router } from "expo-router";
import { useCallback } from "react";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/back-button";
import CustomButton from "../../components/custom-button";
import FormField, { type FormFieldRef } from "../../components/form-field";
import Logo from "../../components/logo";
import colors from "../../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../../constants/fonts";
import { useGlobalContext } from "../../context/global-provider";
import { createUser } from "../../services/api";
import { parseArrayAsList } from "../../utils/formatting";
import {
	MAX_NAME_LENGTH,
	MAX_PASSWORD_LENGTH,
	MIN_NAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	isEmailValid,
	isNameLengthValid,
	isPasswordLengthValid
} from "../../utils/validation";

export default function SignIn() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [submitting, setSubmitting] = useState(false);
	const emailRef = useRef<FormFieldRef>(null);
	const passwordRef = useRef<FormFieldRef>(null);
	const { setUser } = useGlobalContext();

	const validateForm = useCallback(() => {
		const errors = Array<string>();

		if (!isNameLengthValid(form.name))
			errors.push(
				`Name should be between ${MIN_NAME_LENGTH} to ${MAX_NAME_LENGTH} characters long`
			);
		if (!isEmailValid(form.email)) errors.push("Invalid email provided");
		if (!isPasswordLengthValid(form.password))
			errors.push(
				`Password should be between ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters long`
			);

		return parseArrayAsList(errors);
	}, [form]);

	const onSubmit = useCallback(async () => {
		const message = validateForm();
		if (message) return Alert.alert("Error", message);

		setSubmitting(true);

		const { name, email, password } = form;
		const { user, error } = await createUser(email, password, name);

		setSubmitting(false);
		if (user) {
			setUser(user);
			return router.replace("/home");
		}

		Alert.alert("Error", error);
	}, [form, validateForm, setUser]);

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
						title="Name"
						autoFocus
						keyboardType="default"
						returnKeyType="next"
						value={form.name}
						onSubmitEditing={() => emailRef.current?.focus()}
						onChangeText={name => setForm({ ...form, name })}
					/>
					<FormField
						ref={emailRef}
						style={styles.formElement}
						title="Email"
						autoCapitalize="none"
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
						autoCapitalize="none"
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

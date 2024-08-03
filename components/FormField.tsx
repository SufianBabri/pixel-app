import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
	KeyboardType,
	ReturnKeyType,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ViewStyle
} from "react-native";
import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import { POPPINS_MEDIUM, POPPINS_SEMIBOLD } from "../constants/fonts";
import { EyeHideSvg, EyeSvg } from "../constants/icons";

type Props = {
	style: ViewStyle;
	title: string;
	placeholder?: string;
	keyboardType?: KeyboardType;
	returnKeyType?: ReturnKeyType;
	blurOnSubmit?: boolean;
	value: string;
	onSubmitEditing?: () => void;
	onChangeText: (value: string) => void;
};

function FormField(
	{
		style,
		title,
		placeholder,
		keyboardType,
		returnKeyType,
		blurOnSubmit = false,
		value,
		onSubmitEditing,
		onChangeText
	}: Props,
	ref: ForwardedRef<FormFieldRef>
) {
	const [showPassword, setShowPassword] = useState(false);
	const inputRef = useRef<TextInput>(null);

	useImperativeHandle(ref, () => ({ focus }));

	function focus() {
		inputRef.current?.focus();
	}

	return (
		<View style={[styles.container, style]}>
			<Text style={styles.title}>{title}</Text>

			<View style={styles.inputContainer}>
				<TextInput
					ref={inputRef}
					style={styles.input}
					value={value}
					placeholder={placeholder}
					placeholderTextColor={colors["gray.200"]}
					secureTextEntry={title === "Password" && !showPassword}
					keyboardType={keyboardType}
					returnKeyType={returnKeyType}
					blurOnSubmit={blurOnSubmit}
					onSubmitEditing={onSubmitEditing}
					onChangeText={onChangeText}
				/>

				{title === "Password" && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						{showPassword ? (
							<EyeHideSvg style={styles.showPasswordIcon} width={24} />
						) : (
							<EyeSvg style={styles.showPasswordIcon} width={24} />
						)}
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

export default forwardRef(FormField);

const styles = StyleSheet.create({
	container: { marginBottom: 8 },
	title: {
		fontSize: 16,
		color: colors["gray.100"],
		fontFamily: POPPINS_MEDIUM
	},
	inputContainer: {
		width: "100%",
		backgroundColor: colors["black.200"],
		borderRadius: 20,
		borderWidth: 2,
		borderColor: colors["black.100"],
		flexDirection: "row",
		alignItems: "center",
		paddingRight: 16,
		marginTop: 8
	},
	input: {
		flex: 1,
		color: "#ffffff",
		fontFamily: POPPINS_SEMIBOLD,
		fontSize: 16,
		paddingLeft: 16,
		paddingVertical: 16
	},
	showPasswordIcon: { marginLeft: 8 }
});

export type FormFieldRef = { focus: () => void };

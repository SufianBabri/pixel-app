import { useState } from "react";
import { KeyboardType, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import { POPPINS_MEDIUM, POPPINS_SEMIBOLD } from "../constants/fonts";
import { EyeHideSvg, EyeSvg } from "../constants/icons";

type Props = {
	title: string;
	value: string;
	placeholder?: string;
	keyboardType?: KeyboardType;
	handleChangeText: (value: string) => void;
	style: ViewStyle;
};
export default function FormField({
	title,
	value,
	placeholder,
	handleChangeText,
	style,
	keyboardType
}: Props) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View style={[styles.container, style]}>
			<Text style={styles.title}>{title}</Text>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#7B7B8B"
					onChangeText={handleChangeText}
					secureTextEntry={title === "Password" && !showPassword}
					keyboardType={keyboardType}
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

const styles = StyleSheet.create({
	container: {
		marginBottom: 8
	},
	title: {
		fontSize: 16,
		color: colors["gray.100"],
		fontFamily: POPPINS_MEDIUM
	},
	inputContainer: {
		width: "100%",
		height: 64,
		paddingHorizontal: 16,
		backgroundColor: colors["black.200"],
		borderRadius: 20,
		borderWidth: 2,
		borderColor: colors["black.100"],
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8
	},
	input: {
		flex: 1,
		color: "#ffffff",
		fontFamily: POPPINS_SEMIBOLD,
		fontSize: 16
	},
	showPasswordIcon: {
		marginLeft: 8
	}
});

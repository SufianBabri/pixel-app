import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { POPPINS_REGULAR } from "../constants/fonts";
import { SearchSvg } from "../constants/icons";

type Props = { initialQuery?: string };
export default function SearchInput({ initialQuery }: Props) {
	const [isFocused, setIsFocused] = useState(false);
	const [query, setQuery] = useState(initialQuery || "");
	const pathname = usePathname();

	function onSubmitQuery() {
		if (query === "")
			return Alert.alert(
				"Missing Query",
				"Please input something to search results across database"
			);

		if (pathname.startsWith("/search")) {
			router.setParams({ query });
		} else {
			router.push(`/search/${query}`);
		}
	}

	return (
		<View style={[styles.container, isFocused && styles.containerFocused]}>
			<TextInput
				style={styles.input}
				value={query}
				placeholder="Search a video topic"
				placeholderTextColor={colors["placeholder"]}
				returnKeyType="search"
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onSubmitEditing={onSubmitQuery}
				onChangeText={text => setQuery(text)}
			/>

			<TouchableOpacity onPress={onSubmitQuery}>
				<SearchSvg style={styles.icon} />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		backgroundColor: colors["black.100"],
		borderRadius: 16,
		borderWidth: 2,
		borderColor: colors["black.200"]
	},
	containerFocused: {
		borderColor: colors["secondary"]
	},
	input: {
		flex: 1,
		fontSize: 16,
		marginTop: 0.5,
		minHeight: 64,
		color: "white",
		fontFamily: POPPINS_REGULAR,
		paddingStart: 16
	},
	icon: {
		width: 20,
		height: 20,
		marginEnd: 16
	}
});

import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { POPPINS_REGULAR } from "../constants/fonts";
import { SearchSvg } from "../constants/icons";

export default function SearchInput({ initialQuery }: { initialQuery?: string }) {
	const pathname = usePathname();
	const [query, setQuery] = useState(initialQuery || "");

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={query}
				placeholder="Search a video topic"
				placeholderTextColor={colors["placeholder"]}
				onChangeText={text => setQuery(text)}
			/>

			<TouchableOpacity
				onPress={() => {
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
				}}>
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
		height: 64,
		paddingHorizontal: 16,
		backgroundColor: colors["black.100"],
		borderRadius: 16,
		borderWidth: 2,
		borderColor: colors["black.200"]
	},
	input: {
		fontSize: 16,
		marginTop: 0.5,
		color: "white",
		flex: 1,
		fontFamily: POPPINS_REGULAR
	},
	icon: {
		width: 20,
		height: 20
	}
});

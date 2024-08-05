import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { POPPINS_MEDIUM, POPPINS_SEMIBOLD } from "../constants/fonts";
import SearchInput from "./search-input";

type Props = { query: string };
export default function SearchListHeader({ query }: Props) {
	return (
		<View style={styles.container}>
			<Text style={styles.searchResultsText}>Search Results</Text>
			<Text style={styles.queryText}>"{query}"</Text>

			<View style={styles.searchInputContainer}>
				<SearchInput initialQuery={query} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 24,
		paddingHorizontal: 16
	},
	searchResultsText: {
		fontFamily: POPPINS_MEDIUM,
		color: colors["placeholder"],
		fontSize: 14
	},
	queryText: {
		fontFamily: POPPINS_SEMIBOLD,
		color: "white",
		fontSize: 24,
		marginTop: 4
	},
	searchInputContainer: {
		marginTop: 24,
		marginBottom: 32
	}
});

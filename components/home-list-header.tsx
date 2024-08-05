import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import { POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../constants/fonts";
import { LogoSvg } from "../constants/images";
import { useGlobalContext } from "../context/global-provider";
import { Post } from "../services/api";
import SearchInput from "./search-input";
import Trending from "./trending";

type Props = { latestPosts: Post[] };

export default function HomeListHeader({ latestPosts }: Props) {
	const { user } = useGlobalContext();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View>
					<Text style={styles.welcomeText}>Welcome back</Text>
					<Text style={styles.title}>{user?.username}</Text>
				</View>

				<View style={styles.logoContainer}>
					<LogoSvg style={styles.logo} />
				</View>
			</View>

			<SearchInput />

			<View style={styles.content}>
				<Text style={styles.latestVideosText}>Latest Videos</Text>
			</View>
			<Trending posts={latestPosts} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 24,
		paddingHorizontal: 16
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 24
	},
	welcomeText: {
		fontFamily: POPPINS_MEDIUM,
		fontSize: 14,
		color: colors["gray.300"]
	},
	title: {
		fontFamily: POPPINS_SEMIBOLD,
		fontSize: 24,
		color: "white"
	},
	logoContainer: {
		marginTop: 6
	},
	logo: {
		width: 36,
		height: 40
	},
	content: {
		flex: 1,
		paddingTop: 20,
		paddingBottom: 32
	},
	latestVideosText: {
		fontFamily: POPPINS_REGULAR,
		fontSize: 18,
		color: colors["gray.300"],
		marginBottom: 12
	}
});

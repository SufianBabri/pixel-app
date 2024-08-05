import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { LogoutSvg } from "../constants/icons";
import { Post, User } from "../services/api";
import InfoBox from "./info-box";

type Props = { user: User; posts: Post[]; onLogoutClick: () => Promise<void> };

export default function ProfileListHeader({ user, posts, onLogoutClick }: Props) {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onLogoutClick} style={styles.logoutButton}>
				<LogoutSvg style={styles.logoutIcon} />
			</TouchableOpacity>

			<View style={styles.avatarContainer}>
				<Image source={{ uri: user.avatarUrl }} style={styles.avatar} resizeMode="cover" />
			</View>

			<InfoBox
				title={user.username}
				containerStyle={styles.infoBoxContainer}
				titleStyle={styles.infoBoxTitle}
			/>

			<View style={styles.statsContainer}>
				<InfoBox
					title={posts.length || 0}
					subtitle="Posts"
					titleStyle={styles.statsTitle}
					containerStyle={styles.statsBoxContainer}
				/>
				<InfoBox title="1.2k" subtitle="Followers" titleStyle={styles.statsTitle} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
		marginBottom: 48,
		paddingHorizontal: 16
	},
	logoutButton: {
		width: "100%",
		alignItems: "flex-end",
		marginBottom: 40
	},
	logoutIcon: {
		width: 24,
		height: 24
	},
	avatarContainer: {
		width: 64,
		height: 64,
		borderWidth: 1,
		borderColor: colors["secondary"],
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center"
	},
	avatar: {
		width: "90%",
		height: "90%",
		borderRadius: 8
	},
	infoBoxContainer: {
		marginTop: 20
	},
	infoBoxTitle: {
		fontSize: 18
	},
	statsContainer: {
		marginTop: 20,
		flexDirection: "row"
	},
	statsTitle: {
		fontSize: 20
	},
	statsBoxContainer: {
		marginRight: 40
	}
});

import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../constants/fonts";
import { PlaySvg } from "../constants/icons";
import { type Post, type User, deletePost } from "../services/api";
import OverflowMenu from "./overflow-menu";

type Props = {
	post: Post;
	user: User;
	onPostDeleted: (id: string) => void;
};

export default function VideoCard({ post, user, onPostDeleted }: Props) {
	const { title, creator, thumbnailUrl, videoUrl } = post;
	const [play, setPlay] = useState(false);

	async function onBookmark() {
		// await bookmarkPost($id, userId);
	}

	async function onDelete() {
		const isDeleted = await deletePost(post, user.name);
		if (isDeleted) onPostDeleted(post.$id);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.userDetails}>
					<View style={styles.avatarContainer}>
						<Image
							source={{ uri: creator.avatarUrl }}
							style={styles.avatar}
							resizeMode="cover"
						/>
					</View>

					<View style={styles.textContainer}>
						<Text style={styles.title} numberOfLines={1}>
							{title}
						</Text>
						<Text style={styles.creator} numberOfLines={1}>
							{creator.name}
						</Text>
					</View>
				</View>

				<OverflowMenu
					style={styles.menuIconContainer}
					showDeleteOption={creator.$id === user.id}
					onBookmark={onBookmark}
					onDelete={onDelete}
				/>
			</View>

			{play ? (
				<Video
					source={{ uri: videoUrl }}
					style={styles.video}
					resizeMode={ResizeMode.CONTAIN}
					useNativeControls
					shouldPlay
					onPlaybackStatusUpdate={status => {
						if ("error" in status) {
							Alert.alert("Error", "An error occurred while playing video");
							setPlay(false);
						}

						if ("didJustFinish" in status && status.didJustFinish) setPlay(false);
					}}
				/>
			) : (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setPlay(true)}
					style={styles.thumbnailContainer}>
					<Image
						source={{ uri: thumbnailUrl }}
						style={styles.thumbnail}
						resizeMode="cover"
					/>

					<PlaySvg style={styles.playIcon} />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		paddingHorizontal: 16,
		marginBottom: 56
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12
	},
	userDetails: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flex: 1
	},
	avatarContainer: {
		width: 46,
		height: 46,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors["secondary"],
		justifyContent: "center",
		alignItems: "center",
		padding: 0.5
	},
	avatar: {
		width: "100%",
		height: "100%",
		borderRadius: 8
	},
	textContainer: {
		justifyContent: "center",
		flex: 1,
		marginLeft: 12,
		gap: 4
	},
	title: {
		fontFamily: POPPINS_SEMIBOLD,
		fontSize: 14,
		color: "white"
	},
	creator: {
		fontFamily: POPPINS_REGULAR,
		fontSize: 12,
		color: colors["neutral.100"]
	},
	menuIconContainer: {
		paddingTop: 8
	},
	video: {
		width: "100%",
		height: 240,
		borderRadius: 16,
		marginTop: 12
	},
	thumbnailContainer: {
		width: "100%",
		height: 240,
		borderRadius: 16,
		marginTop: 12,
		justifyContent: "center",
		alignItems: "center",
		position: "relative"
	},
	thumbnail: {
		width: "100%",
		height: "100%",
		borderRadius: 16
	},
	playIcon: {
		width: 48,
		height: 48,
		position: "absolute"
	}
});

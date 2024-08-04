import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
	Alert,
	FlatList,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	ViewStyle
} from "react-native";
import * as Animatable from "react-native-animatable";
import { PlaySvg } from "../constants/icons";
import { Post } from "../services/api";

const zoomIn = {
	0: {
		scale: 0.9
	},
	1: {
		scale: 1.1
	}
} as Animatable.CustomAnimation;

const zoomOut = {
	0: {
		scale: 1
	},
	1: {
		scale: 0.9
	}
} as Animatable.CustomAnimation;

type TrendingItemProps = {
	activeItem: string;
	item: Post;
};

function TrendingItem({ activeItem, item }: TrendingItemProps) {
	const [play, setPlay] = useState(false);

	return (
		<Animatable.View
			style={styles.animatableView}
			animation={activeItem === item.$id ? zoomIn : zoomOut}
			duration={500}>
			{play ? (
				<Video
					source={{ uri: item.videoUrl, overrideFileExtensionAndroid: "m3u8" }}
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
					style={styles.touchable}
					activeOpacity={0.7}
					onPress={() => setPlay(true)}>
					<ImageBackground
						source={{ uri: item.thumbnailUrl }}
						style={styles.imageBackground}
						resizeMode="cover"
					/>

					<PlaySvg style={styles.playIcon} />
				</TouchableOpacity>
			)}
		</Animatable.View>
	);
}

type Props = {
	posts: Post[];
};

function Trending({ posts }: Props) {
	const [activeItem, setActiveItem] = useState(posts.length > 0 ? posts[1].$id : "");

	function viewableItemsChanged({ viewableItems }: { viewableItems: { key: string }[] }) {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].key);
		}
	}

	return (
		<FlatList
			data={posts}
			horizontal
			keyExtractor={item => item.$id}
			renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
			onViewableItemsChanged={viewableItemsChanged}
			viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
			contentOffset={{ x: 170, y: 0 }}
		/>
	);
}

export default Trending;

const styles = StyleSheet.create({
	animatableView: {
		marginRight: 20
	} as ViewStyle,
	video: {
		width: 208,
		height: 288,
		borderRadius: 33,
		marginTop: 12,
		backgroundColor: "rgba(255, 255, 255, 0.1)"
	},
	touchable: {
		position: "relative",
		justifyContent: "center",
		alignItems: "center"
	},
	imageBackground: {
		width: 208,
		height: 288,
		borderRadius: 33,
		marginVertical: 20,
		overflow: "hidden",
		shadowColor: "rgba(0, 0, 0, 0.4)",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 1,
		shadowRadius: 10
	},
	playIcon: {
		width: 48,
		height: 48,
		position: "absolute"
	}
});

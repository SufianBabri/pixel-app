import { FlatList, RefreshControl, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import EmptyState from "../../components/empty-state";
import HomeListHeader from "../../components/home-list-header";
import Loader from "../../components/loader";
import VideoCard from "../../components/video-card";
import colors from "../../constants/colors";
import useApi from "../../hooks/use-api";
import { getAllPosts, getLatestPosts } from "../../services/api";

export default function Home() {
	const { response: latestPostsResponse } = useApi(getLatestPosts);
	const { response: postsResponse, loading, refetch, refetching } = useApi(getAllPosts);

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<Loader isLoading={loading} />
			) : (
				<FlatList
					data={postsResponse?.data}
					keyExtractor={item => item.$id}
					keyboardShouldPersistTaps="handled"
					refreshControl={<RefreshControl refreshing={refetching} onRefresh={refetch} />}
					ListHeaderComponent={() => (
						<HomeListHeader latestPosts={latestPostsResponse?.data ?? []} />
					)}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Videos Found"
							subtitle="Be the first one to upload a video"
						/>
					)}
					renderItem={({ item }) => (
						<VideoCard
							title={item.title}
							thumbnail={item.thumbnailUrl}
							video={item.videoUrl}
							creatorName={item.creator.username}
							creatorAvatarUrl={item.creator.avatarUrl}
						/>
					)}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors["primary"]
	}
});

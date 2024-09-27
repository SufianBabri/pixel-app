import { Redirect } from "expo-router";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet } from "react-native";
import EmptyState from "../../components/empty-state";
import HomeListHeader from "../../components/home-list-header";
import Loader from "../../components/loader";
import VideoCard from "../../components/video-card";
import colors from "../../constants/colors";
import { useGlobalContext } from "../../context/global-provider";
import useApi from "../../hooks/use-api";
import { getAllPosts, getLatestPosts } from "../../services/api";

export default function Home() {
	const { user } = useGlobalContext();
	const { response: latestPostsResponse } = useApi(getLatestPosts);
	const {
		response: postsResponse,
		loading,
		refetch,
		refetching,
		handlePostDeleted
	} = useApi(getAllPosts);

	if (!user) return <Redirect href="/sign-in" />;

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<Loader />
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
						<VideoCard post={item} user={user} onPostDeleted={handlePostDeleted} />
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

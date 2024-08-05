import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import EmptyState from "../../components/empty-state";
import Loader from "../../components/loader";
import SearchListHeader from "../../components/search-list-header";
import VideoCard from "../../components/video-card";
import colors from "../../constants/colors";
import useApi from "../../hooks/use-api";
import { searchPosts } from "../../services/api";

export default function Search() {
	const { query } = useLocalSearchParams();
	const queryString = Array.isArray(query) ? query[0] : query ?? "";
	const {
		response: postsResponse,
		loading,
		refetch
	} = useApi(async () => await searchPosts(queryString));

	useEffect(() => {
		refetch();
	}, [queryString]);

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<Loader />
			) : (
				<FlatList
					data={postsResponse?.data}
					keyExtractor={item => item.$id}
					keyboardShouldPersistTaps="handled"
					ListHeaderComponent={() => <SearchListHeader query={queryString} />}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Videos Found"
							subtitle="No videos found for this search"
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

import { Redirect, router } from "expo-router";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import EmptyState from "../../components/empty-state";
import Loader from "../../components/loader";
import ProfileListHeader from "../../components/profile-list-header";
import VideoCard from "../../components/video-card";
import colors from "../../constants/colors";
import { useGlobalContext } from "../../context/global-provider";
import useApi from "../../hooks/use-api";
import { getUserPosts, signOut } from "../../services/api";

export default function Profile() {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const { response: postsResponse, loading } = useApi(
		async () => await getUserPosts(user?.id ?? "")
	);

	if (!user) return <Redirect href="/home" />;

	async function onLogoutClick() {
		await signOut();
		setUser(null);
		setIsLoggedIn(false);

		router.replace("/sign-in");
	}

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<Loader />
			) : (
				<FlatList
					data={postsResponse?.data}
					keyExtractor={item => item.$id}
					keyboardShouldPersistTaps="handled"
					ListHeaderComponent={
						<ProfileListHeader
							user={user}
							posts={postsResponse?.data ?? []}
							onLogoutClick={onLogoutClick}
						/>
					}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Videos Found"
							subtitle="No videos found for this profile"
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

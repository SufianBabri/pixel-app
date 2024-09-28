import { Redirect, router } from "expo-router";
import { useCallback } from "react";
import { FlatList, type ListRenderItemInfo, SafeAreaView, StyleSheet } from "react-native";
import EmptyState from "../../components/empty-state";
import Loader from "../../components/loader";
import ProfileListHeader from "../../components/profile-list-header";
import VideoCard from "../../components/video-card";
import colors from "../../constants/colors";
import { useGlobalContext } from "../../context/global-provider";
import useApi from "../../hooks/use-api";
import { type Post, getUserPosts, signOut } from "../../services/api";

export default function Profile() {
	const { user, setUser, setIsLoggedIn } = useGlobalContext();
	const fetchPosts = useCallback(async () => await getUserPosts(user?.id ?? ""), [user?.id]);
	const { response: postsResponse, loading } = useApi(fetchPosts);

	const onLogoutClick = useCallback(async () => {
		await signOut();
		setUser(null);
		setIsLoggedIn(false);

		router.replace("/sign-in");
	}, [setUser, setIsLoggedIn]);
	const renderPost = useCallback(
		({ item }: ListRenderItemInfo<Post>) => {
			if (!user) return null;

			return (
				<VideoCard
					post={item}
					user={user}
					onPostDeleted={id => console.log("delelte-clicked", id)}
				/>
			);
		},
		[user]
	);

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
					ListHeaderComponent={
						<ProfileListHeader
							user={user}
							postsCount={postsResponse?.data?.length ?? 0}
							onLogoutClick={onLogoutClick}
						/>
					}
					ListEmptyComponent={() => (
						<EmptyState
							title="No Videos Found"
							subtitle="No videos found for this profile"
						/>
					)}
					renderItem={renderPost}
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

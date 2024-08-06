import { ImagePickerAsset } from "expo-image-picker";
import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	ImageGravity,
	Models,
	Query,
	Storage
} from "react-native-appwrite";

const CONFIG_ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT ?? "";
const CONFIG_PLATFORM = process.env.EXPO_PUBLIC_PLATFORM ?? "";
const CONFIG_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? "";
const CONFIG_DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID ?? "";
const CONFIG_USER_COLLECTION_ID = process.env.EXPO_PUBLIC_USER_COLLECTION_ID ?? "";
const CONFIG_VIDEO_COLLECTION_ID = process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID ?? "";
const CONFIG_STORAGE_ID = process.env.EXPO_PUBLIC_STORAGE_ID ?? "";

const client = new Client();

client.setEndpoint(CONFIG_ENDPOINT).setProject(CONFIG_PROJECT_ID).setPlatform(CONFIG_PLATFORM);

const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const databases = new Databases(client);

export type User = { id: string; username: string; email: string; avatarUrl: string };
type ApiUserResponse = { user: User; error?: string } | { user?: User; error: string };

export async function createUser(
	email: string,
	password: string,
	username: string
): Promise<ApiUserResponse> {
	try {
		const newAccount = await account.create(ID.unique(), email, password, username);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const userDocument = await databases.createDocument(
			CONFIG_DATABASE_ID,
			CONFIG_USER_COLLECTION_ID,
			ID.unique(),
			{ accountId: newAccount.$id, email, username, avatarUrl }
		);

		const user: User = {
			id: userDocument.$id,
			username,
			email,
			avatarUrl: avatarUrl.toString()
		};

		return { user };
	} catch (error) {
		console.log("An error has occurred while signing up", error);

		let message;
		if (error instanceof Error) message = error.message;
		else message = "An error has occurred while trying to sign up";

		return { error: message };
	}
}

export async function signIn(email: string, password: string): Promise<ApiUserResponse> {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		const user = await getUserForId(session.userId);

		if (!user) return { error: "An error occured while signing in" };

		return { user };
	} catch (error) {
		console.log("Error while signing in", error);
		let message;
		if (error instanceof Error) message = error.message;
		else message = "An error has occurred while trying to sign in";

		return { error: message };
	}
}

export async function signOut() {
	try {
		const session = await account.deleteSession("current");

		return session;
	} catch (error) {
		console.log("Error occurred while signing out", error);
	}
}

async function getIdOfLoggedInUser() {
	try {
		const { $id } = await account.get();

		return $id;
	} catch (error) {
		return null;
	}
}

export async function getCurrentUser() {
	try {
		const userId = await getIdOfLoggedInUser();
		if (!userId) return null;

		return getUserForId(userId);
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function getUserForId(userId: string) {
	const docs = await databases.listDocuments<Models.Document & Models.User<Models.Preferences>>(
		CONFIG_DATABASE_ID,
		CONFIG_USER_COLLECTION_ID,
		[Query.equal("accountId", userId)]
	);

	if (!docs || docs.total === 0) return null;

	const { $id: id, username, email, avatarUrl } = docs.documents[0];
	const user: User = { id, username, email, avatarUrl };

	return user;
}

type ApiDataResponse<T> = { data: T; error?: string } | { data?: T; error: string };

export type Post = {
	$id: string;
	title: string;
	thumbnailUrl: string;
	prompt: string;
	videoUrl: string;
	creator: { username: string; avatarUrl: string };
};

export async function getAllPosts(): Promise<ApiDataResponse<Post[]>> {
	try {
		const posts = await databases.listDocuments<Models.Document & Post>(
			CONFIG_DATABASE_ID,
			CONFIG_VIDEO_COLLECTION_ID,
			[Query.orderDesc("$createdAt")]
		);

		return { data: posts.documents };
	} catch (error) {
		console.log("Error while fetching posts", error);
		return { error: "Error occured while retrieving posts" };
	}
}

export async function getLatestPosts(): Promise<ApiDataResponse<Post[]>> {
	try {
		const posts = await databases.listDocuments<Models.Document & Post>(
			CONFIG_DATABASE_ID,
			CONFIG_VIDEO_COLLECTION_ID,
			[Query.orderDesc("$createdAt"), Query.limit(7)]
		);

		return { data: posts.documents };
	} catch (error) {
		console.log("Error while fetching latest posts", error);
		return { error: "Error occured while retrieving latest posts" };
	}
}

export async function searchPosts(query: string): Promise<ApiDataResponse<Post[]>> {
	try {
		const posts = await databases.listDocuments<Models.Document & Post>(
			CONFIG_DATABASE_ID,
			CONFIG_VIDEO_COLLECTION_ID,
			[Query.search("title", query)]
		);

		return { data: posts.documents };
	} catch (error) {
		console.log("Error while searching posts", error);
		return { error: "Error occured while searching posts" };
	}
}

export async function getUserPosts(userId: string): Promise<ApiDataResponse<Post[]>> {
	try {
		const posts = await databases.listDocuments<Models.Document & Post>(
			CONFIG_DATABASE_ID,
			CONFIG_VIDEO_COLLECTION_ID,
			[Query.equal("creator", userId), Query.orderDesc("$createdAt")]
		);

		return { data: posts.documents };
	} catch (error) {
		console.log("Error fetching posts of the user", error);
		return { error: "Error occured while fetching posts" };
	}
}

type FileCategory = "video" | "image";

export async function getFilePreview(fileId: string, category: FileCategory) {
	let fileUrl;

	try {
		if (category === "video") fileUrl = storage.getFileView(CONFIG_STORAGE_ID, fileId);
		else if (category === "image") {
			fileUrl = storage.getFilePreview(
				CONFIG_STORAGE_ID,
				fileId,
				2000,
				2000,
				ImageGravity.Top,
				100
			);
		}
		if (!fileUrl)
			return { error: "Error occurred while generating preview of the ${category}" };

		return { fileUrl };
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "Error occurred while generating preview of the ${category}" };
	}
}

export async function uploadFile(file: ImagePickerAsset, category: FileCategory) {
	if (!file.mimeType) return { error: `mimetype of ${category} not recognized` };
	if (!file.fileSize) return { error: `${category} file seems to be empty` };

	const asset = {
		name: file.fileName ?? "file" + Math.random() * 100,
		type: file.mimeType,
		size: file.fileSize,
		uri: file.uri
	};
	try {
		const uploadedFile = await storage.createFile(CONFIG_STORAGE_ID, ID.unique(), asset);

		const res = await getFilePreview(uploadedFile.$id, category);
		return res;
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: `An error occurred while uploading ${category}` };
	}
}

export type NewPost = {
	title: string;
	videoAsset: ImagePickerAsset | null;
	thumbnailAsset: ImagePickerAsset | null;
	prompt: string;
};

export async function createVideoPost(form: NewPost, userId: string) {
	try {
		if (!form.thumbnailAsset || !form.videoAsset)
			return { error: "Video and thumbnails are both required!" };

		const [
			{ fileUrl: thumbnailUrl, error: thumbnailError },
			{ fileUrl: videoUrl, error: videoError }
		] = await Promise.all([
			uploadFile(form.thumbnailAsset, "image"),
			uploadFile(form.videoAsset, "video")
		]);

		if (thumbnailError && videoError) return { error: thumbnailError + " and " + videoError };
		if (thumbnailError || videoError) return { error: thumbnailError ?? videoError };

		const post = await databases.createDocument<Models.Document & Post>(
			CONFIG_DATABASE_ID,
			CONFIG_VIDEO_COLLECTION_ID,
			ID.unique(),
			{
				title: form.title,
				thumbnailUrl,
				videoUrl,
				prompt: form.prompt,
				creator: userId
			}
		);

		console.log("post-created", post);
		return { post };
	} catch (error) {
		if (error instanceof Error) return { error: error.message };
		return { error: "An error occurred while creating post" };
	}
}

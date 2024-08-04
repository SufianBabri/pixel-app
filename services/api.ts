import {
	Account,
	AppwriteException,
	Avatars,
	Client,
	Databases,
	ID,
	Models,
	Query
} from "react-native-appwrite";

const CONFIG_ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT ?? "";
const CONFIG_PLATFORM = process.env.EXPO_PUBLIC_PLATFORM ?? "";
const CONFIG_PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? "";
const CONFIG_DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID ?? "";
const CONFIG_USERCOLLECTION_ID = process.env.EXPO_PUBLIC_USER_COLLECTION_ID ?? "";
const CONFIG_VIDEOCOLLECTION_ID = process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID ?? "";
const CONFIG_STORAGE_ID = process.env.EXPO_PUBLIC_STORAGE_ID ?? "";

const client = new Client();

client.setEndpoint(CONFIG_ENDPOINT).setProject(CONFIG_PROJECT_ID).setPlatform(CONFIG_PLATFORM);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export type User = { id: string; username: string; email: string; avatarUrl: string };

export async function createUser(email: string, password: string, username: string) {
	try {
		const newAccount = await account.create(ID.unique(), email, password, username);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(username);

		await signIn(email, password);

		const userDocument = await databases.createDocument(
			CONFIG_DATABASE_ID,
			CONFIG_USERCOLLECTION_ID,
			ID.unique(),
			{ accountId: newAccount.$id, email, username, avatarUrl }
		);

		const user: User = {
			id: userDocument.$id,
			username,
			email,
			avatarUrl: avatarUrl.toString()
		};

		return user;
	} catch (error) {
		throw error;
	}
}

export async function signIn(email: string, password: string) {
	try {
		account.deleteSession("current"); //TODO this is for testing

		const session = await account.createEmailPasswordSession(email, password);
		const user = await getUserForId(session.userId);

		return user;
	} catch (error) {
		if (error instanceof AppwriteException) {
			console.log("errorCode", error.code);
		}
		throw error;
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
		CONFIG_USERCOLLECTION_ID,
		[Query.equal("accountId", userId)]
	);

	if (!docs || docs.total === 0) return null;

	const { $id: id, name: username, email, avatarUrl } = docs.documents[0];
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
			CONFIG_VIDEOCOLLECTION_ID
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
			CONFIG_VIDEOCOLLECTION_ID,
			[Query.orderDesc("$createdAt"), Query.limit(7)]
		);

		return { data: posts.documents };
	} catch (error) {
		console.log("Error while fetching latest posts", error);
		return { error: "Error occured while retrieving latest posts" };
	}
}

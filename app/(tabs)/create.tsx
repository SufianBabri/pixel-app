import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import { useCallback } from "react";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/custom-button";
import FormField from "../../components/form-field";
import colors from "../../constants/colors";
import { POPPINS_MEDIUM, POPPINS_SEMIBOLD } from "../../constants/fonts";
import { UploadSvg } from "../../constants/icons";
import { useGlobalContext } from "../../context/global-provider";
import { type NewPost, createPost } from "../../services/api";

export default function Create() {
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState<NewPost>({
		title: "",
		videoAsset: null,
		thumbnailAsset: null,
		prompt: ""
	});

	const openPicker = useCallback(async (selectType: "video" | "image") => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes:
				selectType === "video"
					? ImagePicker.MediaTypeOptions.Videos
					: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1
		});

		if (result.canceled) return;

		if (selectType === "image")
			setForm(prev => ({ ...prev, thumbnailAsset: result.assets[0] }));

		if (selectType === "video") setForm(prev => ({ ...prev, videoAsset: result.assets[0] }));
	}, []);

	const submit = useCallback(async () => {
		if (!user) return;

		if (form.prompt === "" || form.title === "" || !form.thumbnailAsset || !form.videoAsset) {
			return Alert.alert("Please provide all fields");
		}

		setUploading(true);
		const { error } = await createPost(form, user.id);
		setUploading(false);

		if (error) {
			return Alert.alert("Error", error);
		}

		setForm({ title: "", videoAsset: null, thumbnailAsset: null, prompt: "" });

		Alert.alert("Success", "Post uploaded successfully");
		router.push("/home");
	}, [form, user]);

	if (!user) return <Redirect href="/sign-in" />;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
				<Text style={styles.headerText}>Upload Video</Text>

				<FormField
					style={styles.formFieldMargin}
					title="Video Title"
					autoCorrect
					value={form.title}
					placeholder="Give your video a catchy title..."
					onChangeText={title => setForm({ ...form, title })}
				/>

				<View style={styles.uploadContainer}>
					<Text style={styles.subHeaderText}>Upload Video</Text>

					<TouchableOpacity onPress={() => openPicker("video")}>
						{form.videoAsset ? (
							<Video
								source={{ uri: form.videoAsset.uri }}
								style={styles.videoPlayer}
								useNativeControls
								resizeMode={ResizeMode.COVER}
								isLooping
							/>
						) : (
							<View style={styles.videoPlaceholder}>
								<View style={styles.uploadIconContainer}>
									<UploadSvg
										style={styles.uploadIcon}
										accessibilityLabel="upload"
									/>
								</View>
							</View>
						)}
					</TouchableOpacity>
				</View>

				<View style={styles.uploadContainer}>
					<Text style={styles.subHeaderText}>Thumbnail Image</Text>

					<TouchableOpacity onPress={() => openPicker("image")}>
						{form.thumbnailAsset ? (
							<Image
								source={{ uri: form.thumbnailAsset.uri }}
								resizeMode="cover"
								style={styles.thumbnailImage}
							/>
						) : (
							<View style={styles.imagePlaceholder}>
								<UploadSvg
									style={styles.smallUploadIcon}
									accessibilityLabel="upload"
								/>
								<Text style={styles.chooseFileText}>Choose a file</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>

				<FormField
					style={styles.formFieldMargin}
					title="AI Prompt"
					autoCorrect
					value={form.prompt}
					placeholder="The AI prompt of your video...."
					onChangeText={prompt => setForm({ ...form, prompt })}
				/>

				<CustomButton
					style={styles.submitButtonMargin}
					title="Submit & Publish"
					isLoading={uploading}
					onPress={submit}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors["primary"]
	},
	scrollContainer: {
		paddingHorizontal: 16,
		marginVertical: 24
	},
	headerText: {
		fontSize: 24,
		color: "white",
		fontFamily: POPPINS_SEMIBOLD
	},
	formFieldMargin: {
		marginTop: 40
	},
	uploadContainer: {
		marginTop: 28,
		marginBottom: 8
	},
	subHeaderText: {
		fontSize: 16,
		color: colors["gray.100"],
		fontFamily: POPPINS_MEDIUM
	},
	videoPlayer: {
		width: "100%",
		height: 256,
		borderRadius: 16
	},
	videoPlaceholder: {
		width: "100%",
		height: 160,
		paddingHorizontal: 16,
		backgroundColor: colors["black.100"],
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors["black.200"],
		justifyContent: "center",
		alignItems: "center"
	},
	uploadIconContainer: {
		width: 56,
		height: 56,
		borderWidth: 1,
		borderStyle: "dashed",
		borderColor: colors["secondary.100"],
		justifyContent: "center",
		alignItems: "center"
	},
	uploadIcon: {
		width: "50%",
		height: "50%"
	},
	thumbnailImage: {
		width: "100%",
		height: 256,
		borderRadius: 16
	},
	imagePlaceholder: {
		width: "100%",
		height: 64,
		paddingHorizontal: 16,
		backgroundColor: colors["black.100"],
		borderRadius: 16,
		borderWidth: 2,
		borderColor: colors["black.200"],
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row"
	},
	smallUploadIcon: {
		width: 20,
		height: 20
	},
	chooseFileText: {
		fontSize: 14,
		color: "#cdcde0",
		fontFamily: POPPINS_MEDIUM,
		marginLeft: 8
	},
	submitButtonMargin: {
		marginTop: 28
	}
});

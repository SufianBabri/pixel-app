import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/custom-button";
import FormField from "../../components/form-field";
import colors from "../../constants/colors";
import { POPPINS_SEMIBOLD } from "../../constants/fonts";
import { UploadSvg } from "../../constants/icons";
import { useGlobalContext } from "../../context/global-provider";
import { NewPost, createVideoPost } from "../../services/api";

export default function Create() {
	const { user } = useGlobalContext();
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState<NewPost>({
		title: "",
		videoAsset: null,
		thumbnailAsset: null,
		prompt: ""
	});
	if (!user) return <Redirect href="/sign-in" />;

	async function openPicker(selectType: "video" | "image") {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes:
				selectType === "video"
					? ImagePicker.MediaTypeOptions.Videos
					: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1
		});

		if (result.canceled) return;

		if (selectType === "image") setForm({ ...form, thumbnailAsset: result.assets[0] });

		if (selectType === "video") setForm({ ...form, videoAsset: result.assets[0] });
	}

	const submit = async () => {
		if (form.prompt === "" || form.title === "" || !form.thumbnailAsset || !form.videoAsset) {
			return Alert.alert("Please provide all fields");
		}

		setUploading(true);
		const { error } = await createVideoPost(form, user.id);
		setUploading(false);

		if (error) {
			return Alert.alert("Error", error);
		}

		setForm({ title: "", videoAsset: null, thumbnailAsset: null, prompt: "" });

		Alert.alert("Success", "Post uploaded successfully");
		router.push("/home");
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
				<Text style={styles.headerText}>Upload Video</Text>

				<FormField
					style={styles.formFieldMargin}
					title="Video Title"
					value={form.title}
					placeholder="Give your video a catchy title..."
					onChangeText={e => setForm({ ...form, title: e })}
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
					value={form.prompt}
					placeholder="The AI prompt of your video...."
					onChangeText={e => setForm({ ...form, prompt: e })}
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
		fontFamily: "Poppins-Medium" // Assuming 'font-pmedium'
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
		color: "#CDCDE0",
		fontFamily: "Poppins-Medium",
		marginLeft: 8
	},
	submitButtonMargin: {
		marginTop: 28
	}
});

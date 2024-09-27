import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import colors from "../constants/colors";
import { POPPINS_MEDIUM } from "../constants/fonts";
import { BookmarkSvg, DeleteSvg, MenuSvg } from "../constants/icons";

type Props = {
	style: ViewStyle;
	showDeleteOption: boolean;
	onBookmark: () => void;
	onDelete: () => void;
};

export default function OverflowMenu({ style, showDeleteOption, onBookmark, onDelete }: Props) {
	return (
		<TouchableOpacity style={style}>
			<Menu>
				<MenuTrigger>
					<MenuSvg style={styles.menuIcon} />
				</MenuTrigger>
				<MenuOptions optionsContainerStyle={styles.optionsMenu}>
					<MenuOption style={styles.optionContainer} onSelect={onBookmark}>
						<BookmarkSvg
							style={styles.optionIcon}
							width={18}
							height={18}
							color="#cdcde0"
						/>
						<Text style={styles.optionLabel}>Bookmark</Text>
					</MenuOption>
					{showDeleteOption && (
						<MenuOption style={styles.optionContainer} onSelect={onDelete}>
							<DeleteSvg style={styles.optionIcon} width={18} height={18} />
							<Text style={styles.optionLabel}>Delete</Text>
						</MenuOption>
					)}
				</MenuOptions>
			</Menu>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	menuIcon: {
		width: 20,
		height: 20
	},
	optionsMenu: {
		backgroundColor: colors["black.100"],
		borderWidth: 2,
		borderRadius: 8,
		borderColor: colors["black.200"],
		paddingVertical: 8
	},
	optionContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	optionIcon: { marginHorizontal: 8 },
	optionLabel: {
		color: "#cdcde0",
		fontSize: 16,
		fontFamily: POPPINS_MEDIUM,
		paddingVertical: 4
	}
});

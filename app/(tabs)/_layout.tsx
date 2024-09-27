import { Tabs } from "expo-router";
import type { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import colors from "../../constants/colors";
import { POPPINS_REGULAR, POPPINS_SEMIBOLD } from "../../constants/fonts";
import { BookmarkSvg, HomeSvg, PlusSvg, ProfileSvg } from "../../constants/icons";

export default function TabsLayout() {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarShowLabel: false,
					tabBarActiveTintColor: colors["secondary"],
					tabBarInactiveTintColor: colors["gray.100"],
					tabBarStyle: {
						backgroundColor: colors["primary"],
						borderTopWidth: 1,
						borderTopColor: colors["black.200"],
						height: 84
					}
				}}>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon Icon={HomeSvg} color={color} name="Home" focused={focused} />
						)
					}}
				/>
				<Tabs.Screen
					name="bookmark"
					options={{
						title: "Bookmark",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								Icon={BookmarkSvg}
								color={color}
								name="Bookmark"
								focused={focused}
							/>
						)
					}}
				/>
				<Tabs.Screen
					name="create"
					options={{
						title: "Create",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon Icon={PlusSvg} color={color} name="Create" focused={focused} />
						)
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								Icon={ProfileSvg}
								color={color}
								name="Profile"
								focused={focused}
							/>
						)
					}}
				/>
			</Tabs>
		</>
	);
}

type TabIconProps = {
	Icon: FC<SvgProps>;
	color: string;
	name: string;
	focused: boolean;
};

const TabIcon = ({ Icon, color, name, focused }: TabIconProps) => {
	return (
		<View style={styles.container}>
			<Icon style={styles.icon} color={color} />
			<Text
				style={{
					fontSize: 12,
					color,
					fontFamily: focused ? POPPINS_SEMIBOLD : POPPINS_REGULAR
				}}>
				{name}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		gap: 8
	},
	icon: {
		width: 24,
		height: 24
	}
});

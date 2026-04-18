import { tabs } from "@/constants/data";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import clsx from "clsx";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components } from "@/constants/theme";
import { useAuth } from "@clerk/expo";

const TabBar = components.tabBar;


const TabLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx('tabs-pill', focused && 'tabs-active')}>
          <Image source={icon} resizeMode="contain" className="tabs-glyph" />
        </View>
      </View>
    )
  }
  
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
        bottom: Math.max(insets.bottom, TabBar.horizontalInset),
        height: TabBar.height,
        marginHorizontal: TabBar.horizontalInset,
        borderRadius: TabBar.radius,
        backgroundColor: colors.primary,
        borderTopWidth: 0,
        elevation: 0,
      },
      tabBarItemStyle: {
        paddingVertical: TabBar.height / 2 - TabBar.iconFrame / 1.6,
        
      },
      tabBarIconStyle: {
        width: TabBar.iconFrame,
        height: TabBar.iconFrame,
        alignItems: 'center'
      },
    }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}/>
      ))}
    </Tabs>
    ) 
}

export default TabLayout;

import React, {useEffect} from "react";
import FeedView from "../../ui/Feed/FeedView";
import FeedHeaderDropdown from "../../ui/Feed/FeedHeaderDropdown";
import {useFeed} from "../../hooks/feeds/feedsHooks";
import {initialize, lemmyInstance} from "../../../lemmy/LemmyInstance";
import {useAppDispatch, useAppSelector} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {loadSettings} from "../../../slices/settings/settingsActions";
import CIconButton from "../../ui/CIconButton";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {Text} from "native-base";
import {selectAccounts} from "../../../slices/accounts/accountsSlice";
import {loadBookmarks} from "../../../slices/bookmarks/bookmarksActions";

const FeedsIndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const feed = useFeed();

    const accounts = useAppSelector(selectAccounts);

    const dispatch = useAppDispatch();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <FeedHeaderDropdown title={sortFix()} enabled={true} />,
            headerLeft: () => <CIconButton name={"star-outline"} onPress={() => navigation.navigate("Subscriptions")} />
        });

        load();
    }, []);

    const load = async () => {
        if(!lemmyInstance) {
            try {
                await initialize({
                    server: accounts[0].instance,
                    username: accounts[0].username,
                    password: accounts[0].password,
                    auth: accounts[0].token
                });

                feed.load(false);
            } catch (e) {
                console.log("Error", e);
            }
        }
        dispatch(getSubscribedCommunities());
        dispatch(getAllCommunities());
        dispatch(loadBookmarks());
    };

    const sortFix = () => {
        if(feed.sort === "MostComments") return "Most Comments";
        else if(feed.sort === "TopDay") return "Top Day";
        else if(feed.sort === "TopWeek") return "Top Week";

        return feed.sort;
    };

    return <FeedView posts={feed.posts} loading={feed.loading} load={feed.load} setSort={feed.setSort} titleDropsdown={true} setListingType={feed.setListingType} />;
};

export default FeedsIndexScreen;
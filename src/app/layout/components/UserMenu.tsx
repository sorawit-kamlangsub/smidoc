import { Badge, Divider, Icon, IconButton } from "@mui/material";
import { AppMenu, UserProfile } from ".";

const UserMenu = () => {
    return (
        <>
            <AppMenu />
            <IconButton color="secondary">
                {/* Badge notification */}
                <Badge badgeContent={0} color="error">
                    <Icon>notifications</Icon>
                </Badge>
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <UserProfile />
        </>
    );
};

export default UserMenu;

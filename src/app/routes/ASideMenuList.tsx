import { Badge, Drawer, DrawerProps, List, styled, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { APP_INFO } from "../../Const";
import { useAppDispatch, useAppSelector } from "../../redux";
import { MenuItem, selectLayout, setDrawerOpen } from "../layout";

export const ASideMenuList = () => {
    const layoutReducer = useAppSelector(selectLayout);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const handleOnClose = () => {
        dispatch(setDrawerOpen(!layoutReducer.drawerOpen));
    };

    // if screen size is large, show drawer permanently
    // else, show drawer temporarily

    const matches = useMediaQuery(theme.breakpoints.up("lg"));
    const [drawerProps, setDrawerProps] = React.useState<DrawerProps>({});

    useEffect(() => {
        if (matches) {
            setDrawerProps({ variant: "permanent" });
        } else {
            setDrawerProps({
                variant: "temporary",
                ModalProps: { keepMounted: true },
            });
        }

        return () => {
            dispatch(setDrawerOpen(false));
        };
    }, [matches]);

    return (
        <ASideMenuListDrawer
            open={layoutReducer.drawerOpen}
            {...drawerProps}
            onClose={handleOnClose}
            style={{ display: "none" }}
        >
            <ASideMenuListContainer dense aria-labelledby="nested-list-subheader">
                <ASideMenuListTopMenu />
                {/* ใส่เมนูเพิ่มที่นี่ */}

                {/* <MenuItem path="/" icon="home" text="Home" permissions={[]} /> */}
                <MenuItem path="/document" icon="home" text="ค้นหารายการเอกสาร" permissions={[]} />
                <MenuItem path="/document/add" icon="home" text="เพิ่มรายการเอกสาร" permissions={[]} />
                {/* <ParentMenu icon={<FontAwesomeIcon icon="cube" />} text="Parent Menu">
                    <MenuItem path="/test-permission" icon="home" text="Test Permission" />
                </ParentMenu> */}
            </ASideMenuListContainer>
        </ASideMenuListDrawer>
    );
};

const ASideMenuListContainer = styled(List)({
    width: "100%",
    maxWidth: 360,
});

const ASideMenuListTopMenu = () => {
    const { mode, name } = APP_INFO;
    const TitleDiv = styled("div")(({ theme }) => ({
        display: "flex",
        backgroundColor: "#07518c",
        margin: "-8px 0 0 0",
        fontSize: theme.typography.body1.fontSize,
        color: theme.palette.primary.contrastText,
        height: "48px",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiBadge-badge": { right: "-10px", fontSize: "0.65rem" },
    }));

    if (mode !== "" && mode !== "production") {
        return (
            <TitleDiv>
                <Badge badgeContent={mode.substring(0, 3).toUpperCase()} color="error">
                    {name}
                </Badge>
            </TitleDiv>
        );
    }

    return <TitleDiv>{name}</TitleDiv>;
};

const ASideMenuListDrawer = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: theme.drawerWidth,
        backgroundColor: theme.palette.secondary.main,
        overflowX: "hidden",
    },
}));

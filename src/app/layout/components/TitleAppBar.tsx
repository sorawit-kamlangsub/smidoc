import {
    AppBar,
    Breadcrumbs,
    Divider,
    Grid,
    Slide,
    Toolbar,
    Typography,
    styled,
    useScrollTrigger,
} from "@mui/material";
import React from "react";
import { Link, useLocation, useMatches } from "react-router-dom";
import { UserMenu } from ".";
import { useAppSelector } from "../../../redux/hook";
import { RouteHandleType } from "../../routes";

const TitleAppToolbar = styled(Toolbar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

// const TitleAppIconButton = styled(IconButton)(({ theme }) => ({
//     marginRight: theme.spacing(2),
// }));

const TitleAppPageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontSize: "1.2rem",
}));

type HideOnScrollProps = {
    children: React.ReactNode;
    windows?: Window;
};

const HideOnScroll = ({ children, windows }: HideOnScrollProps) => {
    const trigger = useScrollTrigger({ target: windows ?? undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <div style={{ display: trigger ? "none" : "block" }}>{children}</div>
        </Slide>
    );
};

const Breadcrumb = () => {
    const location = useLocation();
    const matches = useMatches();

    const crumbs = matches.filter((match) => !match.pathname.endsWith("/"));

    return (
        <TitleAppToolbar variant="dense">
            <Breadcrumbs aria-label="breadcrumb">
                {crumbs.map((crumb, index) => {
                    const handle = crumb.handle as RouteHandleType;

                    return index === crumbs.length - 1 ? (
                        <Typography color="textPrimary" key={crumb.pathname}>
                            {handle.title}
                        </Typography>
                    ) : (
                        <Link color="inherit" to={crumb.pathname} key={crumb.pathname}>
                            {handle.title}
                        </Link>
                    );
                })}
                {location.pathname === "/" && (
                    <Typography color="textPrimary" key={location.pathname}>
                        Home
                    </Typography>
                )}
            </Breadcrumbs>
        </TitleAppToolbar>
    );
};

const TitleAppBar = () => {
    // const dispatch = useAppDispatch();

    const layoutReducer = useAppSelector((state) => state.layout);

    // const handleDrawerToggle = () => {
    //     dispatch(setDrawerOpen(!layoutReducer.drawerOpen));
    // };

    const HeaderBar = styled(AppBar)(({ theme }) => ({
        width: `calc(100% - ${layoutReducer.drawerOpen ? theme.drawerWidth : 0}px)`,
        left: layoutReducer.drawerOpen ? theme.drawerWidth : 0,
        transition: theme.transitions.create(["left"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
        }),
    }));

    return (
        <HeaderBar position="fixed" color="default">
            <TitleAppToolbar variant="dense">
                <Grid container direction="row" wrap="nowrap">
                    <Grid container item alignItems="center" wrap="nowrap">
                        {/* <TitleAppIconButton edge="start" onClick={handleDrawerToggle}>
                            <Icon>menu</Icon>
                        </TitleAppIconButton> */}
                        <TitleAppPageTitle color="primary">{layoutReducer.currentTitle}</TitleAppPageTitle>
                    </Grid>
                    <Grid container item justifyContent="flex-end" wrap="nowrap">
                        <UserMenu />
                    </Grid>
                </Grid>
            </TitleAppToolbar>
            <HideOnScroll>
                <Divider light />
                <Breadcrumb />
            </HideOnScroll>
        </HeaderBar>
    );
};

export default TitleAppBar;

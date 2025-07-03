import { Box } from "@mui/material";
const Home = () => {
    return (
        <Box
            sx={(theme) => ({
                width: "100%",
                height: "100%",
                backgroundColor: theme.palette.primary.light,
            })}
        >
            {/* <DocumentScanFileDialog isOpenDialog={true}  /> */}
        </Box>
    );
};

export default Home;

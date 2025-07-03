import { Box, Typography } from "@mui/material";

type NoticePageProps = {
    title: string;
    body: string;
};

const NoticePage = ({ title, body }: NoticePageProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1">{body}</Typography>
        </Box>
    );
};

export default NoticePage;

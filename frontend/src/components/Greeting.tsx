import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typopgraphy from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { IconButton, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import ImageGalleryDialog from "./ImageGallery";

interface Props {
  onUsernameEnter: (name: string, avatar: string) => void;
}

const Greeting: React.FC<Props> = (props) => {
  const [name, setName] = useState("");
  const [img, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const { onUsernameEnter } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 600px and below
  const isTablet = useMediaQuery(theme.breakpoints.down("md")); // 768px and below
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg")); // 1200px and below

  const paperStyle: React.CSSProperties = {
    height: isMobile ? "auto" : "auto",
    width: isMobile ? "90%" : isTablet ? "70%" : isMediumScreen ? "55%" : "35%",
    minHeight: isMobile ? "350px" : "300px",
    backgroundColor: "lightslategrey",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: isMobile ? "30px 20px" : isTablet ? "40px 30px" : "30px 25px",
    margin: isMobile ? "20px" : "0",
  };

  const inputStyle: React.CSSProperties = {
    marginTop: isMobile ? "20px" : "30px",
    width: "85%", // Fixed width to ensure it stays within bounds
    maxWidth: "300px", // Maximum width constraint
    color: "white",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  };

  const avatarStyle: React.CSSProperties = {
    height: isMobile ? 60 : isTablet ? 70 : 80,
    width: isMobile ? 60 : isTablet ? 70 : 80,
    margin: isMobile ? "1rem 0rem" : "1.5rem 0rem",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !img) return;
    onUsernameEnter(name, img);
  };

  const handleImageSelect = (imgURL: string) => {
    if (!imgURL) return;
    setImage(imgURL);
    setOpen(false);
  };

  return (
    <>
      <Paper style={paperStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <Typopgraphy
            variant={isMobile ? "h6" : isTablet ? "h5" : "h5"}
            sx={{
              textAlign: "center",
              fontSize: isMobile ? "1.1rem" : isTablet ? "1.2rem" : "1.25rem",
              lineHeight: 1.2,
              maxWidth: "100%",
              wordWrap: "break-word",
              hyphens: "auto",
              padding: "0 10px",
            }}
          >
            Please enter your name before joining the chat
          </Typopgraphy>
          <IconButton
            style={avatarStyle}
            onClick={() => setOpen((prev) => !prev)}
          >
            <Tooltip title="Add Image">
              <Avatar src={img} style={avatarStyle} sizes="large" />
            </Tooltip>
          </IconButton>
          <TextField
            style={inputStyle}
            placeholder="Enter Username..."
            value={name}
            size={isMobile ? "small" : "medium"}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{
              style: {
                color: "white",
              },
            }}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          />
        </form>
      </Paper>
      <ImageGalleryDialog isOpen={open} onImageSelect={handleImageSelect} />
    </>
  );
};

export default Greeting;

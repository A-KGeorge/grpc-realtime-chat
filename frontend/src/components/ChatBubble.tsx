import React from "react";
import Grid from "@mui/material/Grid";
import { useTheme, useMediaQuery } from "@mui/material";
import "./style.css";
import { StreamMessage } from "../proto/random_pb";

interface Props {
  message: StreamMessage.AsObject;
  isCurrentUser: boolean;
}

const ChatBubble: React.FC<Props> = ({ message, isCurrentUser }) => {
  const { userName, message: text } = message;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Changed from 'md' to 'sm'

  return (
    <Grid
      container
      justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
      style={{
        width: "100%",
        marginBottom: isMobile ? "8px" : "10px",
      }}
    >
      <blockquote
        className={`speech-bubble ${isMobile ? "mobile" : ""}`}
        style={{
          backgroundColor: isCurrentUser ? "#bad4ff" : undefined,
          maxWidth: isMobile ? "85%" : "60%",
          fontSize: isMobile ? "0.9rem" : "1.2rem",
          padding: isMobile ? "0.8rem 1.5rem" : "1rem 2rem",
        }}
      >
        <p style={{ marginBottom: isMobile ? "8px" : "10px" }}>{text}</p>
        {!isCurrentUser && (
          <cite style={{ fontSize: isMobile ? "0.7rem" : "0.8rem" }}>
            {userName}
          </cite>
        )}
      </blockquote>
    </Grid>
  );
};

export default ChatBubble;

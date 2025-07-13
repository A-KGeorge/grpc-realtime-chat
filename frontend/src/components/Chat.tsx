import { useState, useEffect, useRef } from "react";
import {
  Divider,
  Paper,
  Typography,
  Avatar,
  TextField,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import UserList from "./UserList";
import ChatBubble from "./ChatBubble";
import { Status, StreamMessage, User } from "../proto/random_pb";

interface Props {
  user: User.AsObject;
  userList: Array<User.AsObject>;
  messages: Array<StreamMessage.AsObject>;
  onMessageSubmit: (msg: string, onSuccess: () => void) => void;
}

const Chat: React.FC<Props> = (props) => {
  const [msg, setMsg] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userList, messages, onMessageSubmit, user } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 600px and below - for mobile styles
  const hideUserList = useMediaQuery("(max-width: 900px)"); // Custom breakpoint - 900px and below - hide user list

  const containerStyle: React.CSSProperties = {
    overflowY: "hidden",
    height: "90vh",
    padding: isMobile ? "0.5rem" : "1rem",
    width: "95vw",
    maxWidth: hideUserList ? "800px" : "1200px",
  };

  const paperStyle: React.CSSProperties = {
    padding: isMobile ? "10px" : "20px",
    height: "100%",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    backgroundColor: "lightslategrey",
  };

  const avatarStyle: React.CSSProperties = {
    margin: isMobile ? "10px" : "20px",
    width: isMobile ? 40 : 56,
    height: isMobile ? 40 : 56,
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("called");
    e.preventDefault();
    if (!msg) return;
    console.log("here ", msg);
    onMessageSubmit(msg, () => setMsg(""));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <form onSubmit={handleSendMessage}>
      <Grid container style={containerStyle} spacing={isMobile ? 1 : 3}>
        <Grid
          size={{ xs: 12, sm: 12, md: 4, lg: 3 }}
          sx={{
            display: hideUserList ? "none" : "block",
            order: { xs: 2, md: 1 },
          }}
        >
          <Paper style={paperStyle}>
            <UserList
              users={userList.map((x) => ({
                id: x.id,
                isOnline: x.status === "ONLINE",
                avatar: x.avatarUrl,
                name: x.name,
              }))}
            />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 8, lg: 9 }}
          sx={{ order: { xs: 1, md: 2 } }}
          style={{ height: "100%" }}
        >
          <Paper style={paperStyle}>
            <div
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "aliceblue",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* {name banner} */}
              <div
                style={{
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  minHeight: isMobile ? "50px" : "60px",
                  padding: isMobile ? "0 5px" : "0",
                  flexShrink: 0,
                }}
              >
                <Avatar style={avatarStyle} src={user.avatarUrl} />
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems={isMobile ? "flex-start" : "center"}
                >
                  <Typography
                    variant={isMobile ? "body1" : "button"}
                    sx={{ fontSize: isMobile ? "0.9rem" : undefined }}
                  >
                    {user.name}
                  </Typography>
                  <Chip
                    color="primary"
                    size={isMobile ? "small" : "small"}
                    style={{
                      width: isMobile ? "60px" : "70px",
                      fontSize: isMobile ? "0.7rem" : undefined,
                    }}
                    label="online"
                  />
                </Grid>
              </div>
              <Divider />
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  padding: isMobile ? "5px 0" : "10px 0",
                  minHeight: 0,
                  maxHeight: "90%",
                }}
              >
                {messages.map((msg, i) => (
                  <ChatBubble
                    key={`${msg.userId}-${msg.message}-${i}`}
                    message={msg}
                    isCurrentUser={msg.userId === user.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <Divider />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: isMobile ? "5px" : "10px",
                  minHeight: isMobile ? "50px" : "60px",
                  flexShrink: 0,
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Start Typing..."
                  value={msg}
                  size={isMobile ? "small" : "medium"}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage(e as any);
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SendIcon
                          style={{
                            cursor: "pointer",
                            fontSize: isMobile ? "1.2rem" : "1.5rem",
                          }}
                          onClick={(e) => handleSendMessage(e as any)}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Mobile/Tablet Users List Dialog */}
      <Dialog
        open={showUserList && hideUserList}
        onClose={() => setShowUserList(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Online Users
          <IconButton
            aria-label="close"
            onClick={() => setShowUserList(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UserList
            users={userList.map((x) => ({
              id: x.id,
              isOnline: x.status === "ONLINE",
              avatar: x.avatarUrl,
              name: x.name,
            }))}
          />
        </DialogContent>
      </Dialog>

      {/* Mobile/Tablet Floating Action Button for Users */}
      {hideUserList && (
        <Fab
          color="primary"
          aria-label="show users"
          onClick={() => setShowUserList(true)}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            zIndex: 1000,
          }}
        >
          <PeopleIcon />
        </Fab>
      )}
    </form>
  );
};

export default Chat;

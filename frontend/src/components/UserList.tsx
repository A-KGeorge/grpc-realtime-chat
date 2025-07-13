import React from "react";
import Card from "@mui/material/Card";
import {
  Avatar,
  Typography,
  Chip,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface IUser {
  id: number;
  name: string;
  isOnline: boolean;
  avatar: string;
}
interface Props {
  users: Array<IUser>;
}

const UserList: React.FC<Props> = (props) => {
  const { users } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Changed from 'md' to 'sm'

  const cardStyle: React.CSSProperties = {
    height: isMobile ? "60px" : "80px",
    width: "100%",
    backgroundColor: "aliceblue",
    display: "flex",
    alignItems: "center",
    marginBottom: isMobile ? "5px" : "10px",
  };

  const avatarStyle: React.CSSProperties = {
    margin: isMobile ? "10px" : "20px",
    width: isMobile ? 40 : 56,
    height: isMobile ? 40 : 56,
  };

  return (
    <>
      {users.map((u) => (
        <Card style={cardStyle} key={u.id}>
          <Avatar style={avatarStyle} src={u.avatar} />
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Typography
              variant={isMobile ? "body2" : "body1"}
              sx={{
                fontSize: isMobile ? "0.8rem" : undefined,
                fontWeight: 500,
              }}
            >
              {u.name}
            </Typography>
            <Chip
              color={u.isOnline ? "primary" : "default"}
              size="small"
              style={{
                width: isMobile ? "60px" : "70px",
                fontSize: isMobile ? "0.6rem" : "0.75rem",
                height: isMobile ? "20px" : "24px",
              }}
              label={u.isOnline ? "online" : "offline"}
            />
          </Grid>
        </Card>
      ))}
    </>
  );
};

export default UserList;

import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalendarIcon} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} marginTop={"1rem"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"}  text={user?.bio} />
      <ProfileCard heading={"Username"} Icon={<UsernameIcon/>} text={user?.username} />
      <ProfileCard heading={"Name"} Icon={<FaceIcon/>} text={user?.name} />
      <ProfileCard heading={"Joined"} Icon={<CalendarIcon/>} text={moment(user?.createdAt).fromNow()} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} color={"white"} textAlign={"center"}>
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color={"gray"}>{heading}</Typography>
    </Stack>
  </Stack>
);
export default Profile;

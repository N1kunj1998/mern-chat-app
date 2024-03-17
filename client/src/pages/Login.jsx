import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Input,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useInputValidation, useStrongPassword, useFileHandler } from "6pp";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const handleLogin = (e) => {
    e.preventDefault();
  }

  const handleSignUp = (e) => {
    e.preventDefault();
  }
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)",
        backgroundColor: "#85FFBD"
      }}
    >
      <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />
              <Button
                sx={{ marginTop: "1rem" }}
                variant="contained"
                fullWidth
                color="primary"
                type="submit"
              >
                Login
              </Button>
              <Typography textAlign={"center"} marginTop={"1rem"}>
                OR
              </Typography>
              <Button
                sx={{ marginTop: "1rem" }}
                variant="text"
                fullWidth
                onClick={toggleLogin}
              >
                Sign Up Instead
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5">Sign Up</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleSignUp}
            >
              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                  src={avatar.preview}
                />
                {/* <IconButton
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    ":hover": {
                      bgcolor: "rgba(0, 0, 0, 0.7)"
                    },
                    component: "label",
                  }}
                >
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput type="file"/>
                  </>
                </IconButton> */}
                <>
                  <Input
                    id="fileInput"
                    type="file"
                    onChange={avatar.changeHandler}
                    sx={{
                      display: "none",
                      border: 0,
                      // clip: 'rect(0 0 0 0)',
                      height: 1,
                      margin: -1,
                      overflow: "hidden",
                      position: "absolute",
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "white",
                      // overflow:"hidden",
                      // borderRadius: '50%',
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                      },
                      component: "label",
                    }}
                  >
                    <CameraAltIcon />
                  </Button>
                </>
              </Stack>
                {avatar.error && (
                  <Typography m={"1rem auto"} width={"fit-content"} display={"block"} color="error" variant="caption">
                    {avatar.error}
                  </Typography>
                )}
              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />
              {username.error && (
                <Typography color="error" variant="caption">
                  {username.error}
                </Typography>
              )}
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />
              {password.error && (
                <Typography color="error" variant="caption">
                  {password.error}
                </Typography>
              )}
              <Button
                sx={{ marginTop: "1rem" }}
                variant="contained"
                fullWidth
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>
              <Typography textAlign={"center"} marginTop={"1rem"}>
                OR
              </Typography>
              <Button
                sx={{ marginTop: "1rem" }}
                variant="text"
                fullWidth
                onClick={toggleLogin}
              >
                Login Instead
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
    </div>
  );
};

export default Login;

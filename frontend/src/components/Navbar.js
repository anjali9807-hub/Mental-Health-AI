import React from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";

function Navbar() {
  return (
    <AppBar position="static">

      <Toolbar>

        <PsychologyIcon sx={{ mr: 1 }} />

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold"
          }}
        >
          AI Mental Health Companion
        </Typography>

        <Box>

          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/history"
          >
            History
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
          >
            Dashboard
          </Button>

        </Box>

      </Toolbar>

    </AppBar>
  );
}

export default Navbar;
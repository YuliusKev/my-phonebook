import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Divider, IconButton } from "@mui/material";
import { Link, useLocation, useRoutes } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";

export default function ContactHeader() {
  const route = useLocation();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {route.pathname.startsWith("/input-contact") && (
            <IconButton
              size="large"
              edge="start"
              color="default"
              aria-label="menu"
              sx={{ color: "#fff" }}
              href="/"
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Contact List
          </Typography>

          {route.pathname === "/" && (
            <IconButton
              size="large"
              edge="start"
              color="default"
              aria-label="menu"
              sx={{ color: "#fff" }}
              href="/input-contact"
            >
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Divider sx={{ bgcolor: "grey", opacity: 0.5 }} />
    </>
  );
}

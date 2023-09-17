import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Divider, IconButton } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";

export default function ContactHeader() {
  const route = useLocation();
  const params = useParams();
  console.log(params)
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {(route.pathname.startsWith("/input-contact") || route.pathname.startsWith("/edit-contact")) && (
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
            {route.pathname.startsWith("/input-contact") ? "Add Contact" : (route.pathname.startsWith("/edit-contact")) ? "Edit Contact" : "Contact List"}
          </Typography>

          {route.pathname === "/" && (
            <IconButton
              size="large"
              edge="start"
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

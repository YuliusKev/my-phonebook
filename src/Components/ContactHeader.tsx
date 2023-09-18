import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Divider, IconButton, Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";

export default function ContactHeader() {
  const route = useLocation();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {(route.pathname.startsWith("/input-contact") ||
            route.pathname.startsWith("/edit-contact")) && (
            <Link component={RouterLink} to={"/"}>
              <IconButton
                size="large"
                edge="start"
                color="default"
                aria-label="menu"
                sx={{ color: "#fff" }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Link>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {route.pathname.startsWith("/input-contact")
              ? "Add Contact"
              : route.pathname.startsWith("/edit-contact")
              ? "Edit Contact"
              : "Contact List"}
          </Typography>

          {route.pathname === "/" && (
            <Link component={RouterLink} to={"/input-contact"}>
              <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ color: "#fff" }}
              >
                <AddIcon />
              </IconButton>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Divider sx={{ bgcolor: "grey", opacity: 0.5 }} />
    </>
  );
}

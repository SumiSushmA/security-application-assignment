"use client";
import { useAuth } from "@/context/userContext";
import ApiRequest from "@/utils/apiRequest";
import {
  Category,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Create,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  Logout,
  MenuBook as MenuBookIcon,
  Menu as MenuIcon,
  Newspaper as NewspaperIcon,
  HelpOutline as QuestionMarkIcon,
  Quiz as QuizIcon,
  SupervisedUserCircleOutlined
} from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import * as React from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DashboardLayout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState("Dashboard");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (page) => {
    setSelectedPage(page);
  };

  const handleLogout = async () => {
    try {
      await ApiRequest.get("/user/logout");
      enqueueSnackbar("Logout Successful", {
        variant: "success",
      });
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
      setIsAuthenticated(true);
      enqueueSnackbar("Failed to Logout!", { variant: "error" });
    }
  };

  const renderComponent = () => {
    switch (selectedPage) {
      case "User":
        return router.push("/");
      case "Create":
        return router.push("/create");
      case "Category":
        return router.push("/category");
      case "Quiz":
        return router.push("/quiz");
      case "Questions":
        return router.push("/questions");
      case "Book":
        return router.push("/book");
      case "News":
        return router.push("/news");
      case "Score":
        return router.push("/score");
      case "Add-Admin":
        return router.push("/add-admin");
      //   default:
      //     return router.push("/user");
    }
  };

  // console.log(isAuthenticated);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {isAuthenticated && (
        <>
          <AppBar
            position="fixed"
            open={open}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              pr: "10px",
              bgcolor: "#00b894",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                QuizKoshi Dashboard
              </Typography>
            </Toolbar>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ cursor: "pointer" }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader sx={{ bgcolor: "#00b894" }}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {[
                { text: "User", icon: <GroupIcon /> },
                { text: "Create", icon: <Create /> },
                { text: "Category", icon: <Category /> },
                { text: "Quiz", icon: <QuizIcon /> },
                { text: "Questions", icon: <QuestionMarkIcon /> },
                { text: "Book", icon: <MenuBookIcon /> },
                { text: "News", icon: <NewspaperIcon /> },
                { text: "Score", icon: <EmojiEventsIcon /> },
                { text: "Add-Admin", icon: <SupervisedUserCircleOutlined /> },
              ].map((item, index) => (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: "block" }}
                  onClick={() => handleNavigation(item.text)}
                  button
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title={item.text} placement="right">
                        {item.icon}
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {renderComponent()}
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardLayout;

import BookComponent from "@/components/BookComponent";
import CategoryComponent from "@/components/CategoryComponent";
import CreateComponent from "@/components/CreateComponent";
import NewsComponent from "@/components/NewsComponent";
import QuestionsComponent from "@/components/QuestionsComponent";
import QuizComponent from "@/components/QuizComponent";
import ScoreComponent from "@/components/ScoreComponent";
import UserComponent from "@/components/UserComponent";
import { useAuth } from "@/context/userContext";
import ApiRequest from "@/utils/apiRequest";
import { Category, Create, Logout } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import QuizIcon from "@mui/icons-material/Quiz";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
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

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
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
        return <UserComponent />;
      case "Create":
        return <CreateComponent />;
      case "Category":
        return <CategoryComponent />;
      case "Quiz":
        return <QuizComponent />;
      case "Questions":
        return <QuestionsComponent />;
      case "Book":
        return <BookComponent />;
      case "News":
        return <NewsComponent />;
      case "Score":
        return <ScoreComponent />;
      default:
        return <UserComponent />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
        <Logout onClick={handleLogout} sx={{ cursor: "pointer" }} />
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
            "User",
            "Create",
            "Category",
            "Quiz",
            "Questions",
            "Book",
            "News",
            "Score",
          ].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleNavigation(text)}
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
                  {index === 0 && <GroupIcon />}
                  {index === 1 && <Create />}
                  {index === 2 && <Category />}
                  {index === 3 && <QuizIcon />}
                  {index === 4 && <QuestionMarkIcon />}
                  {index === 5 && <MenuBookIcon />}
                  {index === 6 && <NewspaperIcon />}
                  {index === 7 && <EmojiEventsIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Dashboard;

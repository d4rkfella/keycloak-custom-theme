import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    spacing: 8,
    palette: {
        mode: "dark",
        primary: {
            main: "#FF8065"
        },
        secondary: {
            main: "#54C5CD"
        },
        success: {
            main: "#4ADE80"
        },
        error: {
            main: "#DC2626"
        }
    },
    typography: {
        fontFamily: "Outfit",
        h1: {
            fontSize: "1.8rem"
        },
        h2: {
            fontSize: "1.3rem"
        },
        button: {
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.02em"
        }
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 16px"
                }
            }
        },
        MuiLink: {
            defaultProps: {
                underline: "hover"
            },
            styleOverrides: {
                root: {
                    color: "#4dd0e1 !important",
                    cursor: "pointer"
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    "&::before, &::after": {
                        borderColor: "rgba(255, 255, 255, 0.12)"
                    }
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 2px 4px rgba(255, 123, 69, 0.28)",
                    "&:hover": {
                        border: `1px solid ${theme.palette.secondary.main}`
                    },
                    "&.Mui-selected": {
                        backdropFilter: "blur(2px)",
                        border: `2px solid ${theme.palette.primary.main}`,
                        boxShadow: "0 4px 8px rgba(255, 123, 69, 0.35)"
                    }
                })
            }
        },
        MuiButton: {
            defaultProps: {
                size: "large",
                fullWidth: true
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "8px",
                    whiteSpace: "nowrap"
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                fullWidth: true
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(255, 123, 69, 0.28)"
                    }
                }
            }
        }
    }
});

import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme(
  /**
   * @see https://material-ui.com/customization/themes/#theme-configuration-variables
   */
  {
    // direction: "rtl",
    typography: {
      fontFamily: ["Open Sans"].join(","),
      fontSize: 18,
    },

    palette: {
      contrastThreshold: 3,
      primary: {
        // light: will be calculated from palette.primary.main,
        main: "#5d78ff",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
        contrastText: "#fff",
      },
      secondary: {
        // light: will be calculated from palette.primary.main,
        main: "#0abb87",
        // dark: will be calculated from palette.primary.main,
        contrastText: "#fff",
      },
      error: {
        // light: will be calculated from palette.primary.main,
        main: "#fd397a",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
        contrastText: "#fff",
      },
      success: {
        // light: will be calculated from palette.primary.main,
        main: "#0abb87",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
        contrastText: "#fff",
      },
      info: {
        // light: will be calculated from palette.primary.main,
        main: "#5d78ff",
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
        contrastText: "#fff",
      },
    },

    /**
     * @see https://material-ui.com/customization/globals/#default-props
     */
    overrides: {
      MuiInputBase: {
        root: {
          "&$disabled": {
            color: "rgba(0, 0, 0, 0.87)",
          },
        },
      },
      MuiIconButton: {
        colorSecondary: {
          color: "#fd397a",
        },
      },
      MuiTextField: {
        root: {
          marginTop: 8,
        },
      },
      MuiBadge: {
        colorPrimary: {
          fontWeight: "bold",
          backgroundColor: "#9e9e9e",
          transition: "100ms",
        },
        colorSecondary: {
          fontWeight: "bold",
          transition: "100ms",
        },
      },
      MuiOutlinedInput: {
        adornedEnd: {
          paddingRight: "none",
        },
      },
      MuiFormControlLabel: {
        root: {
          marginBottom: 0,
        },
        label: {
          fontSize: 14,
        },
      },
      MuiSkeleton: {
        root: {
          backgroundColor: "rgba(158, 158, 158,.15)",
        },
      },
      MuiAppBar: {
        colorDefault: {
          backgroundColor: "#fff",
        },
      },
      MuiTooltip: {
        tooltip: {
          fontSize: 12,
        },
      },
      MuiMenuItem: {
        root: {
          fontSize: 14,
          lineHeight: "24px",
          "&:hover": {
            color: "#5d78ff",
            background: "none",
          },
        },
      },
      MuiMenu: {
        paper: {
          width: "100%",
          maxWidth: 280,
        },
      },
    },
    props: {
      // Name of the component ⚛️
      MuiButtonBase: {
        // The properties to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },

      // Set default elevation to 1 for popovers.
      MuiPopover: {
        elevation: 1,
      },
    },
  }
);

export default function ThemeProvider(props) {
  const { children } = props;

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

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
    },

    /**
     * @see https://material-ui.com/customization/globals/#default-props
     */
    overrides: {
      MuiIconButton: {
        colorSecondary: {
          color: "#fd397a",
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

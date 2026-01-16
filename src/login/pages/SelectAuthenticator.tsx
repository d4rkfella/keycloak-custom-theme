import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Stack from "@mui/material/Stack";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, auth } = kcContext;
    const { msg, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            headerNode={msg("loginChooseAuthenticator")}
        >
            <Box component="form" id="kc-select-credential-form" action={url.loginAction} method="post">
                <Stack spacing={2}>
                    {auth.authenticationSelections.map((authenticationSelection, i) => (
                        <Button
                            key={i}
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                p: 1,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                textTransform: "none"
                            }}
                            type="submit"
                            name="authenticationExecution"
                            value={authenticationSelection.authExecId}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 48,
                                    height: 48,
                                    flexShrink: 0,
                                    borderRadius: 1,
                                    backgroundColor: "action.selected",
                                    mr: 1,
                                    color: "primary.main"
                                }}
                            >
                                <FormatListBulletedIcon fontSize="large" />
                            </Box>

                            <Box sx={{ flexGrow: 1, textAlign: "left", minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {advancedMsg(authenticationSelection.displayName)}
                                </Typography>
                                <Typography sx={{ whiteSpace: "normal", wordBreak: "break-word" }} variant="body2" color="text.secondary">
                                    {advancedMsg(authenticationSelection.helpText)}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center", // vertical center
                                    justifyContent: "center" // optional: horizontal center if needed
                                }}
                            >
                                <ArrowForwardIcon />
                            </Box>
                        </Button>
                    ))}
                </Stack>
            </Box>
        </Template>
    );
}

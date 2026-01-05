import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, auth } = kcContext;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
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
            <Box component="form" id="kc-select-credential-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <Box className={kcClsx("kcSelectAuthListClass")}>
                    {auth.authenticationSelections.map((authenticationSelection, i) => (
                        <Button
                            key={i}
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                mb: 2,
                                p: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                textTransform: "none",
                                backgroundColor: "background.paper",
                                "&:hover": {
                                    backgroundColor: "action.hover"
                                }
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
                                    borderRadius: 1,
                                    backgroundColor: "action.selected",
                                    mr: 2
                                }}
                            >
                                <i className={kcClsx("kcSelectAuthListItemIconPropertyClass", authenticationSelection.iconCssClass)} />
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {advancedMsg(authenticationSelection.displayName)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {advancedMsg(authenticationSelection.helpText)}
                                </Typography>
                            </Box>
                            <Box sx={{ ml: 2 }}>
                                <i className={kcClsx("kcSelectAuthListItemArrowIconClass")} />
                            </Box>
                        </Button>
                    ))}
                </Box>
            </Box>
        </Template>
    );
}

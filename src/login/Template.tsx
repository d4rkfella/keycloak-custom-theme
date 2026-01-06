import { useEffect } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { useStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    const { css, theme, cx } = useStyles();
    if (!isReadyToRender) {
        return null;
    }

    return (
        <Box
            className={cx(
                kcClsx("kcLoginClass"),
                css({
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                })
            )}
        >
            <Box
                className={css({
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: theme.spacing(6),
                    borderRadius: theme.shape.borderRadius
                })}
            >
                <Box component="header" sx={{ mb: 1, display: "flex", width: "100%", justifyContent: "center" }}>
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <Typography
                                id="kc-page-title"
                                variant="h5"
                                sx={{
                                    pb: 3
                                }}
                            >
                                {headerNode}
                            </Typography>
                        ) : (
                            <Box id="kc-username" sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", width: "100%" }}>
                                <Typography id="kc-attempted-username" component="label" variant="h6">
                                    {auth.attemptedUsername}
                                </Typography>
                                <Tooltip title={msg("restartLoginTooltip")} placement="right" disableInteractive>
                                    <IconButton
                                        id="reset-login"
                                        href={url.loginRestartFlowUrl}
                                        aria-label={msgStr("restartLoginTooltip")}
                                        size="small"
                                    >
                                        <OpenInNewIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                        return node;
                    })()}
                </Box>
                <Box id="kc-content">
                    <Box id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                severity={message.type}
                                sx={{
                                    mb: 1,
                                    mt: 0
                                }}
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </Alert>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <Box component="form" id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <Box sx={{ mt: 2 }}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <Link
                                        href="#"
                                        id="try-another-way"
                                        underline="hover"
                                        onClick={e => {
                                            e.preventDefault();
                                            document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                            return false;
                                        }}
                                        sx={{
                                            fontSize: "0.875rem",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </Link>
                                </Box>
                            </Box>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <Box
                                className={css({
                                    marginTop: theme.spacing(5),
                                    textAlign: "center"
                                })}
                            >
                                {infoNode}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

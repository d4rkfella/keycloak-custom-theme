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
                    padding: theme.spacing(5),
                    borderRadius: theme.shape.borderRadius
                })}
            >
                <header className={kcClsx("kcFormHeaderClass")}>
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <Typography
                                id="kc-page-title"
                                variant="h1"
                                sx={{
                                    pb: 3,
                                    textAlign: "center"
                                }}
                            >
                                {headerNode}
                            </Typography>
                        ) : (
                            <Box id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <Box className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                    </Box>
                                </a>
                            </Box>
                        );
                        return node;
                    })()}
                </header>
                <Box id="kc-content">
                    <Box id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert
                                severity={message.type}
                                sx={{
                                    mb: 4,
                                    mt: 0
                                }}
                            >
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </Alert>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <Box component="form" id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <Box className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
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

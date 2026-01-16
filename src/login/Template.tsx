import { useEffect } from "react";
import * as React from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Tooltip, Typography, Alert, Box, Link, Stack } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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

    if (!isReadyToRender) {
        return null;
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Stack
                    id="kc-authentication"
                    spacing={4}
                    sx={{
                        maxWidth: "440px",
                        width: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(1px)",
                        borderRadius: 1,
                        px: { xs: 2, sm: 4 },
                        py: 4
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        spacing={1}
                        id="kc-authentication-header"
                        sx={{
                            width: "100%"
                        }}
                    >
                        {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <Typography id="kc-page-title" variant="h1">
                                {headerNode}
                            </Typography>
                        ) : (
                            <>
                                <Typography variant="h1" noWrap title={auth.attemptedUsername} sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                                    {auth.attemptedUsername}
                                </Typography>

                                <Tooltip placement="right-end" arrow disableInteractive title={msg("restartLoginTooltip")}>
                                    <Link
                                        href={url.loginRestartFlowUrl}
                                        aria-label={msgStr("restartLoginTooltip")}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            color: "text.secondary",
                                            flexShrink: 0
                                        }}
                                    >
                                        <RestartAltIcon fontSize="small" />
                                    </Link>
                                </Tooltip>
                            </>
                        )}
                    </Stack>
                    <Stack id="kc-authentication-body" spacing={2.5}>
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert severity={message.type} variant="standard">
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </Alert>
                        )}
                        {children}
                        {socialProvidersNode}
                    </Stack>
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <Box component="form" id="kc-select-try-another-way-form" action={url.loginAction} method="post">
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
                            >
                                {msg("doTryAnotherWay")}
                            </Link>
                        </Box>
                    )}
                    <Box sx={{ textAlign: "center" }} id="kc-authentication-footer">
                        {displayInfo && infoNode}
                    </Box>
                </Stack>
            </Box>
        </React.Fragment>
    );
}

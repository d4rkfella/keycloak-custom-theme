import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript";
import { Button, IconButton, InputAdornment, TextField, Link, Stack } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { WebAuthnSection } from "../components/WebAuthnSection";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { realm, url, messagesPerField, enableWebAuthnConditionalUI, authenticators } = kcContext;
    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayMessage={!messagesPerField.existsError("password")}
        >
            <Stack spacing={2}>
                <Stack
                    component="form"
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                    spacing={2.5}
                >
                    <Stack spacing={2}>
                        <TextField
                            tabIndex={2}
                            id="password"
                            name="password"
                            label={msg("password")}
                            type={showPassword ? "text" : "password"}
                            autoFocus
                            autoComplete="on"
                            error={messagesPerField.existsError("password")}
                            aria-invalid={messagesPerField.existsError("username", "password")}
                            helperText={
                                messagesPerField.existsError("password") && (
                                    <span
                                        id="input-error-password"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("password"))
                                        }}
                                    />
                                )
                            }
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={showPassword ? "hide the password" : "display the password"}
                                                onClick={() => setShowPassword(show => !show)}
                                                onMouseDown={event => event.preventDefault()}
                                                onMouseUp={event => event.preventDefault()}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        {realm.resetPasswordAllowed && (
                            <Link
                                variant="body2"
                                tabIndex={5}
                                href={url.loginResetCredentialsUrl}
                                underline="hover"
                                sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                            >
                                {msg("doForgotPassword")}
                            </Link>
                        )}
                    </Stack>

                    <Button tabIndex={4} variant="contained" type="submit" disabled={isLoginButtonDisabled} name="login" id="kc-login">
                        {msg("doLogIn")}
                    </Button>
                </Stack>
                <WebAuthnSection
                    enableWebAuthnConditionalUI={enableWebAuthnConditionalUI}
                    url={url}
                    authenticators={authenticators}
                    webAuthnButtonId={webAuthnButtonId}
                    buttonLabel={msgStr("passkey-doAuthenticate")}
                />
            </Stack>
        </Template>
    );
}

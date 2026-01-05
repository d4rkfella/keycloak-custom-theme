/**
 * Password step (login-password.ftl) for flows where username is already captured.
 * Adds conditional WebAuthn passkey authenticate section when enabled.
 */
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginPassword.useScript";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

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
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        <Divider sx={{ mb: 3 }} />

                        <FormControl sx={{ width: "100%", mb: 2 }} variant="outlined" error={messagesPerField.existsError("password")}>
                            <InputLabel htmlFor="password">{msg("password")}</InputLabel>
                            <OutlinedInput
                                tabIndex={2}
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoFocus
                                autoComplete="on"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? "hide the password" : "display the password"}
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={e => e.preventDefault()}
                                            onMouseUp={e => e.preventDefault()}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={msg("password")}
                            />
                            {messagesPerField.existsError("password") && (
                                <FormHelperText id="input-error-password">
                                    <span
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("password"))
                                        }}
                                    />
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
                            {realm.resetPasswordAllowed && (
                                <Link variant="button" underline="hover" tabIndex={5} href={url.loginResetCredentialsUrl}>
                                    {msg("doForgotPassword")}
                                </Link>
                            )}
                        </Box>

                        <div id="kc-form-buttons">
                            <Button
                                sx={{ width: "100%" }}
                                tabIndex={4}
                                variant="contained"
                                type="submit"
                                disabled={isLoginButtonDisabled}
                                name="login"
                                id="kc-login"
                                size="large"
                            >
                                {msg("doLogIn")}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            {enableWebAuthnConditionalUI && (
                <>
                    <form id="webauth" action={url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input type="hidden" id="authenticatorData" name="authenticatorData" />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </form>

                    {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                        <>
                            <form id="authn_select" className={kcClsx("kcFormClass")}>
                                {authenticators.authenticators.map((authenticator, i) => (
                                    <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                                ))}
                            </form>
                        </>
                    )}

                    <Box sx={{ mt: 1 }}>
                        <Button id={webAuthnButtonId} variant="outlined" size="large" sx={{ width: "100%" }}>
                            {msgStr("passkey-doAuthenticate")}
                        </Button>
                    </Box>
                </>
            )}
        </Template>
    );
}

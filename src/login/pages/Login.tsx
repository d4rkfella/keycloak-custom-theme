/**
 * Combined Username + Password login page (login.ftl) with optional WebAuthn passkey support.
 * Renders standard login form plus conditional passkey authenticator section.
 */
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

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
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography
                    sx={{
                        mt: 2
                    }}
                    variant="body2"
                >
                    {msg("noAccount")} <Link href={url.registrationUrl}>{msg("doRegister")}</Link>
                </Typography>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Divider sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {msg("identity-provider-login-label")}
                                </Typography>
                            </Divider>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: social.providers.length > 3 ? "repeat(2, 1fr)" : "1fr",
                                    gap: 1.5,
                                    width: "100%"
                                }}
                            >
                                {social.providers.map(p => (
                                    <Button
                                        key={p.alias}
                                        id={`social-${p.alias}`}
                                        variant="outlined"
                                        size="large"
                                        href={p.loginUrl}
                                        sx={{
                                            width: "100%",
                                            justifyContent: "flex-start",
                                            textTransform: "none",
                                            py: 1.5,
                                            borderColor: "divider",
                                            color: "text.primary",
                                            "&:hover": {
                                                borderColor: "primary.main",
                                                backgroundColor: "action.hover"
                                            }
                                        }}
                                        startIcon={p.iconClasses && <i aria-hidden="true" style={{ fontSize: "20px" }} />}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    )}
                </>
            }
        >
            <Box id="kc-form">
                <Box id="kc-form-wrapper">
                    {realm.password && (
                        <Box
                            component="form"
                            id="kc-form-login"
                            sx={{
                                width: "100%"
                            }}
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <TextField
                                    sx={{
                                        pb: 1,
                                        width: "100%",
                                        minWidth: 300
                                    }}
                                    label={
                                        !realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")
                                    }
                                    tabIndex={2}
                                    variant="outlined"
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    autoFocus
                                    autoComplete="username"
                                    error={messagesPerField.existsError("username", "password")}
                                    helperText={
                                        messagesPerField.existsError("username", "password") && (
                                            <span
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        )
                                    }
                                />
                            )}

                            <FormControl sx={{ width: "100%" }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">{msg("password")}</InputLabel>
                                <OutlinedInput
                                    tabIndex={3}
                                    name="password"
                                    autoComplete="current-password"
                                    error={messagesPerField.existsError("username", "password")}
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
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
                                    label="Password"
                                />
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <FormHelperText>
                                        <span
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <Box sx={{ mt: 1 }} display="flex" alignItems="center" justifyContent="space-between">
                                {realm.rememberMe && !usernameHidden && (
                                    <FormControlLabel
                                        sx={{
                                            my: 0,
                                            mr: 0,
                                            mt: 0
                                        }}
                                        control={<Checkbox defaultChecked={!!login.rememberMe} tabIndex={5} name="rememberMe" />}
                                        label={msg("rememberMe")}
                                        slotProps={{
                                            typography: {
                                                fontSize: "0.875rem" // 14px
                                            }
                                        }}
                                    />
                                )}

                                {realm.resetPasswordAllowed && (
                                    <Link underline="hover" tabIndex={6} sx={{ fontSize: "0.875rem" }} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </Link>
                                )}
                            </Box>

                            <Box id="kc-form-buttons">
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    sx={{ width: "100%", mt: 3 }}
                                    tabIndex={7}
                                    variant="contained"
                                    type="submit"
                                    disabled={isLoginButtonDisabled}
                                    name="login"
                                    size="large"
                                >
                                    {msg("doLogIn")}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            {enableWebAuthnConditionalUI && (
                <>
                    <Box component="form" id="webauth" action={url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input type="hidden" id="authenticatorData" name="authenticatorData" />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </Box>

                    {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                        <>
                            <Box component="form" id="authn_select">
                                {authenticators.authenticators.map((authenticator, i) => (
                                    <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                                ))}
                            </Box>
                        </>
                    )}
                    <br />

                    <Button id={webAuthnButtonId} variant="outlined" size="large" sx={{ width: "100%" }}>
                        {msgStr("passkey-doAuthenticate")}
                    </Button>
                </>
            )}
        </Template>
    );
}

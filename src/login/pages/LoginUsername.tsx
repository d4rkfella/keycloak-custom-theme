import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { SocialProviderCarousel } from "./Login";
import { WebAuthnSection } from "../components/WebAuthnSection";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

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
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("doLogIn")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography sx={{ textAlign: "center" }} variant="body2">
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            socialProvidersNode={
                realm.password && social?.providers?.length ? (
                    <Stack spacing={2.5}>
                        <Divider>
                            <Typography variant="body2" color="text.secondary">
                                {msg("identity-provider-login-label")}
                            </Typography>
                        </Divider>

                        <SocialProviderCarousel providers={social.providers} />

                        <Divider />
                    </Stack>
                ) : null
            }
        >
            <Stack spacing={2}>
                {realm.password && (
                    <Stack
                        spacing={2.5}
                        component="form"
                        id="kc-form-login"
                        action={url.loginAction}
                        method="post"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                    >
                        <Stack spacing={2}>
                            {!usernameHidden && (
                                <TextField
                                    fullWidth
                                    label={
                                        !realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")
                                    }
                                    tabIndex={2}
                                    name="username"
                                    defaultValue={login.username ?? ""}
                                    autoFocus
                                    autoComplete="username"
                                    error={messagesPerField.existsError("username")}
                                    helperText={messagesPerField.existsError("username") && messagesPerField.getFirstError("username")}
                                />
                            )}

                            {realm.rememberMe && !usernameHidden && (
                                <Box>
                                    <FormControlLabel
                                        control={<Checkbox tabIndex={3} name="rememberMe" defaultChecked={!!login.rememberMe} />}
                                        label={msg("rememberMe")}
                                    />
                                </Box>
                            )}
                        </Stack>

                        <Button fullWidth tabIndex={4} variant="contained" type="submit" size="large" disabled={isLoginButtonDisabled} name="login">
                            {msgStr("doLogIn")}
                        </Button>
                    </Stack>
                )}

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

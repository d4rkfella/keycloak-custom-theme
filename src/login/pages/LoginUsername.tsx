import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
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

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

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
                <Typography sx={{ mt: 2 }} variant="body2">
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            socialProvidersNode={
                <>
                    {realm.password && social !== undefined && social.providers !== undefined && social.providers.length !== 0 && (
                        <Box id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true" />}
                                            <span className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}>
                                                {p.displayName}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
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
                            action={url.loginAction}
                            method="post"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                        >
                            {!usernameHidden && (
                                <Box className={kcClsx("kcFormGroupClass")}>
                                    <TextField
                                        sx={{ width: "100%", minWidth: 350, pb: 1 }}
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
                                </Box>
                            )}

                            <Box className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                {realm.rememberMe && !usernameHidden && (
                                    <FormControlLabel
                                        control={<Checkbox tabIndex={3} name="rememberMe" defaultChecked={!!login.rememberMe} />}
                                        label={msg("rememberMe")}
                                    />
                                )}
                            </Box>

                            <Box id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <Button
                                    sx={{ width: "100%" }}
                                    tabIndex={4}
                                    variant="contained"
                                    type="submit"
                                    size="large"
                                    disabled={isLoginButtonDisabled}
                                    name="login"
                                >
                                    {msgStr("doLogIn")}
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
                        <Box component="form" id="authn_select" className={kcClsx("kcFormClass")}>
                            {authenticators.authenticators.map((authenticator, i) => (
                                <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                            ))}
                        </Box>
                    )}

                    <br />

                    <input
                        id={webAuthnButtonId}
                        type="button"
                        className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        value={msgStr("passkey-doAuthenticate")}
                    />
                </>
            )}
        </Template>
    );
}

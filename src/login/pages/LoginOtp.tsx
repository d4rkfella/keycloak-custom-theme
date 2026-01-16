import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, TextField, Radio, Box, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { otpLogin, url, messagesPerField } = kcContext;
    const { msg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCredentialId, setSelectedCredentialId] = useState(otpLogin.selectedCredentialId);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <Stack
                spacing={3}
                component="form"
                id="kc-otp-login-form"
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <List disablePadding>
                        {otpLogin.userOtpCredentials.map(otpCredential => (
                            <ListItem disableGutters key={otpCredential.id}>
                                <ListItemButton
                                    selected={selectedCredentialId === otpCredential.id}
                                    onClick={() => setSelectedCredentialId(otpCredential.id)}
                                >
                                    <ListItemIcon>
                                        <KeyIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={otpCredential.userLabel} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}

                <TextField
                    label={msg("loginOtpOneTime")}
                    id="otp"
                    name="otp"
                    autoComplete="off"
                    type="text"
                    autoFocus
                    error={messagesPerField.existsError("totp")}
                    helperText={
                        messagesPerField.existsError("totp") && (
                            <Box
                                component="span"
                                id="input-error-otp-code"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        )
                    }
                />

                <Button variant="contained" name="login" id="kc-login" type="submit" loading={isSubmitting}>
                    {msg("doLogIn")}
                </Button>
            </Stack>
        </Template>
    );
}

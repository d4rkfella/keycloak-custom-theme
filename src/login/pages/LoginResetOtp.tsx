import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";

export default function LoginResetOtp(props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField, configuredOtpCredentials } = kcContext;
    const { msg } = i18n;

    const [selectedCredentialId, setSelectedCredentialId] = useState(configuredOtpCredentials.selectedCredentialId);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <Stack component="form" id="kc-otp-reset-form" action={url.loginAction} method="post" spacing={2.5}>
                <List
                    subheader={
                        <ListSubheader disableGutters disableSticky>
                            <Typography variant="body1">{msg("otp-reset-description")}</Typography>
                        </ListSubheader>
                    }
                    disablePadding
                >
                    {configuredOtpCredentials.userOtpCredentials.map(otpCredential => (
                        <ListItem key={otpCredential.id} disableGutters>
                            <ListItemButton
                                selected={selectedCredentialId === otpCredential.id}
                                onClick={() => setSelectedCredentialId(otpCredential.id)}
                            >
                                <ListItemIcon>
                                    <SmartphoneIcon />
                                </ListItemIcon>

                                <ListItemText primary={otpCredential.userLabel} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Button id="kc-otp-reset-form-submit" variant="contained" type="submit">
                    {msg("doSubmit")}
                </Button>
            </Stack>
        </Template>
    );
}

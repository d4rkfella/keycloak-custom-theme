import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Alert } from "@mui/material";

export default function TrustedDevice(props: PageProps<Extract<KcContext, { pageId: "trusted-device.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, auth, trustedDeviceName } = kcContext;
    const { msg } = i18n;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [deviceName, setDeviceName] = useState(trustedDeviceName);

    const handleDialogSubmit = () => {
        const form = document.getElementById("kc-form-trusted-device") as HTMLFormElement;
        const input = document.getElementById("kc-trusted-device-name") as HTMLInputElement;
        input.value = deviceName;

        const yesInput = document.createElement("input");
        yesInput.type = "hidden";
        yesInput.name = "trusted-device";
        yesInput.value = "yes";
        form.appendChild(yesInput);

        form.submit();
    };

    const noUsername = !auth?.showUsername || !auth.attemptedUsername;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("trusted-device-display-name")}
            infoNode={
                <Typography aria-live="polite" variant="body2">
                    {msg("trusted-device-explanation")}
                </Typography>
            }
        >
            <form id="kc-form-trusted-device" action={url.loginAction} method="post">
                <input type="hidden" id="kc-trusted-device-name" name="trusted-device-name" value={deviceName} />
                <Stack spacing={3}>
                    {noUsername && (
                        <Alert severity="error" variant="standard">
                            No username detected. Please restart the login flow.
                        </Alert>
                    )}

                    {!noUsername && auth?.showUsername && !auth.showResetCredentials && (
                        <Typography variant="h2" textAlign="left">
                            {msg("trusted-device-header")}
                        </Typography>
                    )}

                    <Stack spacing={2}>
                        {!noUsername ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={e => {
                                        e.preventDefault();
                                        setDialogOpen(true);
                                    }}
                                >
                                    {msg("trusted-device-yes")}
                                </Button>

                                <Button variant="outlined" type="submit" name="trusted-device" value="no">
                                    {msg("trusted-device-no")}
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" size="large" fullWidth href={url.loginRestartFlowUrl}>
                                Back to Login
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </form>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{msg("trusted-device-name")}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        value={deviceName}
                        onChange={e => setDeviceName(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>{msg("doCancel")}</Button>
                    <Button onClick={handleDialogSubmit} variant="contained">
                        {msg("doSubmit")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Template>
    );
}

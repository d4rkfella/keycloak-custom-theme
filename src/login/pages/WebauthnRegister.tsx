import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isSetRetry, isAppInitiatedAction } = kcContext;
    const { msg } = i18n;
    const authButtonId = "authenticateWebAuthnButton";

    useScript({
        authButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("webauthn-registration-title")}
        >
            <Stack spacing={2}>
                <Box component="form" id="register" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="attestationObject" name="attestationObject" />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                    <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                    <input type="hidden" id="transports" name="transports" />
                    <input type="hidden" id="error" name="error" />
                    <Stack spacing={2.5}>
                        <Box>
                            <FormControlLabel
                                control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked />}
                                label={msg("logoutOtherSessions")}
                            />
                        </Box>

                        <Button variant="contained" type="submit" id={authButtonId}>
                            {msg("doRegisterSecurityKey")}
                        </Button>
                    </Stack>
                </Box>

                {!isSetRetry && isAppInitiatedAction && (
                    <Box component="form" action={url.loginAction} method="post">
                        <input type="hidden" name="cancel-aia" value="true" />
                        <Button sx={{ width: "100%" }} variant="outlined" color="error" type="submit" id="cancelWebAuthnAIA">
                            {msg("doCancel")}
                        </Button>
                    </Box>
                )}
            </Stack>
        </Template>
    );
}

import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage
            headerNode={<Typography variant="h5">{msg("webauthn-error-title")}</Typography>}
        >
            {/* Hidden retry form */}
            <Box component="form" id="kc-error-credential-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <input type="hidden" id="executionValue" name="authenticationExecution" />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />
            </Box>

            {/* Retry Button */}
            <Box sx={{ mt: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => {
                        const executionEl = document.getElementById("executionValue") as HTMLInputElement | null;
                        const retryEl = document.getElementById("isSetRetry") as HTMLInputElement | null;
                        const form = document.getElementById("kc-error-credential-form") as HTMLFormElement | null;

                        if (executionEl) executionEl.value = "${execution}";
                        if (retryEl) retryEl.value = "retry";
                        form?.requestSubmit();
                    }}
                >
                    {msgStr("doTryAgain")}
                </Button>
            </Box>

            {/* Cancel Button for App-Initiated Action */}
            {isAppInitiatedAction && (
                <Box component="form" id="kc-webauthn-settings-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                    <Box>
                        <Button fullWidth variant="outlined" size="large" type="submit" name="cancel-aia" value="true" id="cancelWebAuthnAIA">
                            {msgStr("doCancel")}
                        </Button>
                    </Box>
                </Box>
            )}
        </Template>
    );
}

import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, isAppInitiatedAction } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage
            headerNode={msg("webauthn-error-title")}
        >
            <Box component="form" id="kc-error-credential-form" action={url.loginAction} method="post">
                <input type="hidden" id="executionValue" name="authenticationExecution" />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />

                <Stack spacing={2}>
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

                    {isAppInitiatedAction && (
                        <Box component="form" id="kc-webauthn-settings-form" action={url.loginAction} method="post">
                            <Button fullWidth variant="outlined" type="submit" name="cancel-aia" value="true" id="cancelWebAuthnAIA">
                                {msgStr("doCancel")}
                            </Button>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Template>
    );
}

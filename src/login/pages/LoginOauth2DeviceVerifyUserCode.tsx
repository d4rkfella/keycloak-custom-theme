import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("oauth2DeviceVerificationTitle")}
        >
            <Stack spacing={2.5} component="form" id="kc-user-verify-device-user-code-form" action={url.oauth2DeviceVerificationAction} method="post">
                <TextField
                    id="device-user-code"
                    name="device_user_code"
                    label={msg("verifyOAuth2DeviceUserCode")}
                    autoComplete="off"
                    autoFocus
                    fullWidth
                    variant="outlined"
                />

                <Button type="submit" variant="contained">
                    {msgStr("doSubmit")}
                </Button>
            </Stack>
        </Template>
    );
}

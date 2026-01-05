import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function LoginOauth2DeviceVerifyUserCode(
    props: PageProps<Extract<KcContext, { pageId: "login-oauth2-device-verify-user-code.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("oauth2DeviceVerificationTitle")}
        >
            <Box
                component="form"
                id="kc-user-verify-device-user-code-form"
                className={kcClsx("kcFormClass")}
                action={url.oauth2DeviceVerificationAction}
                method="post"
            >
                {/* User code input */}
                <Box className={kcClsx("kcFormGroupClass")}>
                    <Box className={kcClsx("kcInputWrapperClass")} sx={{ width: "100%" }}>
                        <TextField
                            id="device-user-code"
                            name="device_user_code"
                            label={msg("verifyOAuth2DeviceUserCode")}
                            autoComplete="off"
                            autoFocus
                            fullWidth
                            variant="outlined"
                            sx={{
                                width: "100%",
                                minWidth: 395
                            }}
                        />
                    </Box>
                </Box>

                {/* Buttons */}
                <Box className={kcClsx("kcFormGroupClass")}>
                    <Box id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <Box className={kcClsx("kcFormOptionsWrapperClass")} />
                    </Box>

                    <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <Button type="submit" fullWidth variant="contained" size="large">
                            {msgStr("doSubmit")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Template>
    );
}

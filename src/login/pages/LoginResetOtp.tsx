import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LoginResetOtp(props: PageProps<Extract<KcContext, { pageId: "login-reset-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

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
            <form id="kc-otp-reset-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className={kcClsx("kcInputWrapperClass")}>
                    <div className={kcClsx("kcInfoAreaWrapperClass")}>
                        <Typography id="kc-otp-reset-form-description" variant="body1" sx={{ mb: 2 }}>
                            {msg("otp-reset-description")}
                        </Typography>

                        {configuredOtpCredentials.userOtpCredentials.map((otpCredential, index) => (
                            <Box
                                key={otpCredential.id}
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    p: 1,
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "action.hover"
                                    }
                                }}
                            >
                                <FormControlLabel
                                    sx={{
                                        width: "100%",
                                        m: 0
                                    }}
                                    control={
                                        <Radio
                                            id={`kc-otp-credential-${index}`}
                                            name="selectedCredentialId"
                                            value={otpCredential.id}
                                            checked={selectedCredentialId === otpCredential.id}
                                            onChange={e => setSelectedCredentialId(e.target.value)}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1,
                                                    backgroundColor: "action.selected"
                                                }}
                                            >
                                                <i className={kcClsx("kcLoginOTPListItemIconClass")} aria-hidden="true"></i>
                                            </Box>
                                            <Typography variant="body2">{otpCredential.userLabel}</Typography>
                                        </Box>
                                    }
                                />
                            </Box>
                        ))}

                        <div className={kcClsx("kcFormGroupClass")}>
                            <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                                <Button id="kc-otp-reset-form-submit" sx={{ width: "100%", mt: 3 }} variant="contained" type="submit" size="large">
                                    {msg("doSubmit")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="clearfix" />
        </Template>
    );
}

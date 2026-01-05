import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

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
            <form
                id="kc-otp-login-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                                <FormControlLabel
                                    key={index}
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                        ml: 0,
                                        mr: 0,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        p: 1,
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "action.hover"
                                        }
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
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                            ))}
                        </div>
                    </div>
                )}

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <TextField
                            sx={{
                                width: "100%",
                                minWidth: 350,
                                mt: 3
                            }}
                            label={msg("loginOtpOneTime")}
                            variant="outlined"
                            id="otp"
                            name="otp"
                            autoComplete="off"
                            type="text"
                            autoFocus
                            error={messagesPerField.existsError("totp")}
                        />
                        {messagesPerField.existsError("totp") && (
                            <span
                                id="input-error-otp-code"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            name="login"
                            id="kc-login"
                            type="submit"
                            disabled={isSubmitting}
                            size="large"
                        >
                            {msg("doLogIn")}
                        </Button>
                    </div>
                </div>
            </form>
        </Template>
    );
}

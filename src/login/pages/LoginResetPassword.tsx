import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
            headerNode={msg("emailForgotTitle")}
        >
            <Box component="form" id="kc-reset-password-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <Box className={kcClsx("kcFormGroupClass")}>
                    <Box className={kcClsx("kcInputWrapperClass")}>
                        <TextField
                            sx={{
                                width: "100%",
                                minWidth: 350
                            }}
                            label={
                                !realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")
                            }
                            tabIndex={1}
                            variant="outlined"
                            type="text"
                            id="username"
                            name="username"
                            autoFocus
                            defaultValue={auth.attemptedUsername ?? ""}
                            error={messagesPerField.existsError("username")}
                        />
                        {messagesPerField.existsError("username") && (
                            <span
                                id="input-error-username"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        )}
                    </Box>
                </Box>
                <Box className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                    <Box id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <Box className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span>
                                <Link
                                    sx={{
                                        display: "inline-block",
                                        position: "relative"
                                    }}
                                    href={url.loginUrl}
                                    variant="overline"
                                    underline="hover"
                                >
                                    {msg("backToLogin")}
                                </Link>
                            </span>
                        </Box>
                    </Box>
                    <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <Button
                            sx={{
                                width: "100%"
                            }}
                            variant="contained"
                            type="submit"
                            size="large"
                        >
                            {msgStr("doSubmit")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Template>
    );
}

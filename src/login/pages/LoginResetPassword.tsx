import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
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
            infoNode={
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                    {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                </Typography>
            }
            headerNode={msg("emailForgotTitle")}
        >
            <Stack spacing={2} component="form" id="kc-reset-password-form" action={url.loginAction} method="post">
                <TextField
                    label={
                        !realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")
                    }
                    tabIndex={1}
                    variant="outlined"
                    type="text"
                    id="username"
                    name="username"
                    autoFocus
                    defaultValue={auth.attemptedUsername ?? ""}
                    error={messagesPerField.existsError("username")}
                    helperText={messagesPerField.existsError("username") && messagesPerField.get("username")}
                />

                <Link href={url.loginUrl}>{msg("backToLogin")}</Link>

                <Button variant="contained" type="submit">
                    {msgStr("doSubmit")}
                </Button>
            </Stack>
        </Template>
    );
}

import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <Stack spacing={2.5} component="form" id="kc-passwd-update-form" action={url.loginAction} method="post">
                <Stack spacing={2}>
                    <TextField
                        sx={{ width: "100%" }}
                        variant="outlined"
                        id="password-new"
                        name="password-new"
                        label={msg("passwordNew")}
                        type={showPasswordNew ? "text" : "password"}
                        autoFocus
                        autoComplete="new-password"
                        error={messagesPerField.existsError("password", "password-confirm")}
                        helperText={
                            messagesPerField.existsError("password") && (
                                <span
                                    id="input-error-password"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password"))
                                    }}
                                />
                            )
                        }
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPasswordNew ? "hide the password" : "display the password"}
                                            onClick={() => setShowPasswordNew(show => !show)}
                                            onMouseDown={event => event.preventDefault()}
                                            onMouseUp={event => event.preventDefault()}
                                            edge="end"
                                        >
                                            {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <TextField
                        sx={{ width: "100%" }}
                        variant="outlined"
                        id="password-confirm"
                        name="password-confirm"
                        label={msg("passwordConfirm")}
                        type={showPasswordConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        error={messagesPerField.existsError("password", "password-confirm")}
                        helperText={
                            messagesPerField.existsError("password-confirm") && (
                                <span
                                    id="input-error-password-confirm"
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password-confirm"))
                                    }}
                                />
                            )
                        }
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPasswordConfirm ? "hide the password" : "display the password"}
                                            onClick={() => setShowPasswordConfirm(show => !show)}
                                            onMouseDown={event => event.preventDefault()}
                                            onMouseUp={event => event.preventDefault()}
                                            edge="end"
                                        >
                                            {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                    <LogoutOtherSessions i18n={i18n} />
                </Stack>
                <Stack id="kc-form-buttons" spacing={2}>
                    {isAppInitiatedAction ? (
                        <>
                            <Button variant="contained" type="submit">
                                {msg("doSubmit")}
                            </Button>
                            <Button variant="outlined" type="submit" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" type="submit">
                            {msg("doSubmit")}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Template>
    );
}

function LogoutOtherSessions(props: { i18n: I18n }) {
    const { msg } = props.i18n;
    return (
        <Box>
            <FormControlLabel
                control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked />}
                label={msg("logoutOtherSessions")}
            />
        </Box>
    );
}

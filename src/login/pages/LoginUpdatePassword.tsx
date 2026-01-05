import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

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
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <FormControl sx={{ width: "100%", minWidth: 350, mb: 2 }} variant="outlined">
                            <InputLabel htmlFor="password-new">{msg("passwordNew")}</InputLabel>
                            <OutlinedInput
                                id="password-new"
                                name="password-new"
                                type={showPasswordNew ? "text" : "password"}
                                autoFocus
                                autoComplete="new-password"
                                error={messagesPerField.existsError("password", "password-confirm")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPasswordNew ? "hide the password" : "display the password"}
                                            onClick={() => setShowPasswordNew(!showPasswordNew)}
                                            onMouseDown={e => e.preventDefault()}
                                            onMouseUp={e => e.preventDefault()}
                                            edge="end"
                                        >
                                            {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={msg("passwordNew")}
                            />
                            {messagesPerField.existsError("password") && (
                                <FormHelperText error>
                                    <span
                                        id="input-error-password"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("password"))
                                        }}
                                    />
                                </FormHelperText>
                            )}
                        </FormControl>
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <FormControl sx={{ width: "100%", minWidth: 350, mb: 2 }} variant="outlined">
                            <InputLabel htmlFor="password-confirm">{msg("passwordConfirm")}</InputLabel>
                            <OutlinedInput
                                id="password-confirm"
                                name="password-confirm"
                                type={showPasswordConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                error={messagesPerField.existsError("password", "password-confirm")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPasswordConfirm ? "hide the password" : "display the password"}
                                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                            onMouseDown={e => e.preventDefault()}
                                            onMouseUp={e => e.preventDefault()}
                                            edge="end"
                                        >
                                            {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={msg("passwordConfirm")}
                            />
                            {messagesPerField.existsError("password-confirm") && (
                                <FormHelperText error>
                                    <span
                                        id="input-error-password-confirm"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("password-confirm"))
                                        }}
                                    />
                                </FormHelperText>
                            )}
                        </FormControl>
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <LogoutOtherSessions i18n={i18n} />
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        {isAppInitiatedAction ? (
                            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                                <Button sx={{ flex: 1 }} variant="contained" type="submit">
                                    {msg("doSubmit")}
                                </Button>
                                <Button sx={{ flex: 1 }} variant="outlined" type="submit" name="cancel-aia" value="true">
                                    {msg("doCancel")}
                                </Button>
                            </Box>
                        ) : (
                            <Button sx={{ width: "100%" }} variant="contained" type="submit">
                                {msg("doSubmit")}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

function LogoutOtherSessions(props: { i18n: I18n }) {
    const { msg } = props.i18n;

    return (
        <FormControlLabel
            sx={{ width: "100%" }}
            control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked />}
            label={msg("logoutOtherSessions")}
        />
    );
}

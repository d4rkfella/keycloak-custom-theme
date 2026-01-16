import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { Link, Box, Button, Checkbox, FormControlLabel, Stack, Typography, useTheme, Theme } from "@mui/material";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;
    const { msg, advancedMsg } = i18n;

    const theme = useTheme();

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as Window & { onSubmitRecaptcha?: () => void })["onSubmitRecaptcha"] = () => {
            const form = document.getElementById("kc-register-form") as HTMLFormElement | null;
            form?.requestSubmit();
        };
        return () => {
            delete (window as Window & { onSubmitRecaptcha?: () => void })["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <Stack spacing={3} component="form" id="kc-register-form" action={url.registrationAction} method="post">
                <Stack spacing={2}>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />

                    {termsAcceptanceRequired && (
                        <TermsAcceptance
                            i18n={i18n}
                            messagesPerField={messagesPerField}
                            areTermsAccepted={areTermsAccepted}
                            onAreTermsAcceptedValueChange={setAreTermsAccepted}
                            theme={theme}
                        />
                    )}

                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                        <Box
                            sx={{
                                display: "flex",
                                transform: "scale(0.8)",
                                transformOrigin: "center left",
                                justifyContent: "left"
                            }}
                            className="g-recaptcha"
                            data-theme="dark"
                            data-font="14px"
                            data-sitekey={recaptchaSiteKey}
                            data-action={recaptchaAction}
                        />
                    )}
                </Stack>

                <Link href={url.loginUrl}>{msg("backToLogin")}</Link>

                {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                    <Button
                        variant="contained"
                        className="g-recaptcha"
                        data-sitekey={recaptchaSiteKey}
                        data-callback="onSubmitRecaptcha"
                        data-action={recaptchaAction}
                        type="submit"
                    >
                        {msg("doRegister")}
                    </Button>
                ) : (
                    <Button variant="contained" disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)} type="submit">
                        {msg("doRegister")}
                    </Button>
                )}
            </Stack>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
    theme: Theme;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange, theme } = props;
    const { msg, msgStr } = i18n;

    const openTermsInNewTab = () => {
        const sanitizeTitle = (str: string) => {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        };

        const title = sanitizeTitle(msgStr("termsTitle") || "Terms of Service");

        const termsHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;">
                <title>${title}</title>
                <style>
                    /* ... your existing styles ... */
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${title}</h1>
                    ${kcSanitize(msgStr("termsText"))}
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([termsHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank", "noopener,noreferrer");

        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    return (
        <FormControlLabel
            disableTypography
            control={
                <Checkbox
                    size="medium"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                    sx={{}}
                />
            }
            label={
                <>
                    <Stack spacing={1}>
                        <Typography variant="body2">
                            {msg("acceptTermsPrefix")}{" "}
                            <Link component="button" type="button" onClick={openTermsInNewTab} underline="hover">
                                {msg("termsTitle")}
                            </Link>
                        </Typography>
                        {messagesPerField.existsError("termsAccepted") && (
                            <Typography
                                variant="body2"
                                component="span"
                                color="error"
                                id="input-error-terms-accepted"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("termsAccepted"))
                                }}
                            />
                        )}
                    </Stack>
                </>
            }
        />
    );
}

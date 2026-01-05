import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as Window & { onSubmitRecaptcha?: () => void })["onSubmitRecaptcha"] = () => {
            const form = document.getElementById("kc-register-form") as HTMLFormElement | null;
            if (form) {
                form.requestSubmit();
            }
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
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <Box component="form" id="kc-register-form" className={kcClsx("kcFormClass")} action={url.registrationAction} method="post">
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
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <Box className="form-group">
                        <Box className={kcClsx("kcInputWrapperClass")}>
                            <Box className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></Box>
                        </Box>
                    </Box>
                )}
                <Box className={kcClsx("kcFormGroupClass")}>
                    <Box id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <Box className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span>
                                <Link href={url.loginUrl}>{msg("backToLogin")}</Link>
                            </span>
                        </Box>
                    </Box>

                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <Button
                                sx={{ width: "100%" }}
                                variant="contained"
                                className={clsx("g-recaptcha")}
                                data-sitekey={recaptchaSiteKey}
                                data-callback="onSubmitRecaptcha"
                                data-action={recaptchaAction}
                                type="submit"
                                size="large"
                            >
                                {msg("doRegister")}
                            </Button>
                        </Box>
                    ) : (
                        <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <Button
                                sx={{ width: "100%" }}
                                variant="contained"
                                disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                type="submit"
                                size="large"
                            >
                                {msg("doRegister")}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}): JSX.Element {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <>
            <Box className="form-group" sx={{ mb: 2 }}>
                <Box className={kcClsx("kcInputWrapperClass")}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {msg("termsTitle")}
                    </Typography>
                    <Box id="kc-registration-terms-text" sx={{ mb: 2 }}>
                        <Typography variant="body2">{msg("termsText")}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box className="form-group" sx={{ mb: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            id="termsAccepted"
                            name="termsAccepted"
                            checked={areTermsAccepted}
                            onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        />
                    }
                    label={msg("acceptTerms")}
                />
                {messagesPerField.existsError("termsAccepted") && (
                    <Typography variant="body2" color="error" sx={{ ml: 4, mt: 0.5 }}>
                        <span
                            id="input-error-terms-accepted"
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </Typography>
                )}
            </Box>
        </>
    );
}

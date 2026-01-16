import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { messagesPerField, url, isAppInitiatedAction } = kcContext;
    const { msg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayRequiredFields
            headerNode={msg("loginProfileTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <Stack spacing={2.5} component="form" id="kc-update-profile-form" action={url.loginAction} method="post">
                <Stack spacing={2}>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                </Stack>

                <Stack spacing={2}>
                    {isAppInitiatedAction ? (
                        <>
                            <Button fullWidth variant="contained" disabled={!isFormSubmittable} type="submit">
                                {msg("doSubmit")}
                            </Button>
                            <Button fullWidth variant="outlined" type="submit" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        </>
                    ) : (
                        <Button fullWidth variant="contained" disabled={!isFormSubmittable} type="submit">
                            {msg("doSubmit")}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Template>
    );
}

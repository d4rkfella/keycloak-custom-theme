import "@fontsource/orbitron";
import "@fontsource/outfit";
import "font-awesome/css/font-awesome.min.css";
import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import { tss } from "tss-react/mui";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import backgroundJpgUrl from "./assets/img/background.jpg";
const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));
import CssBaseline from "@mui/material/CssBaseline";
const Login = lazy(() => import("./pages/Login"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const SelectAuthenticator = lazy(() => import("./pages/SelectAuthenticator"));
const Info = lazy(() => import("./pages/Info"));
const Error = lazy(() => import("./pages/Error"));
const Terms = lazy(() => import("./pages/Terms"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const LoginResetOtp = lazy(() => import("./pages/LoginResetOtp"));
const FrontchannelLogout = lazy(() => import("./pages/FrontchannelLogout"));
const Register = lazy(() => import("./pages/Register"));
const LoginUpdateProfile = lazy(() => import("./pages/LoginUpdateProfile"));
const LoginUsername = lazy(() => import("./pages/LoginUsername"));
const WebauthnAuthenticate = lazy(() => import("./pages/WebauthnAuthenticate"));
const WebauthnRegister = lazy(() => import("./pages/WebauthnRegister"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));
const LoginOauth2DeviceVerifyUserCode = lazy(
    () => import("./pages/LoginOauth2DeviceVerifyUserCode")
);
const LoginOauthGrant = lazy(() => import("./pages/LoginOauthGrant"));
const LoginPassword = lazy(() => import("./pages/LoginPassword"));
const WebauthnError = lazy(() => import("./pages/WebauthnError"));
const Code = lazy(() => import("./pages/Code"));
const LoginRecoveryAuthnCodeConfig = lazy(
    () => import("./pages/LoginRecoveryAuthnCodeConfig")
);
const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <KcPageContextualized {...props} />
        </ThemeProvider>
    );
}
function KcPageContextualized(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const { classes } = useStyles();

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-config-totp.ftl":
                        return (
                            <LoginConfigTotp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-otp.ftl":
                        return (
                            <LoginOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-verify-email.ftl":
                        return (
                            <LoginVerifyEmail
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "select-authenticator.ftl":
                        return (
                            <SelectAuthenticator
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "info.ftl":
                        return (
                            <Info
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "error.ftl":
                        return (
                            <Error
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "terms.ftl":
                        return (
                            <Terms
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-page-expired.ftl":
                        return (
                            <LoginPageExpired
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-reset-otp.ftl":
                        return (
                            <LoginResetOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "frontchannel-logout.ftl":
                        return (
                            <FrontchannelLogout
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-update-profile.ftl":
                        return (
                            <LoginUpdateProfile
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-username.ftl":
                        return (
                            <LoginUsername
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "webauthn-authenticate.ftl":
                        return (
                            <WebauthnAuthenticate
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "webauthn-register.ftl":
                        return (
                            <WebauthnRegister
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-oauth2-device-verify-user-code.ftl":
                        return (
                            <LoginOauth2DeviceVerifyUserCode
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-oauth-grant.ftl":
                        return (
                            <LoginOauthGrant
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "webauthn-error.ftl":
                        return (
                            <WebauthnError
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "code.ftl":
                        return (
                            <Code
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-recovery-authn-code-config.ftl":
                        return (
                            <LoginRecoveryAuthnCodeConfig
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    case "login-password.ftl":
                        return (
                            <LoginPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={false}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={false}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const useStyles = tss.create({
    kcHtmlClass: {
        ":root": {
            colorScheme: "dark"
        }
    },
    kcBodyClass: {
        background: `url(${backgroundJpgUrl}) no-repeat center center fixed`,
        backgroundSize: "cover",
        color: theme.palette.text.primary,

        "@media (max-width: 768px)": {
            backgroundSize: "cover",
            backgroundPosition: "center center"
        }
    }
} satisfies { [key in ClassKey]?: unknown });

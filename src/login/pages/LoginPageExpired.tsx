import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <Typography id="instruction1" className="instruction" variant="body1">
                {msg("pageExpiredMsg1")}{" "}
                <Link id="loginRestartLink" href={url.loginRestartFlowUrl} variant="overline" underline="hover">
                    {msg("doClickHere")}
                </Link>{" "}
                .<br />
                {msg("pageExpiredMsg2")}{" "}
                <Link id="loginContinueLink" href={url.loginAction} variant="overline" underline="hover">
                    {msg("doClickHere")}
                </Link>{" "}
                .
            </Typography>
        </Template>
    );
}

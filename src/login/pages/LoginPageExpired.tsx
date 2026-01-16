import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <Stack spacing={2}>
                <Typography id="instruction1" variant="body1">
                    {msg("pageExpiredMsg1")}{" "}
                    <Link id="loginRestartLink" href={url.loginRestartFlowUrl} underline="hover">
                        {msg("doClickHere")}
                    </Link>
                    .
                </Typography>
                <Typography variant="body1">
                    {msg("pageExpiredMsg2")}{" "}
                    <Link id="loginContinueLink" href={url.loginAction} underline="hover">
                        {msg("doClickHere")}
                    </Link>
                    .
                </Typography>
            </Stack>
        </Template>
    );
}

import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;
    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <Stack spacing={2.5} component="form" action={url.loginAction} method="POST">
                <Typography id="kc-terms-text" variant="body1">
                    {msg("termsText")}
                </Typography>

                <Stack spacing={2}>
                    <Button fullWidth variant="contained" color="success" name="accept" id="kc-accept" type="submit">
                        {msg("doAccept")}
                    </Button>
                    <Button fullWidth variant="contained" name="cancel" id="kc-decline" type="submit" color="error">
                        {msg("doDecline")}
                    </Button>
                </Stack>
            </Stack>
        </Template>
    );
}

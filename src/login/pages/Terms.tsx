import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
            <Box id="kc-terms-text" sx={{ mb: 3 }}>
                <Typography variant="body1">{msg("termsText")}</Typography>
            </Box>
            <form className="form-actions" action={url.loginAction} method="POST">
                <Button sx={{ width: "100%", mb: 1 }} variant="contained" name="accept" id="kc-accept" type="submit">
                    {msg("doAccept")}
                </Button>
                <Button sx={{ width: "100%" }} variant="contained" name="cancel" id="kc-decline" type="submit" color="error">
                    {msg("doDecline")}
                </Button>
            </form>
            <div className="clearfix" />
        </Template>
    );
}

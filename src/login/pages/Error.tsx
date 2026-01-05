import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <Box id="kc-error-message">
                <Typography className="instruction" variant="body1" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                    <Typography variant="body2">
                        <Link id="backToApplication" href={client.baseUrl}>
                            {msg("backToApplication")}
                        </Link>
                    </Typography>
                )}
            </Box>
        </Template>
    );
}

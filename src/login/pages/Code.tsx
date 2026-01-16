import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Typography, TextField, Stack } from "@mui/material";

export default function Code(props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { code } = kcContext;

    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}
        >
            <Stack spacing={2} id="kc-code">
                {code.success ? (
                    <>
                        <Typography component="p" variant="body1">
                            {msg("copyCodeInstruction")}
                        </Typography>

                        <TextField
                            id="code"
                            variant="outlined"
                            fullWidth
                            defaultValue={code.code}
                            slotProps={{
                                input: {
                                    readOnly: true
                                }
                            }}
                        />
                    </>
                ) : (
                    code.error && (
                        <Typography
                            id="error"
                            component="p"
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: kcSanitize(code.error) }}
                            color="error"
                        />
                    )
                )}
            </Stack>
        </Template>
    );
}

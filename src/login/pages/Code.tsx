import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
            headerNode={<Typography variant="h5">{code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}</Typography>}
        >
            <Box id="kc-code" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {code.success ? (
                    <>
                        <Typography>{msg("copyCodeInstruction")}</Typography>
                        <TextField
                            id="code"
                            defaultValue={code.code}
                            fullWidth
                            variant="outlined"
                            slotProps={{
                                input: {
                                    readOnly: true
                                }
                            }}
                            onFocus={e => e.target.select()}
                        />
                    </>
                ) : (
                    code.error && <Typography id="error" color="error" dangerouslySetInnerHTML={{ __html: kcSanitize(code.error) }} />
                )}
            </Box>
        </Template>
    );
}

import { useState } from "react";
import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function LoginRecoveryAuthnCodeConfig(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { recoveryAuthnCodesConfigBean, isAppInitiatedAction, url } = kcContext;
    const { msg, msgStr } = i18n;

    const [isConfirmed, setIsConfirmed] = useState(false);

    const olRecoveryCodesListId = "kc-recovery-codes-list";
    useScript({ olRecoveryCodesListId, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("recovery-code-config-header")}
        >
            <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>{msg("recovery-code-config-warning-title")}</AlertTitle>
                {msg("recovery-code-config-warning-message")}
            </Alert>

            <Stack spacing={1}>
                <List disablePadding component="ol" id={olRecoveryCodesListId}>
                    {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                        <ListItem divider sx={{ ml: 1 }} disableGutters key={index}>
                            <Typography component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                                {index + 1}:
                            </Typography>
                            {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                        </ListItem>
                    ))}
                </List>

                {/* Action Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >
                    <Button id="printRecoveryCodes" size="small" variant="text" startIcon={<PrintIcon />} fullWidth={false}>
                        {msg("recovery-codes-print")}
                    </Button>
                    <Button id="downloadRecoveryCodes" size="small" variant="text" startIcon={<DownloadIcon />} fullWidth={false}>
                        {msg("recovery-codes-download")}
                    </Button>
                    <Button id="copyRecoveryCodes" size="small" variant="text" startIcon={<ContentCopyIcon />} fullWidth={false}>
                        {msg("recovery-codes-copy")}
                    </Button>
                </Box>
            </Stack>

            <Box component="form" action={url.loginAction} id="kc-recovery-codes-settings-form" method="post">
                <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />
                <Stack spacing={2.5}>
                    <Stack spacing={1}>
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="kcRecoveryCodesConfirmationCheck"
                                        name="kcRecoveryCodesConfirmationCheck"
                                        checked={isConfirmed}
                                        onChange={event => setIsConfirmed(event.target.checked)}
                                    />
                                }
                                label={msg("recovery-codes-confirmation-message")}
                            />
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked />}
                                label={msg("logoutOtherSessions")}
                            />
                        </Box>
                    </Stack>

                    <Stack spacing={2}>
                        {isAppInitiatedAction ? (
                            <>
                                <Button type="submit" id="saveRecoveryAuthnCodesBtn" variant="contained" disabled={!isConfirmed} fullWidth>
                                    {msg("recovery-codes-action-complete")}
                                </Button>

                                <Button type="submit" id="cancelRecoveryAuthnCodesBtn" name="cancel-aia" variant="outlined" fullWidth>
                                    {msg("recovery-codes-action-cancel")}
                                </Button>
                            </>
                        ) : (
                            <Button type="submit" id="saveRecoveryAuthnCodesBtn" variant="contained" disabled={!isConfirmed} fullWidth>
                                {msg("recovery-codes-action-complete")}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Template>
    );
}

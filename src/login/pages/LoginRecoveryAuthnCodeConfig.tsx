import { useState } from "react";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { useScript } from "keycloakify/login/pages/LoginRecoveryAuthnCodeConfig.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Box from "@mui/material/Box";
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
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
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
            {/* Warning Alert */}
            <Alert severity="warning" sx={{ mb: 3 }} className={kcClsx("kcRecoveryCodesWarning")}>
                <AlertTitle>{msg("recovery-code-config-warning-title")}</AlertTitle>
                {msg("recovery-code-config-warning-message")}
            </Alert>

            {/* Recovery Codes List */}
            <Box
                component="ol"
                id={olRecoveryCodesListId}
                className={kcClsx("kcRecoveryCodesList")}
                sx={{
                    listStyle: "none",
                    mb: 1,
                    "& li": {
                        fontSize: "1.0rem",
                        padding: "8px 8px",
                        backgroundColor: "action.hover",
                        borderRadius: 1,
                        "& span": {
                            fontWeight: "bold",
                            marginRight: 1
                        }
                    }
                }}
            >
                {recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList.map((code, index) => (
                    <li key={index}>
                        <span>{index + 1}:</span> {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
                    </li>
                ))}
            </Box>

            {/* Action Buttons */}
            <Box
                className={kcClsx("kcRecoveryCodesActions")}
                sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                    flexWrap: "wrap"
                }}
            >
                <Button
                    id="printRecoveryCodes"
                    variant="text"
                    startIcon={<PrintIcon />}
                    sx={{
                        "& .MuiButton-startIcon": {
                            marginLeft: 1
                        }
                    }}
                >
                    {msg("recovery-codes-print")}
                </Button>
                <Button
                    id="downloadRecoveryCodes"
                    variant="text"
                    startIcon={<DownloadIcon />}
                    sx={{
                        "& .MuiButton-startIcon": {
                            marginLeft: 1
                        }
                    }}
                >
                    {msg("recovery-codes-download")}
                </Button>
                <Button
                    id="copyRecoveryCodes"
                    variant="text"
                    startIcon={<ContentCopyIcon />}
                    sx={{
                        "& .MuiButton-startIcon": {
                            marginLeft: 1
                        }
                    }}
                >
                    {msg("recovery-codes-copy")}
                </Button>
            </Box>

            {/* Confirmation Checkbox */}
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

            {/* Form */}
            <form action={url.loginAction} id="kc-recovery-codes-settings-form" method="post">
                <input type="hidden" name="generatedRecoveryAuthnCodes" value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString} />
                <input type="hidden" name="generatedAt" value={recoveryAuthnCodesConfigBean.generatedAt} />
                <input type="hidden" id="userLabel" name="userLabel" value={msgStr("recovery-codes-label-default")} />

                <Box sx={{ mb: 3 }}>
                    <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                </Box>

                {isAppInitiatedAction ? (
                    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                        <Button
                            type="submit"
                            id="saveRecoveryAuthnCodesBtn"
                            variant="contained"
                            size="large"
                            disabled={!isConfirmed}
                            sx={{ width: "100%" }}
                        >
                            {msg("recovery-codes-action-complete")}
                        </Button>

                        <Button
                            type="submit"
                            id="cancelRecoveryAuthnCodesBtn"
                            name="cancel-aia"
                            variant="outlined"
                            size="large"
                            sx={{ width: "100%" }}
                        >
                            {msg("recovery-codes-action-cancel")}
                        </Button>
                    </Box>
                ) : (
                    <Button
                        type="submit"
                        id="saveRecoveryAuthnCodesBtn"
                        variant="contained"
                        size="large"
                        disabled={!isConfirmed}
                        sx={{ width: "100%" }}
                    >
                        {msg("recovery-codes-action-complete")}
                    </Button>
                )}
            </form>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { i18n } = props;
    const { msg } = i18n;

    return (
        <FormControlLabel
            control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked />}
            label={msg("logoutOtherSessions")}
        />
    );
}

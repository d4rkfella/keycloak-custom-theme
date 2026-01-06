import { getKcClsx, KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <>
                <List id="kc-totp-settings" component="ol" sx={{ pl: 3, mb: 1 }}>
                    <ListItem component="li" sx={{ display: "list-item", listStyleType: "decimal", pl: 1 }}>
                        <Typography variant="body1">{msg("loginTotpStep1")}</Typography>

                        <List id="kc-totp-supported-apps" component="ul" sx={{ pl: 3 }}>
                            {totp.supportedApplications.map(app => (
                                <ListItem key={app} component="li" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                    <Typography variant="body2">{advancedMsg(app)}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    </ListItem>

                    {mode == "manual" ? (
                        <>
                            <ListItem component="li" sx={{ display: "list-item", listStyleType: "decimal", pl: 1 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {msg("loginTotpManualStep2")}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <Box component="span" id="kc-totp-secret-key" sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                                        {totp.totpSecretEncoded}
                                    </Box>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <Link href={totp.qrUrl} id="mode-barcode" underline="hover">
                                        {msg("loginTotpScanBarcode")}
                                    </Link>
                                </Typography>
                            </ListItem>
                            <ListItem component="li" sx={{ display: "list-item", listStyleType: "decimal", pl: 1 }}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {msg("loginTotpManualStep3")}
                                </Typography>
                                <List component="ul" sx={{ pl: 3 }}>
                                    <ListItem component="li" id="kc-totp-type" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                        <Typography variant="body2">
                                            {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                        </Typography>
                                    </ListItem>
                                    <ListItem component="li" id="kc-totp-algorithm" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                        <Typography variant="body2">
                                            {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                        </Typography>
                                    </ListItem>
                                    <ListItem component="li" id="kc-totp-digits" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                        <Typography variant="body2">
                                            {msg("loginTotpDigits")}: {totp.policy.digits}
                                        </Typography>
                                    </ListItem>
                                    {totp.policy.type === "totp" ? (
                                        <ListItem component="li" id="kc-totp-period" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                            <Typography variant="body2">
                                                {msg("loginTotpInterval")}: {totp.policy.period}
                                            </Typography>
                                        </ListItem>
                                    ) : (
                                        <ListItem component="li" id="kc-totp-counter" sx={{ display: "list-item", listStyleType: "disc", pl: 0 }}>
                                            <Typography variant="body2">
                                                {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                            </Typography>
                                        </ListItem>
                                    )}
                                </List>
                            </ListItem>
                        </>
                    ) : (
                        <ListItem component="li" sx={{ display: "list-item", listStyleType: "decimal", pl: 1 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {msg("loginTotpStep2")}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    mb: 1
                                }}
                            >
                                <Box
                                    component="img"
                                    id="kc-totp-secret-qr-code"
                                    src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                    alt="Figure: Barcode"
                                    sx={{
                                        maxWidth: "100%",
                                        width: "150px",
                                        height: "auto",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1
                                    }}
                                />
                            </Box>
                            <Typography variant="body2">
                                <Link href={totp.manualUrl} id="mode-manual" underline="hover">
                                    {msg("loginTotpUnableToScan")}
                                </Link>
                            </Typography>
                        </ListItem>
                    )}
                    <ListItem component="li" sx={{ display: "list-item", listStyleType: "decimal", pl: 1 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {msg("loginTotpStep3")}
                        </Typography>
                        <Typography variant="body2">{msg("loginTotpStep3DeviceName")}</Typography>
                    </ListItem>
                </List>

                <Box component="form" action={url.loginAction} id="kc-totp-settings-form" method="post">
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            sx={{
                                width: "100%",
                                minWidth: 350
                            }}
                            variant="outlined"
                            type="text"
                            id="totp"
                            name="totp"
                            label={msg("authenticatorCode")}
                            required
                            autoComplete="off"
                            error={messagesPerField.existsError("totp")}
                            helperText={
                                messagesPerField.existsError("totp") && (
                                    <span
                                        id="input-error-otp-code"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("totp"))
                                        }}
                                    />
                                )
                            }
                        />
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" value={mode} />}
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            sx={{
                                width: "100%",
                                minWidth: 350
                            }}
                            variant="outlined"
                            type="text"
                            id="userLabel"
                            name="userLabel"
                            required={totp.otpCredentials.length >= 1}
                            label={msg("loginTotpDeviceName")}
                            autoComplete="off"
                            error={messagesPerField.existsError("userLabel")}
                            helperText={
                                messagesPerField.existsError("userLabel") && (
                                    <span
                                        id="input-error-otp-label"
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.get("userLabel"))
                                        }}
                                    />
                                )
                            }
                        />
                    </Box>

                    <Box>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    </Box>

                    {isAppInitiatedAction ? (
                        <>
                            <Button sx={{ width: "100%", mb: 1 }} variant="contained" type="submit" id="saveTOTPBtn">
                                {msg("doSubmit")}
                            </Button>
                            <Button sx={{ width: "100%" }} variant="outlined" type="submit" id="cancelTOTPBtn" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        </>
                    ) : (
                        <Button size="large" sx={{ width: "100%" }} variant="contained" type="submit" id="saveTOTPBtn">
                            {msg("doSubmit")}
                        </Button>
                    )}
                </Box>
            </>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { i18n } = props;

    const { msg } = i18n;

    return (
        <FormControlLabel
            sx={{ mb: 2 }}
            control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />}
            label={msg("logoutOtherSessions")}
        />
    );
}

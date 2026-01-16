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
import Stack from "@mui/material/Stack";

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
            <Stack spacing={3}>
                {/* Instructions list */}
                <List id="kc-totp-settings" component="ol" sx={{ pl: 2.5 }}>
                    {/* Step 1: Install app */}
                    <ListItem
                        disablePadding
                        disableGutters
                        sx={{
                            display: "list-item",
                            listStyleType: "decimal",
                            mb: 2.5
                        }}
                    >
                        <Stack spacing={1.5}>
                            <Typography>{msg("loginTotpStep1")}</Typography>

                            {/* Nested app list */}
                            <List component="ul" id="kc-totp-supported-apps" dense disablePadding>
                                {totp.supportedApplications.map(app => (
                                    <ListItem key={app} disablePadding disableGutters>
                                        <Typography>{advancedMsg(app)}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Stack>
                    </ListItem>

                    {/* Step 2 & 3: Manual or QR mode */}
                    {mode === "manual" ? (
                        <>
                            {/* Manual Step 2: Enter key */}
                            <ListItem
                                disablePadding
                                disableGutters
                                sx={{
                                    display: "list-item",
                                    listStyleType: "decimal",
                                    mb: 2.5
                                }}
                            >
                                <Typography>{msg("loginTotpManualStep2")}</Typography>
                                <Stack mt={1.5} spacing={1}>
                                    <Typography
                                        id="kc-totp-secret-key"
                                        sx={{
                                            fontWeight: "bold",
                                            fontFamily: "monospace",
                                            letterSpacing: "0.05em"
                                        }}
                                    >
                                        {totp.totpSecretEncoded}
                                    </Typography>

                                    <Typography variant="body2">
                                        <Link href={totp.qrUrl} id="mode-barcode" underline="hover">
                                            {msg("loginTotpScanBarcode")}
                                        </Link>
                                    </Typography>
                                </Stack>
                            </ListItem>

                            {/* Manual Step 3: Configuration values */}
                            <ListItem
                                disablePadding
                                disableGutters
                                sx={{
                                    display: "list-item",
                                    listStyleType: "decimal",
                                    mb: 2.5
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Typography>{msg("loginTotpManualStep3")}</Typography>

                                    {/* Nested config list */}
                                    <List component="ul" dense disablePadding>
                                        <ListItem disablePadding disableGutters id="kc-totp-type">
                                            <Typography>
                                                {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                            </Typography>
                                        </ListItem>

                                        <ListItem disablePadding disableGutters id="kc-totp-algorithm">
                                            <Typography>
                                                {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                            </Typography>
                                        </ListItem>

                                        <ListItem disablePadding disableGutters id="kc-totp-digits">
                                            <Typography>
                                                {msg("loginTotpDigits")}: {totp.policy.digits}
                                            </Typography>
                                        </ListItem>

                                        {totp.policy.type === "totp" ? (
                                            <ListItem disablePadding disableGutters id="kc-totp-period">
                                                <Typography>
                                                    {msg("loginTotpInterval")}: {totp.policy.period}
                                                </Typography>
                                            </ListItem>
                                        ) : (
                                            <ListItem disablePadding disableGutters id="kc-totp-counter">
                                                <Typography>
                                                    {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                                </Typography>
                                            </ListItem>
                                        )}
                                    </List>
                                </Stack>
                            </ListItem>
                        </>
                    ) : (
                        /* QR Code mode - Step 2: Scan barcode */
                        <ListItem
                            disablePadding
                            disableGutters
                            sx={{
                                display: "list-item",
                                listStyleType: "decimal",
                                mb: 2.5
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Typography>{msg("loginTotpStep2")}</Typography>

                                <Box
                                    component="img"
                                    id="kc-totp-secret-qr-code"
                                    src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                    alt="Figure: Barcode"
                                    sx={{
                                        display: "block",
                                        maxWidth: "100%",
                                        width: "150px",
                                        height: "auto",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1
                                    }}
                                />

                                <Typography>
                                    <Link href={totp.manualUrl} id="mode-manual" underline="hover">
                                        {msg("loginTotpUnableToScan")}
                                    </Link>
                                </Typography>
                            </Stack>
                        </ListItem>
                    )}

                    {/* Final step: Enter code */}
                    <ListItem
                        disablePadding
                        disableGutters
                        sx={{
                            display: "list-item",
                            listStyleType: "decimal"
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography>{msg("loginTotpStep3")}</Typography>
                            <Typography color="text.secondary">{msg("loginTotpStep3DeviceName")}</Typography>
                        </Stack>
                    </ListItem>
                </List>

                {/* Form section */}
                <Stack spacing={2.5} component="form" action={url.loginAction} id="kc-totp-settings-form" method="post">
                    <Stack spacing={2}>
                        <TextField
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

                        <TextField
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
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    </Stack>
                    {isAppInitiatedAction ? (
                        <Stack spacing={2}>
                            <Button variant="contained" type="submit" id="saveTOTPBtn">
                                {msg("doSubmit")}
                            </Button>
                            <Button variant="outlined" type="submit" id="cancelTOTPBtn" name="cancel-aia" value="true">
                                {msg("doCancel")}
                            </Button>
                        </Stack>
                    ) : (
                        <Button variant="contained" type="submit" id="saveTOTPBtn">
                            {msg("doSubmit")}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { i18n } = props;
    const { msg } = i18n;

    return (
        <Box>
            <FormControlLabel
                control={<Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />}
                label={msg("logoutOtherSessions")}
            />
        </Box>
    );
}

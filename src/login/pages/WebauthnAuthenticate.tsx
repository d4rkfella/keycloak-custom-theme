import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import KeyIcon from "@mui/icons-material/VpnKey";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import UsbIcon from "@mui/icons-material/Usb";
import TapAndPlayIcon from "@mui/icons-material/TapAndPlay";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    const getAuthenticatorIcon = (authenticator: (typeof authenticators.authenticators)[0]) => {
        const transports = authenticator.transports.displayNameProperties ?? [];

        for (const t of transports) {
            let labelStr: string;

            if (typeof t === "string") {
                labelStr = t;
            } else {
                const advanced = advancedMsg(t);
                labelStr = typeof advanced === "string" ? advanced : "";
            }

            const type = labelStr.toLowerCase();

            if (type.includes("internal")) return <SmartphoneIcon fontSize="large" color="primary" />;
            if (type.includes("usb")) return <UsbIcon fontSize="large" color="primary" />;
            if (type.includes("nfc")) return <TapAndPlayIcon fontSize="large" color="primary" />;
            if (type.includes("ble")) return <BluetoothIcon fontSize="large" color="primary" />;
            if (type.includes("platform")) return <LaptopMacIcon fontSize="large" color="primary" />;
        }

        return <KeyIcon fontSize="large" color="primary" />;
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <Box id="kc-form-webauthn" className={kcClsx("kcFormClass")}>
                {/* Hidden WebAuthn form */}
                <Box component="form" id="webauth" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />
                </Box>

                <Box className={clsx(kcClsx("kcFormGroupClass"), "no-bottom-margin")}>
                    {authenticators && (
                        <>
                            {/* Hidden authenticator selector form */}
                            <Box component="form" id="authn_select" className={kcClsx("kcFormClass")}>
                                {authenticators.authenticators.map(authenticator => (
                                    <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                                ))}
                            </Box>

                            {shouldDisplayAuthenticators && (
                                <>
                                    {authenticators.authenticators.length > 1 && (
                                        <Typography variant="subtitle1" className={kcClsx("kcSelectAuthListItemTitle")} sx={{ mt: 2 }}>
                                            {msg("webauthn-available-authenticators")}
                                        </Typography>
                                    )}

                                    {/* OTP-style card list */}
                                    <Box className={kcClsx("kcFormOptionsClass")} sx={{ mt: 2 }}>
                                        {authenticators.authenticators.map((authenticator, i) => (
                                            <Box
                                                key={i}
                                                id={`kc-webauthn-authenticator-item-${i}`}
                                                sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 1,
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                    p: 1,
                                                    cursor: "pointer",
                                                    "&:hover": { backgroundColor: "action.hover" }
                                                }}
                                                onClick={() => {
                                                    const input = document.querySelector<HTMLInputElement>(
                                                        `input[name="authn_use_chk"][value="${authenticator.credentialId}"]`
                                                    );
                                                    input?.dispatchEvent(new Event("change", { bubbles: true }));
                                                }}
                                            >
                                                {/* Icon */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 1,
                                                        backgroundColor: "action.selected",
                                                        mr: 1,
                                                        color: "text.primary"
                                                    }}
                                                >
                                                    {getAuthenticatorIcon(authenticator)}
                                                </Box>

                                                {/* Text */}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    {/* Authenticator label */}
                                                    <Typography id={`kc-webauthn-authenticator-label-${i}`} variant="body2" fontWeight={500}>
                                                        {typeof authenticator.label === "string"
                                                            ? authenticator.label
                                                            : advancedMsg(authenticator.label)}
                                                    </Typography>

                                                    {(authenticator.transports?.displayNameProperties ?? []).length > 0 && (
                                                        <Typography
                                                            id={`kc-webauthn-authenticator-transport-${i}`}
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {(authenticator.transports.displayNameProperties ?? [])
                                                                .map(prop => (typeof prop === "string" ? prop : advancedMsg(prop)))
                                                                .join(", ")}
                                                        </Typography>
                                                    )}

                                                    <Typography variant="caption" color="text.secondary">
                                                        {(authenticator.transports?.displayNameProperties ?? []).length > 0 ? " " : ""}
                                                        {msg("webauthn-createdAt-label")} {authenticator.createdAt}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </>
                    )}

                    <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")} sx={{ mt: 3 }}>
                        <Button
                            id={authButtonId}
                            autoFocus
                            fullWidth
                            variant="contained"
                            tabIndex={7}
                            onClick={() => {
                                const btn = document.getElementById(authButtonId) as HTMLInputElement | null;
                                btn?.click();
                            }}
                        >
                            {msgStr("webauthn-doAuthenticate")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Template>
    );
}

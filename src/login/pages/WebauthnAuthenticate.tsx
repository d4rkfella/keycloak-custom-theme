import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import KeyIcon from "@mui/icons-material/VpnKey";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import UsbIcon from "@mui/icons-material/Usb";
import TapAndPlayIcon from "@mui/icons-material/TapAndPlay";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;
    const { msg, msgStr, advancedMsg } = i18n;
    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    const getAuthenticatorIcon = (authenticator: (typeof authenticators.authenticators)[0]) => {
        const transports = authenticator.transports.displayNameProperties ?? [];

        for (const t of transports) {
            let labelStr: string;
            if (typeof t === "string") labelStr = t;
            else {
                const advanced = advancedMsg(t);
                labelStr = typeof advanced === "string" ? advanced : "";
            }

            const type = labelStr.toLowerCase();
            if (type.includes("internal")) return <SmartphoneIcon />;
            if (type.includes("usb")) return <UsbIcon />;
            if (type.includes("nfc")) return <TapAndPlayIcon />;
            if (type.includes("ble")) return <BluetoothIcon />;
            if (type.includes("platform")) return <LaptopMacIcon />;
        }

        return <KeyIcon />;
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography sx={{ textAlign: "center" }} variant="body2">
                    {msg("noAccount")}{" "}
                    <Link tabIndex={6} href={url.registrationUrl} underline="hover">
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <Box id="kc-form-webauthn">
                {/* Hidden inputs required by Keycloak */}
                <form id="webauth" action={url.loginAction} method="post">
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="authenticatorData" name="authenticatorData" />
                    <input type="hidden" id="signature" name="signature" />
                    <input type="hidden" id="credentialId" name="credentialId" />
                    <input type="hidden" id="userHandle" name="userHandle" />
                    <input type="hidden" id="error" name="error" />
                </form>

                {authenticators && (
                    <form id="authn_select">
                        {authenticators.authenticators.map(authenticator => (
                            <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                        ))}
                    </form>
                )}

                <Stack spacing={5}>
                    {shouldDisplayAuthenticators && authenticators && (
                        <List
                            disablePadding
                            dense
                            subheader={
                                authenticators.authenticators.length > 1 ? (
                                    <ListSubheader disableGutters sx={{ fontSize: "1.3rem" }} disableSticky>
                                        <Divider variant="middle">{msg("webauthn-available-authenticators")}</Divider>
                                    </ListSubheader>
                                ) : undefined
                            }
                        >
                            {authenticators.authenticators.map((authenticator, i) => (
                                <ListItem dense divider disableGutters key={i}>
                                    <ListItemIcon>{getAuthenticatorIcon(authenticator)}</ListItemIcon>
                                    <ListItemText
                                        primary={typeof authenticator.label === "string" ? authenticator.label : advancedMsg(authenticator.label)}
                                        secondary={
                                            <>
                                                {(authenticator.transports?.displayNameProperties ?? []).join(", ")}
                                                <br />
                                                {msg("webauthn-createdAt-label")} {authenticator.createdAt}
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}

                    <Button id={authButtonId} type="button" autoFocus variant="contained" tabIndex={7}>
                        {msgStr("webauthn-doAuthenticate")}
                    </Button>
                </Stack>
            </Box>
        </Template>
    );
}

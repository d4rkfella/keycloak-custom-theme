import { Box, Button } from "@mui/material";

interface WebAuthnSectionProps {
    enableWebAuthnConditionalUI?: boolean;
    url: { loginAction: string };
    authenticators?: { authenticators: Array<{ credentialId: string }> };
    webAuthnButtonId: string;
    buttonLabel: string;
}

export function WebAuthnSection({
    enableWebAuthnConditionalUI,
    url,
    authenticators,
    webAuthnButtonId,
    buttonLabel
}: WebAuthnSectionProps) {
    if (!enableWebAuthnConditionalUI) {
        return null;
    }

    return (
        <Box>
            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            {authenticators?.authenticators.length ? (
                <form id="authn_select">
                    {authenticators.authenticators.map((authenticator, i) => (
                        <input
                            key={i}
                            type="hidden"
                            name="authn_use_chk"
                            readOnly
                            value={authenticator.credentialId}
                        />
                    ))}
                </form>
            ) : null}

            <Button
                type="button"
                id={webAuthnButtonId}
                variant="contained"
                color="secondary"
            >
                {buttonLabel}
            </Button>
        </Box>
    );
}

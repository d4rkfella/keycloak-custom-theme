import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, oauth, client } = kcContext;
    const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={
                <>
                    {client.attributes.logoUri && <img src={client.attributes.logoUri} />}
                    <p>{client.name ? msg("oauthGrantTitle", advancedMsgStr(client.name)) : msg("oauthGrantTitle", client.clientId)}</p>
                </>
            }
        >
            <List disablePadding dense>
                <Stack spacing={1.5}>
                    <ListSubheader sx={{ color: "primary.main" }} disableGutters disableSticky>
                        <Typography variant="h2">{msg("oauthGrantRequest")}</Typography>
                    </ListSubheader>
                    <Stack spacing={1}>
                        {oauth.clientScopesRequested.map(clientScope => (
                            <ListItem disablePadding disableGutters key={clientScope.consentScreenText}>
                                <Typography variant="body2" component="div">
                                    {advancedMsg(clientScope.consentScreenText)}
                                    {clientScope.dynamicScopeParameter && <Box component="span">: {clientScope.dynamicScopeParameter}</Box>}
                                </Typography>
                            </ListItem>
                        ))}
                    </Stack>
                </Stack>
            </List>

            {(client.attributes.policyUri || client.attributes.tosUri) && (
                <Stack spacing={1.5}>
                    <Typography color="primary" variant="h2">
                        {client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                    </Typography>
                    <Stack spacing={1}>
                        {client.attributes.tosUri && (
                            <Typography variant="body2">
                                {msg("oauthGrantReview")}{" "}
                                <Link href={client.attributes.tosUri} target="_blank" rel="noopener noreferrer">
                                    {msg("oauthGrantTos")}
                                </Link>
                            </Typography>
                        )}

                        {client.attributes.policyUri && (
                            <Typography variant="body2">
                                {msg("oauthGrantReview")}{" "}
                                <Link href={client.attributes.policyUri} target="_blank" rel="noopener noreferrer">
                                    {msg("oauthGrantPolicy")}
                                </Link>
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            )}

            <Box component="form" action={url.oauthAction} method="POST">
                <input type="hidden" name="code" value={oauth.code} />
                <Stack spacing={2}>
                    <Button type="submit" name="accept" variant="contained">
                        {msgStr("doYes")}
                    </Button>
                    <Button type="submit" name="cancel" variant="outlined">
                        {msgStr("doNo")}
                    </Button>
                </Stack>
            </Box>
        </Template>
    );
}

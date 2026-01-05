import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

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
            bodyClassName={`oauth ${classes?.kcBodyClass ?? ""}`}
            headerNode={
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
                    {client.attributes.logoUri && (
                        <Box component="img" src={client.attributes.logoUri} alt={`${client.name} logo`} sx={{ maxHeight: 48 }} />
                    )}
                    <Typography variant="h4" component="p">
                        {client.name ? msg("oauthGrantTitle", advancedMsgStr(client.name)) : msg("oauthGrantTitle", client.clientId)}
                    </Typography>
                </Box>
            }
        >
            <Box id="kc-oauth" className="content-area">
                <Typography variant="h6" gutterBottom>
                    {msg("oauthGrantRequest")}
                </Typography>

                <List>
                    {oauth.clientScopesRequested.map(clientScope => (
                        <ListItem key={clientScope.consentScreenText} sx={{ pl: 0 }}>
                            <Typography variant="body2">
                                {advancedMsg(clientScope.consentScreenText)}
                                {clientScope.dynamicScopeParameter && (
                                    <Typography component="span" fontWeight={700}>
                                        : {clientScope.dynamicScopeParameter}
                                    </Typography>
                                )}
                            </Typography>
                        </ListItem>
                    ))}
                </List>

                {(client.attributes.policyUri || client.attributes.tosUri) && (
                    <Box mt={2}>
                        <Typography variant="h6">
                            {client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                        </Typography>

                        {client.attributes.tosUri && (
                            <Typography variant="body2">
                                {msg("oauthGrantReview")}{" "}
                                <Link href={client.attributes.tosUri} target="_blank" rel="noopener">
                                    {msg("oauthGrantTos")}
                                </Link>
                            </Typography>
                        )}

                        {client.attributes.policyUri && (
                            <Typography variant="body2">
                                {msg("oauthGrantReview")}{" "}
                                <Link href={client.attributes.policyUri} target="_blank" rel="noopener">
                                    {msg("oauthGrantPolicy")}
                                </Link>
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Form buttons */}
                <Box component="form" action={url.oauthAction} method="POST" mt={3} display="flex" flexDirection="column" gap={2}>
                    <input type="hidden" name="code" value={oauth.code} />

                    <Button type="submit" name="accept" variant="contained" size="large" fullWidth>
                        {msgStr("doYes")}
                    </Button>
                    <Button type="submit" name="cancel" variant="outlined" size="large" fullWidth>
                        {msgStr("doNo")}
                    </Button>
                </Box>
            </Box>
        </Template>
    );
}

import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Typography, List, ListItem, Button, Stack } from "@mui/material";

export default function FrontchannelLogout(props: PageProps<Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { logout } = kcContext;
    const { msg, msgStr } = i18n;

    const [iframeLoadCount, setIframeLoadCount] = useState(0);

    useEffect(() => {
        if (!logout.logoutRedirectUri) return;
        if (iframeLoadCount !== logout.clients.length) return;

        window.location.replace(logout.logoutRedirectUri);
    }, [iframeLoadCount, logout.logoutRedirectUri, logout.clients.length]);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            documentTitle={msgStr("frontchannel-logout.title")}
            headerNode={msg("frontchannel-logout.title")}
        >
            <Stack spacing={2} id="kc-frontchannel-logout">
                <Typography component="p" variant="body1">
                    {msg("frontchannel-logout.message")}
                </Typography>

                <List disablePadding sx={{ pl: 2 }}>
                    {logout.clients.map(client => (
                        <ListItem disablePadding dense key={client.name} sx={{ display: "list-item", listStyleType: "disc" }}>
                            <Typography variant="body1">{client.name}</Typography>
                            <iframe
                                src={client.frontChannelLogoutUrl}
                                style={{ display: "none" }}
                                onLoad={() => setIframeLoadCount(count => count + 1)}
                            />
                        </ListItem>
                    ))}
                </List>
            </Stack>

            {logout.logoutRedirectUri && (
                <Button id="continue" variant="contained" href={logout.logoutRedirectUri}>
                    {msg("doContinue")}
                </Button>
            )}
        </Template>
    );
}

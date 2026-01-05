import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function FrontchannelLogout(props: PageProps<Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { logout } = kcContext;
    const { msg, msgStr } = i18n;

    const [iframeLoadCount, setIframeLoadCount] = useState(0);

    useEffect(() => {
        if (!kcContext.logout.logoutRedirectUri) {
            return;
        }
        if (iframeLoadCount !== kcContext.logout.clients.length) {
            return;
        }
        window.location.replace(kcContext.logout.logoutRedirectUri);
    }, [iframeLoadCount]);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            documentTitle={msgStr("frontchannel-logout.title")}
            headerNode={msg("frontchannel-logout.title")}
        >
            <Typography variant="body1" sx={{ mb: 3 }}>
                {msg("frontchannel-logout.message")}
            </Typography>

            <List sx={{ mb: 3 }}>
                {logout.clients.map(client => (
                    <ListItem key={client.name}>
                        <ListItemText primary={client.name} />
                        <iframe
                            src={client.frontChannelLogoutUrl}
                            style={{ display: "none" }}
                            onLoad={() => {
                                setIframeLoadCount(count => count + 1);
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            {logout.logoutRedirectUri !== undefined && (
                <Button sx={{ width: "100%" }} variant="contained" id="continue" href={logout.logoutRedirectUri}>
                    {msg("doContinue")}
                </Button>
            )}
        </Template>
    );
}

import { useState, useRef, useEffect, useCallback } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import {
    Box,
    Button,
    TextField,
    IconButton,
    InputAdornment,
    Link,
    Checkbox,
    FormControlLabel,
    Typography,
    Divider,
    Stack,
    useTheme
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { WebAuthnSection } from "../components/WebAuthnSection";

export function SocialProviderCarousel({ providers }: { providers: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCarousel, setShowCarousel] = useState(false);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const providerBrandColors: Record<string, string> = {
        bitbucket: "#2684FF",
        facebook: "#1877F2",
        gitlab: "#FF7F3F",
        github: "#FFFFFF",
        google: "#4285F4",
        linkedin: "#0A66C2",
        microsoft: "#00A4EF",
        openshift: "#EE0000",
        paypal: "#00457C",
        stackoverflow: "#F48024",
        twitter: "#1DA1F2",
        instagram: "#E4405F"
    };

    const updateCarouselState = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const needsCarousel = container.scrollWidth > container.clientWidth + 1;

        setShowCarousel(needsCarousel);

        if (needsCarousel) {
            setShowPrev(container.scrollLeft > 1);
            setShowNext(container.scrollLeft + container.clientWidth + 1 < container.scrollWidth);
        } else {
            setShowPrev(false);
            setShowNext(false);
        }
    }, []);

    const scrollByItem = (direction: "prev" | "next") => {
        const container = containerRef.current;
        if (!container) return;

        const children = Array.from(container.children) as HTMLElement[];
        if (!children.length) return;

        const firstItem = children[0];
        const style = getComputedStyle(firstItem);
        const gap = parseInt(style.marginRight || "0");
        const itemWidth = firstItem.offsetWidth + gap;

        const scrollAmount = direction === "next" ? itemWidth : -itemWidth;

        container.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rafId: number;
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateCarouselState);
        });

        ro.observe(container);
        container.addEventListener("scroll", updateCarouselState, { passive: true });

        rafId = requestAnimationFrame(() => {
            rafId = requestAnimationFrame(updateCarouselState);
        });

        return () => {
            ro.disconnect();
            container.removeEventListener("scroll", updateCarouselState);
            cancelAnimationFrame(rafId);
        };
    }, [updateCarouselState]);

    return (
        <Stack
            id="kc-social-providers-carousel"
            justifyContent={showCarousel ? "flex-start" : "center"}
            direction="row"
            alignItems="center"
            spacing={0.5}
        >
            {showCarousel && (
                <IconButton
                    edge="start"
                    onClick={() => scrollByItem("prev")}
                    disabled={!showPrev}
                    sx={{
                        zIndex: 10,
                        color: "rgba(255, 255, 255, 0.9)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                        "&.Mui-disabled": {
                            color: "rgba(255, 255, 255, 0.3)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>
            )}

            <Box
                ref={containerRef}
                sx={{
                    overflowX: "auto",
                    display: "flex",
                    gap: 2,
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                    maxWidth: "100%",
                    flexWrap: "nowrap",
                    paddingTop: 0.5,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": { display: "none" }
                }}
            >
                {providers.map(p => {
                    const brandColor = providerBrandColors[p.alias] ?? "#FFF";
                    return (
                        <Box key={p.alias} sx={{ flex: "0 0 auto", scrollSnapAlign: "start" }}>
                            <Button
                                href={p.loginUrl}
                                variant="outlined"
                                sx={{
                                    width: 100,
                                    height: 64,
                                    background: "rgba(255, 255, 255, 0.05)",
                                    backdropFilter: "blur(10px)",
                                    display: "flex",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    borderRadius: "16px",
                                    color: "text.primary",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "rgba(255, 255, 255, 0.15)",
                                        border: "1px solid rgba(255, 255, 255, 0.4)",
                                        transform: "translateY(-1px)",
                                        boxShadow: `0 2px 6px 0 ${brandColor}55`
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        fontSize: 24,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 0.5,
                                        "& i::before": {
                                            color: `${brandColor}`,
                                            filter: `drop-shadow(0 0 2px ${brandColor}) drop-shadow(0 0 8px ${brandColor}80)`
                                        }
                                    }}
                                >
                                    <i className={p.iconClasses} aria-hidden />
                                </Box>
                                <Typography variant="caption">{p.displayName}</Typography>
                            </Button>
                        </Box>
                    );
                })}
            </Box>

            {showCarousel && (
                <IconButton
                    edge="end"
                    onClick={() => scrollByItem("next")}
                    disabled={!showNext}
                    sx={{
                        zIndex: 10,
                        color: "rgba(255, 255, 255, 0.9)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                        "&.Mui-disabled": {
                            color: "rgba(255, 255, 255, 0.3)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                        }
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            )}
        </Stack>
    );
}

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;
    const { msg, msgStr } = i18n;

    const theme = useTheme();
    console.log("Theme palette:", theme.palette);
    console.log("Button styles:", theme.components?.MuiButton);
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({ webAuthnButtonId, kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography id="kc-registration-description" variant="body2">
                    {msg("noAccount")}{" "}
                    <Link id="kc-registration-link" tabIndex={8} href={url.registrationUrl} underline="hover">
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            socialProvidersNode={
                realm.password && social?.providers?.length ? (
                    <Stack id="kc-social-providers" spacing={2}>
                        <Divider id="kc-social-providers-divider">
                            <Typography variant="body2" color="text.secondary">
                                {msg("identity-provider-login-label")}
                            </Typography>
                        </Divider>

                        <SocialProviderCarousel providers={social.providers} />
                    </Stack>
                ) : null
            }
        >
            {realm.password && (
                <Stack
                    spacing={3}
                    component="form"
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                >
                    <Stack spacing={2}>
                        {!usernameHidden && (
                            <TextField
                                tabIndex={2}
                                name="username"
                                autoFocus
                                autoComplete="username"
                                label={
                                    !realm.loginWithEmailAllowed
                                        ? msg("username")
                                        : !realm.registrationEmailAsUsername
                                          ? msg("usernameOrEmail")
                                          : msg("email")
                                }
                                defaultValue={login.username ?? ""}
                                error={messagesPerField.existsError("username", "password")}
                                helperText={
                                    messagesPerField.existsError("username", "password") ? (
                                        <span
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    ) : null
                                }
                            />
                        )}

                        <TextField
                            tabIndex={3}
                            name="password"
                            id="outlined-adornment-password"
                            label={msg("password")}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            error={messagesPerField.existsError("username", "password")}
                            helperText={
                                usernameHidden &&
                                messagesPerField.existsError("username", "password") && (
                                    <span
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )
                            }
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label={showPassword ? "hide the password" : "display the password"}
                                                onClick={() => setShowPassword(show => !show)}
                                                onMouseDown={event => event.preventDefault()}
                                                onMouseUp={event => event.preventDefault()}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                        {(realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "nowrap"
                                }}
                            >
                                {realm.rememberMe && !usernameHidden && (
                                    <FormControlLabel
                                        control={<Checkbox size="medium" defaultChecked={!!login.rememberMe} tabIndex={5} name="rememberMe" />}
                                        label={<Typography variant="body2">{msg("rememberMe")}</Typography>}
                                    />
                                )}
                                {realm.resetPasswordAllowed && (
                                    <Link
                                        variant="body2"
                                        tabIndex={6}
                                        href={url.loginResetCredentialsUrl}
                                        underline="hover"
                                        sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                                    >
                                        {msg("doForgotPassword")}
                                    </Link>
                                )}
                            </Box>
                        ) : null}
                    </Stack>
                    <Box>
                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                        <Button tabIndex={7} variant="contained" type="submit" loading={isLoginButtonDisabled}>
                            {msg("doLogIn")}
                        </Button>
                    </Box>
                </Stack>
            )}

            <WebAuthnSection
                enableWebAuthnConditionalUI={enableWebAuthnConditionalUI}
                url={url}
                authenticators={authenticators}
                webAuthnButtonId={webAuthnButtonId}
                buttonLabel={msgStr("passkey-doAuthenticate")}
            />
        </Template>
    );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";
/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            "trusted-device-display-name": "Trusted device",
            "trusted-device-help-text": "Trusted devices are verified automatically.",
            "trusted-device-header": "Trust this device?",
            "trusted-device-yes": "Yes",
            "trusted-device-no": "No",
            "trusted-device-explanation":
                "Trusted devices do not need a second factor. Do not trust public or shared machines.",
            "trusted-device-name": "Device Name",
            acceptTermsPrefix: "I have read and agree to the",
            acceptTermsLink: "terms and conditions"
        },
        ca: {
            "trusted-device-display-name": "Dispositiu de confiança",
            "trusted-device-help-text":
                "Els dispositius de confiança es comproven automàticament",
            "trusted-device-header": "Confies en aquest dispositiu?",
            "trusted-device-yes": "Sí",
            "trusted-device-no": "No",
            "trusted-device-explanation":
                "El segon factor ja no es demanarà en un dispositiu de confiança. No confieu mai en ordinadors públics o compartits.",
            "trusted-device-name": "Nom d'aquest dispositiu",
            acceptTermsPrefix: "He llegit i accepto els",
            acceptTermsLink: "termes i condicions"
        },
        de: {
            "trusted-device-display-name": "Vertrauenswürdiges Gerät",
            "trusted-device-help-text":
                "Vertrauenswürdige Geräte werden automatisch überprüft",
            "trusted-device-header": "Diesem Gerät vertrauen?",
            "trusted-device-yes": "Ja",
            "trusted-device-no": "Nein",
            "trusted-device-explanation":
                "Der zweite Faktor wird auf einem vertrauenswürdigen Gerät nicht mehr angefordert. Vertrauen Sie niemals öffentlichen oder gemeinsam genutzten Computern.",
            "trusted-device-name": "Name dieses Geräts",
            acceptTermsPrefix: "Ich habe die",
            acceptTermsLink: "Allgemeinen Geschäftsbedingungen"
        },
        es: {
            "trusted-device-display-name": "Dispositivo de confianza",
            "trusted-device-help-text":
                "Los dispositivos de confianza se verifican automáticamente",
            "trusted-device-header": "¿Confiar en este dispositivo?",
            "trusted-device-yes": "Sí",
            "trusted-device-no": "No",
            "trusted-device-explanation":
                "El segundo factor ya no se solicitará en un dispositivo de confianza. Nunca confíes en ordenadores públicos o compartidos.",
            "trusted-device-name": "Nombre de este dispositivo",
            acceptTermsPrefix: "He leído y acepto los",
            acceptTermsLink: "términos y condiciones"
        },
        fr: {
            "trusted-device-display-name": "Appareil de confiance",
            "trusted-device-help-text":
                "Les appareils de confiance sont vérifiés automatiquement",
            "trusted-device-header": "Faire confiance à cet appareil ?",
            "trusted-device-yes": "Oui",
            "trusted-device-no": "Non",
            "trusted-device-explanation":
                "Le deuxième facteur ne sera plus demandé sur un appareil de confiance. Ne jamais faire confiance à des ordinateurs publics ou partagés.",
            "trusted-device-name": "Nom de cet appareil",
            acceptTermsPrefix: "J'ai lu et j'accepte les",
            acceptTermsLink: "termes et conditions"
        },
        it: {
            "trusted-device-display-name": "Dispositivo attendibile",
            "trusted-device-help-text":
                "I dispositivi attendibili vengono controllati automaticamente",
            "trusted-device-header": "Fidati di questo dispositivo?",
            "trusted-device-yes": "Sì",
            "trusted-device-no": "No",
            "trusted-device-explanation":
                "Il secondo fattore non sarà più richiesto su un dispositivo attendibile. Non fidarti mai dei computer pubblici o condivisi.",
            "trusted-device-name": "Nome di questo dispositivo",
            acceptTermsPrefix: "Ho letto e accetto i",
            acceptTermsLink: "termini e condizioni"
        }
    })
    .build();
type I18n = typeof ofTypeI18n;
export { useI18n, type I18n };

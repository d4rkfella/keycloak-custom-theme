import type { JSX } from "keycloakify/tools/JSX";
import { useEffect, Fragment, useState } from "react";
import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { I18n } from "./i18n";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Radio,
    RadioGroup,
    Select,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps): JSX.Element {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;
    const theme = useTheme();

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({ kcContext, i18n, doMakeUserConfirmPassword });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => (
                <Fragment key={attribute.name}>
                    <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} theme={theme} />

                    {BeforeField && (
                        <BeforeField
                            attribute={attribute}
                            dispatchFormAction={dispatchFormAction}
                            displayableErrors={displayableErrors}
                            valueOrValues={valueOrValues}
                            kcClsx={kcClsx}
                            i18n={i18n}
                        />
                    )}

                    {attribute.annotations.inputType !== "hidden" && !(attribute.name === "password-confirm" && !doMakeUserConfirmPassword) && (
                        <>
                            {attribute.annotations.inputHelperTextBefore && (
                                <Typography variant="body2" color="text.secondary">
                                    {i18n.advancedMsgStr(attribute.annotations.inputHelperTextBefore)}
                                </Typography>
                            )}

                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                kcClsx={kcClsx}
                                i18n={i18n}
                                theme={theme}
                            />

                            {attribute.annotations.inputHelperTextAfter && (
                                <Typography variant="body2" color="text.secondary">
                                    {i18n.advancedMsgStr(attribute.annotations.inputHelperTextAfter)}
                                </Typography>
                            )}

                            {AfterField && (
                                <AfterField
                                    attribute={attribute}
                                    dispatchFormAction={dispatchFormAction}
                                    displayableErrors={displayableErrors}
                                    valueOrValues={valueOrValues}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />
                            )}
                        </>
                    )}
                </Fragment>
            ))}
        </>
    );
}

function GroupLabel({ attribute, groupNameRef, i18n }: { attribute: Attribute; groupNameRef: { current: string }; i18n: I18n; theme: any }) {
    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current) {
            assert(attribute.group !== undefined);

            const headerText = attribute.group.displayHeader ? i18n.advancedMsgStr(attribute.group.displayHeader) : attribute.group.name;

            const descriptionText = attribute.group.displayDescription ? i18n.advancedMsgStr(attribute.group.displayDescription) : "";

            return (
                <Stack
                    spacing={1}
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    <Typography variant="h6">{headerText}</Typography>
                    {descriptionText && (
                        <Typography variant="body2" color="text.secondary">
                            {descriptionText}
                        </Typography>
                    )}
                </Stack>
            );
        }
    }
    return null;
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
    theme: any;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        case "hidden":
            return <input type="hidden" name={attribute.name} value={valueOrValues} />;
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default:
            if (Array.isArray(valueOrValues)) {
                return (
                    <Stack spacing={1}>
                        {valueOrValues.map((_, i) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </Stack>
                );
            }
            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return <PasswordInputTag {...props} fieldIndex={undefined} />;
            }
            return <InputTag {...props} fieldIndex={undefined} />;
    }
}

function PasswordInputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;
    const { advancedMsgStr, msgStr } = i18n;
    const [showPassword, setShowPassword] = useState(false);

    assert(typeof valueOrValues === "string");

    return (
        <TextField
            sx={{ width: "100%" }}
            variant="outlined"
            id={attribute.name}
            name={attribute.name}
            label={advancedMsgStr(attribute.displayName ?? "")}
            type={showPassword ? "text" : "password"}
            value={valueOrValues}
            required={attribute.required}
            error={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            autoComplete={attribute.autocomplete}
            onChange={event => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: event.target.value })}
            onBlur={() => dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: undefined })}
            helperText={
                displayableErrors.length > 0 && (
                    <span style={{ whiteSpace: "pre-line" }}>
                        {displayableErrors.map((e, i) => (
                            <Fragment key={i}>
                                {typeof e.errorMessage === "string" ? advancedMsgStr(e.errorMessage) : e.errorMessage}
                                {i < displayableErrors.length - 1 && <br />}
                            </Fragment>
                        ))}
                    </span>
                )
            }
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? msgStr("hidePassword") : msgStr("showPassword")}
                                onClick={() => setShowPassword(show => !show)}
                                onMouseDown={event => event.preventDefault()}
                                onMouseUp={event => event.preventDefault()}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                },
                formHelperText: {
                    sx: { whiteSpace: "pre-line" }
                }
            }}
        />
    );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors, theme } = props;
    const { advancedMsgStr } = i18n;

    const currentValue = fieldIndex !== undefined && Array.isArray(valueOrValues) ? valueOrValues[fieldIndex] : valueOrValues;

    return (
        <>
            <TextField
                sx={{ width: "100%" }}
                variant="outlined"
                type={
                    attribute.annotations.inputType?.startsWith("html5-")
                        ? attribute.annotations.inputType.slice(6)
                        : (attribute.annotations.inputType ?? "text")
                }
                id={attribute.name}
                name={attribute.name}
                label={advancedMsgStr(attribute.displayName ?? "")}
                required={attribute.required}
                value={currentValue}
                error={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={attribute.annotations.inputTypePlaceholder && advancedMsgStr(attribute.annotations.inputTypePlaceholder)}
                inputProps={{
                    pattern: attribute.annotations.inputTypePattern,
                    size: attribute.annotations.inputTypeSize ? parseInt(`${attribute.annotations.inputTypeSize}`) : undefined,
                    maxLength: attribute.annotations.inputTypeMaxlength ? parseInt(`${attribute.annotations.inputTypeMaxlength}`) : undefined,
                    minLength: attribute.annotations.inputTypeMinlength ? parseInt(`${attribute.annotations.inputTypeMinlength}`) : undefined,
                    max: attribute.annotations.inputTypeMax,
                    min: attribute.annotations.inputTypeMin,
                    step: attribute.annotations.inputTypeStep,
                    ...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))
                }}
                onChange={event => {
                    const newValue =
                        fieldIndex !== undefined && Array.isArray(valueOrValues)
                            ? valueOrValues.map((v, i) => (i === fieldIndex ? event.target.value : v))
                            : event.target.value;
                    dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: newValue });
                }}
                onBlur={() => dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex })}
                helperText={displayableErrors
                    .filter(error => error.fieldIndex === fieldIndex)
                    .map((e, i, arr) => (
                        <Fragment key={i}>
                            {typeof e.errorMessage === "string" ? advancedMsgStr(e.errorMessage) : e.errorMessage}
                            {i < arr.length - 1 && <br />}
                        </Fragment>
                    ))}
            />

            {fieldIndex !== undefined && Array.isArray(valueOrValues) && (
                <AddRemoveButtonsMultiValuedAttribute
                    attribute={attribute}
                    values={valueOrValues}
                    fieldIndex={fieldIndex}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                    theme={theme}
                />
            )}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
    theme: any;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
    const { msg } = i18n;
    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });
    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <Stack direction="row" spacing={2}>
            {hasRemove && (
                <Button
                    id={`kc-remove${idPostfix}`}
                    variant="text"
                    size="small"
                    onClick={() =>
                        dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: values.filter((_, i) => i !== fieldIndex) })
                    }
                >
                    {msg("remove")}
                </Button>
            )}
            {hasAdd && (
                <Button
                    id={`kc-add${idPostfix}`}
                    variant="text"
                    size="small"
                    onClick={() => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: [...values, ""] })}
                >
                    {msg("addValue")}
                </Button>
            )}
        </Stack>
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, valueOrValues, i18n } = props;
    const { advancedMsgStr } = i18n;

    assert(typeof valueOrValues === "string");

    return (
        <TextField
            sx={{ width: "100%" }}
            variant="outlined"
            multiline
            id={attribute.name}
            name={attribute.name}
            label={advancedMsgStr(attribute.displayName ?? "")}
            required={attribute.required}
            error={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            rows={attribute.annotations.inputTypeRows ? parseInt(`${attribute.annotations.inputTypeRows}`) : 4}
            inputProps={{ maxLength: attribute.annotations.inputTypeMaxlength ? parseInt(`${attribute.annotations.inputTypeMaxlength}`) : undefined }}
            value={valueOrValues}
            onChange={event => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: event.target.value })}
            onBlur={() => dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: undefined })}
            helperText={displayableErrors.map((e, i, arr) => (
                <Fragment key={i}>
                    {typeof e.errorMessage === "string" ? advancedMsgStr(e.errorMessage) : e.errorMessage}
                    {i < arr.length - 1 && <br />}
                </Fragment>
            ))}
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;
    const { advancedMsgStr } = i18n;

    const isMultiple = attribute.annotations.inputType === "multiselect";
    const options = (() => {
        const fromValidation = attribute.annotations.inputOptionsFromValidation;
        if (fromValidation) {
            const validator = (attribute.validators as Record<string, { options?: string[] }>)[fromValidation];
            if (validator?.options) return validator.options;
        }
        return attribute.validators.options?.options ?? [];
    })();

    return (
        <FormControl sx={{ width: "100%" }} variant="outlined" error={displayableErrors.length !== 0}>
            <InputLabel id={`${attribute.name}-label`} required={attribute.required}>
                {advancedMsgStr(attribute.displayName ?? "")}
            </InputLabel>
            <Select
                labelId={`${attribute.name}-label`}
                id={attribute.name}
                name={attribute.name}
                multiple={isMultiple}
                value={valueOrValues}
                required={attribute.required}
                disabled={attribute.readOnly}
                onChange={event => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: event.target.value })}
                onBlur={() => dispatchFormAction({ action: "focus lost", name: attribute.name, fieldIndex: undefined })}
                label={advancedMsgStr(attribute.displayName ?? "")}
            >
                {!isMultiple && <MenuItem value=""></MenuItem>}
                {options.map(option => (
                    <MenuItem key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </MenuItem>
                ))}
            </Select>
            {displayableErrors.length !== 0 && (
                <FormHelperText>
                    {displayableErrors.map((e, i, arr) => (
                        <Fragment key={i}>
                            {typeof e.errorMessage === "string" ? advancedMsgStr(e.errorMessage) : e.errorMessage}
                            {i < arr.length - 1 && <br />}
                        </Fragment>
                    ))}
                </FormHelperText>
            )}
        </FormControl>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues } = props;
    const { inputType } = attribute.annotations;

    assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

    const options = (() => {
        const fromValidation = attribute.annotations.inputOptionsFromValidation;
        if (fromValidation) {
            const validator = (attribute.validators as Record<string, { options?: string[] }>)[fromValidation];
            if (validator?.options) return validator.options;
        }
        return attribute.validators.options?.options ?? [];
    })();

    if (inputType === "select-radiobuttons") {
        return (
            <RadioGroup
                name={attribute.name}
                value={typeof valueOrValues === "string" ? valueOrValues : ""}
                onChange={event => dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: event.target.value })}
            >
                {options.map(option => (
                    <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio disabled={attribute.readOnly} />}
                        label={inputLabel(i18n, attribute, option)}
                    />
                ))}
            </RadioGroup>
        );
    }

    return (
        <Stack spacing={1}>
            {options.map(option => (
                <FormControlLabel
                    key={option}
                    control={
                        <Checkbox
                            id={`${attribute.name}-${option}`}
                            name={attribute.name}
                            value={option}
                            disabled={attribute.readOnly}
                            checked={Array.isArray(valueOrValues) ? valueOrValues.includes(option) : valueOrValues === option}
                            onChange={event => {
                                const isChecked = event.target.checked;
                                const newValue = Array.isArray(valueOrValues)
                                    ? isChecked
                                        ? [...valueOrValues, option]
                                        : valueOrValues.filter(v => v !== option)
                                    : isChecked
                                      ? option
                                      : "";
                                dispatchFormAction({ action: "update", name: attribute.name, valueOrValues: newValue });
                            }}
                        />
                    }
                    label={inputLabel(i18n, attribute, option)}
                />
            ))}
        </Stack>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    if (attribute.annotations.inputOptionLabels) {
        return i18n.advancedMsgStr(attribute.annotations.inputOptionLabels[option] ?? option);
    }
    if (attribute.annotations.inputOptionLabelsI18nPrefix) {
        return i18n.advancedMsgStr(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }
    return option;
}

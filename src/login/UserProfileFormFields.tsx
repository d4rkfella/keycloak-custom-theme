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
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Button from "@mui/material/Button";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps): JSX.Element {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <div
                            className={kcClsx("kcFormGroupClass")}
                            style={{
                                display:
                                    attribute.annotations.inputType === "hidden" ||
                                    (attribute.name === "password-confirm" && !doMakeUserConfirmPassword)
                                        ? "none"
                                        : undefined
                            }}
                        >
                            <div className={kcClsx("kcInputWrapperClass")}>
                                {attribute.annotations.inputHelperTextBefore !== undefined && (
                                    <div
                                        className={kcClsx("kcInputHelperTextBeforeClass")}
                                        id={`form-help-text-before-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {i18n.advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                    </div>
                                )}
                                <InputFieldByType
                                    attribute={attribute}
                                    valueOrValues={valueOrValues}
                                    displayableErrors={displayableErrors}
                                    dispatchFormAction={dispatchFormAction}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />
                                {attribute.annotations.inputHelperTextAfter !== undefined && (
                                    <div
                                        className={kcClsx("kcInputHelperTextAfterClass")}
                                        id={`form-help-text-after-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {i18n.advancedMsg(attribute.annotations.inputHelperTextAfter)}
                                    </div>
                                )}
                                {AfterField !== undefined && (
                                    <AfterField
                                        attribute={attribute}
                                        dispatchFormAction={dispatchFormAction}
                                        displayableErrors={displayableErrors}
                                        valueOrValues={valueOrValues}
                                        kcClsx={kcClsx}
                                        i18n={i18n}
                                    />
                                )}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n, kcClsx } = props;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className={kcClsx("kcFormGroupClass")}
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? i18n.advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <div className={kcClsx("kcContentWrapperClass")}>
                                <label id={`header-${attribute.group.name}`} className={kcClsx("kcFormGroupHeader")}>
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = i18n.advancedMsg(groupDisplayDescription);

                            return (
                                <div className={kcClsx("kcLabelWrapperClass")}>
                                    <label id={`description-${attribute.group.name}`} className={kcClsx("kcLabelClass")}>
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }

                        return null;
                    })()}
                </div>
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
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return <PasswordInputTag {...props} fieldIndex={undefined} />;
            }

            return <InputTag {...props} fieldIndex={undefined} />;
        }
    }
}

function PasswordInputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;
    const { advancedMsg, msgStr } = i18n;
    const [showPassword, setShowPassword] = useState(false);

    assert(typeof valueOrValues === "string");

    return (
        <FormControl sx={{ width: "100%", minWidth: 350 }} variant="outlined">
            <InputLabel htmlFor={attribute.name} required={attribute.required}>
                {advancedMsg(attribute.displayName ?? "")}
            </InputLabel>
            <OutlinedInput
                id={attribute.name}
                name={attribute.name}
                type={showPassword ? "text" : "password"}
                value={valueOrValues}
                required={attribute.required}
                error={displayableErrors.length !== 0}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={showPassword ? msgStr("hidePassword") : msgStr("showPassword")}
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={e => e.preventDefault()}
                            onMouseUp={e => e.preventDefault()}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={advancedMsg(attribute.displayName ?? "")}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            />
            {displayableErrors.length !== 0 && (
                <FormHelperText error>
                    {displayableErrors.map(({ errorMessage }, i) => (
                        <Fragment key={i}>
                            {errorMessage}
                            {i < displayableErrors.length - 1 && <br />}
                        </Fragment>
                    ))}
                </FormHelperText>
            )}
        </FormControl>
    );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

    const { advancedMsgStr, advancedMsg } = i18n;

    return (
        <>
            <TextField
                sx={{
                    width: "100%",
                    minWidth: 350
                }}
                variant="outlined"
                type={(() => {
                    const { inputType } = attribute.annotations;
                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }
                    return inputType ?? "text";
                })()}
                id={attribute.name}
                name={attribute.name}
                label={advancedMsg(attribute.displayName ?? "")}
                required={attribute.required}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }
                    assert(typeof valueOrValues === "string");
                    return valueOrValues;
                })()}
                error={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                inputProps={{
                    pattern: attribute.annotations.inputTypePattern,
                    size: attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`),
                    maxLength:
                        attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`),
                    minLength:
                        attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`),
                    max: attribute.annotations.inputTypeMax,
                    min: attribute.annotations.inputTypeMin,
                    step: attribute.annotations.inputTypeStep,
                    ...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))
                }}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);
                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }
                                    return value;
                                });
                            }
                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
                helperText={
                    displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined &&
                    displayableErrors.filter(error => error.fieldIndex === fieldIndex).map(({ errorMessage }) => errorMessage)
                }
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }
                assert(valueOrValues instanceof Array);
                const values = valueOrValues;
                return (
                    <AddRemoveButtonsMultiValuedAttribute
                        attribute={attribute}
                        values={values}
                        fieldIndex={fieldIndex}
                        dispatchFormAction={dispatchFormAction}
                        i18n={i18n}
                    />
                );
            })()}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <>
            {hasRemove && (
                <>
                    <Button
                        id={`kc-remove${idPostfix}`}
                        variant="text"
                        size="small"
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </Button>
                    {hasAdd ? <>&nbsp;|&nbsp;</> : null}
                </>
            )}
            {hasAdd && (
                <Button
                    id={`kc-add${idPostfix}`}
                    variant="text"
                    size="small"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </Button>
            )}
        </>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

    const { inputType } = attribute.annotations;

    assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    if (inputType === "select-radiobuttons") {
        return (
            <RadioGroup
                name={attribute.name}
                value={typeof valueOrValues === "string" ? valueOrValues : ""}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    })
                }
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
        <>
            {options.map(option => (
                <FormControlLabel
                    key={option}
                    control={
                        <Checkbox
                            id={`${attribute.name}-${option}`}
                            name={attribute.name}
                            value={option}
                            disabled={attribute.readOnly}
                            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                            onChange={event =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: (() => {
                                        const isChecked = event.target.checked;

                                        if (valueOrValues instanceof Array) {
                                            const newValues = [...valueOrValues];

                                            if (isChecked) {
                                                newValues.push(option);
                                            } else {
                                                newValues.splice(newValues.indexOf(option), 1);
                                            }

                                            return newValues;
                                        }

                                        return event.target.checked ? option : "";
                                    })()
                                })
                            }
                        />
                    }
                    label={inputLabel(i18n, attribute, option)}
                />
            ))}
        </>
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, valueOrValues, i18n } = props;

    const { advancedMsg } = i18n;

    assert(typeof valueOrValues === "string");

    const value = valueOrValues;

    return (
        <TextField
            sx={{
                width: "100%",
                minWidth: 350
            }}
            variant="outlined"
            multiline
            id={attribute.name}
            name={attribute.name}
            label={advancedMsg(attribute.displayName ?? "")}
            required={attribute.required}
            error={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            rows={attribute.annotations.inputTypeRows === undefined ? 4 : parseInt(`${attribute.annotations.inputTypeRows}`)}
            inputProps={{
                maxLength:
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
            }}
            value={value}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
            helperText={displayableErrors.length !== 0 && displayableErrors.map(({ errorMessage }) => errorMessage)}
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;

    const { advancedMsg } = i18n;

    const isMultiple = attribute.annotations.inputType === "multiselect";

    return (
        <FormControl sx={{ width: "100%", minWidth: 350, mb: 2 }} variant="outlined" error={displayableErrors.length !== 0}>
            <InputLabel id={`${attribute.name}-label`} required={attribute.required}>
                {advancedMsg(attribute.displayName ?? "")}
            </InputLabel>
            <Select
                labelId={`${attribute.name}-label`}
                id={attribute.name}
                name={attribute.name}
                label={advancedMsg(attribute.displayName ?? "")}
                required={attribute.required}
                disabled={attribute.readOnly}
                multiple={isMultiple}
                value={valueOrValues}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            >
                {!isMultiple && <MenuItem value=""></MenuItem>}
                {(() => {
                    const options = (() => {
                        walk: {
                            const { inputOptionsFromValidation } = attribute.annotations;

                            if (inputOptionsFromValidation === undefined) {
                                break walk;
                            }

                            assert(typeof inputOptionsFromValidation === "string");

                            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

                            if (validator === undefined) {
                                break walk;
                            }

                            if (validator.options === undefined) {
                                break walk;
                            }

                            return validator.options;
                        }

                        return attribute.validators.options?.options ?? [];
                    })();

                    return options.map(option => (
                        <MenuItem key={option} value={option}>
                            {inputLabel(i18n, attribute, option)}
                        </MenuItem>
                    ));
                })()}
            </Select>
            {displayableErrors.length !== 0 && (
                <FormHelperText>
                    {displayableErrors.map(({ errorMessage }, i) => (
                        <Fragment key={i}>
                            {errorMessage}
                            {i < displayableErrors.length - 1 && <br />}
                        </Fragment>
                    ))}
                </FormHelperText>
            )}
        </FormControl>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}

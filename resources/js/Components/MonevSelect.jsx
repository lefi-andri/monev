import React, { useId, useMemo } from 'react';
import Select from 'react-select';

export default function MonevSelect({
    options = [],
    value,
    onChange,
    onChangeValue,
    placeholder = 'Pilih...',
    isSearchable = true,
    isClearable = false,
    isDisabled = false,
    size = 'md', // 'sm' | 'md' | 'lg'
    className = '',
    menuPortal = true,
    noOptionsMessage = 'Pilihan tidak ditemukan',
    ...props
}) {
    const instanceId = useId();

    // Map primitive value to option object if needed
    const selectedOption = useMemo(() => {
        if (value === undefined || value === null) return null;
        if (typeof value === 'object' && value !== null && 'value' in value) return value;
        return options.find((opt) => String(opt.value) === String(value)) || null;
    }, [options, value]);

    const handleChange = (selected, actionMeta) => {
        const val = selected ? selected.value : null;
        if (onChangeValue) {
            onChangeValue(val, selected);
        }
        if (onChange) {
            onChange(selected, actionMeta);
        }
    };

    // Size-based dimensional tokens
    const dimensions = {
        sm: {
            minHeight: '36px',
            fontSize: '12px',
            borderRadius: '12px',
            paddingX: '8px',
            paddingY: '2px',
            optionPadding: '7px 12px',
        },
        md: {
            minHeight: '46px',
            fontSize: '14px',
            borderRadius: '16px',
            paddingX: '12px',
            paddingY: '4px',
            optionPadding: '10px 14px',
        },
        lg: {
            minHeight: '52px',
            fontSize: '15px',
            borderRadius: '18px',
            paddingX: '14px',
            paddingY: '6px',
            optionPadding: '12px 16px',
        },
    }[size] || dimensions.md;

    const customStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: dimensions.minHeight,
            fontSize: dimensions.fontSize,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            backgroundColor: state.isDisabled ? '#f8fafc' : '#ffffff',
            borderColor: state.isFocused
                ? '#075cdb'
                : state.isDisabled
                ? '#e2e8f0'
                : '#c5d4e8',
            borderRadius: dimensions.borderRadius,
            boxShadow: state.isFocused ? '0 0 0 3px rgba(7, 92, 219, 0.15)' : 'none',
            paddingLeft: dimensions.paddingX,
            paddingRight: '6px',
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
                borderColor: state.isFocused ? '#075cdb' : '#9bbde8',
            },
        }),
        valueContainer: (base) => ({
            ...base,
            padding: `${dimensions.paddingY} 0`,
        }),
        singleValue: (base) => ({
            ...base,
            color: '#071a3c',
            fontWeight: 600,
        }),
        placeholder: (base) => ({
            ...base,
            color: '#7f93ad',
            fontWeight: 500,
        }),
        input: (base) => ({
            ...base,
            color: '#071a3c',
            fontWeight: 600,
            margin: 0,
            padding: 0,
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? '#075cdb' : '#7f93ad',
            padding: '4px 6px',
            transition: 'transform 0.2s ease, color 0.15s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
            '&:hover': {
                color: '#075cdb',
            },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: '#94a3b8',
            padding: '4px',
            '&:hover': {
                color: '#ef4444',
            },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#ffffff',
            borderRadius: dimensions.borderRadius,
            border: '1px solid #d5e1ef',
            boxShadow:
                '0 12px 28px -4px rgba(7, 26, 60, 0.12), 0 8px 12px -6px rgba(7, 26, 60, 0.08)',
            overflow: 'hidden',
            marginTop: '6px',
            zIndex: 9999,
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        menuList: (base) => ({
            ...base,
            padding: '6px',
            maxHeight: '230px',
        }),
        option: (base, state) => ({
            ...base,
            fontSize: dimensions.fontSize,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: state.isSelected ? 700 : 500,
            padding: dimensions.optionPadding,
            borderRadius: '10px',
            marginBottom: '2px',
            cursor: 'pointer',
            backgroundColor: state.isSelected
                ? '#075cdb'
                : state.isFocused
                ? '#edf4ff'
                : 'transparent',
            color: state.isSelected
                ? '#ffffff'
                : state.isFocused
                ? '#075cdb'
                : '#071a3c',
            transition: 'background-color 0.12s ease, color 0.12s ease',
            '&:active': {
                backgroundColor: state.isSelected ? '#075cdb' : '#dbeafe',
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            fontSize: dimensions.fontSize,
            color: '#8c9cae',
            fontStyle: 'italic',
            padding: '12px',
        }),
    };

    return (
        <Select
            instanceId={instanceId}
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeholder={placeholder}
            isSearchable={isSearchable}
            isClearable={isClearable}
            isDisabled={isDisabled}
            styles={customStyles}
            menuPortalTarget={
                menuPortal && typeof document !== 'undefined' ? document.body : undefined
            }
            menuPosition={menuPortal ? 'fixed' : 'absolute'}
            noOptionsMessage={() => noOptionsMessage}
            className={`monev-select-container ${className}`}
            classNamePrefix="monev-select"
            {...props}
        />
    );
}

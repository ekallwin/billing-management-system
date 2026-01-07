import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange }) => {
    const [inputs, setInputs] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value) {
            const chars = value.split('');
            const newInputs = new Array(length).fill('');
            for (let i = 0; i < length; i++) {
                newInputs[i] = chars[i] || '';
            }
            setInputs(newInputs);
        } else {
            setInputs(new Array(length).fill(''));
        }
    }, [value, length]);

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newInputs = [...inputs];
        newInputs[index] = val.substring(val.length - 1);
        setInputs(newInputs);
        onChange(newInputs.join(''));

        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!inputs[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);
        if (!/^\d+$/.test(pastedData)) return;

        const chars = pastedData.split('');
        const newInputs = [...inputs];

        chars.forEach((char, index) => {
            if (index < length) {
                newInputs[index] = char;
            }
        });

        setInputs(newInputs);
        onChange(newInputs.join(''));

        const focusIndex = Math.min(chars.length, length - 1);
        if (inputRefs.current[focusIndex]) {
            inputRefs.current[focusIndex].focus();
        }
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {inputs.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="input-field"
                    style={{
                        width: '3rem',
                        height: '3.5rem',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        padding: 0,
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                    }}
                />
            ))}
        </div>
    );
};

export default OTPInput;

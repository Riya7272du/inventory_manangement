import { type CSSProperties } from 'react';

export const authStyles = {
    container: {
        background: 'radial-gradient(1200px 800px at 20% -10%, #1b2140 0%, #0e1220 55%, #0b0e1a 100%)',
        color: '#e6e9f2',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
    } as CSSProperties,

    card: {
        background: '#161a2f',
        borderColor: '#2a3156',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
    } as CSSProperties,

    logo: {
        background: 'linear-gradient(135deg, #6e8bff, #22c55e)',
        boxShadow: '0 6px 20px rgba(110,139,255,0.35)'
    } as CSSProperties,

    subtitle: {
        color: '#acb2c7'
    } as CSSProperties,

    link: {
        color: '#6e8bff',
        textDecoration: 'none',
        cursor: 'pointer'
    } as CSSProperties,

    smallText: {
        color: '#acb2c7',
        fontSize: '14px'
    } as CSSProperties
};
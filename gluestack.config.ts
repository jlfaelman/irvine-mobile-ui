// gluestack.config.ts
import { createConfig } from '@gluestack-style/react';


export const config = createConfig({
    tokens: {
        color: {
            base: '#ffffff',
            inverted: '#030712',
            muted: '#676c73',
            primary: '#488AFF',
            'primary-hover': '#355a9c',
            danger: '#dc2626',
            warning: '#fcd34d',
            success: '#2CAA4F',
            secondary: '#00569E',
            accent: '#495B7A',
        },
    },
    aliases: {
        bg: 'backgroundColor',
        p: 'padding',
        px: 'paddingHorizontal',
        py: 'paddingVertical',
        m: 'margin',
        mx: 'marginHorizontal',
        my: 'marginVertical',
        rounded: 'borderRadius',
        text: 'color',
    },
    themes: {
        light: {
            color: {
                backgroundColor: '$base',
                textColor: '$inverted',
                primary: '$primary',
            },
        },
    },
});

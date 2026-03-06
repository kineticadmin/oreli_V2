import { fr } from './fr';

// Very lightweight custom i18n resolver.
export function t(path: string, params?: Record<string, string | number>) {
    const keys = path.split('.');
    let result: any = fr;
    for (const key of keys) {
        if (result && result[key]) {
            result = result[key];
        } else {
            return path; // Fallback to path if missing
        }
    }

    if (typeof result !== 'string') return path;

    if (params) {
        Object.keys(params).forEach(key => {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(params[key]));
        });
    }

    return result;
}

import { Breakpoint, Theme, useMediaQuery, useTheme } from "@mui/material";
import md5 from "md5";

type BreakpointOrNull = Breakpoint | null;

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://legacy.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
export function useWidth() {
    const theme: Theme = useTheme();
    const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse();

    return (
        keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
            const matches = useMediaQuery(theme.breakpoints.up(key));

            return !output && matches ? key : output;
        }, null) || "xs"
    );
}

/**
 * This code takes an email address and returns a URL to the Gravatar
 * image associated with that email address. If no image is found, a
 * default "identicon" image is returned instead.
 **/
export function getEmailGravatarUrl(email: string) {
    // Trim whitespace and convert to lowercase.
    const trimmedEmail = email.trim().toLowerCase();

    // Hash the email address.
    const hash = trimmedEmail === "" ? "" : md5(trimmedEmail, { encoding: "binary" });

    // Build the Gravatar URL.
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

    return gravatarUrl;
}

/**
 * this function takes a url and a paramObject as input and returns a url with the paramObject appended to the end of the url as query parameters.
 *
 * for example:
 *
 * `encodeURLWithParams("https://example.com", {name: "John", age: 20})`
 *
 * returns "https://example.com?name=John&age=20"
 **/

export const encodeURLWithParams = (url: string, paramObject: any): string => {
    const searchParams = new URLSearchParams();
    Object.entries(paramObject).forEach(([key, value]) => searchParams.append(key, value as string));

    return `${url}?${searchParams.toString()}`;
};

// Returns an absolute URL from a relative path.
export const toAbsoluteUrl = (pathname: string): string => process.env.PUBLIC_URL + pathname;

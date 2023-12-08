import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from '@remix-run/react';
import './tailwind.css';
import './styles/main.css';

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&subset=latin&display=swap"
                rel="stylesheet"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <LiveReload/>
        <Scripts/>
        </body>
        </html>
    );
}

export function ErrorBoundary() {
    const error: any = useRouteError();
    console.error(error);
    return (
        <html>
        <head>
            <title>Error!</title>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
            <div className="rounded-2xl bg-white px-10 py-6 flex flex-col gap-3">
                <div>
                    <p className="text-xl text-center">{error.data || error.message}</p>
                </div>
                <div>
                    <p className="text-xs text-center">
                        Try to fix in:&nbsp;<a className="text-blue-700 hover:underline" href="/admin">Admin Panel</a>
                    </p>
                </div>
            </div>
        </div>
        <Scripts/>
        </body>
        </html>
    );
}

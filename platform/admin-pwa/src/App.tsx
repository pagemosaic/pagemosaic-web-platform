import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {SignUpRoute, signUpAction} from '@/roots/auth/SignUpRoute';
import {LoginRoute, loginAction} from '@/roots/auth/LoginRoute';
import {MainRoute, mainLoader, mainAction} from '@/roots/main/MainRoute';
import {PasswordRecoveryRoute, passwordRecoveryAction} from '@/roots/auth/PasswordRecoveryRoute';
import {PasswordResetConfirmRoute} from '@/roots/auth/PasswordResetConfirmRoute';
import {PasswordResetRoute, passwordResetAction} from '@/roots/auth/PasswordResetRoute';
import {SettingsRoute} from '@/features/settings/SettingsRoute';
import {SysUserProfileRoute} from '@/subfeatures/sysUserProfile/SysUserProfileRoute';
import {PagesRoute} from '@/features/pages/PagesRoute';
import {mainPageAction} from '@/subfeatures/mainPage/mainPage.action';
import {mainPageLoader, mainPageLoaderGuard} from '@/subfeatures/mainPage/mainPage.loader';
import {MainPageRoute} from '@/subfeatures/mainPage/MainPageRoute';
import {sysUserProfileLoaderGuard, sysUserProfileLoader} from '@/subfeatures/sysUserProfile/sysUserProfile.loader';
import {sysUserProfileAction} from '@/subfeatures/sysUserProfile/sysUserProfile.action';
import {WelcomeRoute} from '@/features/welcome/WelcomeRoute';

const router = createBrowserRouter([
    {
        id: 'main',
        path: '/',
        element: <MainRoute />,
        loader: mainLoader,
        action: mainAction,
        children: [
            {
                path: '',
                index: true,
                element: <WelcomeRoute />
            },
            {
                path: 'pages',
                element: <PagesRoute />,
                children: [
                    {
                        path: 'main-page',
                        action: mainPageAction,
                        loader: mainPageLoader,
                        shouldRevalidate: mainPageLoaderGuard,
                        element: <MainPageRoute />
                    }
                ]
            },
            {
                path: 'settings',
                element: <SettingsRoute />,
                children: [
                    {
                        path: 'sys-user-profile',
                        action: sysUserProfileAction,
                        loader: sysUserProfileLoader,
                        shouldRevalidate: sysUserProfileLoaderGuard,
                        element: <SysUserProfileRoute />
                    }
                ]
            }
        ]
    },
    {
        path: '/sign-up',
        action: signUpAction,
        element: <SignUpRoute />
    },
    {
        path: '/login',
        action: loginAction,
        element: <LoginRoute />
    },
    {
        path: '/password-reset',
        action: passwordResetAction,
        element: <PasswordResetRoute />
    },
    {
        path: '/password-reset-confirm',
        element: <PasswordResetConfirmRoute />
    },
    {
        path: '/password-recovery',
        action: passwordRecoveryAction,
        element: <PasswordRecoveryRoute />
    }
], {basename: '/admin'});

if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose());
}

export function App() {
    return (
        <RouterProvider
            router={router}
        />
    );
}

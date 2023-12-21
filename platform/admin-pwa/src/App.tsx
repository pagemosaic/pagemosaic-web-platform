import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {SignUpRoute, signUpAction} from '@/roots/auth/SignUp.route';
import {LoginRoute, loginAction} from '@/roots/auth/Login.route';
import {MainRoute, mainLoader, mainAction} from '@/roots/main/Main.route';
import {PasswordRecoveryRoute, passwordRecoveryAction} from '@/roots/auth/PasswordRecovery.route';
import {PasswordResetConfirmRoute} from '@/roots/auth/PasswordResetConfirm.route';
import {PasswordResetRoute, passwordResetAction} from '@/roots/auth/PasswordReset.route';
import {SettingsRoute} from '@/features/settings/Settings.route';
import {SysUserProfileFormRoute} from '@/subfeatures/sysUserProfile/SysUserProfileForm.route';
import {PagesRoute} from '@/features/pages/Pages.route';
import {mainPageFormAction} from '@/subfeatures/mainPage/mainPageForm.action';
import {mainPageFormLoader, mainPageFormLoaderGuard} from '@/subfeatures/mainPage/mainPageForm.loader';
import {MainPageFormRoute} from '@/subfeatures/mainPage/MainPageForm.route';
import {sysUserProfileFormLoaderGuard, sysUserProfileFormLoader} from '@/subfeatures/sysUserProfile/sysUserProfileForm.loader';
import {sysUserProfileFormAction} from '@/subfeatures/sysUserProfile/sysUserProfileForm.action';
import {WelcomeRoute} from '@/features/welcome/Welcome.route';
import {websiteUrlLoader, websiteUrlLoaderGuard} from '@/subfeatures/websiteUrl/websiteUrl.loader';
import {WebsiteUrlRoute} from '@/subfeatures/websiteUrl/WebsiteUrl.route';
import {WebsiteUrlViewRoute} from '@/subfeatures/websiteUrl/WebsiteUrlView.route';
import {customDomainFormAction} from '@/subfeatures/websiteUrl/CustomDomainForm.action';
import {CustomDomainFormRoute} from '@/subfeatures/websiteUrl/CustomDomainForm.route';
import {deleteDomainFormAction} from '@/subfeatures/websiteUrl/DeleteDomainForm.action';
import {DeleteDomainFormRoute} from '@/subfeatures/websiteUrl/DeleteDomainForm.route';
import {distributionDomainFormAction} from '@/subfeatures/websiteUrl/DistributionDomainForm.action';
import {DistributionDomainFormRoute} from '@/subfeatures/websiteUrl/DistributionDomainForm.route';
import {allPagesLoader, allPagesLoaderGuard} from '@/subfeatures/allPages/allPages.loader';
import {AllPagesRoute} from '@/subfeatures/allPages/AllPages.route';
import {NewPageRoute} from '@/features/newPage/NewPage.route';
import {
    allPageTemplatesLoader,
    allPageTemplatesLoaderGuard
} from '@/subfeatures/newPageTemplates/newPageTemplates.loader';
import {NewPageTemplatesRoute} from '@/subfeatures/newPageTemplates/NewPageTemplates.route';
import {createNewPageLoader, createNewPageLoaderGuard} from '@/subfeatures/createNewPage/createNewPage.loader';
import {createNewPageAction} from '@/subfeatures/createNewPage/createNewPage.action';
import {CreateNewPageRoute} from '@/subfeatures/createNewPage/CreateNewPage.route';

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
                        path: '',
                        index: true,
                        loader: allPagesLoader,
                        shouldRevalidate: allPagesLoaderGuard,
                        element: <AllPagesRoute />
                    },
                    {
                        path: 'main-page',
                        action: mainPageFormAction,
                        loader: mainPageFormLoader,
                        shouldRevalidate: mainPageFormLoaderGuard,
                        element: <MainPageFormRoute />
                    }
                ]
            },
            {
                path: 'settings',
                element: <SettingsRoute />,
                children: [
                    {
                        path: 'sys-user-profile',
                        action: sysUserProfileFormAction,
                        loader: sysUserProfileFormLoader,
                        shouldRevalidate: sysUserProfileFormLoaderGuard,
                        element: <SysUserProfileFormRoute />
                    },
                    {
                        id: 'website-url',
                        path: 'website-url',
                        loader: websiteUrlLoader,
                        shouldRevalidate: websiteUrlLoaderGuard,
                        element: <WebsiteUrlRoute />,
                        children: [
                            {
                                index: true,
                                path: '',
                                element: <WebsiteUrlViewRoute />
                            },
                            {
                                path: 'custom-domain',
                                action: customDomainFormAction,
                                element: <CustomDomainFormRoute />
                            },
                            {
                                path: 'delete-domain',
                                action: deleteDomainFormAction,
                                element: <DeleteDomainFormRoute />
                            },
                            {
                                path: 'link-domain',
                                action: distributionDomainFormAction,
                                element: <DistributionDomainFormRoute />
                            },
                        ]
                    },
                ]
            },
            {
                path: 'new-page',
                element: <NewPageRoute />,
                children: [
                    {
                        path: '',
                        index: true,
                        loader: allPageTemplatesLoader,
                        shouldRevalidate: allPageTemplatesLoaderGuard,
                        element: <NewPageTemplatesRoute />
                    },
                    {
                        path: ':templateId',
                        action: createNewPageAction,
                        loader: createNewPageLoader,
                        shouldRevalidate: createNewPageLoaderGuard,
                        element: <CreateNewPageRoute />
                    },
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

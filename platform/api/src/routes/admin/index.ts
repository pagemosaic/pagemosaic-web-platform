import { Router } from 'express';

import auth from './post-sys-user-auth';
import authRefresh from './post-sys-user-auth-refresh';
import authResetConfirm from './post-sys-user-auth-reset-confirm';
import authResetStart from './post-sys-user-auth-reset-start';
import authSignUpConfirm from './post-sys-user-auth-signup-confirm';

import probeData from './get-probe-data';
import getSysUserProfile from './get-sys-user-profile';
import postSysUserProfile from './post-sys-user-profile';
import getPageContent from './get-page-content';
import postPageContent from './post-page-content';
import getPreview from './get-preview';
import getWebsiteUrl from './get-website-url';
import postCustomDomainCertificate from './post-custom-domain-certificate';
import postCustomDomainDistribution from './post-custom-domain-distribution';
import getWebsiteSslCertificateDetails from './get-website-ssl-certificate-details';
import deleteCustomDomain from './delete-custom-domain';

const router = Router();

router.use(auth);
router.use(authRefresh);
router.use(authResetConfirm);
router.use(authResetStart);
router.use(authSignUpConfirm);

router.use(probeData);
router.use(getSysUserProfile);
router.use(postSysUserProfile);
router.use(getPageContent);
router.use(postPageContent);
router.use(getPreview);
router.use(getWebsiteUrl);
router.use(postCustomDomainCertificate);
router.use(postCustomDomainDistribution);
router.use(getWebsiteSslCertificateDetails);
router.use(deleteCustomDomain);

export default router;

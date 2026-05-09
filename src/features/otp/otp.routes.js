/**
 * OTP Routes
 */

import { Router } from 'express';
import { sendOtp, verifyOtp, resetPassword } from './otp.controller.js';

const router = Router();

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
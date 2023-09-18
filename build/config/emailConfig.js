"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailDetails = exports.POLevels = void 0;
exports.POLevels = [
    'Creator',
    'Buyer',
    'Accounts',
    'BOHead'
];
exports.mailDetails = {
    'new-vendor': {
        subject: 'Review New Vendor Details!!',
        title: 'Vendor Review',
        message: 'A new vendor is being registered. Please review the details of the vendor so that further work can be done.',
        priority: 'high',
        sendTo: "accounts@evolvedigitas.com",
        // sendTo: "jatina+po@evolvedigitas.com",
        actionRoute: "review-vendor",
        actionText: "Review Vendor"
    },
    'vendor-success': {
        subject: 'Vendor Registration Successful',
        title: 'Vendor Registration Success',
        message: 'Congratulations your registration of $company is successful. Your vendor code is $vendorCode.',
        priority: 'normal'
    },
    'vendor-fail': {
        subject: 'Vendor Registration Failed',
        title: 'Vendor Registration Failed',
        message: 'Your registration is been rejected and following problem(s) were found:-\n$denyReason \nPlease click on the link below to update the details and fix it.',
        priority: 'high',
        actionRoute: 'update-vendor',
        actionText: "Update Details"
    },
    'update-vendor': {
        subject: 'Review Updated Vendor Details!!',
        title: 'Vendor Review',
        message: 'Based on your review Vendor Details have been updated please check. Please review the details of the vendor so that further work can be done.',
        priority: 'high',
        sendTo: "accounts@evolvedigitas.com",
        // sendTo: "jatina+po@evolvedigitas.com",
        actionRoute: "review-vendor",
        actionText: "Review Vendor"
    },
    'new-skus': {
        subject: "Review New SKUs for the vendor",
        title: "SKUs Verification",
        message: "Click on the link below to view the skus entered by the user for $companyName and verify them.",
        priority: "high",
        sendTo: ["yogeshk@globalplugin.com", "aswanis@globalplugin.com"],
        actionRoute: "review-skus",
        actionText: "Review SKUs"
    },
    'skus-success': {
        subject: 'SKUs Verification Successful',
        title: 'SKUs Verification Success',
        message: 'Congratulations your skus of $company is successful. You can start creating POs using entered skus.',
        priority: 'normal'
    },
    'skus-fail': {
        subject: 'SKUs Verification Failed',
        title: 'SKUs Verification Failed',
        message: 'Your skus has been rejected and following problem(s) were found:-\n$denyReason \nPlease fix the problem(s) and enter skus again.',
        priority: 'high'
    },
    'buyer-approval': {
        subject: "Review PO Details",
        title: "Review PO Details",
        message: "You'll find PO Attachment attached with this email. Please verify the details and then submit the review by clicking button below.",
        priority: 'high',
        sendTo: "yogeshk@globalplugin.com",
        actionRoute: "review-po",
        actionText: "Review PO"
    },
    'account-approval': {
        subject: "Review PO Details",
        title: "Review PO Details",
        message: "You'll find PO Attachment attached with this email. Please verify the details and then submit the review by clicking button below.",
        priority: 'high',
        sendTo: "accounts@evolvedigitas.com",
        actionRoute: "review-po",
        actionText: "Review PO"
    },
    'bu-approval': {
        subject: "Review PO Details",
        title: "Review PO Details",
        message: "You'll find PO Attachment attached with this email. Please verify the details and then submit the review by clicking button below.",
        priority: 'high',
        sendTo: ["aparnag@evolvedigitas.com", "tarunm@evolvedigitas.com"],
        actionRoute: "review-po",
        actionText: "Review PO"
    },
    'po-fail': {
        subject: 'PO Verification Failed',
        title: 'PO Verification Failed',
        message: 'Your PO has been rejected and following problem(s) were found:-\n$denyReason \nPlease fix the problem(s) and enter po again.',
        priority: 'high'
    },
};

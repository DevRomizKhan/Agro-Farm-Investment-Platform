export type Language = 'bn' | 'en'

export interface TranslationDictionary {
  header: {
    home: string
    about: string
    plans: string
    faq: string
    blog: string
    contact: string
    login: string
    register: string
  }
  hero: {
    eyebrow: string
    titleLine1: string
    highlightWord: string
    titleLine2: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    badges: {
      shariah: string
      dividends: string
      locations: string
      insured: string
    }
  }
  plans: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    mostPopular: string
    highReturns: string
    entryLevel: string
    perYearRoi: string
    months: string
    perShareText: string
    pricePerShare: string
    totalShares: string
    maxPerInvestor: string
    maxLabel: string
    startInvesting: string
    viewAllDetails: string
    comingSoon: string
    upcomingPlan: string
    opensAt: string
    opensSoon: string
    openingNow: string
    timeUnits: {
      days: string
      hours: string
      minutes: string
      seconds: string
    }
  }
  about: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    description: string
    features: {
      shariah: string
      dividends: string
      ownership: string
      production: string
    }
    stats: {
      founded: string
      farmSites: string
      activeInvestors: string
    }
    learnMore: string
    managedBy: string
  }
  whyInvest: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    reasons: Array<{
      title: string
      description: string
    }>
  }
  howItWorks: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    steps: Array<{
      step: string
      title: string
      description: string
    }>
  }
  faq: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    faqs: Array<{
      q: string
      a: string
    }>
  }
  statsSection: {
    activeInvestors: { label: string; desc: string }
    averageRoi: { label: string; desc: string }
    assetsManaged: { label: string; desc: string }
    transparentReporting: { label: string; desc: string }
  }
  blog: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    allArticles: string
    newInsightsTitle: string
    newInsightsDesc: string
    featuredInsight: string
    readArticle: string
    categoryDefault: string
  }
  footer: {
    bannerBadge: string
    bannerTitle: string
    bannerSubtitle: string
    createFreeAccount: string
    contactUs: string
    brandDescription: string
    companyTitle: string
    investorTitle: string
    newsletterTitle: string
    newsletterSubtitle: string
    emailPlaceholder: string
    subscribedMessage: string
    copyright: string
  }
  auth: {
    welcomeBack: string
    signInSubtitle: string
    createAccountTitle: string
    createAccountSubtitle: string
    forgotPasswordTitle: string
    forgotPasswordSubtitle: string
    fullName: string
    fullNamePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    password: string
    passwordPlaceholder: string
    confirmPassword: string
    confirmPasswordPlaceholder: string
    acceptTerms: string
    termsLink: string
    privacyLink: string
    signInBtn: string
    signingIn: string
    createAccountBtn: string
    creatingAccount: string
    sendResetLink: string
    sendingLink: string
    forgotPasswordLink: string
    noAccount: string
    alreadyHaveAccount: string
    backToLogin: string
    verificationRequiredTitle: string
    verificationRequiredDesc: string
    resendVerification: string
    sending: string
    passwordsMatch: string
  }
  investorNav: {
    dashboard: string
    myInvestments: string
    kycVerification: string
    documents: string
    notifications: string
    profile: string
    settings: string
    signOut: string
  }
  adminNav: {
    dashboard: string
    investors: string
    kycManagement: string
    plans: string
    investments: string
    transactions: string
    blog: string
    reports: string
    notifications: string
    submissions: string
    settings: string
    ownerRole: string
    signOut: string
  }
  galleryPage: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    cta: string
    items: Array<{
      title: string
      location: string
    }>
  }
  contactPage: {
    badge: string
    titlePrefix: string
    titleHighlight: string
    subtitle: string
    formTitle: string
    formSubtitle: string
    fullName: string
    phone: string
    email: string
    message: string
    messagePlaceholder: string
    submitBtn: string
    submitting: string
    successTitle: string
    successMessage: string
    sendAnother: string
    confidentialNotice: string
    openMap: string
    labels: {
      locations: string
      phone: string
      email: string
      website: string
      hours: string
    }
  }
  common: {
    active: string
    pending: string
    approved: string
    rejected: string
    completed: string
    failed: string
    viewAll: string
    details: string
    back: string
    save: string
    cancel: string
    edit: string
    delete: string
    search: string
    filter: string
    shares: string
    perShare: string
    currency: string
    loading: string
  }
  investForm: {
    title: string
    selectPlan: string
    chooseActivePlan: string
    year: string
    pricePerShare: string
    annualRoi: string
    maxSharesPerInvestor: string
    maxSharesLabel: string
    duration: string
    months: string
    exitLock: string
    days: string
    totalShares: string
    numberOfShares: string
    sharesPlaceholder: string
    maxSharesPerInvestorHint: string
    shareRequestCannotSubmit: string
    sharesRequestedExceedsAvailable: string
    sharesAvailable: string
    maxSharesPerInvestorExceeded: string
    investmentAmount: string
    probableReturnRate: string
    probableReturnAtMaturity: string
    totalCapitalPlusRoi: string
    noPaymentRequired: string
    submittingRequest: string
    requestInvestmentApproval: string
    successMessage: string
    errorMessage: string
    unexpectedError: string
  }
}

export const translations: Record<Language, TranslationDictionary> = {
  bn: {
    header: {
      home: 'মূল পাতা',
      about: 'আমাদের পরিচয়',
      plans: 'বিনিয়োগ প্ল্যান',
      faq: 'প্রশ্নোত্তর',
      blog: 'ব্লগ ও আপডেট',
      contact: 'যোগাযোগ',
      login: 'বিনিয়োগকারী লগইন',
      register: 'অ্যাকাউন্ট খুলুন',
    },
    hero: {
      eyebrow: 'হালাল · সম্পদ-ভিত্তিক · শরীয়াহ সম্মত খামার বিনিয়োগ',
      titleLine1: 'কৃষিতে বিনিয়োগ করুন।',
      highlightWord: 'সমৃদ্ধি',
      titleLine2: ' ঘরে তুলুন।',
      subtitle: 'শরীয়াহ সম্মত অংশীদারিত্বের মাধ্যমে গবাদি পশু ও মৎস্য খামারের আনুপাতিক মালিকানায় যুক্ত হোন — স্বচ্ছ, বিশ্বস্ত ও অভিজ্ঞ খামার ব্যবস্থাপনা।',
      ctaPrimary: 'আজই বিনিয়োগ শুরু করুন',
      ctaSecondary: 'বিনিয়োগ প্ল্যানসমূহ দেখুন',
      badges: {
        shariah: 'শরীয়াহ সনদপ্রাপ্ত',
        dividends: 'পরিবর্তনশীল বাৎসরিক লভ্যাংশ',
        locations: '১+ খামার প্রাঙ্গণ',
        insured: 'বীমাকৃত খামার সম্পদ',
      },
    },
    plans: {
      badge: 'বিনিয়োগ প্ল্যানসমূহ',
      titlePrefix: 'বিনিয়োগ ',
      titleHighlight: 'প্ল্যানসমূহ',
      subtitle: 'বর্তমানে বিনিয়োগের জন্য উন্মুক্ত প্ল্যানসমূহ দেখুন এবং আপনার পছন্দের প্ল্যানটি বেছে নিন।',
      mostPopular: 'সর্বাধিক জনপ্রিয়',
      highReturns: 'উচ্চ লভ্যাংশ',
      entryLevel: 'প্রাথমিক স্তর',
      perYearRoi: '/ বছর লভ্যাংশ',
      months: 'মাস',
      perShareText: 'প্রতি শেয়ার',
      pricePerShare: 'প্রতি শেয়ার মূল্য',
      totalShares: 'মোট শেয়ার সংখ্যা',
      maxPerInvestor: 'সর্বোচ্চ বিনিয়োগ সীমা',
      maxLabel: 'সর্বোচ্চ',
      startInvesting: 'বিনিয়োগ শুরু করুন',
      viewAllDetails: 'সকল প্ল্যানের বিস্তারিত দেখুন',
      comingSoon: 'শীঘ্রই আসছে',
      upcomingPlan: 'আসন্ন প্ল্যান',
      opensAt: 'শুরু হবে',
      opensSoon: 'শীঘ্রই চালু হবে',
      openingNow: 'এখনই উন্মুক্ত হচ্ছে…',
      timeUnits: {
        days: 'দিন',
        hours: 'ঘণ্টা',
        minutes: 'মিনিট',
        seconds: 'সেকেন্ড',
      },
    },
    about: {
      badge: 'আমাদের পরিচিতি',
      titlePrefix: 'বিনিয়োগকারীদের ক্ষমতায়ন, ',
      titleHighlight: 'কৃষির আধুনিকায়ন',
      description: 'আমানাহ ফার্ম একটি শরীয়াহ সম্মত অংশীদারিত্বভিত্তিক কৃষি বিনিয়োগ উদ্যোগ, যা বিনিয়োগকারীদের Fish Project ও মাছ চাষ প্রকল্পের প্রবৃদ্ধি ও সম্পদের আনুপাতিক মালিকানায় সংযুক্ত করে। Fish Project পরিচালিত হয় ইসলামিক শরীয়াহ নীতিমালায়, যেখানে সব খরচ বাদ দিয়ে বাৎসরিক নিট লভ্যাংশ প্রদান করা হয়।',
      features: {
        shariah: 'শরীয়াহ সম্মত চুক্তিমালা',
        dividends: 'বাৎসরিক নিট লভ্যাংশ বণ্টন',
        ownership: 'সম্পদের আনুপাতিক মালিকানা',
        production: 'গবাদি পশু ও মৎস্য খামার',
      },
      stats: {
        founded: 'প্রতিষ্ঠিত',
        farmSites: 'খামার প্রাঙ্গণ',
        activeInvestors: 'সক্রিয় বিনিয়োগকারী',
      },
      learnMore: 'আমাদের সম্পর্কে আরও জানুন',
      managedBy: 'ব্যবস্থাপনায়',
    },
    whyInvest: {
      badge: 'কেন আমাদের বেছে নেবেন',
      titlePrefix: 'কেন বিনিয়োগ করবেন ',
      titleHighlight: 'আমানাহ ফার্মে?',
      subtitle: 'আমরা আধুনিক ফিনটেক স্বচ্ছতা ও অভিজ্ঞ কৃষি ব্যবস্থাপনার সমন্বয়ে শরীয়াহ নীতি মেনে প্রকৃত খামার আয়ের নির্ভরযোগ্য বিনিয়োগ নিশ্চিত করি।',
      reasons: [
        {
          title: 'সুরক্ষিত ও সম্পূর্ণ স্বচ্ছ',
          description: 'প্রতিটি বিনিয়োগের স্বচ্ছ আর্থিক হিসাব রাখা হয়। স্বাধীন স্বীকৃত নিরীক্ষক দ্বারা বাৎসরিক হিসাব অডিট এবং বিনিয়োগকারীদের জন্য নিয়মিত পূর্ণাঙ্গ আয়-ব্যয় প্রতিবেদন প্রদান করা হয়।',
        },
        {
          title: 'পরিবর্তনশীল নিট লভ্যাংশ',
          description: 'শরীয়াহ আইন অনুযায়ী খামার পরিচালনার সর্বমোট পরিচালনা ব্যয় বাদ দিয়ে বাৎসরিক নিট লভ্যাংশ বন্টন করা হয় — কোনো স্থির বা সুনির্দিষ্ট সুদের সুযোগ নেই।',
        },
        {
          title: '২ বছর মেয়াদী প্রকল্প ব্যবস্থা',
          description: 'Fish Project একটি ২ বছর মেয়াদী প্রকল্প। মেয়াদের পর খামারের উৎপাদনশীল সম্পদ বিক্রয়লব্ধ অর্থ সকল শেয়ারহোল্ডারদের মাঝে আনুপাতিক হারে বন্টন করা হবে।',
        },
        {
          title: 'দক্ষ খামার ব্যবস্থাপনা',
          description: 'অভিজ্ঞ কৃষিবিদ ও খামার বিশেষজ্ঞদের সুনিপুণ তত্ত্বাবধানে আমাদের Fish Project ও মাছ চাষ খামারসমূহ উচ্চ ফলনশীলতায় পরিচালিত হয়।',
        },
        {
          title: 'Fish Project ও মৎস্য উৎপাদন খাত',
          description: 'বিনিয়োগ শুধুমাত্র Fish Project ও মাছের উৎপাদনশীল মূল সম্পদে প্রয়োগ করা হয় — কোন ধরনের অনাবশ্যক বা কাঠামোগত অকৃষি খাতে নয়।',
        },
        {
          title: 'রিয়েল-টাইম বিনিয়োগকারী পোর্টাল',
          description: 'ব্যক্তিগত অনলাইন ড্যাশবোর্ড থেকে সহজেই আপনার শেয়ার হিসাব, বাৎসরিক অডিট রিপোর্ট এবং খামার সংক্রান্ত সময়োপযোগী তথ্য পর্যবেক্ষণ করুন।',
        },
      ],
    },
    howItWorks: {
      badge: 'সহজ পদ্ধতি',
      titlePrefix: 'যেভাবে ',
      titleHighlight: 'কাজ করে',
      subtitle: 'মাত্র ৬টি সহজ ধাপে কৃষিখাতে সুরক্ষিত বিনিয়োগ শুরু করুন। পুরো প্রক্রিয়াটি স্বচ্ছ, নিরাপদ এবং সম্পূর্ণ ডিজিটাল।',
      steps: [
        {
          step: '০১',
          title: 'আপনার অ্যাকাউন্ট তৈরি করুন',
          description: 'ইমেইল ও প্রাথমিক ব্যক্তিগত তথ্য প্রদান করে মাত্র ২ মিনিটে বিনামূল্যে অ্যাকাউন্ট খুলুন।',
        },
        {
          step: '০২',
          title: 'কেওয়াইসি (KYC) পরিচয় যাচাই',
          description: 'জাতীয় পরিচয়পত্র (NID) ও তথ্য জমা দিন। আমাদের প্যানেল যাচাই শেষে আপনার বিনিয়োগকারী অ্যাকাউন্ট সক্রিয় করবে।',
        },
        {
          step: '০৩',
          title: 'শেয়ার ক্রয় (প্রতি শেয়ার ৳১০,০০০ টাকা)',
          description: 'অনুমোদিত বিকাশ/ব্যাংক পেমেন্টের মাধ্যমে প্রতি শেয়ার ১০,০০০ টাকা মূল্যে আপনার পছন্দমতো শেয়ার অর্জন করুন।',
        },
        {
          step: '০৪',
          title: 'উৎপাদনশীল খামারের অংশীদারিত্ব',
          description: 'আপনার বিনিয়োগের অর্থ সরাসরি ইসলামী শরীয়াহ অংশীদারিত্ব নীতিতে Fish Project ও মৎস্য মূল সম্পদে যুক্ত হবে।',
        },
        {
          step: '০৫',
          title: 'বাৎসরিক লভ্যাংশ গ্রহণ',
          description: 'খামারের বাৎসরিক নিট লভ্যাংশ হিসাব ৬ মাস পর পর আপডেট করা হয় এবং বাৎসরিক ভিত্তিতে বিনিয়োগকারীর ওয়ালেটে যুক্ত হয়।',
        },
        {
          step: '০৬',
          title: '১ বছর পর এক্সিট বা পুনর্নিয়োগ',
          description: 'প্রথম বছর পর ১ মাসের লিখিত বিজ্ঞপ্তিতে শেয়ার বিক্রয় বা হস্তান্তর সম্ভব। অবায়িতকরণ ৪ মাসের মধ্যে সম্পন্ন হয়।',
        },
      ],
    },
    faq: {
      badge: 'সাধারণ জিজ্ঞাসা',
      titlePrefix: 'সাধারণ ',
      titleHighlight: 'প্রশ্নাবলী (FAQ)',
      subtitle: 'Fish Project – ২ বছর মেয়াদী কৃষি মালিকানা সংক্রান্ত বহুল জিজ্ঞাসিত প্রশ্ন ও উত্তর।',
      faqs: [
        {
          q: 'Fish Project – ২ বছর মেয়াদী প্রোগ্রামটি আসলে কী?',
          a: 'Fish Project হলো একটি ২ বছর মেয়াদী শরীয়াহ সম্মত যৌথ কৃষি প্রকল্প, যা মূলত Fish Project ও মৎস্য চাষ উৎপাদন সম্পদে কেন্দ্রীভূত।',
        },
        {
          q: 'শেয়ারের মূল্য এবং সর্বনিম্ন বিনিয়োগ কত?',
          a: 'বিনিয়োগ শেয়ারের মূল্য প্রতি শেয়ার ১০,০০০ টাকা (এক হাজার টাকা)। আপনি সর্বনিম্ন ১টি শেয়ার (১০,০০০ টাকা) থেকে শুরু করে সামর্থ্য অনুযায়ী একাধিক শেয়ার আমানাহ ফার্মের নির্ধারিত পেমেন্ট চ্যানেলে জমা দিয়ে কিনতে পারেন।',
        },
        {
          q: 'লভ্যাংশ কীভাবে এবং কখন বিতরণ করা হয়?',
          a: 'প্রকল্পের পরিচালন ব্যয়, খাদ্য খরচ ও পরিচর্যা বাদ দেয়ার পর অর্জিত নিট মুনাফা হিসাব করা হয়। লভ্যাংশের হালনাগাদ তথ্য ৬ মাস পর পর প্রকাশ করা হয় এবং বাৎসরিক ভিত্তিতে প্রদান করা হয়।',
        },
        {
          q: 'লভ্যাংশ কি নির্দিষ্ট বা নিশ্চিত?',
          a: 'না। ইসলামিক শরীয়াহ নীতি অনুযায়ী কোনো স্থির, নিশ্চিত বা পূর্বনির্ধারিত মুনাফা অফার করা হয় না। লভ্যাংশ সম্পূর্ণ খামারের প্রকৃত উৎপাদনের উপর নির্ভর করে। ক্ষতি বা ঝুঁকিও শেয়ারের অনুপাত অনুযায়ী বহন করতে হয়।',
        },
        {
          q: 'লক-ইন পিরিয়ড এবং শেয়ার বিক্রয়ের নিয়ম কী?',
          a: 'প্রথম ১ বছর বিনিয়োগ ফেরতযোগ্য বা হস্তান্তরযোগ্য নয়। প্রথম বছর অতিক্রান্ত হলে ১ মাসের লিখিত নোটিশ দিয়ে শেয়ার বিক্রয় বা হস্তান্তরের আবেদন করা যাবে। সমাপনী কার্য সম্পন্ন করতে সর্বোচ্চ ৪ মাস সময় প্রয়োজন হয়।',
        },
        {
          q: '২ বছর মেয়াদ শেষে কী হবে?',
          a: 'মেয়াদান্তে (৩০ জুন ২০২৯ এর মধ্যে) প্রজেক্টের সমস্ত উৎপাদিত গবাদি পশু ও মৎস্য সম্পদ বিক্রয় করে নগদ টাকায় রূপান্তর করা হবে। অর্জিত বিক্রয়লব্ধ নিট অর্থ সকল শেয়ারহোল্ডারদের মাঝে তাদের শেয়ারের আনুপাতিক হারে বন্টন করা হবে।',
        },
        {
          q: 'আর্থিক স্বচ্ছতা এবং নিরীক্ষা ব্যবস্থা কেমন?',
          a: 'Fish Project কঠোর আর্থিক স্বচ্ছতা বজায় রাখে। নিরপেক্ষ স্বীকৃত চার্টার্ড অ্যাকাউন্ট্যান্ট ফার্ম দ্বারা বাৎসরিক অডিট সম্পন্ন করা হয় এবং নিয়মিত অডিট রিপোর্ট বিনিয়োগকারীকে প্রদান করা হয়।',
        },
        {
          q: 'প্রকল্পে কী ধরনের ঝুঁকি থাকতে পারে?',
          a: 'কৃষি ও মৎস্য খাতে প্রাকৃতিক দুর্যোগ, প্রাণীর রোগব্যাধি, গো-খাদ্যের মূল্য বৃদ্ধি ও বাজারদরের ওঠানামার ঝুঁকি থাকে। শরীয়াহ নীতি অনুসারে লাভ ও ক্ষতি আনুপাতিকভাবে ভাগ করে নেয়া হয়।',
        },
      ],
    },
    statsSection: {
      activeInvestors: { label: 'সক্রিয় বিনিয়োগকারী', desc: 'আস্থাশীল বিনিয়োগকারী পরিবার' },
      averageRoi: { label: 'বাৎসরিক গড় লভ্যাংশ হার', desc: 'প্রকল্পের ধারাবাহিক নিট মুনাফা' },
      assetsManaged: { label: 'ব্যবস্থাপনাধীন খামার সম্পদ', desc: 'সম্পূর্ণ বীমাকৃত কৃষি সম্পদ' },
      transparentReporting: { label: 'স্বচ্ছ প্রতিবেদন ব্যবস্থা', desc: 'বাৎসরিক অডিট ও আর্থিক বিবরণী' },
    },
    blog: {
      badge: 'খবর ও বিশ্লেষণ',
      titlePrefix: 'বিচক্ষণ বিনিয়োগকারীদের জন্য ',
      titleHighlight: 'তথ্য কেন্দ্র',
      allArticles: 'সকল নিবন্ধ দেখুন',
      newInsightsTitle: 'নতুন নতুন নিবন্ধ প্রকাশিত হচ্ছে',
      newInsightsDesc: 'আমাদের টিম কৃষি, হালাল বিনিয়োগ ও টেকসই অর্থনীতির সময়োপযোগী বিশ্লেষণ তৈরিতে কাজ করছে।',
      featuredInsight: 'বিশেষ নিবন্ধ',
      readArticle: 'নিবন্ধটি পড়ুন',
      categoryDefault: 'কৃষি প্রযুক্তি',
    },
    footer: {
      bannerBadge: 'সম্পদ বৃদ্ধি শুরু করুন',
      bannerTitle: 'Fish Project-তে যুক্ত হোন — কৃষি সম্পদের অংশীদার হন',
      bannerSubtitle: 'প্রতি শেয়ার ৳১০,০০০ টাকা · Fish Project ও মৎস্য উৎপাদন · ২ বছর মেয়াদী প্রকল্প · ১০০% শরীয়াহ সম্মত।',
      createFreeAccount: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
      contactUs: 'যোগাযোগ করুন',
      brandDescription: 'বাংলাদেশের শীর্ষস্থানীয় শরীয়াহ সম্মত কৃষি বিনিয়োগ প্ল্যাটফর্ম — নিরাপদ, স্বচ্ছ এবং লাভজনক।',
      companyTitle: 'কোম্পানি',
      investorTitle: 'বিনিয়োগকারী',
      newsletterTitle: 'সংবাদপত্র সাময়িকী',
      newsletterSubtitle: 'নিয়মিত খামার আপডেট এবং বিনিয়োগ সংক্রান্ত প্রতিবেদন পান।',
      emailPlaceholder: 'আপনার ইমেইল ঠিকানা দিন',
      subscribedMessage: 'সফলভাবে সাবস্ক্রাইব করা হয়েছে!',
      copyright: 'সর্বস্বত্ব সংরক্ষিত।',
    },
    auth: {
      welcomeBack: 'আপনাকে পুনরায় স্বাগতম',
      signInSubtitle: 'আপনার বিনিয়োগ ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন',
      createAccountTitle: 'আপনার অ্যাকাউন্ট তৈরি করুন',
      createAccountSubtitle: 'আজই আমানাহ ফার্মে যুক্ত হয়ে আপনার নিরাপদ বিনিয়োগ সফর শুরু করুন',
      forgotPasswordTitle: 'পাসওয়ার্ড পুনরুদ্ধার',
      forgotPasswordSubtitle: 'আপনার নিবন্ধিত ইমেইল ঠিকানা দিন, আমরা রিসেট লিংক পাঠাব',
      fullName: 'পূর্ণ নাম',
      fullNamePlaceholder: 'আপনার নাম লিখুন (যেমন: মোঃ রফিকুল ইসলাম)',
      email: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'আপনাদের ইমেইল@example.com',
      phone: 'মোবাইল নম্বর',
      phonePlaceholder: '০১৯XXXXXXXX',
      password: 'পাসওয়ার্ড',
      passwordPlaceholder: 'একটি শক্তিশালী পাসওয়ার্ড দিন',
      confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
      confirmPasswordPlaceholder: 'পাসওয়ার্ড পুনরায় লিখুন',
      acceptTerms: 'আমি সম্মত প্রকাশ করছি',
      termsLink: 'নিয়ম ও শর্তাবলী',
      privacyLink: 'গোপনীয়তা নীতি',
      signInBtn: 'প্রবেশ করুন (লগইন)',
      signingIn: 'প্রবেশ করা হচ্ছে…',
      createAccountBtn: 'অ্যাকাউন্ট খুলুন',
      creatingAccount: 'অ্যাকাউন্ট তৈরি হচ্ছে…',
      sendResetLink: 'রিসেট লিংক পাঠান',
      sendingLink: 'পাঠানো হচ্ছে…',
      forgotPasswordLink: 'পাসওয়ার্ড ভুলে গেছেন?',
      noAccount: 'কোনো অ্যাকাউন্ট নেই?',
      alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      backToLogin: 'লগইন পৃষ্ঠায় ফিরে যান',
      verificationRequiredTitle: 'ইমেইল নিশ্চিতকরণ প্রয়োজন',
      verificationRequiredDesc: 'প্রবেশ করার পূর্বে অনুগ্রহ করে আপনার ইমেইল যাচাই করুন। আপনার ইনবক্সে পাঠানো যাচাইকরণ লিংকে ক্লিক করুন।',
      resendVerification: 'পুনরায় ইমেইল পাঠান',
      sending: 'পাঠানো হচ্ছে…',
      passwordsMatch: 'পাসওয়ার্ড মিলেছে',
    },
    investorNav: {
      dashboard: 'ড্যাশবোর্ড',
      myInvestments: 'আমার বিনিয়োগ',
      kycVerification: 'কেওয়াইসি (KYC) যাচাইকরণ',
      documents: 'নথিপত্র ও সার্টিফিকেট',
      notifications: 'বিজ্ঞপ্তিসমূহ',
      profile: 'ব্যক্তিগত প্রোফাইল',
      settings: 'অ্যাকাউন্ট সেটিংস',
      signOut: 'সাইন আউট',
    },
    adminNav: {
      dashboard: 'অ্যাডমিন ড্যাশবোর্ড',
      investors: 'বিনিয়োগকারীবৃন্দ',
      kycManagement: 'কেওয়াইসি পরিচালনা',
      plans: 'বিনিয়োগ প্ল্যানসমূহ',
      investments: 'সকল বিনিয়োগ',
      transactions: 'লেনদেন বিবরণী',
      blog: 'ব্লগ ও নিবন্ধ',
      reports: 'আর্থিক অডিট ও রিপোর্ট',
      notifications: 'বিজ্ঞপ্তি পাঠান',
      submissions: 'লিড ও সাবস্ক্রাইবার',
      settings: 'সিস্টেম সেটিংস',
      ownerRole: 'স্বত্বাধিকারী (Owner)',
      signOut: 'সাইন আউট',
    },
    galleryPage: {
      badge: 'খামার প্রাঙ্গণ',
      titlePrefix: 'আমানাহ ফার্ম ',
      titleHighlight: 'গ্যালারি',
      subtitle: 'আমাদের আধুনিক গবাদি পশু মোটাতাজাকরণ ও মৎস্য খামার প্রাঙ্গণের এক ঝলক।',
      cta: 'এই খামারগুলোতে বিনিয়োগ করুন',
      items: [
        { title: 'উচ্চ ফলনশীল ষাঁড় মোটাতাজাকরণ প্রাঙ্গণ', location: 'রাজশাহী হাব' },
        { title: 'জৈব খাদ্য ও পুষ্টি এলাকা', location: 'কুমিল্লা হাব' },
        { title: 'সমন্বিত দুগ্ধ ও ইকো খামার', location: 'রংপুর হাব' },
        { title: 'ভেটেরিনারি পরীক্ষা ও ট্যাগিং', location: 'সিলেট হাব' },
        { title: 'প্রাকৃতিক চারণভূমি', location: 'বগুড়া হাব' },
        { title: 'স্বয়ংক্রিয় পানি ও বর্জ্য ব্যবস্থাপনা', location: 'ময়মনসিংহ হাব' },
      ],
    },
    contactPage: {
      badge: 'যোগাযোগ করুন',
      titlePrefix: 'আমানাহ ফার্মের সাথে ',
      titleHighlight: 'যোগাযোগ',
      subtitle: 'Fish Project শেয়ার প্যাকেজ, লভ্যাংশের হালনাগাদ কিংবা মালিকানা সংক্রান্ত যেকোনো জিজ্ঞাসায় আমাদের টিম সহায়তায় প্রস্তুত।',
      formTitle: 'বার্তা পাঠান',
      formSubtitle: 'আমরা ২ কর্মঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।',
      fullName: 'আপনার পূর্ণ নাম *',
      phone: 'ফোন / হোয়াটসঅ্যাপ নম্বর *',
      email: 'ইমেইল ঠিকানা *',
      message: 'আপনার বার্তা *',
      messagePlaceholder: 'আপনার বিনিয়োগ লক্ষ্য বা প্রশ্ন সম্পর্কে লিখুন...',
      submitBtn: 'বার্তা প্রেরণ করুন',
      submitting: 'পাঠানো হচ্ছে…',
      successTitle: 'বার্তা পাওয়া গেছে!',
      successMessage: 'ধন্যবাদ, আপনার বার্তা আমাদের কাছে পৌঁছেছে। আমাদের টিম খুব দ্রুত আপনার সাথে যোগাযোগ করবে।',
      sendAnother: 'আরেকটি বার্তা পাঠান',
      confidentialNotice: 'আপনার সকল তথ্য ১০০% নিরাপদ ও গোপন রাখা হয়।',
      openMap: 'পূর্ণাঙ্গ মানচিত্র খুলুন',
      labels: {
        locations: 'খামার প্রাঙ্গণসমূহ',
        phone: 'ফোন / হোয়াটসঅ্যাপ',
        email: 'ইমেইল',
        website: 'ওয়েবসাইট',
        hours: 'অফিস সময়',
      },
    },
    common: {
      active: 'সক্রিয়',
      pending: 'অপেক্ষমাণ',
      approved: 'অনুমোদিত',
      rejected: 'বাতিলকৃত',
      completed: 'সম্পন্ন',
      failed: 'ব্যর্থ',
      viewAll: 'সব দেখুন',
      details: 'বিস্তারিত',
      back: 'ফিরে যান',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল',
      edit: 'সম্পাদনা',
      delete: 'মুছে ফেলুন',
      search: 'অনুসন্ধান করুন…',
      filter: 'ফিল্টার',
      shares: 'শেয়ার',
      perShare: 'প্রতি শেয়ার',
      currency: '৳',
      loading: 'লোড হচ্ছে…',
    },
    investForm: {
      title: 'নতুন শেয়ার ক্রয় আবেদন',
      selectPlan: 'বিনিয়োগ প্ল্যান নির্বাচন করুন',
      chooseActivePlan: 'একটি সক্রিয় প্ল্যান বেছে নিন',
      year: 'বছর',
      pricePerShare: 'প্রতি শেয়ার মূল্য',
      annualRoi: 'বাৎসরিক লভ্যাংশ',
      maxSharesPerInvestor: 'সর্বোচ্চ সীমা',
      maxSharesLabel: 'টি',
      duration: 'মেয়াদ',
      months: 'মাস',
      exitLock: 'লকড সময়',
      days: 'দিন',
      totalShares: 'মোট বরাদ্দকৃত শেয়ার',
      numberOfShares: 'শেয়ার সংখ্যা',
      sharesPlaceholder: 'যেমন: ১০',
      maxSharesPerInvestorHint: 'একজন বিনিয়োগকারী সর্বোচ্ঝ {max} টি শেয়ারের আবেদন করতে পারবেন।',
      shareRequestCannotSubmit: 'শেয়ার আবেদনটি জমা দেওয়া সম্ভব নয়',
      sharesRequestedExceedsAvailable: 'আপনি {requested} টি শেয়ার চেয়েছেন, কিন্তু বর্তমানে মাত্র {available} টি শেয়ার উন্মুক্ত রয়েছে।',
      sharesAvailable: 'টি শেয়ার',
      maxSharesPerInvestorExceeded: 'এই প্ল্যানে একজন বিনিয়োগকারীর জন্য সর্বোচ্চ {max} টি শেয়ারের অনুমতি রয়েছে; আপনার আবেদনটি {requested} টি শেয়ারের।',
      investmentAmount: 'মোট বিনিয়োগের পরিমাণ',
      probableReturnRate: 'আনুমানিক লভ্যাংশের হার',
      probableReturnAtMaturity: 'মেয়াদান্তে আনুমানিক প্রাপ্ত লভ্যাংশ',
      totalCapitalPlusRoi: 'মোট মূলধন + লভ্যাংশ',
      noPaymentRequired: 'এখনই কোনো অর্থপ্রদানের প্রয়োজন নেই। উদ্যোক্তা আবেদন অনুমোদন করলে ব্যাংক বিবরণী ও পেমেন্ট রসিদ জমা দেওয়ার অপশন উন্মুক্ত হবে।',
      submittingRequest: 'আবেদন পাঠানো হচ্ছে...',
      requestInvestmentApproval: 'শেয়ার অনুমোদনের আবেদন করুন',
      successMessage: 'শেয়ার ক্রয়ের অনুরোধ জমা হয়েছে। পেমেন্টের পূর্বে উদ্যোক্তা এটি নিরীক্ষা করবেন।',
      errorMessage: 'আবেদন জমা দিতে ব্যর্থ হয়েছে',
      unexpectedError: 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে',
    },
  },
  en: {
    header: {
      home: 'Home',
      about: 'About Us',
      plans: 'Investment Plans',
      faq: 'FAQ',
      blog: 'Blogs & News',
      contact: 'Contact Us',
      login: 'Investor Sign In',
      register: 'Create Account',
    },
    hero: {
      eyebrow: 'Halal · Asset-Backed · Shariah Compliant',
      titleLine1: 'Invest in Agriculture. ',
      highlightWord: 'Harvest',
      titleLine2: ' the Future.',
      subtitle: 'Participate in proportionate ownership of Fish Project and fish production assets through a Sharia-compliant partnership — transparent, ethical, and managed by experienced farm teams.',
      ctaPrimary: 'Start Investing Today',
      ctaSecondary: 'View Investment Plans',
      badges: {
        shariah: 'Shariah Certified',
        dividends: 'Variable Annual Dividends',
        locations: '1+ Farm Locations',
        insured: 'Asset Insured',
      },
    },
    plans: {
      badge: 'Investment Plans',
      titlePrefix: 'Investment ',
      titleHighlight: 'Plans',
      subtitle: 'Explore the plans currently open for investment and choose the one that suits you.',
      mostPopular: 'Most Popular',
      highReturns: 'High Returns',
      entryLevel: 'Entry Level',
      perYearRoi: '/ year ROI',
      months: 'months',
      perShareText: 'per share',
      pricePerShare: 'Price / Share',
      totalShares: 'Total Shares',
      maxPerInvestor: 'Max Per Investor',
      maxLabel: 'max',
      startInvesting: 'Start Investing',
      viewAllDetails: 'View all plan details',
      comingSoon: 'Coming Soon',
      upcomingPlan: 'Upcoming Plan',
      opensAt: 'Opens at',
      opensSoon: 'Opens Soon',
      openingNow: 'Opening now…',
      timeUnits: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds',
      },
    },
    about: {
      badge: 'Who We Are',
      titlePrefix: 'Empowering Investors, ',
      titleHighlight: 'Transforming Agriculture',
      description: 'Amanah Farm is a partnership-based agricultural investment initiative connecting investors to proportionate ownership in Fish Project and fish production assets. Fish Project operates under Islamic Sharia principles, with annual net dividends calculated after project expenses, transparent financial records.',
      features: {
        shariah: 'Shariah-Compliant Contracts',
        dividends: 'Annual Net Dividends',
        ownership: 'Proportionate Asset Ownership',
        production: 'Fish Project Production',
      },
      stats: {
        founded: 'Founded',
        farmSites: 'Farm Sites',
        activeInvestors: 'Active Investors',
      },
      learnMore: 'Learn More About Us',
      managedBy: 'Managed by',
    },
    whyInvest: {
      badge: 'Why Choose Us',
      titlePrefix: 'Why Invest with ',
      titleHighlight: 'Amanah Farm?',
      subtitle: 'We combine modern fintech transparency with time-tested agricultural expertise to deliver transparent agricultural ownership aligned with Sharia principles and actual farm performance.',
      reasons: [
        {
          title: 'Secured & Transparent',
          description: 'Every investment is documented with comprehensive financial records. Independent auditors conduct annual reviews and investors receive full access to income and expense reports.',
        },
        {
          title: 'Variable Net Dividends',
          description: 'Annual dividends are calculated after all operational costs under Sharia law — no fixed or guaranteed returns. True profit and loss sharing aligned with farm performance.',
        },
        {
          title: '2-Year Program Duration',
          description: 'Fish Project is a 2-year program. Upon conclusion, all assets are liquidated and net proceeds distributed proportionately to all investors.',
        },
        {
          title: 'Expert Farm Management',
          description: 'Our team of experienced agronomists and farm managers ensure optimal productivity in both Fish Project and fish production across all farm sites.',
        },
        {
          title: 'Fish Project Production',
          description: 'The project covers only Fish Project and fish base producing assets. Investor ownership is strictly limited to production assets — not constructional or non-production assets.',
        },
        {
          title: 'Real-Time Investor Portal',
          description: 'Monitor your shareholding, access project updates and annual audit reports, and retrieve your investment records from a personal investor dashboard.',
        },
      ],
    },
    howItWorks: {
      badge: 'Simple Process',
      titlePrefix: 'How It ',
      titleHighlight: 'Works',
      subtitle: 'Start earning from agricultural investments in 6 easy steps. The entire process is transparent, secure, and completely digital.',
      steps: [
        {
          step: '01',
          title: 'Create Your Account',
          description: 'Register with your email and basic personal details. Email verification takes less than 2 minutes.',
        },
        {
          step: '02',
          title: 'Complete KYC Verification',
          description: 'Submit your NID and accurate contact information. Our team verifies your identity and activates your investor account.',
        },
        {
          step: '03',
          title: 'Purchase Shares (BDT 10,000 each)',
          description: 'Buy shares at BDT 10,000 per share through approved payment methods in BDT currency only. Multiple shares can be purchased.',
        },
        {
          step: '04',
          title: 'Own Production Assets',
          description: 'Your investment is allocated proportionately into Fish Project and fish production assets under Sharia-compliant partnership principles.',
        },
        {
          step: '05',
          title: 'Receive Annual Dividends',
          description: 'Net dividends (after all operational costs) are communicated on a 6-month basis and distributed annually to all investors.',
        },
        {
          step: '06',
          title: 'Exit or Reinvest After Year 1',
          description: 'After the first year, submit a 1-month written notice to sell or transfer shares. All settlements completed within 4 months.',
        },
      ],
    },
    faq: {
      badge: 'Frequently Asked Questions',
      titlePrefix: 'Common ',
      titleHighlight: 'Questions',
      subtitle: 'Everything you need to know about Fish Project – 2 Year Ownership Program.',
      faqs: [
        {
          q: 'What is Fish Project?',
          a: 'Fish Project is a 2-year partnership-based agricultural ownership programfocused exclusively on Fish Project and fish (aquaculture) production under Islamic Sharia principles.',
        },
        {
          q: 'What is the share price and minimum investment?',
          a: 'Investment shares are priced at BDT 10,000 per share (Ten Thousand BDT). You can start with as little as 1 share (BDT 10,000) and may purchase multiple shares through approved BDT payment channels on Amanah Farm (amanahfarm.com).',
        },
        {
          q: 'How and when are dividend returns distributed?',
          a: 'Net annual dividends are calculated after deducting all operational costs, production expenses, and maintenance. Dividend payment updates and schedules are communicated on a 6-month basis.',
        },
        {
          q: 'Are returns guaranteed or fixed?',
          a: 'No. In full compliance with Islamic Sharia Law, no fixed, guaranteed, or predetermined profit levels are offered. Returns are variable and dependent on actual project performance. Any losses or underperformance are shared proportionately based on shareholding.',
        },
        {
          q: 'What is the lock period and can I sell/transfer my shares?',
          a: 'Investments are non-refundable and non-transferable during the first year. After the first year, investors may submit a 1-month written notice to sell or transfer shares. Valuations reflect prevailing market conditions, and settlements are completed within 4 months.',
        },
        {
          q: 'What happens at the end of the 2-year project period?',
          a: 'Upon project conclusion, all base project assets (Fish Project and fish inventory) are liquidated by June 30, 2029. Net proceeds from asset sales are distributed proportionately among all investors based on their shareholding percentage.',
        },
        {
          q: 'How is financial transparency and auditing handled?',
          a: 'Fish Project maintains comprehensive financial records. Independent, recognized audit firms conduct annual audits, and investors receive annual financial statements and audit reports.',
        },
        {
          q: 'What are the main risk factors involved?',
          a: 'Livestock and aquaculture carry inherent risks including animal mortality, disease, weather conditions, feed prices, and market price fluctuations. Costs may also shift due to natural disasters or commodity prices, with risks shared proportionately under Sharia partnership principles.',
        },
      ],
    },
    statsSection: {
      activeInvestors: { label: 'Active Investors', desc: 'Trusted by smart investors' },
      averageRoi: { label: 'Average ROI', desc: 'Consistent annual returns' },
      assetsManaged: { label: 'Assets Managed', desc: 'Insured farm assets' },
      transparentReporting: { label: 'Transparent Reporting', desc: 'Annual audits and statements' },
    },
    blog: {
      badge: 'Insights & News',
      titlePrefix: 'Knowledge Hub for ',
      titleHighlight: 'Smart Investors',
      allArticles: 'All Articles',
      newInsightsTitle: 'New insights are on the way',
      newInsightsDesc: 'Our team is preparing practical insights about agriculture, ethical investing, and sustainable growth.',
      featuredInsight: 'Featured insight',
      readArticle: 'Read Article',
      categoryDefault: 'Agriculture',
    },
    footer: {
      bannerBadge: 'Start Growing Wealth',
      bannerTitle: 'Join Fish Project — Own Agricultural Assets',
      bannerSubtitle: 'BDT 10,000 per share · Fish Project production · 2-Year program · 100% Sharia-compliant.',
      createFreeAccount: 'Create Free Account',
      contactUs: 'Contact Us',
      brandDescription: "Bangladesh's premier Shariah-compliant agricultural investment platform — secure, transparent, and profitable.",
      companyTitle: 'Company',
      investorTitle: 'Investors',
      newsletterTitle: 'Newsletter',
      newsletterSubtitle: 'Get regular farm updates and investor reports.',
      emailPlaceholder: 'Your email address',
      subscribedMessage: 'Subscribed successfully!',
      copyright: 'All rights reserved.',
    },
    auth: {
      welcomeBack: 'Welcome Back',
      signInSubtitle: 'Sign in to access your investment dashboard',
      createAccountTitle: 'Create Your Account',
      createAccountSubtitle: 'Join Amanah Farm and start your investment journey today',
      forgotPasswordTitle: 'Forgot Password',
      forgotPasswordSubtitle: 'Enter your registered email address to receive password reset link',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'you@example.com',
      phone: 'Phone Number',
      phonePlaceholder: '01XXXXXXXXX',
      password: 'Password',
      passwordPlaceholder: 'Create a strong password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      acceptTerms: 'I agree to the',
      termsLink: 'Terms & Conditions',
      privacyLink: 'Privacy Policy',
      signInBtn: 'Sign In',
      signingIn: 'Signing In...',
      createAccountBtn: 'Create Account',
      creatingAccount: 'Creating Account...',
      sendResetLink: 'Send Reset Link',
      sendingLink: 'Sending Link...',
      forgotPasswordLink: 'Forgot password?',
      noAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      backToLogin: 'Back to Sign In',
      verificationRequiredTitle: 'Email Verification Required',
      verificationRequiredDesc: 'Please verify your email address before logging in. Check your inbox for the verification link.',
      resendVerification: 'Resend verification email',
      sending: 'Sending...',
      passwordsMatch: 'Passwords match',
    },
    investorNav: {
      dashboard: 'Dashboard',
      myInvestments: 'My Investments',
      kycVerification: 'KYC Verification',
      documents: 'Documents',
      notifications: 'Notifications',
      profile: 'Profile',
      settings: 'Settings',
      signOut: 'Sign Out',
    },
    adminNav: {
      dashboard: 'Dashboard',
      investors: 'Investors',
      kycManagement: 'KYC Management',
      plans: 'Investment Plans',
      investments: 'Investments',
      transactions: 'Transactions',
      blog: 'Blog',
      reports: 'Reports',
      notifications: 'Notifications',
      submissions: 'Leads & Subscribers',
      settings: 'Settings',
      ownerRole: 'Owner',
      signOut: 'Sign Out',
    },
    galleryPage: {
      badge: 'Farm Facilities',
      titlePrefix: 'Amanah Farm ',
      titleHighlight: 'Gallery',
      subtitle: 'Take a visual tour of our modern Fish Project facilities, feeding yards, and sustainable agro hubs.',
      cta: 'Invest in These Farms',
      items: [
        { title: 'High-Yield Bull Fattening Facility', location: 'Rajshahi Hub' },
        { title: 'Organic Feeding & Nutrition Area', location: 'Comilla Hub' },
        { title: 'Integrated Dairy & Eco Ecosystem', location: 'Rangpur Hub' },
        { title: 'Veterinary Inspection & Tagging', location: 'Sylhet Hub' },
        { title: 'Pasture Grazing Grounds', location: 'Bogura Hub' },
        { title: 'Automated Water & Waste System', location: 'Mymensingh Hub' },
      ],
    },
    contactPage: {
      badge: 'Get in Touch',
      titlePrefix: 'Contact ',
      titleHighlight: 'Amanah Farm',
      subtitle: 'Have questions about Fish Project share packages, dividend updates, or ownership rights? Our team responds within 2 business hours.',
      formTitle: 'Send a Message',
      formSubtitle: 'We will respond within 2 business hours.',
      fullName: 'Full Name *',
      phone: 'Phone / WhatsApp *',
      email: 'Email Address *',
      message: 'Message',
      messagePlaceholder: 'Tell us about your investment goals or any questions...',
      submitBtn: 'Send Message',
      submitting: 'Sending...',
      successTitle: 'Message Received!',
      successMessage: 'Thank you! Our team will reach you within 2 business hours.',
      sendAnother: 'Send Another',
      confidentialNotice: 'Your information is 100% confidential.',
      openMap: 'Open full map',
      labels: {
        locations: 'Farm Locations',
        phone: 'Phone / WhatsApp',
        email: 'Email',
        website: 'Website',
        hours: 'Office Hours',
      },
    },
    common: {
      active: 'Active',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      failed: 'Failed',
      viewAll: 'View All',
      details: 'Details',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search...',
      filter: 'Filter',
      shares: 'Shares',
      perShare: 'per share',
      currency: '৳',
      loading: 'Loading...',
    },
    investForm: {
      title: 'New Investment',
      selectPlan: 'Select Investment Plan',
      chooseActivePlan: 'Choose an active plan',
      year: 'yr',
      pricePerShare: 'Price / Share',
      annualRoi: 'Annual ROI',
      maxSharesPerInvestor: 'Max Shares / Investor',
      maxSharesLabel: '',
      duration: 'Duration',
      months: 'months',
      exitLock: 'Exit Lock',
      days: 'days',
      totalShares: 'Total Shares',
      numberOfShares: 'Number of Shares',
      sharesPlaceholder: 'e.g. 10',
      maxSharesPerInvestorHint: 'Maximum {max} shares per investor.',
      shareRequestCannotSubmit: 'This share request cannot be submitted',
      sharesRequestedExceedsAvailable: 'You requested {requested} shares, but only {available} shares are currently available.',
      sharesAvailable: 'shares',
      maxSharesPerInvestorExceeded: 'This plan allows a maximum of {max} shares per investor; your request is {requested} shares.',
      investmentAmount: 'Investment Amount',
      probableReturnRate: 'Probable Return Rate',
      probableReturnAtMaturity: 'Probable Return at Maturity',
      totalCapitalPlusRoi: 'Total Capital + ROI',
      noPaymentRequired: 'No payment is required now. If the owner approves your request, bank-transfer details and receipt upload will become available.',
      submittingRequest: 'Submitting Request...',
      requestInvestmentApproval: 'Request Investment Approval',
      successMessage: 'Interest request submitted. The owner will review it before any payment is made.',
      errorMessage: 'Failed to submit investment',
      unexpectedError: 'An unexpected error occurred',
    },
  },
}

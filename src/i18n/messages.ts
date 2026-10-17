import type { Locale } from '../content/contracts.ts';

const messages = {
  en: {
    nav: { work: 'Work', about: 'About', resume: 'Experience', contact: 'Contact' },
    menu: 'Menu', navigation: 'Main navigation', skip: 'Skip to content',
    light: 'Switch to light mode', dark: 'Switch to dark mode',
    cv: 'Download English CV — PDF', work: 'Explore my work', allWork: 'View all work', contact: 'Let’s discuss the role',
    selected: 'A few projects. The decisions behind them.', selectedIntro: 'Search demand, audience attention, useful content. Different starting points, the same responsibility to carry the work through.',
    results: 'A few results to start with', case: 'Inside the project',
    about: 'More about my approach', experience: 'Review my experience',
    footer: 'Good work starts with a clear conversation.', footerLine: 'Digital marketing & growth. From understanding the market to making the work happen.',
    rights: 'All rights reserved.', privacy: 'Privacy', accessibility: 'Accessibility', location: 'Based in Cairo, Egypt',
    acquisition: 'Acquisition', content: 'Content', seo: 'Search', ai: 'Practical AI',
    created: 'Purposeful content, connected delivery.',
    resumePage: { experience: 'Professional experience', capabilities: 'What I bring to a team', credentials: 'Selected credentials' },
    utility: {
      notFound: { title: 'This page has moved out of the picture.', description: 'The address may have changed. My work and contact details are a good place to continue.' },
      error: { title: 'Something interrupted this page.', description: 'Try the page again, or continue to my work. You can also reach me directly through Contact.' },
      thanks: { title: 'Your message is with me.', description: 'Thank you for the context. You can explore the work while I review your message.' },
    },
  },
  ar: {
    nav: { work: 'الأعمال', about: 'عني', resume: 'الخبرات', contact: 'التواصل' },
    menu: 'القائمة', navigation: 'التنقل الرئيسي', skip: 'انتقل إلى المحتوى',
    light: 'التبديل إلى الوضع النهاري', dark: 'التبديل إلى الوضع الليلي',
    cv: 'تنزيل السيرة بالإنجليزية — PDF', work: 'استكشف أعمالي', allWork: 'شاهد جميع الأعمال', contact: 'لنتحدث عن الدور',
    selected: 'مشروعات مختلفة. وقرارات تصنع الفارق.', selectedIntro: 'طلب في نتائج البحث، أو انتباه جمهور، أو محتوى له غرض. تختلف البداية، وتبقى المسؤولية واحدة: أن يصل العمل إلى التنفيذ.',
    results: 'عمل يمكن الرجوع إلى نتائجه', case: 'داخل المشروع',
    about: 'المزيد عن طريقة عملي', experience: 'راجع خبراتي',
    footer: 'العمل الجيد يبدأ بمحادثة واضحة.', footerLine: 'التسويق الرقمي والنمو. من فهم السوق إلى تنفيذ ما يحتاجه العمل.',
    rights: 'جميع الحقوق محفوظة.', privacy: 'الخصوصية', accessibility: 'إمكانية الوصول', location: 'من القاهرة، مصر',
    acquisition: 'اكتساب العملاء', content: 'المحتوى', seo: 'البحث', ai: 'AI عملي',
    created: 'محتوى له غرض، وتنفيذ مترابط.',
    resumePage: { experience: 'الخبرة المهنية', capabilities: 'ما أضيفه إلى الفريق', credentials: 'شهادات مختارة' },
    utility: {
      notFound: { title: 'هذه الصفحة لم تعد هنا.', description: 'ربما تغيّر العنوان. يمكنك متابعة الرحلة من الأعمال أو الوصول إليّ مباشرة.' },
      error: { title: 'تعذّر عرض الصفحة الآن.', description: 'أعد المحاولة، أو تابع إلى الأعمال. ويمكنك الوصول إليّ من صفحة التواصل.' },
      thanks: { title: 'وصلتني رسالتك.', description: 'شكرًا لتوضيح ما تحتاجه. يمكنك استكشاف الأعمال إلى أن أراجع رسالتك.' },
    },
  },
} as const;

export function t(locale: Locale) { return messages[locale]; }

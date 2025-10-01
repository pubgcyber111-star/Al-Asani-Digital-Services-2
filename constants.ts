import { Service, Category } from './types';

export const WHATSAPP_NUMBER = '967781633796';
export const ADMIN_PASSCODE = '701953109';

export const DEFAULT_LOGO_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAHSAhsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA';
export const DEFAULT_WATERMARK_TEXT = 'Al-Asani for Digital Services';
export const CURRENCIES = ['﷼ يمني', '﷼ سعودي', '$ دولار'];

export const HADRAMOUT_LOCATIONS = [
  'حضرموت',

  'المكلا',
  'سيئون',
  'الشحر',
  'غيل باوزير',
  'تريم',
  'القطن',
  'شبام',
  'الدّيس الشرقية',
  'الريدة وقصيعر',
  'حجر',
  'بروم ميفع',
  'دوعن',
  'وادي العين',
  'حورة ووادي العين',
  'رخية',
  'ثمود',
  'العبر',
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'تصميم ومونتاج', icon: 'fas fa-palette' },
  { id: 2, name: 'برمجة وتطوير', icon: 'fas fa-code' },
  { id: 3, name: 'تسويق رقمي', icon: 'fas fa-bullhorn' },
  { id: 4, name: 'كتابة وترجمة', icon: 'fas fa-pen-nib' },
  { id: 5, name: 'استشارات أعمال', icon: 'fas fa-briefcase' },
  { id: 6, name: 'خدمات قانونية', icon: 'fas fa-gavel' },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 1,
    name: 'تصميم موقع إلكتروني متكامل',
    shortDescription: 'تصميم موقع إلكتروني احترافي متجاوب مع جميع الشاشات بمواصفات عالية الجودة.',
    longDescription: 'نقدم خدمة تصميم مواقع إلكترونية متكاملة تشمل واجهات عصرية وتجربة مستخدم سلسة. الموقع سيكون متجاوباً مع جميع الأجهزة من الحواسيب المكتبية إلى الهواتف المحمولة، مع لوحة تحكم سهلة لإدارة المحتوى. الخدمة تشمل أيضاً تحسينات أساسية لمحركات البحث (SEO) لضمان ظهور موقعك في نتائج البحث.',
    features: [
      'تصميم متجاوب 100%',
      'لوحة تحكم سهلة',
      'تحسين محركات البحث (SEO)',
      'دعم فني لمدة 3 أشهر',
      'استضافة مجانية لأول سنة'
    ],
    price: '500000',
    currency: '﷼ يمني',
    imageUrls: [
        'https://picsum.photos/seed/website1/600/400',
        'https://picsum.photos/seed/website2/600/400',
        'https://picsum.photos/seed/website3/600/400',
    ],
    location: 'صنعاء',
    author: 'Al-Asani for Digital Services',
    createdAt: Date.now() - 2 * 3600 * 1000, // 2 hours ago
    isFeatured: true,
    categoryIds: [2],
    addons: [
        { id: '1-1', name: 'دعم فني لمدة شهر إضافي', description: 'تمديد فترة الدعم الفني للموقع لمدة شهر كامل.', price: 50000, deliveryDays: 0, ownership: 'non-exclusive' },
        { id: '1-2', name: 'إضافة 5 صفحات إضافية', description: 'تصميم وبرمجة 5 صفحات إضافية للموقع (مثل: من نحن، خدماتنا، ...).', price: 100000, deliveryDays: 7, ownership: 'non-exclusive'},
        { id: '1-3', name: 'كود المصدر الأصلي للمشروع', description: 'الحصول على كامل كود المصدر للموقع للاستخدام والتطوير الخاص.', price: 250000, deliveryDays: 1, ownership: 'exclusive'}
    ]
  },
  {
    id: 2,
    name: 'حملة تسويق إلكتروني شاملة',
    shortDescription: 'حملة تسويقية متكاملة على وسائل التواصل الاجتماعي لتعزيز وجودك الرقمي.',
    longDescription: 'نقوم بإدارة حملتك التسويقية على منصات فيسبوك، انستجرام، وتويتر. ننشئ محتوى إبداعياً، ونطلق إعلانات ممولة تستهدف جمهورك بدقة، مع تزويدك بتقارير دورية لقياس الأداء وتحسين النتائج.',
    features: [
      'إدارة 3 منصات اجتماعية',
      'إنشاء محتوى احترافي',
      'إعلانات مستهدفة',
      'تقارير أداء أسبوعية',
    ],
    price: '300000',
    currency: '﷼ يمني',
    imageUrls: [
        'https://picsum.photos/seed/marketing1/600/400',
        'https://picsum.photos/seed/marketing2/600/400',
    ],
    location: 'عدن',
    author: 'Al-Asani for Digital Services',
    createdAt: Date.now() - 1 * 24 * 3600 * 1000, // 1 day ago
    isFeatured: true,
    categoryIds: [3],
    addons: [
        { id: '2-1', name: 'تحليل المنافسين', description: 'تقرير مفصل عن استراتيجيات المنافسين على وسائل التواصل الاجتماعي.', price: 75000, deliveryDays: 5, ownership: 'non-exclusive' },
        { id: '2-2', name: 'إدارة حملة إعلانية إضافية', description: 'إدارة حملة إعلانية ممولة على منصة Google Ads لمدة أسبوع.', price: 150000, deliveryDays: 7, ownership: 'non-exclusive' }
    ]
  },
  {
    id: 3,
    name: 'حزمة استشارات أعمال رقمية',
    shortDescription: 'جلسات استشارية مع خبراء في التحول الرقمي وتطوير استراتيجيات الأعمال.',
    longDescription: 'إذا كنت تسعى لتطوير أعمالك الرقمية، نقدم لك جلسات استشارية مكثفة لتحليل وضعك الحالي، تحديد الفرص، ووضع خطة عمل واضحة وقابلة للتنفيذ لتحقيق أهدافك.',
    features: [
      '4 جلسات استشارية',
      'تحليل شامل للأعمال',
      'خطة تحول رقمي مخصصة',
      'دليل تنفيذي مفصل',
    ],
    price: '250000',
    currency: '﷼ يمني',
    imageUrls: ['https://picsum.photos/seed/consulting/600/400'],
    location: 'صنعاء',
    author: 'Al-Asani for Digital Services',
    createdAt: Date.now() - 5 * 24 * 3600 * 1000, // 5 days ago
    categoryIds: [5],
  },
  {
    id: 4,
    name: 'تصميم هوية بصرية كاملة',
    shortDescription: 'تصميم شعار وهوية بصرية احترافية تعكس قيم علامتك التجارية.',
    longDescription: 'نصمم لك هوية بصرية متكاملة تبدأ من الشعار وتمتد لتشمل كافة تطبيقات العلامة التجارية مثل بطاقات العمل، الأوراق الرسمية، والتصاميم الخاصة بوسائل التواصل الاجتماعي.',
    features: [
        'تصميم 3 نماذج شعار للاختيار',
        'تصميم بطاقة عمل',
        'تصميم غلاف فيسبوك وتويتر',
        'دليل استخدام الهوية البصرية',
    ],
    price: '150000',
    currency: '﷼ يمني',
    imageUrls: ['https://picsum.photos/seed/branding/600/400'],
    location: 'عن بعد',
    author: 'Al-Asani for Digital Services',
    createdAt: Date.now() - 10 * 24 * 3600 * 1000, // 10 days ago
    categoryIds: [1],
    addons: []
  },
];
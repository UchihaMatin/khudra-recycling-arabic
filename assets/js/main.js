// ========================
// Constants & Configurations
// ========================
const APP = {
  rootElement: document.documentElement,
  currentPath: document.body.id,
  PHONE_REGEX: /^05\d{8}$/,
  NATIONAL_ID_REGEX: /^[12]\d{9}$/,
  IBAN_REGEX: /^SA\d{22}$/,
  IBAN_PLACEHOLDER: 'SA** **** **** **** **** ****',
  SECTION_OFFSET: 100,
  CODE_LENGTH: 6,
  CODE_LIMIT_TIME: 90,
  timerInterval: null,
};

// Purchase prices in SAR per kilogram (demo data shared by the web-app pages)
const MATERIALS = {
  copper: { name: 'نحاس', definite: 'النحاس', price: 28, info: 'يشمل النحاس الأسلاك الكهربائية بعد إزالة العازل، وأنابيب السباكة والتكييف، وملفات المحركات والمحولات. افصل النحاس عن البلاستيك والحديد قدر الإمكان، فالنحاس النظيف اللامع يُشترى بأعلى سعر، بينما يُحتسب النحاس المختلط بمواد أخرى بسعر أقل.' },
  aluminum: { name: 'ألمنيوم', definite: 'الألمنيوم', price: 5.5, info: 'علب المشروبات، وإطارات النوافذ والأبواب، وأواني الطبخ القديمة، ورقائق الألمنيوم النظيفة. اضغط العلب لتوفير المساحة، وتأكد من خلوها من السوائل. يمكنك تمييز الألمنيوم بسهولة لأنه لا ينجذب إلى المغناطيس.' },
  iron: { name: 'حديد وزهر', definite: 'الحديد والزهر', price: 0.9, info: 'قطع الأثاث المعدني، والأجهزة المنزلية الكبيرة بعد تفريغها، وحديد البناء والأنابيب. الحديد ثقيل لذلك تتراكم قيمته بسرعة، ويفضّل تجميعه في مكان واحد يسهل على المندوب الوصول إليه.' },
  tin: { name: 'علب الصفيح', definite: 'علب الصفيح', price: 0.6, info: 'علب الأغذية المحفوظة مثل الفول والتونة والحليب المجفف. اشطفها بسرعة لإزالة بقايا الطعام، ويمكن ترك الملصقات الورقية عليها.' },
  brass: { name: 'نحاس أصفر', definite: 'النحاس الأصفر', price: 16, info: 'الصنابير ومحابس المياه، ومقابض الأبواب، والقطع الزخرفية الذهبية اللون. النحاس الأصفر أثقل من الألمنيوم ولا ينجذب إلى المغناطيس، وسعره أعلى بكثير من الحديد.' },
  bags: { name: 'أكياس بلاستيك', definite: 'أكياس البلاستيك', price: 0.8, info: 'أكياس التسوق وأغلفة التعبئة الشفافة. اجمعها نظيفة وجافة داخل كيس واحد كبير، واستبعد الأكياس الملوثة ببقايا الطعام أو الزيوت.' },
  hdpe: { name: 'بلاستيك صلب (HDPE)', definite: 'البلاستيك الصلب (HDPE)', price: 1.4, info: 'عبوات المنظفات والشامبو وجالونات الحليب والزيت، وتحمل غالبًا الرمز 2 داخل مثلث التدوير. اشطفها وأغلقها بأغطيتها.' },
  mixed: { name: 'مخلوط جاف', definite: 'المخلوط الجاف', price: 0.35, info: 'مواد جافة قابلة للتدوير لكنها غير مفروزة، مثل خليط من الورق والبلاستيك والعلب. نستلمها لتسهيل البداية عليك، لكن فرزها يرفع قيمتها كثيرًا.' },
  pet: { name: 'قوارير (PET)', definite: 'القوارير (PET)', price: 1.2, info: 'قوارير المياه والعصائر والمشروبات الغازية الشفافة، وتحمل الرمز 1 داخل مثلث التدوير. أفرغها واضغطها، ويمكن ترك الأغطية عليها.' },
  disposable: { name: 'أدوات أحادية الاستخدام', definite: 'الأدوات أحادية الاستخدام', price: 0.5, info: 'الأكواب والصحون وأدوات المائدة البلاستيكية النظيفة. تُقبل فقط إذا كانت خالية من بقايا الطعام، أما الفلين الأبيض فلا يُقبل حاليًا.' },
  ldpe: { name: 'بلاستيك مرن (LDPE)', definite: 'البلاستيك المرن (LDPE)', price: 1, info: 'أغلفة التغليف المرنة وأكياس الخبز والتجميد، وتحمل الرمز 4 داخل مثلث التدوير. اجمعها نظيفة وجافة.' },
  crates: { name: 'صناديق وسلال بلاستيكية', definite: 'الصناديق والسلال البلاستيكية', price: 1.1, info: 'صناديق الخضار والفاكهة، والسلال والدلاء والكراسي البلاستيكية المكسورة. القطع الكبيرة مرحب بها ويفضل تفكيكها إن أمكن.' },
  cardboard: { name: 'كرتون', definite: 'الكرتون', price: 0.45, info: 'صناديق الشحن والتعبئة وكراتين الأجهزة. افردها واربطها معًا، وأبعدها عن الماء فالكرتون المبلل يفقد معظم قيمته.' },
  office: { name: 'ورق مكتبي', definite: 'الورق المكتبي', price: 0.6, info: 'أوراق الطباعة والدفاتر والكتب القديمة بعد نزع الأغلفة البلاستيكية. الورق الأبيض النظيف من أعلى أنواع الورق سعرًا.' },
  newspaper: { name: 'صحف ومجلات', definite: 'الصحف والمجلات', price: 0.3, info: 'الصحف والمجلات والكتيبات الإعلانية. اربطها في رزم صغيرة واحفظها في مكان جاف حتى موعد الاستلام.' },
};

// Login step state (shared by the sign-in, sign-up and center registration pages)
let currentStepLogin = 0;
// Replaced by the multi-step sign-up page; a no-op on pages without a progress bar
let updateProgressBar = function () {};

// ========================
// Initialization
// ========================
const pathActions = {
  loginMultiStep: () => {
    initializeLoginMultiStep();
    setupLoginSharedFunctions();
    selectBox();
  },
  login: () => {
    initializeLogin();
    setupLoginSharedFunctions();
  },
  registerRecyclable: () => {
    initializeRegisterRecyclable();
    setupLoginSharedFunctions();
    selectBox();
  },
  landingPage: () => {
    landingPageFunc();
    navInit();
    footerInit();
  },
  articlesPage: () => {
    navInit();
    footerInit();
  },
  articleDetailPage: () => {
    articleDetailPage();
    navInit();
    footerInit();
  },
  aboutUs: () => {
    navInit();
    footerInit();
    aboutUsPage();
  },
  homeUserProfile: () => {
    navInit();
    homeUserProfile();
  },
  homeUserLocation: () => {
    navInit();
    selectBox();
    homeUserLocation();
  },
  homeUserWallet: () => {
    navInit();
    homeUserWithdrawal();
  },
  homeUserWalletChange: () => {
    navInit();
    homeUserWalletChange();
  },
  homeUserWalletAdd: () => {
    navInit();
    homeUserWalletAdd();
  },
  homeUserCalculator: () => {
    navInit();
    selectBox();
    homeUserCalculator();
  },
  homeUserWastes: () => {
    navInit();
    homeUserWastes();
  },
  homeUserWasteDetail: () => {
    navInit();
    homeUserWasteDetail();
  },
  homeUserPurchaseRequest: () => {
    navInit();
    homeUserPurchaseRequest();
  },
  recyclingCenterDashboard: () => {
    recyclingCenterDashboard();
  },
};

const action = pathActions[APP.currentPath];
if (action) {
  action();
}

// ========================
// Helpers
// ========================
function formatMoney(value) {
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Lets Arabic search ignore diacritics and common spelling variants (أ/إ/آ, ة/ه, ى/ي)
function normalizeArabic(text) {
  return text
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

// Shows the spinner on a button, then runs the callback (simulates a server round trip)
function withLoading(button, callback, delay = 900) {
  if (!button) return callback();
  button.classList.add('loading');
  setTimeout(() => {
    button.classList.remove('loading');
    callback();
  }, delay);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.select();
  document.execCommand('copy');
  helper.remove();
  return Promise.resolve();
}

// ========================
// Core Functionality
// ========================
/****start siteInit****/
function navInit() {
  const DOM = {
    hamburgerMenuButton: document.querySelector('.ham'),
    hamburgerMenuBox: document.querySelector('.hamburger-menu'),
    header: document.querySelector('.header'),
    headerNav: document.querySelector('.header-nav'),
    scrollBtn: document.getElementById('scrollBtn'),
  };

  // ========================
  // Event Listeners
  // ========================
  DOM.hamburgerMenuBox?.addEventListener('click', hamburgerMenuToggle);
  DOM.hamburgerMenuBox?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburgerMenuToggle();
    }
  });
  DOM.scrollBtn?.addEventListener('click', scrollBtnTop);
  window.addEventListener('scroll', scrollRange, { passive: true });
  // ========================
  // Event Handlers
  // ========================
  function hamburgerMenuToggle() {
    DOM.hamburgerMenuButton.classList.toggle('active');
    DOM.header.classList.toggle('active-ham');
    DOM.headerNav.classList.toggle('active');
    const checkActiveNav = DOM.headerNav.classList.contains('active');
    DOM.hamburgerMenuBox.setAttribute('aria-expanded', String(checkActiveNav));
    if (checkActiveNav) {
      DOM.headerNav.style.visibility = 'visible';
    }
    setTimeout(() => {
      if (!checkActiveNav) {
        DOM.headerNav.style.visibility = 'hidden';
      }
    }, 500);
  }
  function scrollBtnTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function scrollRange() {
    const scrollable = document.body.scrollHeight - innerHeight;
    const position = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
    APP.rootElement.style.setProperty('--scroll-progress', `${position}%`);
    DOM.scrollBtn?.classList.toggle('hidden', scrollY <= 0);
  }
}
/****end siteInit****/

/****start footer****/
function footerInit() {
  const DOM = {
    // Testimonials slider
    commentSliderBox: document.querySelector('.comment-slider-box'),
    commentSliderItems: document.querySelectorAll('.comment-slider-item'),
    commentSliderRight: document.querySelector('.comment-slider-right'),
    commentSliderLeft: document.querySelector('.comment-slider-left'),

    // Commitments (badges) slider
    permissionsSlider: document.querySelector('.permissions-slider'),
    permissionsSliderItems: document.querySelectorAll('.permissions-slider-item'),
    permissionsSliderRight: document.querySelector('.permissions-slider-right'),
    permissionsSliderLeft: document.querySelector('.permissions-slider-left'),
    permissionsSliderNumber: document.querySelector('.permissions-slider-number'),
  };
  if (!DOM.commentSliderBox || !DOM.permissionsSlider) return;

  // ========================
  // Indicator dots for the commitments slider
  // ========================
  DOM.permissionsSliderItems.forEach((item, index) => {
    const spanElement = document.createElement('span');
    spanElement.classList.add(`slider-number-${index}`);
    if (index === 0) spanElement.classList.add('active');
    DOM.permissionsSliderNumber.appendChild(spanElement);
  });

  function updatePermissionsIndicator(currentStep) {
    const spans = DOM.permissionsSliderNumber.children;
    for (let i = 0; i < spans.length; i++) {
      spans[i].classList.toggle('active', i === currentStep);
    }
  }

  // ========================
  // Slider state
  // ========================
  const commentSlider = {
    container: DOM.commentSliderBox,
    items: DOM.commentSliderItems,
    currentStep: 0,
    loopTimeout: 20, // milliseconds
    updateUI() {
      const translateX = this.currentStep * APP.SECTION_OFFSET;
      APP.rootElement.style.setProperty('--translateX-footer-comment', `${translateX}%`);
    }
  };

  const permissionsSlider = {
    container: DOM.permissionsSlider,
    items: DOM.permissionsSliderItems,
    currentStep: 0,
    loopTimeout: 20, // milliseconds
    updateUI() {
      const translateX = this.currentStep * APP.SECTION_OFFSET;
      APP.rootElement.style.setProperty('--translateX-footer-Permissions', `${translateX}%`);
      updatePermissionsIndicator(this.currentStep);
    }
  };

  // ========================
  // Generic slider navigation (wraps around at both ends)
  // ========================
  function navigateSlider(slider, stepChange) {
    const totalItems = slider.items.length;
    const newStep = slider.currentStep + stepChange;

    if (newStep < 0) {
      slider.currentStep = totalItems;
      slider.container.classList.add('animation-slider-stop');
      slider.updateUI();
      setTimeout(() => {
        slider.container.classList.remove('animation-slider-stop');
        slider.currentStep = totalItems - 1;
        slider.updateUI();
      }, slider.loopTimeout);
    } else if (newStep === totalItems) {
      slider.currentStep = -1;
      slider.container.classList.add('animation-slider-stop');
      slider.updateUI();
      setTimeout(() => {
        slider.container.classList.remove('animation-slider-stop');
        slider.currentStep = 0;
        slider.updateUI();
      }, slider.loopTimeout);
    } else {
      slider.currentStep = newStep;
      slider.updateUI();
    }
  }

  DOM.commentSliderRight.addEventListener('click', () => {
    navigateSlider(commentSlider, -1);
    resetInterval();
  });
  DOM.commentSliderLeft.addEventListener('click', () => {
    navigateSlider(commentSlider, 1);
    resetInterval();
  });
  DOM.permissionsSliderRight.addEventListener('click', () => {
    navigateSlider(permissionsSlider, -1);
    resetInterval();
  });
  DOM.permissionsSliderLeft.addEventListener('click', () => {
    navigateSlider(permissionsSlider, 1);
    resetInterval();
  });

  // ========================
  // Auto-slide
  // ========================
  let sliderInterval = null;
  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
      navigateSlider(commentSlider, 1);
      navigateSlider(permissionsSlider, 1);
    }, 10000);
  }
  resetInterval();
}
/****end footer****/

/****start landing page****/
function landingPageFunc() {
  const questionsButtons = document.querySelectorAll('.questions-item');
  questionsButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isOpen = button.classList.toggle('active');
      button.setAttribute('aria-expanded', String(isOpen));
    });
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
}
/****end landing page****/

/****start about us page****/
function aboutUsPage() {
  // The copy icon copies the number instead of starting a call
  document.querySelectorAll('.about-us-contact-copy-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const input = icon.parentElement.querySelector('.about-us-contact-input');
      copyText(input.value).then(() => showAlert('successful', 'تم نسخ الرقم'));
    });
  });
}
/****end about us page****/

/****start article Detail Page****/
function articleDetailPage() {
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', () => {
      const isActive = button.classList.toggle('active');
      button.setAttribute('aria-pressed', String(isActive));
      const counter = button.querySelector('span');
      if (counter) {
        counter.textContent = Number(counter.textContent) + (isActive ? 1 : -1);
      }
    });
  });

  document.querySelectorAll('.short-link-box').forEach(box => {
    const input = box.querySelector('.short-link-input');
    input.value = window.location.href.split('#')[0];
    const copy = () => copyText(input.value).then(() => showAlert('successful', 'تم نسخ رابط المقال'));
    box.addEventListener('click', copy);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copy();
      }
    });
  });

  const commentForm = document.querySelector('.comment-registration');
  commentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = commentForm.querySelector('.comment-textarea');
    if (textarea.value.trim().length < 3) {
      showAlert('warning', 'اكتب تعليقك أولًا');
      return;
    }
    textarea.value = '';
    showAlert('successful', 'شكرًا لك! سيظهر تعليقك بعد المراجعة');
  });

  document.querySelectorAll('.reply-button').forEach(button => {
    button.addEventListener('click', () => {
      const textarea = document.querySelector('.comment-textarea');
      const author = button.closest('.comment-box').querySelector('.comment-author').textContent.trim();
      textarea.value = `@${author} `;
      textarea.focus();
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
/****end article Detail Page****/

/****start home user calculator page****/
function homeUserCalculator() {
  const DOM = {
    items: document.querySelectorAll('.scrap-items-section .scrap-item'),
    prevBtn: document.querySelector('.prev-button'),
    nextBtn: document.querySelector('.next-button'),
    priceSelect: document.getElementById('priceSelect'),
    livePrice: document.getElementById('livePrice'),
  };
  let currentIndex = 0;

  function visibleCount() {
    const container = DOM.items[0]?.parentElement;
    if (!container || !DOM.items[0].offsetWidth) return 3;
    return Math.max(1, Math.round(container.offsetWidth / (DOM.items[0].offsetWidth + 10)));
  }

  function updateSlider() {
    const maxIndex = Math.max(0, DOM.items.length - visibleCount());
    currentIndex = Math.min(currentIndex, maxIndex);
    DOM.items.forEach((item) => {
      item.style.transform = `translateX(calc(${currentIndex * 100}% + ${currentIndex * 10}px))`;
    });
    DOM.prevBtn.classList.toggle('disabled', currentIndex === 0);
    DOM.nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
  }

  DOM.prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });
  DOM.nextBtn.addEventListener('click', () => {
    if (currentIndex < DOM.items.length - visibleCount()) {
      currentIndex++;
      updateSlider();
    }
  });
  window.addEventListener('resize', updateSlider);
  updateSlider();

  // Live price card follows the selected material
  DOM.priceSelect.addEventListener('selectchange', (e) => {
    const price = Number(e.detail.dataset.price);
    DOM.livePrice.firstChild.textContent = formatMoney(price);
  });
}
/****end home user calculator page****/

/****start home user wastes page****/
function homeUserWastes() {
  const DOM = {
    form: document.querySelector('.search-container'),
    input: document.querySelector('.search-input'),
    sections: document.querySelectorAll('.scrap-items-section'),
    empty: document.getElementById('searchEmpty'),
  };

  function filter() {
    const query = normalizeArabic(DOM.input.value);
    let total = 0;
    DOM.sections.forEach(section => {
      let visible = 0;
      section.querySelectorAll('.scrap-item').forEach(item => {
        const name = normalizeArabic(item.querySelector('.scrap-item-title').textContent);
        const match = !query || name.includes(query);
        item.classList.toggle('d-none', !match);
        if (match) visible++;
      });
      section.classList.toggle('d-none', visible === 0);
      total += visible;
    });
    DOM.empty.classList.toggle('d-none', total > 0);
  }

  DOM.form.addEventListener('submit', (e) => {
    e.preventDefault();
    filter();
  });
  DOM.input.addEventListener('input', filter);

  const query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    DOM.input.value = query;
    filter();
  }
}
/****end home user wastes page****/

/****start home user waste detail page****/
function homeUserWasteDetail() {
  const key = new URLSearchParams(window.location.search).get('m');
  const material = MATERIALS[key] || MATERIALS.copper;

  document.getElementById('materialName').textContent = material.definite;
  document.getElementById('materialPrice').textContent = formatMoney(material.price);
  document.getElementById('materialInfoTitle').textContent = `ما الذي يُحتسب ضمن ${material.definite}؟`;
  document.getElementById('materialInfo').textContent = material.info;
  document.title = `${material.name} | خضرة`;

  setupWeightCalculator(() => material.price);
}
/****end home user waste detail page****/

// Keeps the range slider, the weight field and the estimated value in sync
function setupWeightCalculator(getUnitPrice) {
  const DOM = {
    quantity: document.getElementById('quantityRange'),
    weightInput: document.getElementById('weightInput'),
    priceInput: document.getElementById('priceInput'),
  };

  function updatePrice() {
    const weight = Math.max(0, Number(DOM.weightInput.value) || 0);
    DOM.priceInput.value = formatMoney(weight * getUnitPrice());
  }

  DOM.quantity.addEventListener('input', () => {
    DOM.weightInput.value = DOM.quantity.value;
    updatePrice();
  });
  DOM.weightInput.addEventListener('input', () => {
    DOM.quantity.value = DOM.weightInput.value;
    updatePrice();
  });
  updatePrice();
  return { updatePrice, getWeight: () => Number(DOM.weightInput.value) || 0 };
}

/****start home User Location Page****/
function homeUserLocation() {
  const DOM = {
    locationSearchButton: document.getElementById('locationSearchButton'),
    locationSearchInput: document.getElementById('locationSearchInput'),
    locationCloseButton: document.querySelector('.location-close-button'),
    locationSearchBox: document.querySelector('.location-search-box'),
    locationListItems: document.querySelectorAll('.location-list li'),
    addressItems: document.querySelectorAll('.address-item'),
    myLocation: document.querySelector('.my-location'),
    steps: document.querySelectorAll('.location-selection[data-step]'),
    detailLocation: document.getElementById('detailLocation'),
    detailLocationDisplay: document.getElementById('detailLocationDisplay'),
    materialSelect: document.getElementById('materialSelect'),
    dateOptions: document.getElementById('dateOptions'),
    timeFrom: document.getElementById('timeField1'),
    timeTo: document.getElementById('timeField2'),
    addressName: document.getElementById('addressName'),
    saveAddressBtn: document.getElementById('saveAddressBtn'),
  };
  let currentStep = 0;
  let unitPrice = 0;
  const calculator = setupWeightCalculator(() => unitPrice);

  // ========================
  // Address search
  // ========================
  DOM.locationSearchButton.addEventListener('click', () => {
    DOM.locationSearchBox.classList.add('active');
    DOM.locationSearchInput.focus();
  });
  DOM.locationCloseButton.addEventListener('click', closeSearch);
  DOM.locationSearchInput.addEventListener('input', () => {
    const query = normalizeArabic(DOM.locationSearchInput.value);
    DOM.locationListItems.forEach(item => {
      item.classList.toggle('d-none', !!query && !normalizeArabic(item.textContent).includes(query));
    });
  });
  DOM.locationListItems.forEach(item => {
    item.addEventListener('click', () => {
      setAddress(item.textContent.trim());
      closeSearch();
    });
  });
  DOM.addressItems.forEach(item => {
    const select = () => {
      DOM.addressItems.forEach(other => other.classList.remove('active'));
      item.classList.add('active');
      setAddress(item.textContent.trim());
    };
    item.addEventListener('click', select);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    });
  });
  DOM.myLocation.addEventListener('click', () => {
    setAddress('موقعي الحالي (حي الملقا، الرياض)');
    showAlert('successful', 'تم تحديد موقعك الحالي');
  });

  function closeSearch() {
    DOM.locationSearchBox.classList.remove('active');
  }
  function setAddress(value) {
    DOM.locationSearchButton.value = value;
  }

  // ========================
  // Pickup dates: the next four days
  // ========================
  const dayFormat = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' });
  for (let i = 1; i <= 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const option = document.createElement('div');
    option.className = 'date-option' + (i === 1 ? ' active' : '');
    option.setAttribute('role', 'button');
    option.tabIndex = 0;
    option.textContent = dayFormat.format(date);
    option.addEventListener('click', () => {
      DOM.dateOptions.querySelector('.active')?.classList.remove('active');
      option.classList.add('active');
    });
    DOM.dateOptions.appendChild(option);
  }

  DOM.materialSelect.addEventListener('selectchange', (e) => {
    unitPrice = Number(e.detail.dataset.price);
    calculator.updatePrice();
  });

  // ========================
  // Step navigation
  // ========================
  const VALIDATORS = [
    () => {
      if (!DOM.locationSearchButton.value.trim()) {
        showAlert('warning', 'اختر عنوانًا محفوظًا أو ابحث عن موقعك');
        return false;
      }
      return true;
    },
    () => {
      if (DOM.detailLocation.value.trim().length < 8) {
        showAlert('warning', 'اكتب العنوان التفصيلي بدقة');
        return false;
      }
      DOM.detailLocationDisplay.value = `${DOM.locationSearchButton.value} - ${DOM.detailLocation.value.trim()}`;
      return true;
    },
    () => {
      if (!DOM.materialSelect.querySelector('.selected-value').dataset.value) {
        showAlert('warning', 'اختر نوع المادة');
        return false;
      }
      if (calculator.getWeight() <= 0) {
        showAlert('warning', 'أدخل الوزن التقريبي بالكيلوغرام');
        return false;
      }
      return true;
    },
    () => {
      const from = Number(DOM.timeFrom.value);
      const to = Number(DOM.timeTo.value);
      if (!(from >= 8 && to <= 22 && to - from >= 2)) {
        showAlert('warning', 'اختر فترة لا تقل عن ساعتين بين 8 صباحًا و10 مساءً');
        return false;
      }
      return true;
    },
  ];

  function goToStep(step) {
    DOM.steps.forEach(section => {
      section.classList.toggle('d-none', Number(section.dataset.step) !== step);
    });
    currentStep = step;
  }

  document.querySelectorAll('.location-selection [data-next]').forEach(button => {
    button.addEventListener('click', () => {
      if (VALIDATORS[currentStep] && !VALIDATORS[currentStep]()) return;
      withLoading(button, () => goToStep(currentStep + 1), 500);
    });
  });
  document.querySelectorAll('.location-selection [data-prev]').forEach(button => {
    button.addEventListener('click', () => goToStep(currentStep - 1));
  });
  document.querySelectorAll('.location-selection [data-goto]').forEach(button => {
    button.addEventListener('click', () => goToStep(Number(button.dataset.goto)));
  });

  DOM.saveAddressBtn.addEventListener('click', () => {
    if (!DOM.addressName.value.trim()) {
      showAlert('warning', 'اكتب اسمًا للعنوان، مثل: المنزل');
      return;
    }
    withLoading(DOM.saveAddressBtn, () => {
      showAlert('successful', 'تم حفظ العنوان');
      setTimeout(() => { window.location.href = 'home-user-purchase-request.html'; }, 1200);
    });
  });
}
/****end home User Location Page****/

/****start home user purchase request page****/
function homeUserPurchaseRequest() {
  const webApp = document.getElementById('webApp');
  const newRequestLink = document.querySelector('.new-request-link');

  function updateEmptyState() {
    const isEmpty = !document.querySelector('.request-item');
    webApp.classList.toggle('empty-request', isEmpty);
    newRequestLink?.classList.toggle('d-none', isEmpty);
  }

  document.querySelectorAll('.request-remove').forEach(button => {
    button.addEventListener('click', () => {
      if (!window.confirm('هل تريد إلغاء طلب الاستلام هذا؟')) return;
      button.closest('.request-item').remove();
      showAlert('successful', 'تم إلغاء الطلب');
      updateEmptyState();
    });
  });
  updateEmptyState();
}
/****end home user purchase request page****/

/****start home User Wallet Change Page****/
function homeUserWalletChange() {
  const cards = () => document.querySelectorAll('.bank-details');

  cards().forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) return;
      document.querySelector('.bank-details.active')?.classList.remove('active');
      item.classList.add('active');
    });
  });

  document.querySelectorAll('.card-delete').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cards().length === 1) {
        showAlert('warning', 'لا يمكن حذف البطاقة الوحيدة');
        return;
      }
      if (!window.confirm('هل تريد حذف هذه البطاقة؟')) return;
      const card = button.closest('.bank-details');
      const wasActive = card.classList.contains('active');
      card.remove();
      if (wasActive) cards()[0].classList.add('active');
      showAlert('successful', 'تم حذف البطاقة');
    });
  });
}
/****end home User Wallet Change Page****/

/****start home User Wallet add Page****/
function homeUserWalletAdd() {
  const DOM = {
    form: document.getElementById('addCardForm'),
    submit: document.getElementById('addCardBtn'),
    firstName: document.getElementById('addWalletFirstName'),
    lastName: document.getElementById('addWalletLastName'),
    bankNameInput: document.getElementById('addWalletBankName'),
    cardNumber: document.getElementById('addWalletBankAccountNumber'),
    iban: document.getElementById('addWalletBankIban'),
    accountNumber: document.getElementById('addWalletHolderId'),
    bankName: document.querySelector('.bank-name'),
    cardParts: document.querySelectorAll('.bank-account-number .account-part'),
    ibanNumber: document.querySelector('.iban-number'),
    holderFirstName: document.querySelector('.holder-first-name'),
    holderLastName: document.querySelector('.holder-last-name'),
    holderId: document.querySelector('.holder-id'),
  };

  // Live preview on the card
  const mirror = (input, target, empty) => {
    input.addEventListener('input', () => {
      target.textContent = input.value.trim() || empty;
    });
  };
  mirror(DOM.firstName, DOM.holderFirstName, '*******');
  mirror(DOM.lastName, DOM.holderLastName, '*******');
  mirror(DOM.bankNameInput, DOM.bankName, '*******');

  DOM.cardNumber.addEventListener('input', () => {
    const value = DOM.cardNumber.value.replace(/\D/g, '').slice(0, 16);
    DOM.cardNumber.value = value;
    DOM.cardParts.forEach((span, index) => {
      span.textContent = value.slice(index * 4, index * 4 + 4) || '****';
    });
  });

  DOM.iban.addEventListener('input', () => {
    const digits = DOM.iban.value.toUpperCase().replace(/^SA/, '').replace(/\D/g, '').slice(0, 22);
    const value = 'SA' + digits;
    DOM.iban.value = value;
    DOM.ibanNumber.textContent = digits.length ? value.match(/.{1,4}/g).join(' ') : APP.IBAN_PLACEHOLDER;
  });

  DOM.accountNumber.addEventListener('input', () => {
    DOM.accountNumber.value = DOM.accountNumber.value.replace(/\D/g, '');
    DOM.holderId.textContent = DOM.accountNumber.value || '*************';
  });

  DOM.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!DOM.firstName.value.trim() || !DOM.lastName.value.trim()) {
      showAlert('warning', 'أدخل الاسم الأول واسم العائلة');
      return;
    }
    if (!DOM.bankNameInput.value.trim()) {
      showAlert('warning', 'أدخل اسم البنك');
      return;
    }
    if (DOM.cardNumber.value.length !== 16) {
      showAlert('warning', 'رقم البطاقة يتكون من 16 رقمًا');
      return;
    }
    if (!APP.IBAN_REGEX.test(DOM.iban.value)) {
      showAlert('warning', 'رقم الآيبان يبدأ بـ SA ويليه 22 رقمًا');
      return;
    }
    if (DOM.accountNumber.value.length < 8) {
      showAlert('warning', 'أدخل رقم الحساب بشكل صحيح');
      return;
    }
    withLoading(DOM.submit, () => {
      showAlert('successful', 'تمت إضافة البطاقة بنجاح');
      setTimeout(() => { window.location.href = 'home-user-wallet-change.html'; }, 1200);
    });
  });
}
/****end home User Wallet add Page****/

/****start home user withdrawal page****/
function homeUserWithdrawal() {
  const form = document.getElementById('withdrawalForm');
  if (!form) return; // the wallet overview page shares this body id

  const amountInput = document.getElementById('withdrawalAmount');
  const available = document.getElementById('availableBalance');
  const list = document.getElementById('withdrawalList');
  const MIN_AMOUNT = 50;

  amountInput.addEventListener('input', () => {
    amountInput.value = amountInput.value.replace(/[^\d.]/g, '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = Number(amountInput.value);
    const balance = Number(available.textContent.replace(/,/g, ''));
    if (!amount || amount < MIN_AMOUNT) {
      showAlert('warning', `الحد الأدنى للسحب ${MIN_AMOUNT} ر.س`);
      return;
    }
    if (amount > balance) {
      showAlert('warning', 'المبلغ أكبر من الرصيد القابل للسحب');
      return;
    }

    available.textContent = formatMoney(balance - amount);
    const now = new Date();
    const item = list.querySelector('.transaction-item').cloneNode(true);
    item.className = 'transaction-item waiting';
    item.querySelector('.transaction-type').textContent = 'بانتظار المراجعة';
    item.querySelector('.date-text').textContent = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    item.querySelector('.amount').textContent = formatMoney(amount);
    item.querySelector('.time').textContent = now.toTimeString().slice(0, 5);
    list.prepend(item);
    amountInput.value = '';
    showAlert('successful', 'تم إرسال طلب السحب وسيُراجع خلال 24 ساعة');
  });
}
/****end home user withdrawal page****/

/****start home user profile page****/
function homeUserProfile() {
  const form = document.getElementById('profileForm');
  const submit = document.querySelector('.solo-button');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = form.elements.firstName.value.trim();
    const lastName = form.elements.lastName.value.trim();
    const nationalId = form.elements.nationalId.value.trim();
    if (!firstName || !lastName) {
      showAlert('warning', 'أدخل الاسم الأول واسم العائلة');
      return;
    }
    if (!APP.NATIONAL_ID_REGEX.test(nationalId)) {
      showAlert('warning', 'رقم الهوية يتكون من 10 أرقام ويبدأ بـ 1 أو 2');
      return;
    }
    withLoading(submit, () => {
      document.querySelectorAll('.header-username').forEach(el => { el.textContent = `${firstName} ${lastName}`; });
      showAlert('successful', 'تم حفظ التغييرات');
    });
  });
}
/****end home user profile page****/

/****start recycling center dashboard****/
function recyclingCenterDashboard() {
  const DOM = {
    aside: document.getElementById('dashAside'),
    overlay: document.getElementById('dashOverlay'),
    menuBtn: document.getElementById('dashMenuBtn'),
    navLinks: document.querySelectorAll('.dash-nav a'),
    tabs: document.querySelectorAll('.dash-tabs button'),
    rows: () => document.querySelectorAll('#requestsBody tr'),
    search: document.getElementById('dashSearch'),
    empty: document.getElementById('requestsEmpty'),
    newCount: document.getElementById('newCount'),
    date: document.getElementById('dashDate'),
    pricesForm: document.getElementById('pricesForm'),
  };
  let activeFilter = 'all';

  DOM.date.textContent = new Intl.DateTimeFormat('ar-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  // Sidebar (off-canvas on small screens)
  function toggleMenu(open) {
    DOM.aside.classList.toggle('open', open);
    DOM.overlay.classList.toggle('open', open);
    DOM.menuBtn.setAttribute('aria-expanded', String(open));
  }
  DOM.menuBtn.addEventListener('click', () => toggleMenu(!DOM.aside.classList.contains('open')));
  DOM.overlay.addEventListener('click', () => toggleMenu(false));
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      DOM.navLinks.forEach(other => other.classList.remove('active'));
      link.classList.add('active');
      toggleMenu(false);
    });
  });

  // Requests table: status tabs + text search
  function applyFilters() {
    const query = normalizeArabic(DOM.search.value);
    let visible = 0;
    DOM.rows().forEach(row => {
      const matchesTab = activeFilter === 'all' || row.dataset.status === activeFilter;
      const matchesSearch = !query || normalizeArabic(row.textContent).includes(query);
      const show = matchesTab && matchesSearch;
      row.classList.toggle('d-none', !show);
      if (show) visible++;
    });
    DOM.empty.classList.toggle('d-none', visible > 0);
  }

  DOM.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      DOM.tabs.forEach(other => {
        other.classList.remove('active');
        other.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.filter;
      applyFilters();
    });
  });
  DOM.search.addEventListener('input', applyFilters);

  const STATUS = {
    progress: { label: 'في الطريق', action: 'تأكيد الاستلام', next: 'done', message: 'تم قبول الطلب وإسناده إلى مندوب' },
    done: { label: 'مكتمل', message: 'تم تأكيد الاستلام' },
  };
  document.getElementById('requestsBody').addEventListener('click', (e) => {
    const button = e.target.closest('.dash-action');
    if (!button) return;
    const row = button.closest('tr');
    const status = button.dataset.next;
    const info = STATUS[status];
    row.dataset.status = status;
    const badge = row.querySelector('.dash-status');
    badge.className = `dash-status ${status}`;
    badge.textContent = info.label;
    if (info.next) {
      button.dataset.next = info.next;
      button.textContent = info.action;
    } else {
      const paid = document.createElement('span');
      paid.className = 'dash-paid';
      paid.textContent = 'بانتظار الوزن';
      button.replaceWith(paid);
    }
    DOM.newCount.textContent = document.querySelectorAll('#requestsBody tr[data-status="new"]').length;
    showAlert('successful', info.message);
    applyFilters();
  });

  DOM.pricesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...DOM.pricesForm.querySelectorAll('input')].some(input => !(Number(input.value) > 0));
    if (invalid) {
      showAlert('warning', 'أدخل سعرًا صحيحًا لكل مادة');
      return;
    }
    showAlert('successful', 'تم تحديث أسعار الشراء');
  });
}
/****end recycling center dashboard****/

/****start login****/
//====================================================
// Sign-up wizard: city → mobile → account type → account details → code
function initializeLoginMultiStep() {
  const sections = document.querySelectorAll('#login-multi-step-parent > .login-section');
  const DOM = {
    mobileInput: document.getElementById('PhoneNumber'),
    citySelected: sections[0].querySelector('.selected-value'),
    citySubmitButton: document.getElementById('citySubmitButton'),
    mobileSubmitButton: document.getElementById('mobileBtn'),
    mobileBackButton: document.getElementById('mobileBackBtn'),
    subscriptionSubmitButton: document.getElementById('subscriptionBtn'),
    subscriptionBackBtn: document.getElementById('subscriptionBackBtn'),
    subscriptionUserBackBtn: document.getElementById('subscriptionUserBackBtn'),
    subscriptionUserSection: document.getElementById('subscriptionUserSection'),
    subscriptionBox: document.getElementById('subscription-box'),
    subscriptionUserBtn: document.getElementById('subscriptionUserBtn'),
    verificationBtn: document.getElementById('verificationBtn'),
    progressBars: Array.from(document.querySelectorAll('.progress-bar')),
    mediaQuery: window.matchMedia('(max-width: 576px)'),
  };
  let accountType = 'home';

  // ========================
  // Event Listeners
  // ========================
  DOM.mobileInput.addEventListener('input', sanitizeDigits);
  DOM.citySubmitButton.addEventListener('click', validateCity);
  DOM.mobileSubmitButton.addEventListener('click', validateMobile);
  DOM.mobileBackButton.addEventListener('click', goBack);
  DOM.subscriptionBackBtn.addEventListener('click', goBack);
  DOM.subscriptionSubmitButton.addEventListener('click', validateSubscription);
  DOM.subscriptionUserBackBtn.addEventListener('click', goBack);
  DOM.subscriptionBox.addEventListener('click', handleSubscription);
  DOM.subscriptionBox.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      handleSubscription(e);
    }
  });
  DOM.subscriptionUserBtn.addEventListener('click', validateUserInfo);
  DOM.verificationBtn.addEventListener('click', validateCode);
  document.addEventListener('keydown', handleKeyNavigation);
  DOM.mediaQuery.addEventListener('change', () => updateProgressBar());

  // ========================
  // Step handlers
  // ========================
  function validateCity() {
    if (!DOM.citySelected.dataset.value) {
      showAlert('warning', 'اختر مدينتك من القائمة');
      return;
    }
    goForward(DOM.citySubmitButton);
  }

  function validateMobile() {
    if (!APP.PHONE_REGEX.test(DOM.mobileInput.value)) {
      showAlert('warning', 'أدخل رقم جوال صحيحًا يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }
    goForward(DOM.mobileSubmitButton);
  }

  function validateSubscription() {
    const activeOption = DOM.subscriptionBox.querySelector('.subscription-user.active');
    if (!activeOption) {
      showAlert('warning', 'اختر نوع الحساب');
      return;
    }
    accountType = activeOption.id === 'subscriptionUserGuild' ? 'guild' : 'home';
    DOM.subscriptionUserSection.classList.toggle('guild', accountType === 'guild');
    goForward(DOM.subscriptionSubmitButton);
  }

  function validateUserInfo() {
    if (!validateIdentityFields(DOM.subscriptionUserSection)) return;
    if (accountType === 'guild' && !DOM.subscriptionUserSection.querySelector('[name="storeName"]').value.trim()) {
      showAlert('warning', 'أدخل اسم المحل أو المنشأة');
      return;
    }
    goForward(DOM.subscriptionUserBtn, () => {
      handleLimitReset();
      showAlert('successful', `أرسلنا رمز التحقق إلى ${DOM.mobileInput.value}`);
    });
  }

  function validateCode() {
    if (!isCodeComplete()) return;
    const target = accountType === 'guild' ? 'awaiting-confirmation.html' : 'pre-registration.html';
    withLoading(DOM.verificationBtn, () => { window.location.href = target; });
  }

  function handleSubscription(event) {
    const clickedOption = event.target.closest('.subscription-user');
    if (!clickedOption || clickedOption.classList.contains('active')) return;
    DOM.subscriptionBox.querySelector('.subscription-user.active')?.classList.remove('active');
    clickedOption.classList.add('active');
  }

  function handleKeyNavigation(event) {
    if (event.key !== 'Enter' || event.target.closest('.select-box, .subscription-user, .date-picker-container')) return;
    const STEP_HANDLERS = [validateCity, validateMobile, validateSubscription, validateUserInfo, validateCode];
    STEP_HANDLERS[currentStepLogin]?.();
  }

  function goForward(button, after) {
    withLoading(button, () => {
      navigateSteps(1);
      updateProgressBar();
      after?.();
    }, 500);
  }

  function goBack() {
    navigateSteps(-1);
    updateProgressBar();
  }

  // ========================
  // Progress Bar Management
  // ========================
  const totalSteps = DOM.progressBars.length;

  updateProgressBar = function () {
    const activeStep = Math.min(currentStepLogin, totalSteps - 1);
    const isMobile = DOM.mediaQuery.matches;
    const startVisibleIndex = Math.max(activeStep - 1, 0);
    const endVisibleIndex = Math.min(activeStep + 1, totalSteps - 1);

    DOM.progressBars.forEach((bar, index) => {
      bar.classList.remove('in-progress', 'active');
      if (isMobile) {
        bar.style.display = (index >= startVisibleIndex && index <= endVisibleIndex) ? 'flex' : 'none';
      } else {
        bar.style.display = 'flex';
      }
      if (index < activeStep) {
        bar.classList.add('active');
      }
      const line = bar.querySelector('.confirm-progress-line');
      if (line) line.style.width = index < activeStep ? '100%' : '';
    });

    const currentBar = document.getElementById(`progressBar${activeStep}`);
    if (currentBar) {
      setTimeout(() => {
        currentBar.classList.add('in-progress');
      }, 400);
    }
  };
  updateProgressBar();
}

// Sign-in: mobile → code
function initializeLogin() {
  const DOM = {
    mobileInput: document.getElementById('mobile'),
    mobileBtn: document.getElementById('mobileBtn'),
    verificationBtn: document.getElementById('verificationBtn'),
  };

  DOM.mobileInput.addEventListener('input', sanitizeDigits);
  DOM.mobileBtn.addEventListener('click', submitMobile);
  DOM.verificationBtn.addEventListener('click', submitCode);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    (currentStepLogin === 0 ? submitMobile : submitCode)();
  });

  function submitMobile() {
    if (!APP.PHONE_REGEX.test(DOM.mobileInput.value)) {
      showAlert('warning', 'أدخل رقم جوال صحيحًا يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }
    withLoading(DOM.mobileBtn, () => {
      navigateSteps(1);
      handleLimitReset();
      showAlert('successful', `أرسلنا رمز التحقق إلى ${DOM.mobileInput.value}`);
    }, 600);
  }

  function submitCode() {
    if (!isCodeComplete()) return;
    withLoading(DOM.verificationBtn, () => { window.location.href = 'home-user-calculator.html'; });
  }
}

// Recycling-center registration: details form → code
function initializeRegisterRecyclable() {
  const form = document.querySelector('.user-form');
  const submitBtn = document.getElementById('subscriptionUserBtn');
  const verificationBtn = document.getElementById('verificationBtn');
  const mobile = form.querySelector('[name="mobile"]');
  const numericFields = form.querySelectorAll('[name="mobile"], [name="postalCode"], [name="crNumber"], [name="nationalId"]');

  numericFields.forEach(input => input.addEventListener('input', sanitizeDigits));

  submitBtn.addEventListener('click', () => {
    if (!validateIdentityFields(form)) return;
    if (!APP.PHONE_REGEX.test(mobile.value)) {
      showAlert('warning', 'أدخل رقم جوال صحيحًا يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }
    if (!/^\d{5}$/.test(form.querySelector('[name="postalCode"]').value)) {
      showAlert('warning', 'الرمز البريدي يتكون من 5 أرقام');
      return;
    }
    if (!/^\d{10}$/.test(form.querySelector('[name="crNumber"]').value)) {
      showAlert('warning', 'رقم السجل التجاري يتكون من 10 أرقام');
      return;
    }
    if (!form.querySelector('.selected-value').dataset.value) {
      showAlert('warning', 'اختر المدينة');
      return;
    }
    if (!form.querySelector('[name="storeName"]').value.trim()) {
      showAlert('warning', 'أدخل اسم المركز أو المنشأة');
      return;
    }
    withLoading(submitBtn, () => {
      navigateSteps(1);
      handleLimitReset();
      showAlert('successful', `أرسلنا رمز التحقق إلى ${mobile.value}`);
    }, 600);
  });

  document.getElementById('mapBtn').addEventListener('click', () => {
    showAlert('successful', 'تم تحديد موقع المركز على الخريطة');
  });

  verificationBtn.addEventListener('click', () => {
    if (!isCodeComplete()) return;
    withLoading(verificationBtn, () => { window.location.href = 'awaiting-confirmation.html'; });
  });
}

function sanitizeDigits(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
}

// Shared checks for first name, last name, national ID and birth date
function validateIdentityFields(scope) {
  const firstName = scope.querySelector('[name="firstName"]');
  const lastName = scope.querySelector('[name="lastName"]');
  const nationalId = scope.querySelector('[name="nationalId"]');
  const birthdate = scope.querySelector('.birthdate-input');

  if (!firstName.value.trim() || !lastName.value.trim()) {
    showAlert('warning', 'أدخل الاسم الأول واسم العائلة');
    return false;
  }
  if (!APP.NATIONAL_ID_REGEX.test(nationalId.value)) {
    showAlert('warning', 'رقم الهوية أو الإقامة يتكون من 10 أرقام ويبدأ بـ 1 أو 2');
    return false;
  }
  if (birthdate && !birthdate.value) {
    showAlert('warning', 'اختر تاريخ الميلاد');
    return false;
  }
  return true;
}

function isCodeComplete() {
  const code = [...document.querySelectorAll('.code-input')].map(input => input.value).join('');
  if (code.length !== APP.CODE_LENGTH) {
    showAlert('warning', 'أدخل رمز التحقق المكوّن من 6 أرقام');
    return false;
  }
  return true;
}

//====================================================
function setupLoginSharedFunctions() {
  const DOM = {
    codeLimitReset: document.querySelector('.limit-reset'),
    verificationBackButton: document.getElementById('verificationBackBtn'),
    codeContainer: document.querySelector('.code-inputs'),
    codeInputs: document.querySelectorAll('.code-input'),
    maxMediaQuery: window.matchMedia('(min-width: 1400px)'),
  };

  DOM.codeLimitReset.addEventListener('click', () => {
    handleLimitReset();
    showAlert('successful', 'تم إرسال رمز جديد');
  });
  DOM.verificationBackButton.addEventListener('click', backVerification);
  DOM.codeContainer.addEventListener('click', focusFirstInput);
  window.addEventListener('resize', maxMediaQueryFunc);

  function backVerification() {
    clearInterval(APP.timerInterval);
    navigateSteps(-1);
    updateProgressBar();
  }

  // Centers the login card vertically on very large screens
  function maxMediaQueryFunc() {
    if (DOM.maxMediaQuery.matches) {
      const margin = (window.innerWidth - 1400) / 2;
      document.body.style.paddingTop = `${margin}px`;
    } else {
      document.body.style.paddingTop = '';
    }
  }
  maxMediaQueryFunc();

  function focusFirstInput(e) {
    if (e.target === this) {
      const firstEmpty = [...DOM.codeInputs].find(input => !input.value) || DOM.codeInputs[0];
      firstEmpty?.focus();
    }
  }

  // ========================
  // SMS verification inputs
  // ========================
  DOM.codeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(-1);

      if (e.target.value && index < DOM.codeInputs.length - 1) {
        DOM.codeInputs[index + 1].classList.add('filled');
        DOM.codeInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        DOM.codeInputs[index].classList.remove('filled');
        DOM.codeInputs[index - 1].focus();
      }
    });

    // Pasting the whole code fills every box
    input.addEventListener('paste', (e) => {
      const digits = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, DOM.codeInputs.length);
      if (!digits) return;
      e.preventDefault();
      DOM.codeInputs.forEach((box, i) => {
        box.value = digits[i] || '';
        box.classList.toggle('filled', i <= digits.length);
      });
      DOM.codeInputs[Math.min(digits.length, DOM.codeInputs.length - 1)].focus();
    });
  });
}

//====================================================
// Resend-code countdown
function handleLimitReset() {
  const codeLimitValue = document.querySelector('.timer');
  const codeLimitReset = document.querySelector('.limit-reset');
  if (!codeLimitValue || !codeLimitReset) return;

  if (APP.timerInterval) clearInterval(APP.timerInterval);
  codeLimitReset.disabled = true;

  let remainingTime = APP.CODE_LIMIT_TIME;
  updateTimerDisplay(codeLimitValue, remainingTime);
  APP.timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(APP.timerInterval);
      APP.timerInterval = null;
      codeLimitValue.textContent = '00:00';
      codeLimitReset.disabled = false;
      return;
    }
    updateTimerDisplay(codeLimitValue, remainingTime);
  }, 1000);
}

function updateTimerDisplay(element, seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  element.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// ========================
// Step navigation (login pages slide between their sections)
// ========================
function navigateSteps(stepChange) {
  const lastStep = document.querySelectorAll('#login-multi-step-parent > .login-section').length - 1;
  const newStep = currentStepLogin + stepChange;
  if (newStep < 0 || newStep > lastStep) return;
  currentStepLogin = newStep;
  updateUI();
}

function updateUI() {
  const translateX = currentStepLogin * APP.SECTION_OFFSET;
  APP.rootElement.style.setProperty('--translateX-login', `${translateX}%`);
  // Keep keyboard focus out of the sections that slid away
  document.querySelectorAll('#login-multi-step-parent > .login-section').forEach((section, index) => {
    section.inert = index !== currentStepLogin;
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
if (document.getElementById('login-multi-step-parent')) updateUI();
/**** end login ****/

// ========================
// Alert System
// ========================
function showAlert(alertType = 'successful', alertMessage = '', timeout = 2500) {
  document.querySelectorAll('.message').forEach(el => el.remove());

  const alertElement = document.createElement('div');
  alertElement.id = alertType;
  alertElement.className = 'message';
  alertElement.setAttribute('role', alertType === 'successful' ? 'status' : 'alert');
  alertElement.innerHTML = `
    <div class="blur-message"></div>
    <img src="assets/images/icon/${alertType}.svg" alt="">
    <p id="${alertType}Text" class="text-message"></p>
  `;
  alertElement.querySelector('.text-message').textContent = alertMessage;
  document.body.appendChild(alertElement);

  alertElement.style.animation = `fadeInAlert ${timeout / 1000}s linear`;
  setTimeout(() => alertElement.remove(), timeout);
}

// ========================
// Custom select box
// ========================
function selectBox() {
  document.querySelectorAll('.select-box').forEach(selectBoxContainer => {
    const DOM = {
      selectSection: selectBoxContainer,
      selectBoxButton: selectBoxContainer.querySelector('.select-box-button'),
      selectedValue: selectBoxContainer.querySelector('.selected-value'),
      // The <ul class="select-option"> follows the box
      selectBox: selectBoxContainer.nextElementSibling,
    };
    if (!DOM.selectBox) return;

    DOM.selectSection.setAttribute('role', 'button');
    DOM.selectSection.setAttribute('aria-haspopup', 'listbox');
    DOM.selectSection.tabIndex = DOM.selectBoxButton ? -1 : 0;
    DOM.selectBox.setAttribute('role', 'listbox');
    DOM.selectBox.querySelectorAll('li').forEach(li => {
      li.setAttribute('role', 'option');
      li.tabIndex = 0;
    });

    DOM.selectSection.addEventListener('click', toggleSelectBox);
    DOM.selectBox.addEventListener('click', handleOptionSelect);
    DOM.selectBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOptionSelect(e);
      } else if (e.key === 'Escape') {
        toggleSelectBox();
      }
    });

    function toggleSelectBox() {
      DOM.selectBoxButton?.classList.toggle('active');
      const isOpen = DOM.selectBox.classList.toggle('active');
      DOM.selectSection.setAttribute('aria-expanded', String(isOpen));
    }

    function handleOptionSelect(event) {
      const clickedOption = event.target.closest('li');
      if (!clickedOption) return;

      if (!clickedOption.classList.contains('active')) {
        DOM.selectBox.querySelector('.active')?.classList.remove('active');
        clickedOption.classList.add('active');
        DOM.selectedValue.textContent = clickedOption.textContent;
        DOM.selectedValue.dataset.value = clickedOption.dataset.value;
        selectBoxContainer.dispatchEvent(new CustomEvent('selectchange', { detail: clickedOption }));
      }
      toggleSelectBox();
    }
  });
}

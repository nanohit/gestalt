export type ProgramSession = {
  time: string;
  type: string;
  title: string;
  description: string;
};

export type ProgramDay = {
  date: string;
  sessions: ProgramSession[];
};

export type Speaker = {
  name: string;
  role: string;
  experience: string;
  description: string;
  tags: string[];
};

export type PricingOption = {
  label?: string;
  period: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

export type SiteContent = {
  programDays: ProgramDay[];
  speakers: Speaker[];
  pricingOptions: PricingOption[];
  discountTitle: string;
  discountText: string;
};

export function cloneSiteContent(content: SiteContent): SiteContent {
  return {
    programDays: content.programDays.map((day) => ({
      date: day.date,
      sessions: day.sessions.map((session) => ({
        time: session.time,
        type: session.type,
        title: session.title,
        description: session.description,
      })),
    })),
    speakers: content.speakers.map((speaker) => ({
      name: speaker.name,
      role: speaker.role,
      experience: speaker.experience,
      description: speaker.description,
      tags: [...speaker.tags],
    })),
    pricingOptions: content.pricingOptions.map((option) => ({
      label: option.label,
      period: option.period,
      price: option.price,
      features: [...option.features],
      highlight: option.highlight,
    })),
    discountTitle: content.discountTitle,
    discountText: content.discountText,
  };
}

export const createEmptySession = (): ProgramSession => ({
  time: "00:00 - 00:00",
  type: "Тип сессии",
  title: "Название сессии",
  description: "Описание сессии",
});

export const createEmptyDay = (): ProgramDay => ({
  date: "Новый день",
  sessions: [createEmptySession()],
});

export const createEmptySpeaker = (): Speaker => ({
  name: "Имя спикера",
  role: "Роль",
  experience: "Опыт",
  description: "Описание спикера",
  tags: ["Новый тег"],
});

export const createEmptyPricingOption = (): PricingOption => ({
  label: "",
  period: "Новый период",
  price: "0₽",
  features: ["Новое преимущество"],
  highlight: false,
});

export const RAW_DEFAULT_CONTENT: SiteContent = {
  programDays: [
    {
      date: "24 ноября",
      sessions: [
        {
          time: "10:00\u00a0-\u00a011:30",
          type: "Пленарная сессия",
          title: "Основы гештальт-терапии в современном контексте",
          description: "Основной доклад",
        },
        {
          time: "11:45 - 13:15",
          type: "Семинар",
          title: "Работа с травмой через призму гештальт-подхода",
          description: "Практический семинар",
        },
        {
          time: "13:15 - 14:00",
          type: "Дискуссия",
          title: "Обсуждения и QA",
          description: "Интерактивная сессия",
        },
      ],
    },
    {
      date: "25 ноября",
      sessions: [
        {
          time: "10:00\u00a0-\u00a011:30",
          type: "Пленарная сессия",
          title: "Контакт и поддержка в онлайн-терапии",
          description: "Методологический доклад",
        },
        {
          time: "11:45 - 13:15",
          type: "Мастер-класс",
          title: "Полевые процессы в групповой работе",
          description: "Групповой опыт",
        },
        {
          time: "13:15 - 14:00",
          type: "Супервизия",
          title: "Супервизорские группы: обмен опытом",
          description: "Интерактивная сессия",
        },
      ],
    },
    {
      date: "26 ноября",
      sessions: [
        {
          time: "10:00\u00a0-\u00a011:30",
          type: "Пленарная сессия",
          title: "Контакт и поддержка в онлайн-терапии",
          description: "Методологический доклад",
        },
        {
          time: "11:45 - 13:15",
          type: "Мастер-класс",
          title: "Полевые процессы в групповой работе",
          description: "Групповой опыт",
        },
        {
          time: "13:15 - 14:00",
          type: "Супервизия",
          title: "Супервизорские группы: обмен опытом",
          description: "Интерактивная сессия",
        },
      ],
    },
  ],
  speakers: [
    {
      name: "Анна Петрова",
      role: "Ведущий гештальт-терапевт",
      experience: "15+ лет практики",
      description:
        "Специалист по работе с терапевтическим опытом. Автор публикаций по современным подходам в гештальт-терапии.",
      tags: ["Контакт", "Поддержка", "Травма и восстановление"],
    },
    {
      name: "Михаил Иванов",
      role: "Супервизор, тренер",
      experience: "20+ лет практики",
      description:
        "Эксперт в области групповых процессов и полевых феноменов. Ведущий программ подготовки терапевтов.",
      tags: ["Супервизия", "Обучение", "Групповая терапия"],
    },
    {
      name: "Дмитрий Козлов",
      role: "Философ, терапевт",
      experience: "18 лет практики",
      description:
        "Специалист по работе с травматическим опытом. Автор публикаций по современным подходам в гештальт-терапии.",
      tags: ["Философия", "Современность", "Этика терапии"],
    },
    {
      name: "Елена Смирнова",
      role: "Клинический психолог",
      experience: "12 лет практики",
      description:
        "Пионер в области онлайн гештальт-терапии. Исследователь цифровых особенностей контакта в цифровом пространстве.",
      tags: ["Контакт", "Онлайн-практика", "Интеграция"],
    },
  ],
  pricingOptions: [
    {
      label: "Лучшая цена",
      period: "До 20 октября",
      price: "6 000₽",
      features: [
        "Доступ ко всем сессиям",
        "Материалы конференции",
        "Сертификат участника",
        "Запись всех выступлений",
      ],
      highlight: true,
    },
    {
      period: "С 20 октября",
      price: "7 000₽",
      features: [
        "Доступ ко всем сессиям",
        "Материалы конференции",
        "Сертификат участника",
        "Запись всех выступлений",
      ],
      highlight: false,
    },
    {
      period: "С 17 ноября и в день начала",
      price: "8 000₽",
      features: [
        "Доступ ко всем сессиям",
        "Материалы конференции",
        "Сертификат участника",
        "Запись всех выступлений",
      ],
      highlight: false,
    },
  ],
  discountTitle: "Скидка для участников программ МГИ",
  discountText:
    "Скидка 1000₽ для всех, кто проходит или проходил обучение в Московском гештальт институте. Укажите это при регистрации.",
};

export const defaultContent: SiteContent = cloneSiteContent(RAW_DEFAULT_CONTENT);

export function normalizeContent(input: Partial<SiteContent> | null | undefined): SiteContent {
  if (!input) {
    return cloneSiteContent(defaultContent);
  }

  const fallback = cloneSiteContent(defaultContent);
  const emptySession = createEmptySession();
  const emptyDay = createEmptyDay();
  const emptySpeaker = createEmptySpeaker();
  const emptyPricing = createEmptyPricingOption();

  const programDays =
    Array.isArray(input.programDays) && input.programDays.length
      ? input.programDays.map((rawDay) => {
          const sessions =
            Array.isArray(rawDay?.sessions) && rawDay.sessions.length
              ? rawDay.sessions.map((session) => ({
                  time: session?.time?.trim() || emptySession.time,
                  type: session?.type?.trim() || emptySession.type,
                  title: session?.title?.trim() || emptySession.title,
                  description: session?.description?.trim() || emptySession.description,
                }))
              : [createEmptySession()];

          return {
            date: rawDay?.date?.trim() || emptyDay.date,
            sessions,
          };
        })
      : fallback.programDays;

  const speakers =
    Array.isArray(input.speakers) && input.speakers.length
      ? input.speakers.map((rawSpeaker) => {
          const tags =
            Array.isArray(rawSpeaker?.tags) && rawSpeaker.tags.length
              ? rawSpeaker.tags.map((tag) => tag?.trim() || emptySpeaker.tags[0])
              : [...emptySpeaker.tags];

          return {
            name: rawSpeaker?.name?.trim() || emptySpeaker.name,
            role: rawSpeaker?.role?.trim() || emptySpeaker.role,
            experience: rawSpeaker?.experience?.trim() || emptySpeaker.experience,
            description: rawSpeaker?.description?.trim() || emptySpeaker.description,
            tags,
          };
        })
      : fallback.speakers;

  const pricingOptions =
    Array.isArray(input.pricingOptions) && input.pricingOptions.length
      ? input.pricingOptions.map((rawOption) => {
          const features =
            Array.isArray(rawOption?.features) && rawOption.features.length
              ? rawOption.features.map((feature) => feature?.trim() || emptyPricing.features[0])
              : [...emptyPricing.features];

          return {
            label: rawOption?.label?.trim() || undefined,
            period: rawOption?.period?.trim() || emptyPricing.period,
            price: rawOption?.price?.trim() || emptyPricing.price,
            features,
            highlight: rawOption?.highlight ?? false,
          };
        })
      : fallback.pricingOptions;

  const discountTitle = input.discountTitle?.trim() || fallback.discountTitle;
  const discountText = input.discountText?.trim() || fallback.discountText;

  return {
    programDays,
    speakers,
    pricingOptions,
    discountTitle,
    discountText,
  };
}
